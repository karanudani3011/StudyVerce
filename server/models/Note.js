import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'General Study',
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    // Extended note type for Handmade Notebook Hub (e.g. 'Handwritten Pages', 'Formula Sheets')
    type: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['image', 'reel', 'pdf', 'notes'],
      default: 'image',
    },
    targetDestination: {
      type: String,
      enum: ['feed', 'reels', 'explore', 'my-learning'],
      default: 'feed',
    },
    // For Explore Hub notebook uploads
    coverImage: {
      type: String,
      default: '',
    },
    previewImages: {
      type: [String],
      default: [],
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    // Author details for Explore Hub display
    author: {
      name: { type: String, default: 'Scholar Contributor' },
      avatar: { type: String, default: '' },
      university: { type: String, default: 'Stanford University' },
    },
    pagesCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    savesCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    // Original upload fields (kept for backwards compatibility)
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: String,
      default: '',
    },
    creatorId: {
      type: String,
      default: 'u1',
    },
    creatorName: {
      type: String,
      default: 'Student Scholar',
    },
    aiValidationScore: {
      type: Number,
      default: 96,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);
