import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
  caption?: string;
  image: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

const postSchema = new mongoose.Schema<IPost>({
  caption: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, { timestamps: true });

export const Post = mongoose.model<IPost>('Post', postSchema);
