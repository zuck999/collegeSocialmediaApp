import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { getReciverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import {
  encryptMessage,
  decryptMessage,
  generateUserKeyPair,
  getUserPublicKey,
  getUserPrivateKey,
} from "../utils/encryption.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const { textMessage: message } = req.body;
    console.log("Original message:", message);

    // Encrypt message before storing
    let encryptedData = null;
    try {
      encryptedData = encryptMessage(message, reciverId);
      console.log("Message encrypted successfully");
    } catch (encryptError) {
      console.log("Encryption warning:", encryptError.message);
      // If encryption fails, still send message unencrypted
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    // Create message with encryption data
    const newMessage = await Message.create({
      senderId,
      receiverId: reciverId,
      message: message, // Store original for reference
      encryptedMessage: encryptedData?.encryptedMessage?.toString() || null,
      encryptedKey: encryptedData?.encryptedKey?.toString() || null,
      algorithm: encryptedData?.algorithm || null,
      isEncrypted: !!encryptedData,
    });
    console.log("Message saved:", {
      id: newMessage._id,
      isEncrypted: newMessage.isEncrypted,
      hasEncryptedMessage: !!newMessage.encryptedMessage,
      hasEncryptedKey: !!newMessage.encryptedKey
    });

    if (newMessage) conversation.message.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    //emit real time message via socket
    const reciverSocketId = getReciverSocketId(reciverId);
    const senderSocketId = getReciverSocketId(senderId);

    // Prepare message to emit with plaintext for display
    const messageToEmit = newMessage.toObject();
    messageToEmit.displayMessage = message; // Always include plaintext for display
    messageToEmit.decryptionNeeded = newMessage.isEncrypted;

    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", messageToEmit);
    }
    if (senderSocketId && senderSocketId !== reciverSocketId) {
      io.to(senderSocketId).emit("newMessage", messageToEmit);
    }

    return res.status(201).json({
      success: true,
      newMessage: messageToEmit,
    });
  } catch (error) {
    console.log("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;

    console.log("Fetching messages between users:", senderId, reciverId);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate("message");

    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });

    // Decrypt messages for the current user
    const decryptedMessages = conversation.message.map((msg) => {
      const messageObj = msg.toObject();

      if (messageObj.isEncrypted && messageObj.encryptedMessage && messageObj.encryptedKey) {
        try {
          // User can only decrypt messages sent TO them
          if (msg.receiverId.toString() === senderId.toString()) {
            // This user is the receiver - decrypt with their private key
            console.log("Decrypting message for receiver:", senderId);
            const decryptedText = decryptMessage(senderId, {
              encryptedMessage: messageObj.encryptedMessage,
              encryptedKey: messageObj.encryptedKey,
            });
            messageObj.displayMessage = decryptedText;
            messageObj.decrypted = true;
            console.log("Decrypted successfully:", decryptedText);
          } else {
            // This user is the sender - use stored plaintext
            console.log("Sender viewing own message");
            messageObj.displayMessage = messageObj.message;
            messageObj.decrypted = true;
          }
        } catch (decryptError) {
          console.error("Decryption error:", decryptError.message);
          messageObj.displayMessage = "[Unable to decrypt message]";
          messageObj.decrypted = false;
        }
      } else {
        // Not encrypted, show as is
        messageObj.displayMessage = messageObj.message;
        messageObj.decrypted = true;
      }

      return messageObj;
    });

    return res.status(200).json({
      success: true,
      messages: decryptedMessages,
    });
  } catch (error) {
    console.log("Get message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/**
 * Get user's public key (for key exchange)
 */
export const getUserKeyForExchange = async (req, res) => {
  try {
    const userId = req.params.id;
    const publicKey = getUserPublicKey(userId);

    return res.status(200).json({
      success: true,
      userId,
      publicKey: {
        e: publicKey.e.toString(),
        n: publicKey.n.toString(),
      },
    });
  } catch (error) {
    console.log("Key exchange error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get public key",
    });
  }
};
