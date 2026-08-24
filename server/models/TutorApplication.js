import mongoose from 'mongoose';

const tutorApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Primary subject is required'],
    },
    teachingExp: {
      type: String,
      default: '0',
    },
    credentialsUrl: {
      type: String,
      required: [true, 'Credentials URL is required'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('TutorApplication', tutorApplicationSchema);
