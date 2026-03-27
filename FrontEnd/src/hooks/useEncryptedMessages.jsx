import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  getOrFetchPublicKey,
  validateMessage,
  getEncryptionStatus,
  formatMessageForDisplay,
} from "../utils/encryptionClient";

const API_BASE = "http://localhost:8000";

/**
 * Custom Hook for Encrypted Messaging
 * Handles encryption/decryption transparently
 */
export const useEncryptedMessages = (recipientId) => {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [encryptionStatus, setEncryptionStatus] = useState("idle"); // idle, encrypting, sending, decrypting
  const [recipientPublicKey, setRecipientPublicKey] = useState(null);

  // Fetch recipient's public key for encryption
  const loadRecipientPublicKey = useCallback(async () => {
    try {
      if (!recipientId) return;
      const publicKey = await getOrFetchPublicKey(recipientId, axios);
      setRecipientPublicKey(publicKey);
    } catch (err) {
      console.error("Failed to load recipient public key:", err);
      setError("Failed to setup encryption");
    }
  }, [recipientId]);

  // Fetch all messages with decryption
  const fetchMessages = useCallback(async () => {
    if (!recipientId || !user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE}/api/v1/message/all/${recipientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        const decryptedMessages = response.data.messages.map((msg) => ({
          ...msg,
          displayText: msg.displayMessage || msg.message,
          encryptionInfo: getEncryptionStatus(msg.isEncrypted),
        }));
        setMessages(decryptedMessages);
        console.log("Loaded messages:", decryptedMessages.length);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [recipientId, user]);

  // Send encrypted message
  const sendEncryptedMessage = useCallback(
    async (messageText) => {
      if (!recipientId || !user || !recipientPublicKey) {
        setError("Cannot send message: encryption not ready");
        return false;
      }

      // Validate message
      const validation = validateMessage(messageText);
      if (!validation.valid) {
        setError(validation.error);
        return false;
      }

      try {
        setEncryptionStatus("encrypting");

        // Send message (backend handles encryption)
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_BASE}/api/v1/message/send/${recipientId}`,
          { textMessage: messageText },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          setEncryptionStatus("sent");
          setError(null);

          // Add message to local state with plaintext for sender display
          const newMsg = response.data.newMessage;
          setMessages((prev) => [
            ...prev,
            {
              ...newMsg,
              displayText: messageText, // Show plaintext on sender's side
              encryptionInfo: getEncryptionStatus(newMsg.isEncrypted),
              isSent: true, // Flag to indicate this is from sender
            },
          ]);

          // Notify via socket
          if (newMsg.isEncrypted) {
            socket?.emit("sendEncryptedMessage", {
              recipientId,
              encryptedMessage: newMsg.encryptedMessage,
              encryptedKey: newMsg.encryptedKey,
            });
          }

          return true;
        }
      } catch (err) {
        console.error("Failed to send message:", err);
        setError("Failed to send message. Sent unencrypted.");
        setEncryptionStatus("error");
        return false;
      } finally {
        setEncryptionStatus("idle");
      }
    },
    [recipientId, user, recipientPublicKey, socket],
  );

  // Listen for new encrypted messages via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const formattedMsg = {
        ...message,
        displayText:
          message.displayMessage ||
          message.message ||
          formatMessageForDisplay(message),
        encryptionInfo: getEncryptionStatus(message.isEncrypted),
      };
      setMessages((prev) => [...prev, formattedMsg]);
    };

    const handleEncryptedMessage = (data) => {
      // Backend handles decryption on GET, but this is for real-time
      console.log("Received encrypted message via Socket:", data);
      handleNewMessage(data);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("receiveEncryptedMessage", handleEncryptedMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("receiveEncryptedMessage", handleEncryptedMessage);
    };
  }, [socket]);

  // Initialize
  useEffect(() => {
    loadRecipientPublicKey();
    fetchMessages();
  }, [recipientId, loadRecipientPublicKey, fetchMessages]);

  return {
    messages,
    loading,
    error,
    encryptionStatus,
    recipientPublicKey,
    sendMessage: sendEncryptedMessage,
    fetchMessages,
    setError,
  };
};
