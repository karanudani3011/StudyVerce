import express from 'express';
import {
  startStudySession,
  stopStudySession,
  getActiveStudySession,
  getStudySessionStats,
  getStudySessionHistory,
} from '../controllers/studySessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/start', startStudySession);
router.post('/stop', stopStudySession);
router.get('/active', getActiveStudySession);
router.get('/stats', getStudySessionStats);
router.get('/history', getStudySessionHistory);

export default router;