import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated';
import { getMessage, sendMessage } from '../controllers/message.controller';

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/send/:id').get(isAuthenticated, getMessage);

export default router;
