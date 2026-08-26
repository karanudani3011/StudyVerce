import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import Admin from '../models/Admin.js';

// Helper to generate consistent conversation ID for 2 participants
const getConversationId = (id1, id2) => {
  return [id1.toString(), id2.toString()].sort().join('_');
};

// Helper to find user, tutor, or admin profile strictly from MongoDB collections
const findParticipantProfile = async (userId) => {
  try {
    let profile = await User.findById(userId).select('name username avatar role institution department title email');
    if (!profile) {
      profile = await Tutor.findById(userId).select('name username avatar role institution department title email');
    }
    if (!profile) {
      const admin = await Admin.findById(userId);
      if (admin) {
        return {
          _id: admin._id,
          name: '🛡️ StudyVerse Admin',
          username: '@admin',
          avatar: admin.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'admin',
          institution: 'Official Platform Support',
          department: 'Administrator',
          email: 'admin@studyverse.com',
        };
      }
    }
    return profile || null;
  } catch (err) {
    return null;
  }
};

// Informal personal chat patterns to block
const INFORMAL_PATTERNS = [
  /\bhow\s+are\s+you\b/i,
  /\bhow\s+r\s+u\b/i,
  /\bhow\s+are\s+u\b/i,
  /\bhru\b/i,
  /\bwhat\s+are\s+you\s+doing\b/i,
  /\bwhat\s+r\s+u\s+doing\b/i,
  /\bwyd\b/i,
  /\bwhat'?s?\s+up\b/i,
  /\bwhatsup\b/i,
  /\bwbu\b/i,
  /\bwhere\s+are\s+you\b/i,
  /\bwru\b/i,
  /\bare\s+you\s+free\b/i,
  /\br\s+u\s+free\b/i,
  /\blet'?s\s+hang\s*out\b/i,
  /\bcall\s+me\b/i,
  /\bdate\b/i,
  /\bmeet\s+me\b/i,
  /\bsingle\b/i,
  /\blove\s+you\b/i,
  /\bgirlfriend\b/i,
  /\bboyfriend\b/i,
];

// Helper to validate message text content
const validateMessageContent = (text) => {
  const cleanText = text.trim();
  for (const pattern of INFORMAL_PATTERNS) {
    if (pattern.test(cleanText)) {
      return {
        valid: false,
        reason: "Educational Platform Policy: Personal chit-chat (such as 'how are you' or 'what are you doing') is not permitted. Please keep messages formal and related to coursework, lectures, or study topics.",
      };
    }
  }
  return { valid: true };
};

// @desc    Search students and faculty strictly from MongoDB collections
// @route   GET /api/messages/users/search
// @access  Private
export const searchUsersToMessage = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user._id;

    let tutorsQuery = { _id: { $ne: currentUserId } };
    let studentsQuery = { _id: { $ne: currentUserId } };

    if (q && q.trim()) {
      const searchStr = q.trim();
      const regex = new RegExp(searchStr, 'i');

      tutorsQuery.$or = [
        { name: regex },
        { username: regex },
        { email: regex },
        { department: regex },
        { institution: regex },
      ];

      studentsQuery.$or = [
        { name: regex },
        { username: regex },
        { email: regex },
        { institution: regex },
      ];
    }

    const [tutors, students] = await Promise.all([
      Tutor.find(tutorsQuery).select('name username avatar role institution department title email').limit(50),
      User.find(studentsQuery).select('name username avatar role institution email').limit(50),
    ]);

    // Return exact MongoDB document list
    return res.json({
      success: true,
      users: [...tutors, ...students],
    });
  } catch (error) {
    console.error('Search Users for Message Error:', error);
    return res.status(500).json({ message: error.message || 'Server error searching users.' });
  }
};

// @desc    Get all conversations for logged in user strictly from MongoDB
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1 });

    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const recipientId = conv.participants.find((p) => p.toString() !== userId.toString());
        const recipient = await findParticipantProfile(recipientId);

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          conversationId: conv.conversationId,
          receiverId: userId,
          isRead: false,
        });

        return {
          id: recipientId ? recipientId.toString() : conv._id.toString(),
          conversationId: conv.conversationId,
          recipient: recipient || {
            _id: recipientId,
            name: 'StudyVerse User',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            role: 'student',
          },
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        };
      })
    );

    return res.json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error('Get Conversations Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching conversations.' });
  }
};

// @desc    Get message history between logged in user and target user/faculty
// @route   GET /api/messages/:recipientId
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { recipientId } = req.params;

    const recipient = await findParticipantProfile(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User or Faculty not found in database.' });
    }

    const conversationId = getConversationId(currentUserId, recipientId);

    // Mark unread messages received by current user as read
    await Message.updateMany(
      { conversationId, receiverId: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    return res.json({
      success: true,
      recipient,
      conversationId,
      messages: messages.map((m) => ({
        id: m._id,
        senderId: m.senderId.toString(),
        receiverId: m.receiverId.toString(),
        text: m.text,
        createdAt: m.createdAt,
        isMe: m.senderId.toString() === currentUserId.toString(),
      })),
    });
  } catch (error) {
    console.error('Get Chat History Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching chat history.' });
  }
};

// @desc    Send a message to user/faculty
// @route   POST /api/messages/send
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text } = req.body;

    if (!receiverId || !text || !text.trim()) {
      return res.status(400).json({ message: 'Receiver ID and message text are required.' });
    }

    // Content moderation validation
    const validation = validateMessageContent(text);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        isWarning: true,
        message: validation.reason,
      });
    }

    const recipient = await findParticipantProfile(receiverId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient user or faculty not found in database.' });
    }

    const conversationId = getConversationId(senderId, receiverId);

    // Create the message in MongoDB
    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      text: text.trim(),
    });

    // Create or update conversation record in MongoDB
    await Conversation.findOneAndUpdate(
      { conversationId },
      {
        conversationId,
        participants: [senderId, receiverId],
        lastMessage: text.trim(),
        lastSenderId: senderId,
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
    console.error('Send Message Error:', error);
    return res.status(500).json({ message: error.message || 'Server error sending message.' });
  }
};
