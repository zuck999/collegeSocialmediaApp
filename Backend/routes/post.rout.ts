import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';
import { addComment, addNewPost, deletePost, disLikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controller';

const router = express.Router();

router.route('/add').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/all').get(getAllPost);
router.route('/user').get(isAuthenticated, getUserPost);
router.route('/:id/like').post(isAuthenticated, likePost);
router.route('/:id/dislike').post(isAuthenticated, disLikePost);
router.route('/:id/comment').post(isAuthenticated, addComment);
router.route('/:id/comments').get(getCommentsOfPost);
router.route('/:id').delete(isAuthenticated, deletePost);

export default router;
