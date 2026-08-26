import express from 'express';
import {
  loginAdmin,
  getAdminProfile,
  getAllUsers,
  deleteUser,
  getAllFaculty,
  deleteFaculty,
  cleanupFacultyAccounts,
  getDashboardStats,
  getAdminApplications,
  updateApplicationStatus,
  getAdminReports,
  updateReportStatus,
  deleteReportedContent,
  getFacultyForAdminMessaging,
  getAdminFacultyChatHistory,
  sendAdminFacultyMessage,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getAdminProfile);
router.get('/stats', protect, getDashboardStats);
router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);
router.get('/faculty', protect, getAllFaculty);
router.delete('/faculty/:id', protect, deleteFaculty);
router.delete('/faculty-cleanup', cleanupFacultyAccounts);

// Tutor Applications Routes
router.get('/applications', protect, getAdminApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

// Flagged Content Reports Routes
router.get('/reports', protect, getAdminReports);
router.patch('/reports/:id/dismiss', protect, updateReportStatus);
router.delete('/reports/:id/content', protect, deleteReportedContent);

// Admin to Faculty Messaging Routes (Students excluded!)
router.get('/faculty-messages/list', protect, getFacultyForAdminMessaging);
router.get('/faculty-messages/:facultyId', protect, getAdminFacultyChatHistory);
router.post('/faculty-messages/send', protect, sendAdminFacultyMessage);

export default router;
