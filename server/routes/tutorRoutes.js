import express from 'express';
import {
  registerTutor,
  loginTutor,
  getTutorProfile,
  submitTutorApplication,
  getMyTutorApplication,
} from '../controllers/tutorController.js';

const router = express.Router();

router.post('/register', registerTutor);
router.post('/login', loginTutor);
router.post('/apply', submitTutorApplication);
router.get('/my-application', getMyTutorApplication);

export default router;
