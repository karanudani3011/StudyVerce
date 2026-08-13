import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const username = `@${name.toLowerCase().replace(/\s+/g, '')}${Math.floor(100 + Math.random() * 900)}`;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      username,
    });

    if (user) {
      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          coverImage: user.coverImage,
          institution: user.institution,
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          dailyGoalMinutes: user.dailyGoalMinutes,
          currentGoalMinutes: user.currentGoalMinutes,
          wishlistedCourses: user.wishlistedCourses || [],
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received.' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
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
          coverImage: user.coverImage,
          institution: user.institution,
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          dailyGoalMinutes: user.dailyGoalMinutes,
          currentGoalMinutes: user.currentGoalMinutes,
          wishlistedCourses: user.wishlistedCourses || [],
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during login.' });
  }
};

// @desc    Sync Google / Firebase User with MongoDB
// @route   POST /api/auth/google
// @access  Public
export const googleAuthSync = async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for Google login.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const username = `@${(name || email.split('@')[0]).toLowerCase().replace(/\s+/g, '')}`;
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId: uid,
        avatar: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        username,
      });
    } else if (!user.googleId && uid) {
      user.googleId = uid;
      if (photoURL) user.avatar = photoURL;
      await user.save();
    }

    const token = generateToken(user._id);

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
        coverImage: user.coverImage,
        institution: user.institution,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        dailyGoalMinutes: user.dailyGoalMinutes,
        currentGoalMinutes: user.currentGoalMinutes,
        wishlistedCourses: user.wishlistedCourses || [],
      },
    });
  } catch (error) {
    console.error('Google Sync Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during Google auth sync.' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        coverImage: user.coverImage,
        institution: user.institution,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        dailyGoalMinutes: user.dailyGoalMinutes,
        currentGoalMinutes: user.currentGoalMinutes,
        wishlistedCourses: user.wishlistedCourses || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching user profile.' });
  }
};
