import express from 'express';
import { 
  getNotes, 
  getNoteById,
  createNote, 
  deleteNote,
  toggleNoteLike,
  toggleNoteBookmark,
  getTrendingTags,
  getNoteSubjects,
  getNoteFormats,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getNotes);
router.get('/trending-tags', getTrendingTags);
router.get('/subjects', getNoteSubjects);
router.get('/formats', getNoteFormats);
router.get('/:id', getNoteById);

// Protected routes
router.use(protect);
router.post('/', createNote);
router.post('/:id/like', toggleNoteLike);
router.post('/:id/bookmark', toggleNoteBookmark);
router.delete('/:id', deleteNote);

export default router;