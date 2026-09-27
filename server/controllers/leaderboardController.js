import User from '../models/User.js';
import Tutor from '../models/Tutor.js';

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 50, type = 'xp' } = req.query;

    // Get students
    const students = await User.find({ role: 'student' })
      .select('name username avatar xp streak institution email')
      .lean();

    // Get tutors/faculty
    const tutors = await Tutor.find({})
      .select('name username avatar xp streak institution email')
      .lean();

    // Combine and sort
    let allUsers = [
      ...students.map(s => ({ ...s, userType: 'student' })),
      ...tutors.map(t => ({ ...t, userType: 'tutor' }))
    ];

    if (type === 'streak') {
      allUsers.sort((a, b) => (b.streak || 0) - (a.streak || 0));
    } else {
      allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    }

    // Add rank and format
    const leaderboard = allUsers
      .slice(0, Number(limit))
      .map((user, index) => ({
        rank: index + 1,
        id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        xp: user.xp || 0,
        streak: user.streak || 0,
        institution: user.institution || 'Unknown',
        userType: user.userType,
        badge: getBadge(index + 1, user.xp || 0, user.streak || 0),
      }));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching leaderboard' });
  }
};

// @desc    Get current user's rank
// @route   GET /api/leaderboard/my-rank
// @access  Private
export const getMyRank = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Get all users for ranking
    const students = await User.find({ role: 'student' })
      .select('_id xp streak')
      .lean();
    const tutors = await Tutor.find({})
      .select('_id xp streak')
      .lean();

    const allUsers = [
      ...students.map(s => ({ ...s, userType: 'student' })),
      ...tutors.map(t => ({ ...t, userType: 'tutor' }))
    ];

    allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    const myIndex = allUsers.findIndex(u => u._id.toString() === userId.toString());
    
    if (myIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found in leaderboard' });
    }

    const myUser = allUsers[myIndex];
    const rank = myIndex + 1;
    const percentile = Math.round((1 - rank / allUsers.length) * 100);

    res.status(200).json({
      success: true,
      data: {
        rank,
        totalUsers: allUsers.length,
        percentile,
        xp: myUser.xp || 0,
        streak: myUser.streak || 0,
        badge: getBadge(rank, myUser.xp || 0, myUser.streak || 0),
      },
    });
  } catch (error) {
    console.error('Get My Rank Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching rank' });
  }
};

// @desc    Get leaderboard stats
// @route   GET /api/leaderboard/stats
// @access  Public
export const getLeaderboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await Tutor.countDocuments({});

    // Top XP
    const topXPStudent = await User.findOne({ role: 'student' }).sort({ xp: -1 }).select('name xp').lean();
    const topXPFaculty = await Tutor.findOne().sort({ xp: -1 }).select('name xp').lean();

    // Top Streak
    const topStreakStudent = await User.findOne({ role: 'student' }).sort({ streak: -1 }).select('name streak').lean();
    const topStreakFaculty = await Tutor.findOne().sort({ streak: -1 }).select('name streak').lean();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        topXP: {
          student: topXPStudent,
          faculty: topXPFaculty,
        },
        topStreak: {
          student: topStreakStudent,
          faculty: topStreakFaculty,
        },
      },
    });
  } catch (error) {
    console.error('Leaderboard Stats Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching stats' });
  }
};

// Helper function to determine badge based on rank/XP/streak
function getBadge(rank, xp, streak) {
  if (rank === 1) return 'Grand Scholar';
  if (rank <= 3) return 'Elite Learner';
  if (rank <= 10) return 'Master';
  if (rank <= 25) return 'Scholar Pro';
  if (rank <= 50) return 'Scholar';
  if (xp >= 20000) return 'Expert';
  if (xp >= 10000) return 'Advanced';
  if (xp >= 5000) return 'Intermediate';
  if (streak >= 30) return 'Streak Master';
  return 'Rising Star';
}