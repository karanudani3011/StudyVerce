import express from 'express';
import {
  searchUsersToMessage,
  getConversations,
  getChatHistory,
  sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users/search', protect, searchUsersToMessage);
router.get('/conversations', protect, getConversations);
router.get('/:recipientId', protect, getChatHistory);
router.post('/send', protect, sendMessage);

export default router;
