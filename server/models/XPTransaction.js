import mongoose from 'mongoose';

const xpTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'quiz_completion',
        'quiz_perfect_score',
        'course_completion',
        'module_completion',
        'lecture_completion',
        'study_session',
        'daily_streak',
        'daily_goal_met',
        'enrollment',
        'profile_completion',
        'referral',
        'manual_adjustment',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    referenceType: {
      type: String,
      enum: ['Quiz', 'QuizAttempt', 'Course', 'StudySession', 'User', 'Module', 'Lecture'],
      default: null,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

xpTransactionSchema.index({ userId: 1, createdAt: -1 });
xpTransactionSchema.index({ userId: 1, type: 1 });

const XPTransaction = mongoose.model('XPTransaction', xpTransactionSchema);
export default XPTransaction;