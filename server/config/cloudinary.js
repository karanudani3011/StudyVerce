import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load env vars early — this file may be imported before server.js runs dotenv.config()
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: 'studyverse_media',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'webm', 'pdf'],
    };
  },
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for video/pdf
});

export { cloudinary };
