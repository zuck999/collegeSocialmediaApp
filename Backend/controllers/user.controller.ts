import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { TypedRequest } from '../types/http';
import { User, IUser } from '../model/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/dataUri';
import cloudinary from '../utils/cloudanary';
import { Post } from '../model/post.model';

export interface RegisterBody { username: string; email: string; password: string; faculty: string }

export const register = async (req: TypedRequest<RegisterBody>, res: Response) => {
  try {
    const { username, email, password, faculty } = req.body;
    if (!email || !password || !username || !faculty) {
      return res.status(401).json({ message: 'All fields are required', success: false });
    }

    const u_name_check = await User.findOne({ username });
    if (u_name_check) {
      return res.status(401).json({ message: 'username already exist', success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ message: 'username already exist', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, faculty, password: hashedPassword });

    return res.status(201).json({ message: 'user created successfully', success: true });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export interface LoginBody { email: string; password: string }

export const login = async (req: TypedRequest<LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'something is missing', success: false });
    }

    if (email === process.env.EMAIL && password === process.env.PASSWORD) {
      const adminUser = {
        _id: '64891aefd53c9e0aaf2b91a7',
        username: 'Admin',
        email: '--',
        profilePicture: 'https://static.vecteezy.com/system/resources/previews/000/290/610/non_2x/administration-vector-icon.jpg',
        hobby: '--',
        faculty: '⚙️',
        post: null,
      };

      const token = jwt.sign({ userId: adminUser._id }, process.env.SECRET_KEY as string, { expiresIn: '1d' });
      return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({ message: 'Welcom back, Chief', success: true, user: adminUser });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'email doesnot exixt', success: false });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.status(401).json({ message: 'invalid email or password', success: false });

    const populatedPost = await Promise.all(
      (user.post || []).map(async (postId: mongoose.Types.ObjectId) => {
        const post = await Post.findById(postId as mongoose.Types.ObjectId);
        if (post && post.author && (post.author as mongoose.Types.ObjectId).toString && (post.author as mongoose.Types.ObjectId).toString() === (user._id as mongoose.Types.ObjectId).toString()) {
          return post;
        }
        return null;
      })
    );

    const responseUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      hobby: user.hobby,
      faculty: user.faculty,
      post: populatedPost,
    };

    const token = jwt.sign({ userId: responseUser._id }, process.env.SECRET_KEY as string, { expiresIn: '1d' });
    return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({ message: `hello ${responseUser.username} 👋`, success: true, user: responseUser });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const logout = async (_: Request, res: Response) => {
  try {
    return res.cookie('token', '', { maxAge: 0 }).json({ message: 'logged out successfully', success: true });
  } catch (err) {
    console.error('logout error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const getprofile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('post');
    return res.status(200).json({ user, success: true });
  } catch (err) {
    console.error('getprofile error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export interface EditProfileBody { hobby?: string; gender?: string }

export const editProfile = async (req: TypedRequest<EditProfileBody>, res: Response) => {
  try {
    const userId = req.id as string;
    const { hobby, gender } = req.body;
    const profilePicture = req.file as Express.Multer.File | undefined;
    let cloudResponse: any;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri as string);
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'user not found', success: false });

    if (hobby) user.hobby = hobby;
    if (typeof gender !== 'undefined') (user as any).gender = gender as any;
    if (profilePicture && cloudResponse) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({ message: ' profile updated ', success: true, user });
  } catch (err) {
    console.error('editProfile error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const getSuggestedUsers = async (req: Request, res: Response) => {
  try {
    const suggestedUsers = await User.find({ _id: { $nin: [req.id, '64891aefd53c9e0aaf2b91a7'] } }).select('-password');
    return res.status(200).json({ success: true, users: suggestedUsers });
  } catch (err) {
    console.error('getSuggestedUsers error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const addFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Friend user id
    const currentUserId = req.id; // logged-in user id

    const user = await User.findById(currentUserId as string);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.friends.map(String).includes(String(userId))) return res.status(400).json({ success: false, message: 'User is already in your friends list' });

    user.friends.push(new mongoose.Types.ObjectId(userId));
    await user.save();
    return res.status(200).json({ success: true, message: 'Friend added successfully' });
  } catch (err) {
    console.error('addFriends error:', err);
    return res.status(500).json({ success: false, message: 'An error occurred while adding the friend' });
  }
};
