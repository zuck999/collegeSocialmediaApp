import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { getReciverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const { textMessage: message } = req.body;
    console.log("--------------->>", message);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      reciverId,
      message,
    });
    if (newMessage) conversation.message.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    //implement socket io for real time data transfer...///
    const reciverSocketId = getReciverSocketId(reciverId);
    const senderSocketId = getReciverSocketId(senderId);

    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }
    if (senderSocketId && senderSocketId !== reciverSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;

    console.log("works");

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate("message");
    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });

    return res
      .status(200)
      .json({ success: true, messages: conversation?.message });
  } catch (error) {
    console.log(error);
  }
};
