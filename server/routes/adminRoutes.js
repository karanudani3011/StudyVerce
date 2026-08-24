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
router.patch('/applications/:id/status', protect, updateApplicationStatus);

// Flagged Content Reports Routes
router.get('/reports', protect, getAdminReports);
router.patch('/reports/:id/dismiss', protect, updateReportStatus);
router.delete('/reports/:id/content', protect, deleteReportedContent);

export default router;
