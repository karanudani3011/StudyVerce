import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendPasswordResetEmail from '../utils/sendEmail.js';

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

// @desc    Request password reset — generates & emails a 6-digit OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email exists, a reset code has been sent.',
      });
    }

    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash and store OTP with 10-minute expiry
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.passwordResetOtp = hashedOtp;
    user.passwordResetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now
    await user.save({ validateBeforeSave: false });

    // Send branded OTP email
    await sendPasswordResetEmail(user.email, otp, user.name);

    return res.status(200).json({
      success: true,
      message: 'A 6-digit reset code has been sent to your email.',
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ message: error.message || 'Server error sending reset email.' });
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Fetch user WITH the protected OTP fields
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+passwordResetOtp +passwordResetOtpExpiry');

    if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiry) {
      return res.status(400).json({ message: 'No active reset code found. Please request a new one.' });
    }

    // Check expiry
    if (user.passwordResetOtpExpiry < new Date()) {
      user.passwordResetOtp = null;
      user.passwordResetOtpExpiry = null;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.passwordResetOtp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid reset code. Please check and try again.' });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    user.passwordResetOtp = null;
    user.passwordResetOtpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ message: error.message || 'Server error resetting password.' });
  }
};
