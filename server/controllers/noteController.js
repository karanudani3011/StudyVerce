import Note from '../models/Note.js';
import User from '../models/User.js';

// Get notes (optional query filters for targetDestination or contentType)
export const getNotes = async (req, res) => {
  try {
    const { 
      destination, 
      type, 
      subject, 
      format, 
      search,
      sort = 'latest', // latest, popular, rating, pages
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (destination) filter.targetDestination = destination;
    if (type) filter.contentType = type;
    if (subject && subject !== 'All') filter.subject = subject;
    if (format && format !== 'All') {
      filter.$or = [
        { formatKey: format },
        { type: format },
        { format: format }
      ];
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { 'author.name': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { likesCount: -1, createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'pages') sortOption = { pagesCount: -1, createdAt: -1 };

    const notes = await Note.find(filter)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Note.countDocuments(filter);

    // Add user-specific like/bookmark status if authenticated
    const userId = req.user?._id;
    let userLikes = new Set();
    let userSaves = new Set();
    
    if (userId) {
      const user = await User.findById(userId).select('savedPosts wishlistedCourses').lean();
      if (user) {
        userSaves = new Set((user.savedPosts || []).map(id => id.toString()));
        // For notes, we'll use a separate field or localStorage on frontend
      }
    }

    const formattedNotes = notes.map(note => ({
      ...note,
      id: note._id,
      formatKey: note.formatKey || note.format || note.type,
      thumbnail: note.coverImage || note.previewImages?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      pages: note.previewImages || [note.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
      userLiked: false, // Frontend will manage from localStorage/backend
      userBookmarked: userSaves.has(note._id.toString()),
      dateAdded: formatTimeAgo(note.createdAt),
    }));

    res.status(200).json({
      success: true,
      count: notes.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: formattedNotes,
    });
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).lean();
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new educational note / upload
export const createNote = async (req, res) => {
  try {
    const {
      title,
      subject,
      caption,
      contentType,
      targetDestination,
      fileUrl,
      fileName,
      fileSize,
      // Handmade Notebook Hub fields
      type,
      format,
      description,
      coverImage,
      previewImages,
      pdfUrl,
      tags,
      author,
      pagesCount,
      rating,
      savesCount,
      likesCount,
    } = req.body;

    const newNote = await Note.create({
      title,
      subject: subject || 'General Study',
      caption: caption || description || '',
      description: description || '',
      contentType: contentType || 'image',
      targetDestination: targetDestination || 'feed',
      // Handmade Notebook Hub
      type: type || '',
      format: format || type || '',
      formatKey: format || type || '',
      coverImage: coverImage || fileUrl || '',
      previewImages: previewImages || [],
      pdfUrl: pdfUrl || fileUrl || '',
      tags: tags || [],
      author: author || {
        name: req.user?.name || 'Student Scholar',
        avatar: req.user?.avatar || '',
        university: req.user?.institution || 'StudyVerse University',
      },
      pagesCount: pagesCount || (previewImages?.length || 0),
      rating: rating || 4.9,
      savesCount: savesCount || 0,
      likesCount: likesCount || 0,
      // Original upload fields
      fileUrl: fileUrl || coverImage || '',
      fileName: fileName || '',
      fileSize: fileSize || '',
      creatorId: req.user?.id || 'u1',
      creatorName: req.user?.name || 'Student Scholar',
      aiValidationScore: 96,
    });

    res.status(201).json({ success: true, data: newNote, message: 'Note / Notebook saved successfully to vault 📝' });
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Like/Unlike a note
export const toggleNoteLike = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // For simplicity, we'll just increment/decrement likesCount
    // In production, you'd track liked users in a separate array
    note.likesCount = (note.likesCount || 0) + 1;
    await note.save();

    res.status(200).json({
      success: true,
      likesCount: note.likesCount,
      liked: true,
    });
  } catch (error) {
    console.error('Toggle Note Like Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Bookmark/Unbookmark a note (save to user's savedPosts)
export const toggleNoteBookmark = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const savedPosts = user.savedPosts || [];
    const savedIndex = savedPosts.findIndex(id => id.toString() === noteId);

    let bookmarked;
    if (savedIndex > -1) {
      savedPosts.splice(savedIndex, 1);
      note.savesCount = Math.max(0, (note.savesCount || 0) - 1);
      bookmarked = false;
    } else {
      savedPosts.push(noteId);
      note.savesCount = (note.savesCount || 0) + 1;
      bookmarked = true;
    }

    user.savedPosts = savedPosts;
    await user.save();
    await note.save();

    res.status(200).json({
      success: true,
      bookmarked,
      savesCount: note.savesCount,
    });
  } catch (error) {
    console.error('Toggle Note Bookmark Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get trending tags
export const getTrendingTags = async (req, res) => {
  try {
    const tags = await Note.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unique subjects for filtering
export const getNoteSubjects = async (req, res) => {
  try {
    const subjects = await Note.distinct('subject');
    res.status(200).json({ success: true, data: subjects.filter(s => s) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unique formats for filtering
export const getNoteFormats = async (req, res) => {
  try {
    const formats = await Note.distinct('formatKey');
    res.status(200).json({ success: true, data: formats.filter(f => f) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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