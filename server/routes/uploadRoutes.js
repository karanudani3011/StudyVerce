import express from 'express';
import { uploadMedia } from '../controllers/uploadController.js';
import { upload } from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/upload  (Protected — single file upload to Cloudinary)
router.post('/', protect, upload.single('media'), uploadMedia);

export default router;
