import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getMyQuizAttempts,
  getQuizAttempt,
  getQuizzesByCourse,
  createQuiz,
} from '../controllers/quizController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getQuizzes);
router.get('/course/:courseId', optionalAuth, getQuizzesByCourse);
router.get('/attempts/my', protect, getMyQuizAttempts);
router.get('/attempts/:attemptId', protect, getQuizAttempt);
router.get('/:id', optionalAuth, getQuizById);
router.post('/:id/submit', protect, submitQuiz);
router.post('/', protect, createQuiz);

export default router;