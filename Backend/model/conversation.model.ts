import mongoose, { Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const conversationSchema = new mongoose.Schema<IConversation>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
