import jwt from 'jsonwebtoken';
import Tutor from '../models/Tutor.js';
import User from '../models/User.js';
import TutorApplication from '../models/TutorApplication.js';
import { registerUser } from './authController.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, isTutor: true }, process.env.JWT_SECRET || 'studyverse_secret_jwt_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new Tutor / Faculty member in separate 'tutors' collection
// @route   POST /api/tutors/register
// @access  Public
export const registerTutor = async (req, res) => {
  req.body.role = req.body.role || 'tutor';
  return registerUser(req, res);
};

// @desc    Authenticate Tutor / Faculty member
// @route   POST /api/tutors/login
// @access  Public
export const loginTutor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Try finding in Tutor collection first
    const tutor = await Tutor.findOne({ email: cleanEmail }).select('+password');

    if (tutor && (await tutor.matchPassword(password))) {
      if (tutor.emailVerified === false) {
        return res.status(403).json({
          success: false,
          requireVerification: true,
          email: tutor.email,
          message: 'Please verify your email before logging in.',
        });
      }

      const token = generateToken(tutor._id);
      return res.json({
        success: true,
        token,
        user: {
          id: tutor._id,
          name: tutor.name,
          email: tutor.email,
          username: tutor.username,
          avatar: tutor.avatar,
          bio: tutor.bio,
          institution: tutor.institution,
          department: tutor.department,
          title: tutor.title,
          role: tutor.role,
          isVerified: tutor.isVerified ?? true,
          emailVerified: true,
          rating: tutor.rating,
          xp: tutor.xp,
          streak: tutor.streak,
          wishlistedCourses: tutor.wishlistedCourses || [],
        },
      });
    }

    // Check User collection if role is tutor/faculty
    const user = await User.findOne({ email: cleanEmail, role: { $in: ['tutor', 'faculty'] } }).select('+password');
    if (user && (await user.matchPassword(password))) {
      if (user.emailVerified === false) {
        return res.status(403).json({
          success: false,
          requireVerification: true,
          email: user.email,
          message: 'Please verify your email before logging in.',
        });
      }

      const token = jwt.sign({ id: user._id, isTutor: true }, process.env.JWT_SECRET || 'studyverse_secret_jwt_key_2026_secure', { expiresIn: '30d' });
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          institution: user.institution,
          department: user.department,
          title: user.title,
          role: user.role,
          isVerified: user.isVerified ?? true,
          emailVerified: true,
          xp: user.xp,
          streak: user.streak,
          wishlistedCourses: user.wishlistedCourses || [],
        },
      });
    }

    return res.status(401).json({ message: 'Invalid Tutor/Faculty credentials or account not found.' });
  } catch (error) {
    console.error('Tutor Login Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during tutor login.' });
  }
};

// @desc    Get Tutor Profile
// @route   GET /api/tutors/me
// @access  Private
export const getTutorProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.user._id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    return res.json({
      success: true,
      user: {
        id: tutor._id,
        name: tutor.name,
        email: tutor.email,
        username: tutor.username,
        avatar: tutor.avatar,
        bio: tutor.bio,
        institution: tutor.institution,
        department: tutor.department,
        title: tutor.title,
        role: tutor.role,
        isVerified: tutor.isVerified,
        rating: tutor.rating,
        xp: tutor.xp,
        streak: tutor.streak,
        wishlistedCourses: tutor.wishlistedCourses || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching tutor profile.' });
  }
};

// @desc    Submit Tutor / Faculty Application
// @route   POST /api/tutors/apply
// @access  Public / Private
export const submitTutorApplication = async (req, res) => {
  try {
    const { fullName, email, institution, department, title, subject, teachingExp, credentialsUrl, bio, userId } = req.body;

    if (!fullName || !email || !institution || !subject || !credentialsUrl || !bio) {
      return res.status(400).json({ message: 'Please complete all required application fields.' });
    }

    const application = await TutorApplication.create({
      user: userId || null,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      institution: institution.trim(),
      department: department ? department.trim() : '',
      title: title ? title.trim() : '',
      subject: subject.trim(),
      teachingExp: teachingExp || '0',
      credentialsUrl: credentialsUrl.trim(),
      bio: bio.trim(),
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application,
    });
  } catch (error) {
    console.error('Submit Application Error:', error);
    return res.status(500).json({ message: error.message || 'Server error submitting application.' });
  }
};

// @desc    Get current user's tutor application status
// @route   GET /api/tutors/my-application
// @access  Public / Private
export const getMyTutorApplication = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email required to query application.' });
    }

    const application = await TutorApplication.findOne({ email: email.trim().toLowerCase() }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      application: application || null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching application.' });
  }
};
