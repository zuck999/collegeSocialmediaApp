import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  gender?: 'male' | 'female' | '';
  faculty?: string;
  friends: mongoose.Types.ObjectId[];
  post: mongoose.Types.ObjectId[];
  phoneNum?: number | string;
  batch?: string;
  hobby?: string;
  adress?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['male', 'female', ''],
  },
  faculty: {
    type: String,
    default: '',
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  phoneNum: {
    type: mongoose.Schema.Types.Mixed,
    default: '',
  },
  batch: {
    type: String,
    default: '',
  },
  hobby: {
    type: String,
    default: '',
  },
  adress: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
