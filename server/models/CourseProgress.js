import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    // Which lecture IDs the student has completed
    completedLectures: {
      type: [String],
      default: [],
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // Quiz tracking
    quizRequired: {
      type: Boolean,
      default: false,
    },
    quizCompleted: {
      type: Boolean,
      default: false,
    },
    quizPassed: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      default: null,
    },
    // Certificate
    certificateUnlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'course_progress',
  }
);

// Compound unique index: one progress record per student per course
courseProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
export default CourseProgress;
