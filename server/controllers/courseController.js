import Course from '../models/Course.js';

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
