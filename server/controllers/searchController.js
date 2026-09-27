import Course from '../models/Course.js';
import Post from '../models/Post.js';
import Note from '../models/Note.js';
import Community from '../models/Community.js';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';

// @desc    Global search across all content types
// @route   GET /api/search
// @access  Public
export const globalSearch = async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, data: {} });
    }

    const searchQuery = q.trim();
    const searchRegex = { $regex: searchQuery, $options: 'i' };

    const results = {};

    // Search courses
    if (!type || type === 'courses' || type === 'all') {
      const courses = await Course.find({
        $or: [
          { title: searchRegex },
          { instructor: searchRegex },
          { subject: searchRegex },
          { category: searchRegex },
          { tags: { $in: [searchRegex] } },
        ]
      })
        .select('title instructor instructorAvatar image subject category subcategory duration lessons students rating level price')
        .limit(Number(limit))
        .lean();

      results.courses = courses.map(c => ({
        ...c,
        id: c._id,
        type: 'course',
        subtitle: `${c.instructor} · ${c.duration} · ${c.lessons} lessons`,
      }));
    }

    // Search posts
    if (!type || type === 'posts' || type === 'all') {
      const posts = await Post.find({
        $or: [
          { caption: searchRegex },
          { explanation: searchRegex },
          { topic: searchRegex },
          { subject: searchRegex },
          { tags: { $in: [searchRegex] } },
        ]
      })
        .select('caption topic subject image author authorAvatar authorRole tags likesCount createdAt')
        .limit(Number(limit))
        .lean();

      results.posts = posts.map(p => ({
        ...p,
        id: p._id,
        type: 'post',
        subtitle: `${p.author} · ${p.subject} · ${formatTimeAgo(p.createdAt)}`,
      }));
    }

    // Search notes
    if (!type || type === 'notes' || type === 'all') {
      const notes = await Note.find({
        $or: [
          { title: searchRegex },
          { subject: searchRegex },
          { 'author.name': searchRegex },
          { tags: { $in: [searchRegex] } },
          { description: searchRegex },
        ]
      })
        .select('title subject format coverImage author pagesCount rating likesCount savesCount createdAt')
        .limit(Number(limit))
        .lean();

      results.notes = notes.map(n => ({
        ...n,
        id: n._id,
        type: 'note',
        thumbnail: n.coverImage || n.previewImages?.[0],
        subtitle: `${n.author?.name || 'Unknown'} · ${n.pagesCount} pages · ${formatTimeAgo(n.createdAt)}`,
      }));
    }

    // Search communities
    if (!type || type === 'communities' || type === 'all') {
      const communities = await Community.find({
        $or: [
          { name: searchRegex },
          { subject: searchRegex },
          { description: searchRegex },
        ]
      })
        .select('name subject description icon banner members membersCap joiningFee')
        .limit(Number(limit))
        .lean();

      results.communities = communities.map(c => ({
        ...c,
        id: c._id,
        type: 'community',
        subtitle: `${c.members}/${c.membersCap} members · ${c.subject}`,
      }));
    }

    // Search educators (tutors/faculty)
    if (!type || type === 'educators' || type === 'all') {
      const educators = await Tutor.find({
        $or: [
          { name: searchRegex },
          { department: searchRegex },
          { institution: searchRegex },
          { subject: searchRegex },
        ]
      })
        .select('name username avatar institution department title rating xp followers')
        .limit(Number(limit))
        .lean();

      results.educators = educators.map(e => ({
        ...e,
        id: e._id,
        type: 'educator',
        subtitle: `${e.title || 'Faculty'} · ${e.institution} · ${e.rating}⭐`,
      }));
    }

    // Search users (for leaderboard/profile)
    if (!type || type === 'users' || type === 'all') {
      const users = await User.find({
        $or: [
          { name: searchRegex },
          { username: searchRegex },
          { institution: searchRegex },
        ],
        role: 'student'
      })
        .select('name username avatar xp streak institution')
        .limit(Number(limit))
        .lean();

      results.users = users.map(u => ({
        ...u,
        id: u._id,
        type: 'user',
        subtitle: `${u.institution} · ${u.xp} XP · ${u.streak}d streak`,
      }));
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Global Search Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error searching' });
  }
};

// @desc    Get search suggestions/autocomplete
// @route   GET /api/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 8 } = req.query;

    if (!q || q.trim().length < 1) {
      return res.status(200).json({ success: true, data: [] });
    }

    const searchQuery = q.trim();
    const searchRegex = { $regex: searchQuery, $options: 'i' };

    // Get course titles
    const courses = await Course.find({ title: searchRegex })
      .select('title subject')
      .limit(3)
      .lean();

    // Get post topics
    const posts = await Post.find({ topic: searchRegex })
      .select('topic subject')
      .limit(3)
      .lean();

    // Get note titles
    const notes = await Note.find({ title: searchRegex })
      .select('title subject')
      .limit(3)
      .lean();

    // Get community names
    const communities = await Community.find({ name: searchRegex })
      .select('name subject')
      .limit(2)
      .lean();

    const suggestions = [
      ...courses.map(c => ({ text: c.title, type: 'course', category: c.subject })),
      ...posts.map(p => ({ text: p.topic, type: 'post', category: p.subject })),
      ...notes.map(n => ({ text: n.title, type: 'note', category: n.subject })),
      ...communities.map(c => ({ text: c.name, type: 'community', category: c.subject })),
    ].slice(0, Number(limit));

    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Search Suggestions Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching suggestions' });
  }
};

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}