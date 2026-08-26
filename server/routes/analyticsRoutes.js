import express from 'express';
import { getTutorAnalytics, requestPayout } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tutor', protect, getTutorAnalytics);
router.post('/payout', protect, requestPayout);

export default router;
