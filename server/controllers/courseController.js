import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get all courses from MongoDB
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / Upload a new course by Tutor / Faculty
// @route   POST /api/courses
// @access  Public (or Private)
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      instructor,
      instructorAvatar,
      image,
      tags,
      duration,
      lessons,
      level,
      price,
      subject,
      category,
      subcategory,
      description,
      lectures,
    } = req.body;

    if (!title || !instructor) {
      return res.status(400).json({ success: false, message: 'Title and Instructor are required' });
    }

    const course = await Course.create({
      title,
      instructor,
      instructorAvatar: instructorAvatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&q=80&w=100',
      image: image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
      tags: tags || ['Education', 'Online Course'],
      duration: duration || '12 hrs',
      lessons: lessons || (lectures ? lectures.length : 10),
      students: '1',
      rating: 4.9,
      progress: 0,
      level: level || 'Beginner',
      price: price || 'Free',
      subject: subject || 'Computer Science',
      category: category || 'Technology & CS',
      subcategory: subcategory || 'Artificial Intelligence',
      description: description || '',
      lectures: lectures || [],
      tutorId: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      data: course,
      message: 'Course created and published successfully! 🎉',
    });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create course' });
  }
};

// @desc    Get single course details
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course (Faculty can delete their own courses, Admin can delete ANY course)
// @route   DELETE /api/courses/:id
// @access  Private (Faculty / Admin)
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully from platform.',
    });
  } catch (error) {
    console.error('Delete Course Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error deleting course.' });
  }
};

// @desc    Enroll current user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already enrolled in this course',
        alreadyEnrolled: true
      });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Increment student count on course (optional)
    course.students = String(Number(course.students.replace(/[^\d]/g, '')) + 1);
    await course.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course! 🎉',
      enrolled: true,
    });
  } catch (error) {
    console.error('Enroll Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error enrolling in course.' });
  }
};

// @desc    Get all enrolled courses for current user with progress
// @route   GET /api/courses/enrolled/my
// @access  Private (Student)
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'enrolledCourses',
      model: 'Course',
      select: 'title instructor instructorAvatar image tags duration lessons students rating progress level price subject category subcategory description lectures tutorId createdAt'
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Transform enrolled courses with progress data
    const enrolledCourses = user.enrolledCourses.map(course => ({
      id: course._id,
      title: course.title,
      instructor: course.instructor,
      instructorAvatar: course.instructorAvatar,
      image: course.image,
      tags: course.tags,
      duration: course.duration,
      lessons: course.lessons,
      students: course.students,
      rating: course.rating,
      progress: course.progress || 0,
      level: course.level,
      price: course.price,
      subject: course.subject,
      category: course.category,
      subcategory: course.subcategory,
      description: course.description,
      lectures: course.lectures,
      tutorId: course.tutorId,
      enrolledAt: course.createdAt
    }));

    return res.status(200).json({
      success: true,
      count: enrolledCourses.length,
      data: enrolledCourses,
    });
  } catch (error) {
    console.error('Get Enrolled Courses Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching enrolled courses.' });
  }
};

// @desc    Update course progress for current user
// @route   PUT /api/courses/:id/progress
// @access  Private (Student)
export const updateCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const { progress, completedLectureId } = req.body;

    if (progress === undefined && !completedLectureId) {
      return res.status(400).json({ success: false, message: 'Progress value or completedLectureId required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify user is enrolled
    const isEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    let newProgress = course.progress || 0;

    if (completedLectureId && course.lectures && course.lectures.length > 0) {
      // Calculate progress based on completed lectures
      // This is a simple implementation - can be enhanced with a separate progress model
      const totalLectures = course.lectures.length;
      // For now, just increment by a reasonable amount
      newProgress = Math.min(100, newProgress + Math.round(100 / totalLectures));
    } else if (progress !== undefined) {
      newProgress = Math.max(0, Math.min(100, progress));
    }

    course.progress = newProgress;
    await course.save();

    return res.status(200).json({
      success: true,
      progress: newProgress,
      message: 'Progress updated successfully',
    });
  } catch (error) {
    console.error('Update Progress Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating progress.' });
  }
};

// @desc    Get course progress for current user
// @route   GET /api/courses/:id/progress
// @access  Private (Student)
export const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course', enrolled: false });
    }

    return res.status(200).json({
      success: true,
      progress: course.progress || 0,
      enrolled: true,
    });
  } catch (error) {
    console.error('Get Progress Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching progress.' });
  }
};

// @desc    Check if user is enrolled in a course
// @route   GET /api/courses/:id/enrollment-status
// @access  Private (Student)
export const getEnrollmentStatus = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.toString() === courseId
    );

    return res.status(200).json({
      success: true,
      enrolled: isEnrolled,
    });
  } catch (error) {
    console.error('Get Enrollment Status Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error checking enrollment.' });
  }
};
