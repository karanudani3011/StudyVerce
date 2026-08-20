import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '15 mins',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    instructorAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&q=80&w=100',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
    },
    tags: {
      type: [String],
      default: ['Education', 'Online Course'],
    },
    duration: {
      type: String,
      default: '12 hrs',
    },
    lessons: {
      type: Number,
      default: 10,
    },
    students: {
      type: String,
      default: '1',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    progress: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    price: {
      type: String,
      default: 'Free',
    },
    subject: {
      type: String,
      default: 'Computer Science',
    },
    category: {
      type: String,
      default: 'Technology & CS',
    },
    subcategory: {
      type: String,
      default: 'Artificial Intelligence',
    },
    description: {
      type: String,
      default: '',
    },
    lectures: [lectureSchema],
    tutorId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'courses',
  }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
