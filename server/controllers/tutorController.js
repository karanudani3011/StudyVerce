import jwt from 'jsonwebtoken';
import Tutor from '../models/Tutor.js';
import User from '../models/User.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, isTutor: true }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new Tutor / Faculty member in separate 'tutors' collection
// @route   POST /api/tutors/register
// @access  Public
export const registerTutor = async (req, res) => {
  try {
    const { name, email, password, institution, department, title, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const tutorExists = await Tutor.findOne({ email: email.toLowerCase() });
    if (tutorExists) {
      return res.status(400).json({ message: 'A Tutor/Faculty account with this email already exists.' });
    }

    const username = `@${name.toLowerCase().replace(/\s+/g, '')}${Math.floor(100 + Math.random() * 900)}`;

    const tutor = await Tutor.create({
      name,
      email: email.toLowerCase(),
      password,
      username,
      institution: institution || 'Stanford University',
      department: department || 'Computer Science & AI',
      title: title || 'Faculty / Lead Instructor',
      role: role === 'faculty' ? 'faculty' : 'tutor',
      isVerified: true,
    });

    if (tutor) {
      const token = generateToken(tutor._id);
      return res.status(201).json({
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
          isVerified: tutor.isVerified,
          rating: tutor.rating,
          xp: tutor.xp,
          streak: tutor.streak,
          wishlistedCourses: tutor.wishlistedCourses || [],
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid tutor data received.' });
    }
  } catch (error) {
    console.error('Register Tutor Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during tutor registration.' });
  }
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

    // Try finding in Tutor collection first
    const tutor = await Tutor.findOne({ email: email.toLowerCase() }).select('+password');

    if (tutor && (await tutor.matchPassword(password))) {
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
          isVerified: tutor.isVerified,
          rating: tutor.rating,
          xp: tutor.xp,
          streak: tutor.streak,
          wishlistedCourses: tutor.wishlistedCourses || [],
        },
      });
    }

    // If not found in Tutor collection, check User collection if role is tutor/faculty
    const user = await User.findOne({ email: email.toLowerCase(), role: { $in: ['tutor', 'faculty'] } }).select('+password');
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          wishlistedCourses: user.wishlistedCourses || [],
        },
      });
    }

    return res.status(401).json({ message: 'Invalid Tutor credentials or account not found in Tutor database.' });
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
