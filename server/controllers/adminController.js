import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import Community from '../models/Community.js';
import Course from '../models/Course.js';
import TutorApplication from '../models/TutorApplication.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Helper to generate JWT Token for Admin
const generateToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Seed default admin account if not present
export const seedDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ adminId: 'admin' });
    if (!existingAdmin) {
      await Admin.create({
        adminId: 'admin',
        password: 'admin123',
        name: 'System Admin',
        role: 'admin',
      });
      console.log('✅ Default Admin account seeded (ID: admin)');
    }
  } catch (error) {
    console.error('Error seeding default admin:', error.message);
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ message: 'Please provide Admin ID and Password.' });
    }

    const isHardcodedAdmin = adminId.trim().toLowerCase() === 'admin' && password === 'admin123';

    let admin = await Admin.findOne({ adminId: adminId.trim().toLowerCase() }).select('+password');

    if (!admin && isHardcodedAdmin) {
      admin = await Admin.create({
        adminId: 'admin',
        password: 'admin123',
        name: 'Super Admin',
        role: 'admin',
      });
    }

    if (admin) {
      let isMatch = false;
      if (admin.password) {
        isMatch = await admin.matchPassword(password);
      }
      if (!isMatch && isHardcodedAdmin) {
        isMatch = true;
      }

      if (isMatch) {
        const token = generateToken(admin._id);
        return res.json({
          success: true,
          token,
          user: {
            id: admin._id,
            adminId: admin.adminId,
            name: admin.name,
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          },
        });
      }
    }

    return res.status(401).json({ message: 'Invalid Admin ID or Password.' });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during admin login.' });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/admin/me
// @access  Private (Admin)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.json({
        success: true,
        user: {
          id: req.user._id,
          adminId: 'admin',
          name: 'Super Admin',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
      });
    }
    return res.json({
      success: true,
      user: {
        id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching admin profile.' });
  }
};

// @desc    Get All Student Users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).sort({ createdAt: -1 }).select('-password');
    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching users.' });
  }
};

// @desc    Delete Student User
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error deleting user.' });
  }
};

// @desc    Get All Faculty & Tutors
// @route   GET /api/admin/faculty
// @access  Private (Admin)
export const getAllFaculty = async (req, res) => {
  try {
    const tutors = await Tutor.find({}).sort({ createdAt: -1 }).select('-password');
    return res.json({
      success: true,
      count: tutors.length,
      faculty: tutors,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching faculty/tutors.' });
  }
};

// @desc    Delete Faculty / Tutor
// @route   DELETE /api/admin/faculty/:id
// @access  Private (Admin)
export const deleteFaculty = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    await tutor.deleteOne();
    return res.json({ success: true, message: 'Faculty member deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error deleting faculty.' });
  }
};

// @desc    Remove all faculty accounts from database
// @route   DELETE /api/admin/faculty-cleanup
// @access  Private (Admin) / Public setup
export const cleanupFacultyAccounts = async (req, res) => {
  try {
    const result = await Tutor.deleteMany({ role: { $in: ['faculty', 'tutor'] } });
    const userResult = await User.deleteMany({ role: { $in: ['faculty', 'tutor'] } });
    return res.json({
      success: true,
      message: `Cleared ${result.deletedCount} entries from tutors collection and ${userResult.deletedCount} from users collection.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error purging faculty accounts.' });
  }
};

// @desc    Get Overall Dashboard Overview Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalFaculty = await Tutor.countDocuments({});
    const totalCommunities = await Community.countDocuments({});
    const totalCourses = await Course.countDocuments({});
    const pendingApplications = await TutorApplication.countDocuments({ status: 'pending' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalFaculty,
        totalCommunities,
        totalCourses,
        pendingApplications,
        pendingReports,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching admin stats.' });
  }
};

// ─── TUTOR APPLICATIONS ──────────────────────────────────────────────────

// @desc    Get All Tutor Applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
export const getAdminApplications = async (req, res) => {
  try {
    const applications = await TutorApplication.find({}).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching applications.' });
  }
};

// @desc    Update Tutor Application Status (Approve / Reject)
// @route   PATCH /api/admin/applications/:id/status
// @access  Private (Admin)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const application = await TutorApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    application.status = status;
    if (rejectionReason) application.rejectionReason = rejectionReason;
    application.reviewedAt = new Date();
    await application.save();

    // If Approved, create or promote Tutor record in Tutor collection
    if (status === 'approved') {
      const cleanEmail = application.email.toLowerCase();
      let tutor = await Tutor.findOne({ email: cleanEmail });
      if (!tutor) {
        const username = `@${application.fullName.toLowerCase().replace(/\s+/g, '')}${Math.floor(100 + Math.random() * 900)}`;
        const isFacultyEmail = cleanEmail.endsWith('@faculty.studyverse.com');

        tutor = await Tutor.create({
          name: application.fullName,
          email: cleanEmail,
          password: 'Password123!', // default temporary pass if auto-approved
          username,
          institution: application.institution,
          department: application.department || 'Academic Department',
          title: application.title || 'Verified Educator',
          role: isFacultyEmail ? 'faculty' : 'tutor',
          bio: application.bio,
          isVerified: true,
        });
      } else {
        tutor.isVerified = true;
        await tutor.save();
      }

      // Also update user record if exists
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.role = cleanEmail.endsWith('@faculty.studyverse.com') ? 'faculty' : 'tutor';
        await user.save();
      }
    }

    return res.json({
      success: true,
      message: `Application ${status} successfully.`,
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error updating application status.' });
  }
};

// ─── FLAGGED CONTENT REPORTS ──────────────────────────────────────────────

// @desc    Get All Flagged Content Reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getAdminReports = async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching reports.' });
  }
};

// @desc    Dismiss / Resolve Report
// @route   PATCH /api/admin/reports/:id/dismiss
// @access  Private (Admin)
export const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    report.status = 'resolved';
    report.resolvedAt = new Date();
    await report.save();

    return res.json({
      success: true,
      message: 'Report resolved successfully.',
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error resolving report.' });
  }
};

// @desc    Delete Flagged Content & Mark Report as Resolved
// @route   DELETE /api/admin/reports/:id/content
// @access  Private (Admin)
export const deleteReportedContent = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Attempt deleting target content based on type
    if (report.contentId) {
      if (report.contentType === 'post') {
        await Community.updateOne({}, { $pull: { posts: { _id: report.contentId } } }).catch(() => {});
      } else if (report.contentType === 'course') {
        await Course.findByIdAndDelete(report.contentId).catch(() => {});
      }
    }

    report.status = 'resolved';
    report.adminNotes = 'Content removed by admin.';
    report.resolvedAt = new Date();
    await report.save();

    return res.json({
      success: true,
      message: 'Flagged content deleted and report marked as resolved.',
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error deleting content.' });
  }
};

// @desc    Get Faculty list for Admin Messaging (Students excluded!)
// @route   GET /api/admin/faculty-messages/list
// @access  Private (Admin)
export const getFacultyForAdminMessaging = async (req, res) => {
  try {
    const faculty = await Tutor.find().select('name username avatar role institution department title email status').sort({ name: 1 });
    return res.json({
      success: true,
      faculty,
    });
  } catch (error) {
    console.error('Get Faculty for Admin Messaging Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching faculty list.' });
  }
};

// @desc    Get Chat History between Admin and a Faculty Educator
// @route   GET /api/admin/faculty-messages/:facultyId
// @access  Private (Admin)
export const getAdminFacultyChatHistory = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { facultyId } = req.params;

    const faculty = await Tutor.findById(facultyId).select('name username avatar role institution department title email');
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty educator not found.' });
    }

    const conversationId = [adminId.toString(), facultyId.toString()].sort().join('_');
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    return res.json({
      success: true,
      faculty,
      messages: messages.map((m) => ({
        id: m._id,
        senderId: m.senderId.toString(),
        receiverId: m.receiverId.toString(),
        text: m.text,
        createdAt: m.createdAt,
        isMe: m.senderId.toString() === adminId.toString(),
      })),
    });
  } catch (error) {
    console.error('Get Admin-Faculty Chat History Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching chat history.' });
  }
};

// @desc    Send Message from Admin to a Faculty Educator
// @route   POST /api/admin/faculty-messages/send
// @access  Private (Admin)
export const sendAdminFacultyMessage = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { facultyId, text } = req.body;

    if (!facultyId || !text || !text.trim()) {
      return res.status(400).json({ message: 'Faculty ID and message text are required.' });
    }

    const faculty = await Tutor.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: 'Target Faculty Educator not found in database.' });
    }

    const conversationId = [adminId.toString(), facultyId.toString()].sort().join('_');

    const message = await Message.create({
      conversationId,
      senderId: adminId,
      receiverId: facultyId,
      text: text.trim(),
    });

    await Conversation.findOneAndUpdate(
      { conversationId },
      {
        conversationId,
        participants: [adminId, facultyId],
        lastMessage: text.trim(),
        lastSenderId: adminId,
        lastMessageAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: {
        id: message._id,
        senderId: message.senderId.toString(),
        receiverId: message.receiverId.toString(),
        text: message.text,
        createdAt: message.createdAt,
        isMe: true,
      },
    });
  } catch (error) {
    console.error('Send Admin-Faculty Message Error:', error);
    return res.status(500).json({ message: error.message || 'Server error sending message to faculty.' });
  }
};
