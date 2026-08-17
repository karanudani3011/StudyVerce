import express from 'express';
import { chatWithAI, getChatHistory, clearChatHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/ai/chat  (Protected)
router.post('/chat', protect, chatWithAI);

// GET /api/ai/history  (Protected)
router.get('/history', protect, getChatHistory);

// DELETE /api/ai/history  (Protected)
router.delete('/history', protect, clearChatHistory);

export default router;
