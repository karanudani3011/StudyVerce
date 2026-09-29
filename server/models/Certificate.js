import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      default: '',
    },
    courseStartDate: {
      type: Date,
      required: true,
    },
    courseCompletionDate: {
      type: Date,
      required: true,
    },
    // Quiz info (null if course had no quiz)
    quizCompleted: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      default: null,
    },
    // Unique certificate number e.g. SV-2026-000001
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'certificates',
  }
);

// Compound unique: one certificate per student per course
certificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
