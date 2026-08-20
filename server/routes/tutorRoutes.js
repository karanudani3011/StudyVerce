import express from 'express';
import { registerTutor, loginTutor, getTutorProfile } from '../controllers/tutorController.js';

const router = express.Router();

router.post('/register', registerTutor);
router.post('/login', loginTutor);

export default router;
