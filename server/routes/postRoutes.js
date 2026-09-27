import express from 'express';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  toggleLike, 
  toggleBookmark, 
  deletePost, 
  getMyPosts,
  getTrendingSubjects
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/trending-subjects', getTrendingSubjects);
router.get('/:id', getPostById);

// Protected routes (require authentication)
router.use(protect);

// User post routes
router.post('/', createPost);
router.get('/my-posts', getMyPosts);
router.post('/:id/like', toggleLike);
router.post('/:id/bookmark', toggleBookmark);
router.delete('/:id', deletePost);

export default router;