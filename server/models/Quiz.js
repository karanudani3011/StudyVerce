import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    type: String,
    required: true,
    trim: true,
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
  },
  explanation: {
    type: String,
    trim: true,
    default: '',
  },
  points: {
    type: Number,
    default: 10,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  topic: {
    type: String,
    trim: true,
    default: '',
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: 'General',
    },
    topic: {
      type: String,
      trim: true,
      default: '',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    lectureId: {
      type: String,
      default: null,
    },
    questions: [questionSchema],
    timeLimitMinutes: {
      type: Number,
      default: 10,
    },
    passingScore: {
      type: Number,
      default: 60,
    },
    xpReward: {
      type: Number,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor',
      default: null,
    },
    // Whether this quiz is a course final quiz (vs. standalone topic quiz)
    isFinalQuiz: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ subject: 1, isActive: 1 });
quizSchema.index({ courseId: 1, isActive: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;