import express from 'express';
import { registerUser, loginUser, googleAuthSync, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// POST /api/auth/google
router.post('/google', googleAuthSync);

// GET /api/auth/me  (Protected)
router.get('/me', protect, getMe);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
