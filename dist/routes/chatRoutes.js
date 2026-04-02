import express from 'express';
import { sendMessage, getMessages, replyMessage } from '../controllers/chatController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/send', sendMessage);
router.get('/messages', authMiddleware, getMessages);
router.post('/reply/:id', authMiddleware, isAdmin, replyMessage);
export default router;
