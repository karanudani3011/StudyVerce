import express from 'express';
import { getCourses, createCourse, getCourseById, deleteCourse } from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/', createCourse);
router.get('/:id', getCourseById);
router.delete('/:id', deleteCourse);

export default router;
