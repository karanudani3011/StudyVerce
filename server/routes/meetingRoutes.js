import express from 'express';
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  cancelMeeting,
  deleteMeeting,
} from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMeeting)
  .get(protect, getMeetings);

router.route('/:id')
  .get(protect, getMeetingById)
  .put(protect, updateMeeting)
  .delete(protect, deleteMeeting);

router.patch('/:id/cancel', protect, cancelMeeting);

export default router;
