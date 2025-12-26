import { Request, Response } from 'express';
import mongoose from 'mongoose';
import sharp from 'sharp';
import cloudinary from '../utils/cloudanary';
import { Post } from '../model/post.model';
import { User } from '../model/user.model';
import { Comment } from '../model/comment.model';

export interface NewPostBody { caption?: string }

export const addNewPost = async (req: Request<{}, any, NewPostBody>, res: Response) => {
  try {
    const { caption } = req.body;
    const image = req.file as Express.Multer.File | undefined;
    const authorId = req.id as string;

    if (!image) return res.status(401).json({ message: 'image required' });

    const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: 'inside' }).toFormat('jpeg', { quality: 80 }).toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({ caption, image: cloudResponse.secure_url, author: authorId });
    const user = await User.findById(authorId);

    if (user) {
      user.post.push(post._id as mongoose.Types.ObjectId);
      await user.save();
    }

    await post.populate({ path: 'author', select: '-password' });
    return res.status(200).json({ message: 'new post added', post, success: true });
  } catch (err) {
    console.error('addNewPost error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const getAllPost = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: 1 }).populate({ path: 'author', select: 'username profilePicture' }).populate({ path: 'comments', populate: { path: 'author', select: 'username profilePicture' } });
    return res.status(200).json({ posts, success: true });
  } catch (err) {
    console.error('getAllPost error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const getUserPost = async (req: Request, res: Response) => {
  try {
    const authorId = req.id as string;
    const posts = await Post.find({ author: new mongoose.Types.ObjectId(authorId) }).sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' }).populate({ path: 'comments', populate: { path: 'author', select: 'username profilePicture' } });
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.error('getUserPost error:', error);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const likePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const likeGarneWalaKoId = new mongoose.Types.ObjectId(req.id as string);
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'post not found', success: false });

    await post.updateOne({ $addToSet: { likes: likeGarneWalaKoId } });
    await post.save();
    return res.status(200).json({ message: 'post liked', success: true });
  } catch (err) {
    console.error('likePost error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const disLikePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const likeGarneWalaKoId = new mongoose.Types.ObjectId(req.id as string);
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'post not found', success: false });

    await post.updateOne({ $pull: { likes: likeGarneWalaKoId } });
    await post.save();
    return res.status(200).json({ message: 'post disliked', success: true });
  } catch (err) {
    console.error('disLikePost error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export interface CommentBody { text: string }

export const addComment = async (req: Request<{ id: string }, any, CommentBody>, res: Response) => {
  try {
    const postId = req.params.id;
    const commentGarneWalaKoId = new mongoose.Types.ObjectId(req.id as string);
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) return res.status(400).json({ message: 'text is required', success: false });

    const comment = await Comment.create({ text, author: commentGarneWalaKoId, post: postId });
    await comment.populate({ path: 'author', select: 'username profilePicture' });

    if (post) {
      post.comments.push(comment._id as mongoose.Types.ObjectId);
      await post.save();
    }

    return res.status(201).json({ message: 'comment added', comment, success: true });
  } catch (error) {
    console.error('addComment error:', error);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const getCommentsOfPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');
    if (!comments) return res.status(404).json({ message: 'no comments found for this post', success: false });
    return res.status(200).json({ success: true, comments });
  } catch (err) {
    console.error('getCommentsOfPost error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};

export const deletePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id;
    const adminId = '64891aefd53c9e0aaf2b91a7';
    const authorId = req.id as string;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'cant delete post', success: false });

    if (!(((post.author as mongoose.Types.ObjectId).toString() === req.id) || req.id === adminId)) return res.status(404).json({ message: 'unauthorized user', success: false });

    await Post.findByIdAndDelete(postId);
    const user = await User.findById(post.author);
    if (user) {
      user.post = user.post.filter((id: mongoose.Types.ObjectId) => id.toString() !== postId);
      await user.save();
    }

    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: 'post deleted successfully', success: true });
  } catch (err) {
    console.error('deletePost error:', err);
    return res.status(500).json({ message: 'server error', success: false });
  }
};
