import express from 'express';
import { getDashboardStats, updateProfile, toggleWishlist } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/dashboard  (Protected)
router.get('/dashboard', protect, getDashboardStats);

// PUT /api/users/profile  (Protected)
router.put('/profile', protect, updateProfile);

// POST /api/users/wishlist  (Protected)
router.post('/wishlist', protect, toggleWishlist);

export default router;
