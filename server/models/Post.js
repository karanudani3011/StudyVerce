import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    authorAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    authorRole: {
      type: String,
      trim: true,
      default: 'Educator',
    },
    authorVerified: {
      type: Boolean,
      default: false,
    },
    subject: {
      type: String,
      default: 'General Study',
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
      default: '',
    },
    caption: {
      type: String,
      required: [true, 'Caption is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    aiSummary: {
      type: String,
      trim: true,
      default: '',
    },
    notes: [{
      type: String,
      trim: true,
    }],
    relatedTopics: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    quizQuestions: [{
      question: { type: String, required: true, trim: true },
      options: [{ type: String, required: true, trim: true }],
      correctAnswer: { type: Number, required: true },
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    savesCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      default: 'system',
    },
    tutorId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for search and performance
postSchema.index({ subject: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ caption: 'text', explanation: 'text', topic: 'text' });
postSchema.index({ tutorId: 1, createdAt: -1 });
postSchema.index({ likesCount: -1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;