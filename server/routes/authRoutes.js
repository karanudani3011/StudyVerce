import express from 'express';
import { registerUser, loginUser, googleAuthSync, getMe } from '../controllers/authController.js';
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

export default router;
