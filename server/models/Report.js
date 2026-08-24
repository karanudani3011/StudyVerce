import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterName: {
      type: String,
      default: 'Anonymous User',
    },
    reporterAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    contentType: {
      type: String,
      enum: ['post', 'comment', 'user', 'note', 'course'],
      required: true,
    },
    contentId: {
      type: String,
    },
    contentPreview: {
      type: String,
      required: [true, 'Content preview is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for reporting is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Report', reportSchema);
