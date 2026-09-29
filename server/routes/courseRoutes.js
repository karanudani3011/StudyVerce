import express from 'express';
import {
  getCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getEnrolledCourses,
  updateCourseProgress,
  getCourseProgress,
  getEnrollmentStatus,
  getCertificate,
  getCourseQuiz,
  submitCourseQuiz,
  getCourseQuizResult,
  manageCourseQuiz,
  deleteCourseQuiz,
  getCourseStats,
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', getCourses);
router.post('/', createCourse);

// ─── Protected routes (require authentication) ────────────────────────────────
router.use(protect);

// Enrollment & my courses
router.get('/enrolled/my', getEnrolledCourses);
router.post('/:id/enroll', enrollInCourse);
router.get('/:id/enrollment-status', getEnrollmentStatus);

// Progress
router.get('/:id/progress', getCourseProgress);
router.put('/:id/progress', updateCourseProgress);

// Certificate (backend-validated)
router.get('/:id/certificate', getCertificate);

// Final Quiz for course (student)
router.get('/:id/quiz', getCourseQuiz);
router.post('/:id/quiz/submit', submitCourseQuiz);
router.get('/:id/quiz/my-result', getCourseQuizResult);

// Final Quiz management (faculty/admin)
router.post('/:id/quiz/manage', manageCourseQuiz);
router.delete('/:id/quiz', deleteCourseQuiz);

// Course details and management
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Admin stats for a course
router.get('/:id/stats', getCourseStats);

export default router;
