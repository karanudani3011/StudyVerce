import Post from '../models/Post.js';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';

// @desc    Get all posts with pagination, filtering, sorting
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      tag,
      sort = 'latest', // latest, popular, trending
      search,
      tutorId,
    } = req.query;

    const query = {};
    if (subject && subject !== 'All') query.subject = subject;
    if (tag) query.tags = { $in: [tag] };
    if (tutorId) query.tutorId = tutorId;
    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { likesCount: -1, createdAt: -1 };
    if (sort === 'trending') sortOption = { likesCount: -1, viewsCount: -1, createdAt: -1 };

    const posts = await Post.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Post.countDocuments(query);

    // Populate author info for each post
    const userIds = [...new Set(posts.map(p => p.createdBy).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }).select('name avatar username').lean();
    const tutors = await Tutor.find({ _id: { $in: userIds } }).select('name avatar username').lean();
    
    const userMap = {};
    [...users, ...tutors].forEach(u => {
      if (u) userMap[u._id.toString()] = u;
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      id: post._id,
      author: userMap[post.createdBy]?.name || post.author,
      authorAvatar: userMap[post.createdBy]?.avatar || post.authorAvatar,
      authorRole: userMap[post.createdBy]?.role || post.authorRole,
      authorVerified: userMap[post.createdBy]?.isVerified || post.authorVerified,
      userLiked: false, // Will be set by frontend based on current user
      userBookmarked: false,
      likes: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      savesCount: post.savesCount || 0,
      timestamp: formatTimeAgo(post.createdAt),
    }));

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: formattedPosts,
    });
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching posts' });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new post (Faculty/Admin)
// @route   POST /api/posts
// @access  Private (Faculty/Admin)
export const createPost = async (req, res) => {
  try {
    const {
      subject,
      topic,
      caption,
      image,
      explanation,
      aiSummary,
      notes,
      relatedTopics,
      tags,
      quizQuestions,
    } = req.body;

    if (!caption || !subject) {
      return res.status(400).json({ success: false, message: 'Caption and subject are required' });
    }

    // Determine author info from authenticated user
    let authorInfo = {
      author: req.user?.name || 'Educator',
      authorAvatar: req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      authorRole: req.user?.role === 'tutor' || req.user?.role === 'faculty' ? `${req.user?.title || 'Faculty'} · ${req.user?.institution || 'University'}` : 'Student',
      authorVerified: req.user?.isVerified || false,
      tutorId: req.user?.role === 'tutor' || req.user?.role === 'faculty' ? req.user._id : null,
      createdBy: req.user?._id,
    };

    const post = await Post.create({
      subject,
      topic,
      caption,
      image,
      explanation,
      aiSummary,
      notes: notes || [],
      relatedTopics: relatedTopics || [],
      tags: tags || [],
      quizQuestions: quizQuestions || [],
      ...authorInfo,
    });

    res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully!',
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create post' });
  }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likedIndex = post.likes.findIndex(id => id.toString() === userId.toString());
    let liked;

    if (likedIndex > -1) {
      // Unlike
      post.likes.splice(likedIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
      liked = false;
    } else {
      // Like
      post.likes.push(userId);
      post.likesCount += 1;
      liked = true;
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked,
      likesCount: post.likesCount,
    });
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error toggling like' });
  }
};

// @desc    Bookmark/Unbookmark a post
// @route   POST /api/posts/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const savedPosts = user.savedPosts || [];
    const savedIndex = savedPosts.findIndex(id => id.toString() === postId);

    let bookmarked;
    if (savedIndex > -1) {
      savedPosts.splice(savedIndex, 1);
      post.savesCount = Math.max(0, post.savesCount - 1);
      bookmarked = false;
    } else {
      savedPosts.push(postId);
      post.savesCount += 1;
      bookmarked = true;
    }

    user.savedPosts = savedPosts;
    await user.save();
    await post.save();

    res.status(200).json({
      success: true,
      bookmarked,
      savesCount: post.savesCount,
    });
  } catch (error) {
    console.error('Toggle Bookmark Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error toggling bookmark' });
  }
};

// @desc    Delete a post (Author or Admin)
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership or admin
    const isOwner = post.createdBy === userId.toString() || post.tutorId === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);

    // Remove from users' saved posts
    await User.updateMany(
      { savedPosts: postId },
      { $pull: { savedPosts: postId } }
    );

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error deleting post' });
  }
};

// @desc    Get posts by current user (Faculty)
// @route   GET /api/posts/my-posts
// @access  Private (Faculty)
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ 
      $or: [
        { createdBy: userId },
        { tutorId: userId }
      ]
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Get My Posts Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching posts' });
  }
};

// @desc    Get trending subjects
// @route   GET /api/posts/trending-subjects
// @access  Public
export const getTrendingSubjects = async (req, res) => {
  try {
    const trending = await Post.aggregate([
      { $match: { subject: { $ne: 'General Study' } } },
      { $group: { _id: '$subject', count: { $sum: 1 }, avgLikes: { $avg: '$likesCount' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    console.error('Trending Subjects Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching trending subjects' });
  }
};

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}