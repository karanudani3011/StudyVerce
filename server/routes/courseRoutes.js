import express from 'express';
import { 
  getCourses, 
  createCourse, 
  getCourseById, 
  deleteCourse,
  enrollInCourse,
  getEnrolledCourses,
  updateCourseProgress,
  getCourseProgress,
  getEnrollmentStatus
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.post('/', createCourse);
router.get('/:id', getCourseById);

// Protected routes (require authentication)
router.use(protect);

// Enrollment routes
router.get('/enrolled/my', getEnrolledCourses);
router.post('/:id/enroll', enrollInCourse);
router.get('/:id/enrollment-status', getEnrollmentStatus);
router.get('/:id/progress', getCourseProgress);
router.put('/:id/progress', updateCourseProgress);

// Admin/Faculty routes
router.delete('/:id', deleteCourse);

export default router;
