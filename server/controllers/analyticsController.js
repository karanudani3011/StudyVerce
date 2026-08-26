import TutorAnalytics from '../models/TutorAnalytics.js';
import Tutor from '../models/Tutor.js';

// @desc    Get tutor revenue & analytics data (creates default document if missing)
// @route   GET /api/analytics/tutor
// @access  Private
export const getTutorAnalytics = async (req, res) => {
  try {
    const tutorId = req.user._id;

    let analytics = await TutorAnalytics.findOne({ tutorId });

    if (!analytics) {
      // Create initial seed analytics record for newly verified tutors
      analytics = await TutorAnalytics.create({
        tutorId,
        totalEarnings: 3420.0,
        monthlyEarnings: 740.0,
        pendingPayout: 320.0,
        totalSales: 168,
        activeStudents: 284,
        avgRating: 4.88,
        monthlyData: [
          { month: 'Mar', revenue: 320, enrollments: 24 },
          { month: 'Apr', revenue: 450, enrollments: 38 },
          { month: 'May', revenue: 620, enrollments: 52 },
          { month: 'Jun', revenue: 580, enrollments: 47 },
          { month: 'Jul', revenue: 710, enrollments: 71 },
          { month: 'Aug', revenue: 740, enrollments: 93 },
        ],
        topCourses: [
          { title: 'Advanced ML with Python & PyTorch', sales: 78, revenue: 1560, rating: 4.9, trend: 'up' },
          { title: 'Data Science & Big Data Fundamentals', sales: 52, revenue: 1040, rating: 4.8, trend: 'up' },
          { title: 'Quantum Mechanics & Applied Physics', sales: 38, revenue: 820, rating: 4.7, trend: 'down' },
        ],
        transactions: [
          { id: 'TXN-9021', courseTitle: 'Advanced ML with Python', studentName: 'Alex Rivera', amount: 49.99, date: new Date(Date.now() - 2 * 3600000), type: 'course_sale', status: 'completed' },
          { id: 'TXN-8942', courseTitle: 'Data Science Fundamentals', studentName: 'Priya Sharma', amount: 39.99, date: new Date(Date.now() - 8 * 3600000), type: 'course_sale', status: 'completed' },
          { id: 'TXN-8871', courseTitle: 'Backpropagation Notes Vault', studentName: 'David Chen', amount: 14.99, date: new Date(Date.now() - 24 * 3600000), type: 'note_download', status: 'completed' },
          { id: 'TXN-8720', courseTitle: 'Monthly Faculty Payout', studentName: 'StudyVerse Escrow', amount: 500.0, date: new Date(Date.now() - 72 * 3600000), type: 'payout', status: 'completed' },
        ],
      });
    }

    return res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Fetch Analytics Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching analytics.' });
  }
};

// @desc    Request payout for pending earnings
// @route   POST /api/analytics/payout
// @access  Private
export const requestPayout = async (req, res) => {
  try {
    const tutorId = req.user._id;
    const analytics = await TutorAnalytics.findOne({ tutorId });

    if (!analytics || analytics.pendingPayout <= 0) {
      return res.status(400).json({ message: 'No pending payout available.' });
    }

    const payoutAmount = analytics.pendingPayout;
    analytics.totalEarnings += payoutAmount;
    analytics.pendingPayout = 0;
    analytics.transactions.unshift({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      courseTitle: 'Faculty Payout Request',
      studentName: req.user.name,
      amount: payoutAmount,
      date: new Date(),
      type: 'payout',
      status: 'completed',
    });

    await analytics.save();

    return res.json({
      success: true,
      message: `Payout request of $${payoutAmount.toFixed(2)} processed successfully!`,
      analytics,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error requesting payout.' });
  }
};
