import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Conversation } from '../model/conversation.model';
import { Message } from '../model/message.model';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = new mongoose.Types.ObjectId(req.id as string);
    const reciverId = new mongoose.Types.ObjectId(req.params.id as string);
    const { message } = req.body as { message: string };

    let conversation = await Conversation.findOne({ participants: { $all: [senderId, reciverId] } });
    if (!conversation) {
      conversation = await Conversation.create({ participants: [senderId, reciverId] });
    }

    const newMessage = await Message.create({ senderId, reciverId, message });
    if (newMessage) conversation.messages.push(newMessage._id as mongoose.Types.ObjectId);
    await Promise.all([conversation.save(), newMessage.save()]);

    return res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error('sendMessage error:', error);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const senderId = new mongoose.Types.ObjectId(req.id as string);
    const reciverId = new mongoose.Types.ObjectId(req.params.id as string);

    const conversation = await Conversation.findOne({ participants: { $all: [senderId, reciverId] } }).populate('messages');
    if (!conversation) return res.status(200).json({ success: true, messages: [] });

    return res.status(200).json({ success: true, messages: conversation.messages });
  } catch (error) {
    console.error('getMessage error:', error);
    return res.status(500).json({ message: 'server error', success: false });
  }
};
