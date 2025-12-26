import express from 'express';
import { editProfile, getSuggestedUsers, getprofile, login, logout, register } from '../controllers/user.controller';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getprofile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilepicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);

export default router;
