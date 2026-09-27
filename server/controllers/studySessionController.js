import StudySession from '../models/StudySession.js';
import User from '../models/User.js';
import XPTransaction from '../models/XPTransaction.js';

// @desc    Start a study session
// @route   POST /api/study-sessions/start
// @access  Private
export const startStudySession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, lectureId } = req.body;

    // Check if there's already an active session
    const existingSession = await StudySession.findOne({
      userId,
      status: 'active',
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active study session. Stop it first.',
        session: existingSession,
      });
    }

    const session = await StudySession.create({
      userId,
      courseId: courseId || null,
      lectureId: lectureId || null,
      startedAt: new Date(),
      status: 'active',
    });

    res.status(201).json({
      success: true,
      session,
      message: 'Study session started!',
    });
  } catch (error) {
    console.error('Start Study Session Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Stop/Pause a study session
// @route   POST /api/study-sessions/stop
// @access  Private
export const stopStudySession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionId, pause = false } = req.body;

    const session = await StudySession.findOne({
      _id: sessionId,
      userId,
      status: 'active',
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Active session not found' });
    }

    const endedAt = new Date();
    const durationMs = endedAt - new Date(session.startedAt);
    const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));

    session.endedAt = endedAt;
    session.durationMinutes = durationMinutes;
    session.status = pause ? 'paused' : 'completed';

    // Award XP for study session (2 XP per minute, max 50 per session)
    const xpEarned = Math.min(durationMinutes * 2, 50);
    session.xpEarned = xpEarned;

    await session.save();

    // Update user's study time and XP
    const user = await User.findById(userId);
    if (user) {
      user.totalStudyMinutes = (user.totalStudyMinutes || 0) + durationMinutes;
      user.currentGoalMinutes = (user.currentGoalMinutes || 0) + durationMinutes;
      
      // Update weekly study minutes
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      if (!user.weeklyStudyWeekStart || new Date(user.weeklyStudyWeekStart) < weekStart) {
        user.weeklyStudyMinutes = durationMinutes;
        user.weeklyStudyWeekStart = weekStart;
      } else {
        user.weeklyStudyMinutes = (user.weeklyStudyMinutes || 0) + durationMinutes;
      }

      // Update streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
      if (lastStudy) {
        lastStudy.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          // Consecutive day
          user.streak = (user.streak || 0) + 1;
          if (user.streak > (user.longestStreak || 0)) {
            user.longestStreak = user.streak;
          }
        } else if (diffDays > 1) {
          // Streak broken
          user.streak = 1;
        }
        // If diffDays === 0, same day, streak unchanged
      } else {
        // First study session
        user.streak = 1;
        user.longestStreak = 1;
      }
      user.lastStudyDate = today;

      // Award XP
      if (xpEarned > 0) {
        user.xp = (user.xp || 0) + xpEarned;
        
        // Record XP transaction
        await XPTransaction.create({
          userId,
          amount: xpEarned,
          type: 'study_session',
          description: `Studied for ${durationMinutes} minutes`,
          referenceId: session._id,
          referenceType: 'StudySession',
          balanceAfter: user.xp,
        });
      }

      // Check if daily goal met
      if (user.currentGoalMinutes >= user.dailyGoalMinutes) {
        const bonusXP = 20;
        user.xp += bonusXP;
        await XPTransaction.create({
          userId,
          amount: bonusXP,
          type: 'daily_goal_met',
          description: 'Daily study goal achieved!',
          balanceAfter: user.xp,
        });
      }

      await user.save();
    }

    res.status(200).json({
      success: true,
      session,
      xpEarned,
      message: pause ? 'Study session paused' : 'Study session completed!',
    });
  } catch (error) {
    console.error('Stop Study Session Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get current active study session
// @route   GET /api/study-sessions/active
// @access  Private
export const getActiveStudySession = async (req, res) => {
  try {
    const userId = req.user._id;
    const session = await StudySession.findOne({
      userId,
      status: 'active',
    }).sort({ startedAt: -1 });

    if (!session) {
      return res.status(200).json({ success: true, session: null });
    }

    // Calculate elapsed time
    const elapsedMs = Date.now() - new Date(session.startedAt).getTime();
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

    res.status(200).json({
      success: true,
      session: {
        ...session.toObject(),
        elapsedMinutes,
        elapsedSeconds: Math.floor(elapsedMs / 1000),
      },
    });
  } catch (error) {
    console.error('Get Active Session Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get study session statistics
// @route   GET /api/study-sessions/stats
// @access  Private
export const getStudySessionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'week' } = req.query;

    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'all':
      default:
        startDate = new Date(0);
    }

    const sessions = await StudySession.find({
      userId,
      status: 'completed',
      startedAt: { $gte: startDate },
    }).sort({ startedAt: -1 });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const totalXP = sessions.reduce((sum, s) => sum + (s.xpEarned || 0), 0);
    const sessionCount = sessions.length;

    // Get daily breakdown for the week
    const dailyBreakdown = {};
    if (period === 'week') {
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        const dayStr = day.toISOString().split('T')[0];
        dailyBreakdown[dayStr] = 0;
      }
      sessions.forEach(s => {
        const dayStr = new Date(s.startedAt).toISOString().split('T')[0];
        if (dailyBreakdown[dayStr] !== undefined) {
          dailyBreakdown[dayStr] += s.durationMinutes || 0;
        }
      });
    }

    // Get user's streak and goal data
    const user = await User.findById(userId).select('streak longestStreak dailyGoalMinutes currentGoalMinutes totalStudyMinutes weeklyStudyMinutes lastStudyDate');

    res.status(200).json({
      success: true,
      stats: {
        period,
        totalMinutes,
        totalXP,
        sessionCount,
        dailyBreakdown,
        streak: user?.streak || 0,
        longestStreak: user?.longestStreak || 0,
        dailyGoalMinutes: user?.dailyGoalMinutes || 60,
        currentGoalMinutes: user?.currentGoalMinutes || 0,
        totalStudyMinutes: user?.totalStudyMinutes || 0,
        weeklyStudyMinutes: user?.weeklyStudyMinutes || 0,
        lastStudyDate: user?.lastStudyDate,
        avgSessionLength: sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0,
      },
    });
  } catch (error) {
    console.error('Get Study Stats Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get study session history
// @route   GET /api/study-sessions/history
// @access  Private
export const getStudySessionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, page = 1, status } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const sessions = await StudySession.find(query)
      .sort({ startedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await StudySession.countDocuments(query);

    res.status(200).json({
      success: true,
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get Study History Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};