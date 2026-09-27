import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/sendEmail.js';

// RFC 5322 compliant regex ensuring proper email syntax with domain and dot, without restricting providers
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const validateEmailAddress = (email) => {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return { isValid: false, error: 'Email is required.' };
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true, cleanEmail };
};

// Helper to generate JWT Token
const generateToken = (id, isTutor = false) => {
  return jwt.sign({ id, isTutor }, process.env.JWT_SECRET || 'studyverse_secret_jwt_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user / tutor & send 6-digit OTP
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'student', institution, department, title } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      return res.status(400).json({ message: emailCheck.error });
    }
    const cleanEmail = emailCheck.cleanEmail;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const isTutorRole = role === 'tutor' || role === 'faculty';

    // Check if account already exists across both collections
    let existingUser = await User.findOne({ email: cleanEmail }).select('+otpHash +otpExpiresAt +otpAttempts +otpLastSentAt +password');
    let isTutorDoc = false;
    if (!existingUser) {
      existingUser = await Tutor.findOne({ email: cleanEmail }).select('+otpHash +otpExpiresAt +otpAttempts +otpLastSentAt +password');
      if (existingUser) isTutorDoc = true;
    }

    // 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (existingUser) {
      // If account is already verified
      if (existingUser.emailVerified === true) {
        return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
      }

      // If account exists but email verification is incomplete, enforce 30s cooldown
      const COOLDOWN_MS = 30 * 1000;
      if (existingUser.otpLastSentAt && (Date.now() - new Date(existingUser.otpLastSentAt).getTime() < COOLDOWN_MS)) {
        const waitSecs = Math.ceil((COOLDOWN_MS - (Date.now() - new Date(existingUser.otpLastSentAt).getTime())) / 1000);
        return res.status(429).json({ message: `Please wait ${waitSecs}s before requesting a new verification code.` });
      }

      // Attempt sending email first before persisting
      try {
        await sendVerificationEmail(cleanEmail, otp, name.trim());
      } catch (mailErr) {
        console.error('Email sending failure:', mailErr);
        return res.status(500).json({ message: 'Unable to send verification email. Please try again.' });
      }

      existingUser.name = name.trim();
      existingUser.password = password; // pre-save hook will re-hash
      existingUser.otpHash = otpHash;
      existingUser.otpExpiresAt = otpExpiresAt;
      existingUser.otpAttempts = 0;
      existingUser.otpLastSentAt = new Date();
      if (isTutorRole || isTutorDoc) {
        if (institution) existingUser.institution = institution;
        if (department) existingUser.department = department;
        if (title) existingUser.title = title;
        if (role) existingUser.role = role;
      }
      await existingUser.save();

      return res.status(200).json({
        success: true,
        requireOtp: true,
        email: cleanEmail,
        message: 'A 6-digit verification code has been sent to your email.',
      });
    }

    // New user: attempt sending email before creating account
    try {
      await sendVerificationEmail(cleanEmail, otp, name.trim());
    } catch (mailErr) {
      console.error('Email sending failure:', mailErr);
      return res.status(500).json({ message: 'Unable to send verification email. Please try again.' });
    }

    const username = `@${name.toLowerCase().replace(/\s+/g, '')}${Math.floor(100 + Math.random() * 900)}`;

    if (isTutorRole) {
      await Tutor.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        username,
        institution: institution || 'Stanford University',
        department: department || 'Computer Science & AI',
        title: title || 'Faculty / Lead Instructor',
        role: role || 'tutor',
        emailVerified: false,
        isVerified: false,
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
      });
    } else {
      await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        username,
        role: 'student',
        emailVerified: false,
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      message: 'A 6-digit verification code has been sent to your email.',
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// @desc    Verify registration 6-digit OTP & activate account
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      return res.status(400).json({ message: emailCheck.error });
    }
    const cleanEmail = emailCheck.cleanEmail;

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return res.status(400).json({ message: 'Please enter a valid 6-digit OTP.' });
    }
    const cleanOtp = otp.trim();

    let user = await User.findOne({ email: cleanEmail }).select('+otpHash +otpExpiresAt +otpAttempts +password');
    let isTutor = false;
    if (!user) {
      user = await Tutor.findOne({ email: cleanEmail }).select('+otpHash +otpExpiresAt +otpAttempts +password');
      if (user) isTutor = true;
    }

    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please register first.' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'This email is already verified. Please log in.' });
    }

    // Limit incorrect attempts (max 5)
    if (user.otpAttempts >= 5) {
      return res.status(400).json({ message: 'Too many incorrect attempts. Please request a new OTP.' });
    }

    // Check OTP expiry (5 minutes)
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      user.otpHash = null;
      user.otpExpiresAt = null;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: 'This OTP has expired. Please request a new OTP.' });
    }

    if (!user.otpHash) {
      return res.status(400).json({ message: 'No active OTP found. Please request a new OTP.' });
    }

    // Compare entered OTP with hashed OTP
    const isMatch = await bcrypt.compare(cleanOtp, user.otpHash);
    if (!isMatch) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
    }

    // Successful OTP verification: activate account
    user.emailVerified = true;
    if (isTutor || user.role === 'tutor' || user.role === 'faculty') {
      user.isVerified = true;
    }
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, isTutor || user.role === 'tutor' || user.role === 'faculty');

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to StudyVerse 🎉',
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
        department: user.department,
        title: user.title,
        role: user.role,
        isVerified: user.isVerified ?? true,
        emailVerified: true,
        xp: user.xp || (isTutor ? 3500 : 1250),
        streak: user.streak || 1,
        dailyGoalMinutes: user.dailyGoalMinutes || 60,
        currentGoalMinutes: user.currentGoalMinutes || 45,
        wishlistedCourses: user.wishlistedCourses || [],
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ message: error.message || 'Server error verifying OTP.' });
  }
};

// @desc    Resend 6-digit registration verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      return res.status(400).json({ message: emailCheck.error });
    }
    const cleanEmail = emailCheck.cleanEmail;

    let user = await User.findOne({ email: cleanEmail }).select('+otpHash +otpExpiresAt +otpAttempts +otpLastSentAt');
    if (!user) {
      user = await Tutor.findOne({ email: cleanEmail }).select('+otpHash +otpExpiresAt +otpAttempts +otpLastSentAt');
    }

    if (!user) {
      return res.status(404).json({ message: 'No registration found for this email. Please register.' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'This email is already verified. Please log in.' });
    }

    // Cooldown check (30 seconds)
    const COOLDOWN_MS = 30 * 1000;
    if (user.otpLastSentAt && (Date.now() - new Date(user.otpLastSentAt).getTime() < COOLDOWN_MS)) {
      const waitSecs = Math.ceil((COOLDOWN_MS - (Date.now() - new Date(user.otpLastSentAt).getTime())) / 1000);
      return res.status(429).json({ message: `Please wait ${waitSecs} seconds before requesting a new OTP.` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    try {
      await sendVerificationEmail(cleanEmail, otp, user.name);
    } catch (mailErr) {
      console.error('Resend OTP Email Error:', mailErr);
      return res.status(500).json({ message: 'Unable to send verification email. Please try again.' });
    }

    user.otpHash = otpHash;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'A new verification code has been sent to your email.',
    });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return res.status(500).json({ message: error.message || 'Server error resending OTP.' });
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

    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: cleanEmail }).select('+password');
    let isTutor = false;

    if (!user) {
      user = await Tutor.findOne({ email: cleanEmail }).select('+password');
      if (user) isTutor = true;
    }

    if (user && (await user.matchPassword(password))) {
      // Require email verification for accounts marked emailVerified: false
      if (user.emailVerified === false) {
        return res.status(403).json({
          success: false,
          requireVerification: true,
          email: user.email,
          message: 'Please verify your email before logging in.',
        });
      }

      const token = jwt.sign(
        { id: user._id, isTutor: isTutor || user.role === 'tutor' || user.role === 'faculty' },
        process.env.JWT_SECRET || 'studyverse_secret_jwt_key_2026_secure',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
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
          department: user.department,
          title: user.title,
          role: user.role,
          isVerified: user.isVerified ?? true,
          emailVerified: true,
          xp: user.xp || 0,
          streak: user.streak || 1,
          dailyGoalMinutes: user.dailyGoalMinutes || 60,
          currentGoalMinutes: user.currentGoalMinutes || 45,
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

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const username = `@${(name || cleanEmail.split('@')[0]).toLowerCase().replace(/\s+/g, '')}`;
      user = await User.create({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        googleId: uid,
        avatar: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        username,
        emailVerified: true,
      });
    } else {
      let shouldSave = false;
      if (!user.googleId && uid) {
        user.googleId = uid;
        shouldSave = true;
      }
      if (photoURL && !user.avatar) {
        user.avatar = photoURL;
        shouldSave = true;
      }
      if (user.emailVerified === false) {
        user.emailVerified = true;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
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
        isVerified: true,
        emailVerified: true,
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
    let user = await User.findById(req.user._id);
    if (!user) {
      user = await Tutor.findById(req.user._id);
    }
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
        department: user.department,
        title: user.title,
        role: user.role,
        isVerified: user.isVerified,
        xp: user.xp || 0,
        streak: user.streak || 1,
        dailyGoalMinutes: user.dailyGoalMinutes || 60,
        currentGoalMinutes: user.currentGoalMinutes || 45,
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

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await Tutor.findOne({ email: email.toLowerCase() });
    }

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
    let user = await User.findOne({ email: email.toLowerCase() })
      .select('+passwordResetOtp +passwordResetOtpExpiry');
    if (!user) {
      user = await Tutor.findOne({ email: email.toLowerCase() })
        .select('+passwordResetOtp +passwordResetOtpExpiry');
    }

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
