import mongoose from 'mongoose';

const tutorAnalyticsSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
      unique: true,
    },
    totalEarnings: {
      type: Number,
      default: 2450.0,
    },
    monthlyEarnings: {
      type: Number,
      default: 580.0,
    },
    pendingPayout: {
      type: Number,
      default: 210.0,
    },
    totalSales: {
      type: Number,
      default: 142,
    },
    activeStudents: {
      type: Number,
      default: 261,
    },
    avgRating: {
      type: Number,
      default: 4.85,
    },
    monthlyData: [
      {
        month: String,
        revenue: Number,
        enrollments: Number,
      },
    ],
    topCourses: [
      {
        title: String,
        sales: Number,
        revenue: Number,
        rating: Number,
        trend: { type: String, default: 'up' },
      },
    ],
    transactions: [
      {
        id: String,
        courseTitle: String,
        studentName: String,
        amount: Number,
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['course_sale', 'note_download', 'payout'], default: 'course_sale' },
        status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('TutorAnalytics', tutorAnalyticsSchema);
