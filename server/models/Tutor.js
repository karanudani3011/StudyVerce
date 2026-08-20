import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tutorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
      default: 'Stanford University',
    },
    department: {
      type: String,
      trim: true,
      default: 'Computer Science & AI',
    },
    title: {
      type: String,
      trim: true,
      default: 'Faculty / Lead Instructor',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&w=400&q=80',
    },
    bio: {
      type: String,
      default: 'Passionate educator & faculty member dedicated to inspiring students through interactive courses.',
    },
    role: {
      type: String,
      enum: ['tutor', 'faculty'],
      default: 'tutor',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    xp: {
      type: Number,
      default: 3500,
    },
    streak: {
      type: Number,
      default: 12,
    },
    wishlistedCourses: {
      type: [String],
      default: [],
    },
    createdCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
  },
  {
    timestamps: true,
    collection: 'tutors', // Explicitly using separate 'tutors' collection
  }
);

// Hash password before saving if modified
tutorSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
tutorSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;
