import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    meetingPlatform: {
      type: String,
      enum: ['Google Meet', 'Zoom', 'Microsoft Teams', 'Other'],
      default: 'Google Meet',
    },
    meetingUrl: {
      type: String,
      required: [true, 'Meeting link / URL is required'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'creatorModel',
    },
    creatorModel: {
      type: String,
      required: true,
      enum: ['User', 'Tutor', 'Admin'],
      default: 'Tutor',
    },
    createdByRole: {
      type: String,
      enum: ['faculty', 'tutor', 'admin'],
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
      trim: true,
    },
    createdByAvatar: {
      type: String,
      default: '',
    },
    targetRole: {
      type: String,
      enum: ['students', 'faculty', 'all'],
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      trim: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      default: 'General',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    courseName: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast query filtering by targetRole and scheduled date
meetingSchema.index({ targetRole: 1, createdByRole: 1, startDateTime: 1 });
meetingSchema.index({ createdBy: 1 });

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;
