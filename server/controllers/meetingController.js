import Meeting from '../models/Meeting.js';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import Admin from '../models/Admin.js';

// Helper to validate HTTP/HTTPS URL
const isValidHttpUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Helper to parse date and time string into a Date object
const createDateTime = (dateInput, timeStr) => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid scheduled date');
  }

  // Parse timeStr like "18:30" or "06:30 PM"
  let hours = 0;
  let minutes = 0;

  const is12Hour = /pm|am/i.test(timeStr);
  if (is12Hour) {
    const isPM = /pm/i.test(timeStr);
    const cleanTime = timeStr.replace(/am|pm/i, '').trim();
    const [h, m] = cleanTime.split(':').map(Number);
    hours = (isPM && h !== 12) ? h + 12 : (!isPM && h === 12) ? 0 : (h || 0);
    minutes = m || 0;
  } else {
    const [h, m] = timeStr.trim().split(':').map(Number);
    hours = h || 0;
    minutes = m || 0;
  }

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

// Helper to calculate live status
const getCalculatedStatus = (meeting) => {
  if (meeting.status === 'cancelled') return 'cancelled';
  const now = new Date();
  const start = new Date(meeting.startDateTime);
  const end = new Date(meeting.endDateTime);

  if (now >= start && now <= end) {
    return 'live';
  } else if (now < start) {
    return 'upcoming';
  } else {
    return 'completed';
  }
};

// @desc    Create a new live meeting (Faculty -> Students, Admin -> Faculty)
// @route   POST /api/meetings
// @access  Private (Faculty, Tutor, Admin)
export const createMeeting = async (req, res) => {
  try {
    const user = req.user;
    const role = user.role;

    // Reject students from creating meetings
    if (role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Students cannot create live meetings.',
      });
    }

    const {
      title,
      description,
      meetingPlatform = 'Google Meet',
      meetingUrl,
      scheduledDate,
      startTime,
      endTime,
      subject = 'General',
      courseId = null,
      courseName = '',
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Meeting title is required.' });
    }
    if (!meetingUrl || !meetingUrl.trim()) {
      return res.status(400).json({ success: false, message: 'Meeting link / URL is required.' });
    }
    if (!isValidHttpUrl(meetingUrl.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid HTTP or HTTPS meeting URL (e.g. https://meet.google.com/...)',
      });
    }
    if (!scheduledDate) {
      return res.status(400).json({ success: false, message: 'Scheduled date is required.' });
    }
    if (!startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Start time and End time are required.' });
    }

    const startDateTime = createDateTime(scheduledDate, startTime);
    const endDateTime = createDateTime(scheduledDate, endTime);

    if (endDateTime <= startDateTime) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time.',
      });
    }

    // Determine target audience and creator model strictly from authenticated user
    let createdByRole = 'faculty';
    let targetRole = 'students';
    let creatorModel = 'Tutor';

    if (role === 'admin') {
      createdByRole = 'admin';
      targetRole = 'faculty';
      creatorModel = 'Admin';
    } else {
      createdByRole = 'faculty';
      targetRole = 'students';
      creatorModel = (user.role === 'tutor' || user.role === 'faculty') ? 'Tutor' : 'User';
    }

    const meeting = await Meeting.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      meetingPlatform,
      meetingUrl: meetingUrl.trim(),
      createdBy: user._id,
      creatorModel,
      createdByRole,
      createdByName: user.name || (role === 'admin' ? 'Platform Administrator' : 'Faculty Educator'),
      createdByAvatar: user.avatar || '',
      targetRole,
      scheduledDate: new Date(scheduledDate),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      startDateTime,
      endDateTime,
      subject: subject ? subject.trim() : 'General',
      courseId,
      courseName: courseName ? courseName.trim() : '',
      status: 'upcoming',
    });

    return res.status(201).json({
      success: true,
      data: {
        ...meeting.toObject(),
        status: getCalculatedStatus(meeting),
      },
      message: 'Live meeting created successfully! 🎉',
    });
  } catch (error) {
    console.error('Create Meeting Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating meeting.' });
  }
};

// @desc    Get meetings visible to the currently authenticated user
// @route   GET /api/meetings
// @access  Private (All authenticated roles)
export const getMeetings = async (req, res) => {
  try {
    const user = req.user;
    const role = user.role;
    let query = {};

    if (role === 'admin') {
      // Admin sees all meetings on platform
      query = {};
    } else if (role === 'tutor' || role === 'faculty') {
      // Faculty sees:
      // 1) Meetings they created for students
      // 2) Admin-created meetings targeted to faculty
      query = {
        $or: [
          { createdBy: user._id },
          { targetRole: 'faculty', createdByRole: 'admin' },
        ],
      };
    } else {
      // Students see meetings created by faculty targeted to students
      query = {
        targetRole: 'students',
        createdByRole: { $in: ['faculty', 'tutor'] },
      };
    }

    const meetings = await Meeting.find(query).sort({ startDateTime: 1 });

    const formattedMeetings = meetings.map((m) => {
      const calculatedStatus = getCalculatedStatus(m);
      const isCreator = user._id && m.createdBy && (m.createdBy.toString() === user._id.toString());
      const canManage = role === 'admin' || isCreator;

      return {
        _id: m._id,
        id: m._id,
        title: m.title,
        description: m.description,
        meetingPlatform: m.meetingPlatform,
        meetingUrl: m.meetingUrl,
        createdBy: m.createdBy,
        createdByRole: m.createdByRole,
        createdByName: m.createdByName,
        createdByAvatar: m.createdByAvatar,
        targetRole: m.targetRole,
        scheduledDate: m.scheduledDate,
        startTime: m.startTime,
        endTime: m.endTime,
        startDateTime: m.startDateTime,
        endDateTime: m.endDateTime,
        subject: m.subject,
        courseId: m.courseId,
        courseName: m.courseName,
        status: calculatedStatus,
        isCreator,
        canManage,
        createdAt: m.createdAt,
      };
    });

    return res.json({
      success: true,
      count: formattedMeetings.length,
      data: formattedMeetings,
    });
  } catch (error) {
    console.error('Get Meetings Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching meetings.' });
  }
};

// @desc    Get single meeting details
// @route   GET /api/meetings/:id
// @access  Private
export const getMeetingById = async (req, res) => {
  try {
    const user = req.user;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    // Authorization check
    if (user.role === 'student' && meeting.targetRole !== 'students') {
      return res.status(403).json({ success: false, message: 'Access denied to this meeting.' });
    }
    if ((user.role === 'tutor' || user.role === 'faculty') &&
        meeting.targetRole !== 'faculty' &&
        meeting.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this meeting.' });
    }

    const calculatedStatus = getCalculatedStatus(meeting);
    const isCreator = meeting.createdBy.toString() === user._id.toString();

    return res.json({
      success: true,
      data: {
        ...meeting.toObject(),
        status: calculatedStatus,
        isCreator,
        canManage: user.role === 'admin' || isCreator,
      },
    });
  } catch (error) {
    console.error('Get Meeting By Id Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching meeting.' });
  }
};

// @desc    Update an existing meeting
// @route   PUT /api/meetings/:id
// @access  Private (Admin or Creating Faculty)
export const updateMeeting = async (req, res) => {
  try {
    const user = req.user;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    // Security check: only admin or the creating faculty member can edit
    const isCreator = meeting.createdBy.toString() === user._id.toString();
    if (user.role !== 'admin' && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot modify a meeting created by another user.',
      });
    }

    const {
      title,
      description,
      meetingPlatform,
      meetingUrl,
      scheduledDate,
      startTime,
      endTime,
      subject,
      courseName,
      status,
    } = req.body;

    if (title !== undefined) meeting.title = title.trim();
    if (description !== undefined) meeting.description = description.trim();
    if (meetingPlatform !== undefined) meeting.meetingPlatform = meetingPlatform;
    if (subject !== undefined) meeting.subject = subject.trim();
    if (courseName !== undefined) meeting.courseName = courseName.trim();

    if (meetingUrl !== undefined) {
      if (!isValidHttpUrl(meetingUrl.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid HTTP or HTTPS meeting URL.',
        });
      }
      meeting.meetingUrl = meetingUrl.trim();
    }

    if (scheduledDate || startTime || endTime) {
      const newDate = scheduledDate || meeting.scheduledDate;
      const newStart = startTime || meeting.startTime;
      const newEnd = endTime || meeting.endTime;

      const startDateTime = createDateTime(newDate, newStart);
      const endDateTime = createDateTime(newDate, newEnd);

      if (endDateTime <= startDateTime) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time.',
        });
      }

      meeting.scheduledDate = new Date(newDate);
      meeting.startTime = newStart.trim();
      meeting.endTime = newEnd.trim();
      meeting.startDateTime = startDateTime;
      meeting.endDateTime = endDateTime;
    }

    if (status !== undefined) {
      meeting.status = status;
    }

    await meeting.save();

    return res.json({
      success: true,
      data: {
        ...meeting.toObject(),
        status: getCalculatedStatus(meeting),
      },
      message: 'Meeting updated successfully! ✏️',
    });
  } catch (error) {
    console.error('Update Meeting Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating meeting.' });
  }
};

// @desc    Cancel a meeting
// @route   PATCH /api/meetings/:id/cancel
// @access  Private (Admin or Creating Faculty)
export const cancelMeeting = async (req, res) => {
  try {
    const user = req.user;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    // Security check: only admin or the creating faculty member can cancel
    const isCreator = meeting.createdBy.toString() === user._id.toString();
    if (user.role !== 'admin' && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot cancel a meeting created by another user.',
      });
    }

    meeting.status = 'cancelled';
    await meeting.save();

    return res.json({
      success: true,
      data: {
        ...meeting.toObject(),
        status: 'cancelled',
      },
      message: 'Meeting has been marked as cancelled.',
    });
  } catch (error) {
    console.error('Cancel Meeting Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error cancelling meeting.' });
  }
};

// @desc    Delete a meeting
// @route   DELETE /api/meetings/:id
// @access  Private (Admin or Creating Faculty)
export const deleteMeeting = async (req, res) => {
  try {
    const user = req.user;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    // Security check: only admin or the creating faculty member can delete
    const isCreator = meeting.createdBy.toString() === user._id.toString();
    if (user.role !== 'admin' && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete a meeting created by another user.',
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Meeting deleted successfully from platform.',
    });
  } catch (error) {
    console.error('Delete Meeting Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error deleting meeting.' });
  }
};
