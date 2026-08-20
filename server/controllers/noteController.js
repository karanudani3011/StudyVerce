import Note from '../models/Note.js';

// Get notes (optional query filters for targetDestination or contentType)
export const getNotes = async (req, res) => {
  try {
    const { destination, type } = req.query;
    const filter = {};
    if (destination) filter.targetDestination = destination;
    if (type) filter.contentType = type;

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
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
      coverImage: coverImage || fileUrl || '',
      previewImages: previewImages || [],
      pdfUrl: pdfUrl || fileUrl || '',
      tags: tags || [],
      author: author || {
        name: req.user?.name || 'Student Scholar',
        avatar: '',
        university: 'StudyVerse University',
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
    res.status(400).json({ success: false, message: error.message });
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
