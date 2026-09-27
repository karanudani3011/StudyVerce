import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import { cloudinary } from '../config/cloudinary.js';
import QuizAttempt from '../models/QuizAttempt.js';
import StudySession from '../models/StudySession.js';

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

    // Get quiz stats
    const quizStats = await QuizAttempt.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalCorrect: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
          avgPercentage: { $avg: '$percentage' },
          quizzesPassed: { $sum: { $cond: ['$passed', 1, 0] } },
          totalXPEarned: { $sum: '$xpEarned' },
        },
      },
    ]);

    // Get today's study time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = await StudySession.find({
      userId: user._id,
      status: 'completed',
      startedAt: { $gte: today },
    });
    const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    // Get this week's study time
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekSessions = await StudySession.find({
      userId: user._id,
      status: 'completed',
      startedAt: { $gte: weekStart },
    });
    const weekMinutes = weekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    // Get total study time
    const allSessions = await StudySession.find({
      userId: user._id,
      status: 'completed',
    });
    const totalMinutes = allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    const currentGoal = user.currentGoalMinutes || 0;
    const dailyGoal = user.dailyGoalMinutes || 60;
    const completionPercentage = Math.min(Math.round((currentGoal / dailyGoal) * 100), 100);

    // Format study time
    const formatTime = (minutes) => {
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    // Calculate today's quiz attempts
    const todayQuizAttempts = await QuizAttempt.countDocuments({
      userId: user._id,
      completedAt: { $gte: today },
    });

    // Dynamic daily tasks
    const dailyTasks = [
      {
        id: 'task-1',
        text: `Complete today's study session (${todayMinutes}/${dailyGoal} mins)`,
        subject: 'Study Habit',
        xp: 25,
        completed: todayMinutes >= Math.min(30, dailyGoal),
      },
      {
        id: 'task-2',
        text: 'Take a daily practice quiz challenge',
        subject: 'Self Assessment',
        xp: 50,
        completed: todayQuizAttempts > 0,
      },
      {
        id: 'task-3',
        text: 'Review lecture notes & course modules',
        subject: 'Revision',
        xp: 20,
        completed: (user.enrolledCourses?.length || 0) > 0 && todayMinutes > 0,
      },
      {
        id: 'task-4',
        text: 'Maintain active daily learning streak',
        subject: 'Consistency',
        xp: 15,
        completed: (user.streak || 0) > 0,
      },
    ];

    return res.json({
      success: true,
      stats: {
        streak: user.streak || 0,
        longestStreak: user.longestStreak || 0,
        xp: user.xp || 0,
        studyToday: formatTime(todayMinutes),
        studyThisWeek: formatTime(weekMinutes),
        studyTotal: formatTime(totalMinutes),
        studyHours: formatTime(weekMinutes),
        studyTodayMinutes: todayMinutes,
        studyWeekMinutes: weekMinutes,
        studyTotalMinutes: totalMinutes,
        dailyGoalMinutes: dailyGoal,
        currentGoalMinutes: currentGoal,
        completionPercentage,
        quizzesCompleted: quizStats[0]?.totalAttempts || 0,
        quizzesPassed: quizStats[0]?.quizzesPassed || 0,
        avgQuizScore: quizStats[0]?.avgPercentage ? Math.round(quizStats[0].avgPercentage) : 0,
        totalQuestionsAnswered: quizStats[0]?.totalQuestions || 0,
        correctAnswers: quizStats[0]?.totalCorrect || 0,
      },
      dailyTasks,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        institution: user.institution,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching dashboard stats.' });
  }
};

// @desc    Get user's daily study tasks
// @route   GET /api/study-tasks or GET /api/users/tasks
// @access  Private
export const getDailyTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id) || await Tutor.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = await StudySession.find({
      userId: user._id,
      status: 'completed',
      startedAt: { $gte: today },
    });
    const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const dailyGoal = user.dailyGoalMinutes || 60;

    const todayQuizAttempts = await QuizAttempt.countDocuments({
      userId: user._id,
      completedAt: { $gte: today },
    });

    const tasks = [
      {
        id: 'task-1',
        text: `Complete today's study session (${todayMinutes}/${dailyGoal} mins)`,
        subject: 'Study Habit',
        xp: 25,
        completed: todayMinutes >= Math.min(30, dailyGoal),
      },
      {
        id: 'task-2',
        text: 'Take a daily practice quiz challenge',
        subject: 'Self Assessment',
        xp: 50,
        completed: todayQuizAttempts > 0,
      },
      {
        id: 'task-3',
        text: 'Review lecture notes & course modules',
        subject: 'Revision',
        xp: 20,
        completed: (user.enrolledCourses?.length || 0) > 0 && todayMinutes > 0,
      },
      {
        id: 'task-4',
        text: 'Maintain active daily learning streak',
        subject: 'Consistency',
        xp: 15,
        completed: (user.streak || 0) > 0,
      },
    ];

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
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

