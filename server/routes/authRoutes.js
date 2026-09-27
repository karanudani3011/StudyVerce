import express from 'express';
import { 
  registerUser, 
  verifyRegistrationOtp, 
  resendRegistrationOtp, 
  loginUser, 
  googleAuthSync, 
  getMe, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register (starts registration & sends OTP)
router.post('/register', registerUser);

// POST /api/auth/verify-otp (verifies OTP & activates account)
router.post('/verify-otp', verifyRegistrationOtp);

// POST /api/auth/resend-otp (resends OTP with 30s cooldown)
router.post('/resend-otp', resendRegistrationOtp);

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
