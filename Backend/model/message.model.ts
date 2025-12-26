import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  reciverId: mongoose.Types.ObjectId;
  message: string;
}

const messageSchema = new mongoose.Schema<IMessage>({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reciverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
