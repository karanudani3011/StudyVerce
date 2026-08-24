import Report from '../models/Report.js';

// @desc    Submit a content report / flag
// @route   POST /api/reports
// @access  Public / Private
export const createReport = async (req, res) => {
  try {
    const { contentType, contentId, contentPreview, reason, priority, reporterName, reporterAvatar, reporterId } = req.body;

    if (!contentType || !contentPreview || !reason) {
      return res.status(400).json({ message: 'Content type, preview, and reason are required.' });
    }

    const report = await Report.create({
      reporter: reporterId || null,
      reporterName: reporterName || 'Community Member',
      reporterAvatar: reporterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      contentType,
      contentId: contentId || '',
      contentPreview: contentPreview.trim(),
      reason: reason.trim(),
      priority: priority || 'medium',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our admin team will review it.',
      report,
    });
  } catch (error) {
    console.error('Create Report Error:', error);
    return res.status(500).json({ message: error.message || 'Server error creating report.' });
  }
};
