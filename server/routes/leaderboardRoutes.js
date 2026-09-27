import express from 'express';
import { getLeaderboard, getMyRank, getLeaderboardStats } from '../controllers/leaderboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getLeaderboard);
router.get('/stats', getLeaderboardStats);

// Protected routes
router.use(protect);
router.get('/my-rank', getMyRank);

export default router;