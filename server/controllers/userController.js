import User from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get dashboard statistics for current user
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      success: true,
      stats: {
        streak: user.streak,
        xp: user.xp,
        studyHours: '32.5 hrs',
        dailyGoalMinutes: user.dailyGoalMinutes,
        currentGoalMinutes: user.currentGoalMinutes,
        completionPercentage: Math.round((user.currentGoalMinutes / user.dailyGoalMinutes) * 100),
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
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    
    if (req.body.username !== undefined) {
      user.username = req.body.username;
    }
    if (req.body.institution !== undefined) {
      user.institution = req.body.institution;
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
        coverImage: updatedUser.coverImage,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        role: updatedUser.role,
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

    const user = await User.findById(req.user._id);
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
