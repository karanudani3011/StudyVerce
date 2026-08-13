import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    bio: {
      type: String,
      default: 'Computer Science student & AI enthusiast.',
    },
    role: {
      type: String,
      enum: ['student', 'tutor', 'admin'],
      default: 'student',
    },
    xp: {
      type: Number,
      default: 1250,
    },
    streak: {
      type: Number,
      default: 5,
    },
    dailyGoalMinutes: {
      type: Number,
      default: 60,
    },
    currentGoalMinutes: {
      type: Number,
      default: 45,
    },
    savedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    wishlistedCourses: {
      type: [String],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
