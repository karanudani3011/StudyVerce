import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get dashboard statistics for current user
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      user = await Tutor.findById(req.user._id);
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentGoal = user.currentGoalMinutes || 45;
    const dailyGoal = user.dailyGoalMinutes || 60;

    return res.json({
      success: true,
      stats: {
        streak: user.streak || 1,
        xp: user.xp || 0,
        studyHours: '32.5 hrs',
        dailyGoalMinutes: dailyGoal,
        currentGoalMinutes: currentGoal,
        completionPercentage: Math.round((currentGoal / dailyGoal) * 100),
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching dashboard stats.' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    let isTutor = false;

    if (!user) {
      user = await Tutor.findById(req.user._id);
      if (user) isTutor = true;
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Input validations
    if (req.body.name !== undefined && !req.body.name.trim()) {
      return res.status(400).json({ message: 'Full name cannot be empty.' });
    }
    if (req.body.username !== undefined && !req.body.username.trim()) {
      return res.status(400).json({ message: 'Username cannot be empty.' });
    }

    if (req.body.name !== undefined) user.name = req.body.name.trim();
    if (req.body.bio !== undefined) user.bio = req.body.bio.trim();
    
    if (req.body.username !== undefined) {
      user.username = req.body.username.trim();
    }
    if (req.body.institution !== undefined) {
      user.institution = req.body.institution.trim();
    }
    if (req.body.department !== undefined && isTutor) {
      user.department = req.body.department.trim();
    }
    if (req.body.title !== undefined && isTutor) {
      user.title = req.body.title.trim();
    }

    // Upload base64 avatar to Cloudinary if it's a data URL
    if (req.body.avatar && req.body.avatar.startsWith('data:image/')) {
      const uploadRes = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'studyverse_avatars',
      });
      user.avatar = uploadRes.secure_url;
    } else if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }

    // Upload base64 banner to Cloudinary if it's a data URL
    if (req.body.coverImage && req.body.coverImage.startsWith('data:image/')) {
      const uploadRes = await cloudinary.uploader.upload(req.body.coverImage, {
        folder: 'studyverse_banners',
      });
      user.coverImage = uploadRes.secure_url;
    } else if (req.body.coverImage !== undefined) {
      user.coverImage = req.body.coverImage;
    }

    const updatedUser = await user.save();

    return res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        institution: updatedUser.institution,
        department: updatedUser.department,
        title: updatedUser.title,
        coverImage: updatedUser.coverImage,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        xp: updatedUser.xp,
        streak: updatedUser.streak,
        dailyGoalMinutes: updatedUser.dailyGoalMinutes,
        currentGoalMinutes: updatedUser.currentGoalMinutes,
        wishlistedCourses: updatedUser.wishlistedCourses || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error updating profile.' });
  }
};

// @desc    Toggle course wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    let user = await User.findById(req.user._id);
    if (!user) {
      user = await Tutor.findById(req.user._id);
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure wishlist array exists
    if (!user.wishlistedCourses) {
      user.wishlistedCourses = [];
    }

    const index = user.wishlistedCourses.indexOf(courseId);
    if (index > -1) {
      // Remove it
      user.wishlistedCourses.splice(index, 1);
    } else {
      // Add it
      user.wishlistedCourses.push(courseId);
    }

    await user.save();

    return res.json({
      success: true,
      wishlistedCourses: user.wishlistedCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error toggling wishlist.' });
  }
};

