import express from 'express';
import { createReport } from '../controllers/reportController.js';

const router = express.Router();

// Submit a new content report (accessible by any logged-in user)
router.post('/', createReport);

export default router;
