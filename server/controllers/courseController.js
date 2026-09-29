import Course from '../models/Course.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import CourseProgress from '../models/CourseProgress.js';
import Certificate from '../models/Certificate.js';

// ─── Helper: generate a unique certificate number ──────────────────────────────
const generateCertificateNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Certificate.countDocuments();
  const padded = String(count + 1).padStart(6, '0');
  return `SV-${year}-${padded}`;
};

// ─── Helper: compute unlocked status ──────────────────────────────────────────
const computeCertificateUnlocked = (progress, course) => {
  const courseCompleted = progress.progressPercentage >= 100;
  const quizOk = !course.hasQuiz || progress.quizPassed;
  return courseCompleted && quizOk;
};

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
// @access  Private (Tutor/Faculty/Admin)
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
      // Optional final quiz data submitted inline
      hasQuiz,
      quiz,
    } = req.body;

    if (!title || !instructor) {
      return res.status(400).json({ success: false, message: 'Title and Instructor are required' });
    }

    const courseData = {
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
      tutorId: req.user?.id || req.user?._id || null,
      hasQuiz: false,
      quizId: null,
    };

    const course = await Course.create(courseData);

    // If a quiz was submitted alongside the course, create it now
    if (hasQuiz && quiz && quiz.questions && quiz.questions.length > 0) {
      const newQuiz = await Quiz.create({
        title: quiz.title || `${title} — Final Quiz`,
        description: quiz.description || '',
        subject: subject || 'General',
        courseId: course._id,
        questions: quiz.questions,
        passingScore: quiz.passingScore || 70,
        timeLimitMinutes: quiz.timeLimitMinutes || 30,
        xpReward: quiz.xpReward || 100,
        isFinalQuiz: true,
        isActive: true,
        createdBy: req.user?._id || null,
        tutorId: (req.user?.role === 'tutor' || req.user?.role === 'faculty') ? req.user?._id : null,
      });

      course.hasQuiz = true;
      course.quizId = newQuiz._id;
      await course.save();
    }

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

// @desc    Get single course details (with quiz summary if exists)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    let quizSummary = null;
    if (course.hasQuiz && course.quizId) {
      const quiz = await Quiz.findById(course.quizId).select('-questions.correctAnswer -questions.explanation');
      if (quiz) {
        quizSummary = {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          questionsCount: quiz.questions.length,
          passingScore: quiz.passingScore,
          timeLimitMinutes: quiz.timeLimitMinutes,
        };
      }
    }
    
    res.status(200).json({ success: true, data: { ...course.toObject(), quizSummary } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a course (and optionally its quiz)
// @route   PUT /api/courses/:id
// @access  Private (Faculty/Admin)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const { hasQuiz, quiz, ...courseFields } = req.body;

    // Update basic course fields
    Object.assign(course, courseFields);

    // Handle quiz changes
    if (hasQuiz === false) {
      // Instructor wants to remove quiz
      if (course.quizId) {
        await Quiz.findByIdAndDelete(course.quizId);
      }
      course.hasQuiz = false;
      course.quizId = null;
    } else if (hasQuiz === true && quiz) {
      if (course.quizId) {
        // Update existing quiz
        await Quiz.findByIdAndUpdate(course.quizId, {
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          passingScore: quiz.passingScore,
          timeLimitMinutes: quiz.timeLimitMinutes,
        });
      } else {
        // Create new quiz
        const newQuiz = await Quiz.create({
          title: quiz.title || `${course.title} — Final Quiz`,
          description: quiz.description || '',
          subject: course.subject || 'General',
          courseId: course._id,
          questions: quiz.questions,
          passingScore: quiz.passingScore || 70,
          timeLimitMinutes: quiz.timeLimitMinutes || 30,
          isFinalQuiz: true,
          isActive: true,
          createdBy: req.user?._id || null,
        });
        course.hasQuiz = true;
        course.quizId = newQuiz._id;
      }
    }

    await course.save();
    res.status(200).json({ success: true, data: course, message: 'Course updated successfully' });
  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update course' });
  }
};

// @desc    Delete a course (Faculty can delete their own, Admin can delete any)
// @route   DELETE /api/courses/:id
// @access  Private (Faculty / Admin)
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Delete associated quiz if any
    if (course.hasQuiz && course.quizId) {
      await Quiz.findByIdAndDelete(course.quizId);
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

    // Create or find per-student progress record
    let progress = await CourseProgress.findOne({ studentId: userId, courseId });
    if (!progress) {
      const totalLectures = course.lectures?.length || 0;
      progress = await CourseProgress.create({
        studentId: userId,
        courseId,
        totalLectures,
        completedLectures: [],
        progressPercentage: 0,
        quizRequired: course.hasQuiz,
        quizCompleted: false,
        quizPassed: false,
        certificateUnlocked: false,
        startedAt: new Date(),
      });
    }

    // Increment student count on course
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

// @desc    Get all enrolled courses for current user with per-student progress
// @route   GET /api/courses/enrolled/my
// @access  Private (Student)
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'enrolledCourses',
      model: 'Course',
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch all progress records for this user in one query
    const progressRecords = await CourseProgress.find({ studentId: userId });
    const progressMap = {};
    for (const p of progressRecords) {
      progressMap[p.courseId.toString()] = p;
    }

    // Fetch quiz attempt results for courses with quizzes
    const enrolledCourses = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        const cid = course._id.toString();
        const prog = progressMap[cid];

        let bestAttempt = null;
        if (course.hasQuiz && course.quizId) {
          bestAttempt = await QuizAttempt.findOne({
            userId,
            quizId: course.quizId,
            passed: true,
          }).sort({ percentage: -1 });
        }

        // Ensure progress record exists (backward compat for old enrollments)
        let progressPercentage = prog?.progressPercentage || 0;
        let quizPassed = prog?.quizPassed || (bestAttempt ? bestAttempt.passed : false);
        let quizScore = prog?.quizScore || (bestAttempt ? bestAttempt.percentage : null);
        let certificateUnlocked = prog?.certificateUnlocked || false;

        // Recompute certificate unlocked status
        if (progressPercentage >= 100) {
          certificateUnlocked = !course.hasQuiz || quizPassed;
        }

        return {
          id: course._id,
          title: course.title,
          instructor: course.instructor,
          instructorAvatar: course.instructorAvatar,
          image: course.image,
          tags: course.tags || [],
          duration: course.duration,
          lessons: course.lessons,
          students: course.students,
          rating: course.rating,
          progress: progressPercentage,
          level: course.level,
          price: course.price,
          subject: course.subject,
          category: course.category,
          subcategory: course.subcategory,
          description: course.description,
          lectures: course.lectures,
          tutorId: course.tutorId,
          hasQuiz: course.hasQuiz,
          quizId: course.quizId,
          quizPassed,
          quizScore,
          certificateUnlocked,
          completedAt: prog?.completedAt || null,
          enrolledAt: prog?.startedAt || course.createdAt,
        };
      })
    );

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

// @desc    Update course progress for current user (per-student, per-lecture tracking)
// @route   PUT /api/courses/:id/progress
// @access  Private (Student)
export const updateCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const { completedLectureId, progress: rawProgress } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify enrollment
    const isEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.toString() === courseId
    );
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    // Find or create progress record
    let progress = await CourseProgress.findOne({ studentId: userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        studentId: userId,
        courseId,
        totalLectures: course.lectures?.length || 0,
        quizRequired: course.hasQuiz,
      });
    }

    // Update total lectures in case course was edited
    progress.totalLectures = course.lectures?.length || 0;

    if (completedLectureId) {
      // Mark a specific lecture as completed
      if (!progress.completedLectures.includes(completedLectureId)) {
        progress.completedLectures.push(completedLectureId);
      }
      // Recalculate percentage
      const total = progress.totalLectures;
      if (total > 0) {
        progress.progressPercentage = Math.min(100, Math.round((progress.completedLectures.length / total) * 100));
      }
    } else if (rawProgress !== undefined) {
      // Direct percentage set (fallback for legacy calls)
      progress.progressPercentage = Math.max(0, Math.min(100, rawProgress));
    }

    // Check if course is now 100% complete
    if (progress.progressPercentage >= 100 && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    // Determine if certificate should be unlocked
    progress.certificateUnlocked = computeCertificateUnlocked(progress, course);

    await progress.save();

    return res.status(200).json({
      success: true,
      progress: progress.progressPercentage,
      completedLectures: progress.completedLectures,
      totalLectures: progress.totalLectures,
      certificateUnlocked: progress.certificateUnlocked,
      message: 'Progress updated successfully',
    });
  } catch (error) {
    console.error('Update Progress Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating progress.' });
  }
};

// @desc    Get course progress for current user (per-student)
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

    let progress = await CourseProgress.findOne({ studentId: userId, courseId });

    // Backward compatibility: create a progress record if it doesn't exist yet
    if (!progress) {
      progress = await CourseProgress.create({
        studentId: userId,
        courseId,
        totalLectures: course.lectures?.length || 0,
        quizRequired: course.hasQuiz,
        completedLectures: [],
        progressPercentage: 0,
      });
    }

    // Check best quiz attempt
    let quizPassed = progress.quizPassed;
    let quizScore = progress.quizScore;
    let bestAttempt = null;

    if (course.hasQuiz && course.quizId) {
      bestAttempt = await QuizAttempt.findOne({
        userId,
        quizId: course.quizId,
        passed: true,
      }).sort({ percentage: -1 });

      if (bestAttempt) {
        quizPassed = true;
        quizScore = bestAttempt.percentage;
        // Sync back to progress if needed
        if (!progress.quizPassed) {
          progress.quizPassed = true;
          progress.quizScore = bestAttempt.percentage;
          progress.quizCompleted = true;
          progress.certificateUnlocked = computeCertificateUnlocked(progress, course);
          await progress.save();
        }
      }
    }

    const certificateUnlocked = computeCertificateUnlocked(
      { ...progress.toObject(), quizPassed },
      course
    );

    return res.status(200).json({
      success: true,
      enrolled: true,
      progress: progress.progressPercentage,
      completedLectures: progress.completedLectures,
      totalLectures: progress.totalLectures,
      quizRequired: course.hasQuiz,
      quizCompleted: progress.quizCompleted || !!bestAttempt,
      quizPassed,
      quizScore,
      certificateUnlocked,
      completedAt: progress.completedAt,
      startedAt: progress.startedAt,
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

// @desc    Get or generate a certificate for a completed course
// @route   GET /api/courses/:id/certificate
// @access  Private (Student) — BACKEND VALIDATES completion before returning
export const getCertificate = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    // 1. Verify authenticated student
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Verify enrollment
    const isEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.toString() === courseId
    );
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
    }

    // 3. Load course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // 4. Load progress record from DB (NOT from frontend)
    const progress = await CourseProgress.findOne({ studentId: userId, courseId });
    if (!progress) {
      return res.status(403).json({ success: false, message: 'No progress record found. Please start the course first.' });
    }

    // 5. Check progress percentage from DB
    if (progress.progressPercentage < 100) {
      return res.status(403).json({
        success: false,
        message: `Course not yet completed. Current progress: ${progress.progressPercentage}%`,
        progressPercentage: progress.progressPercentage,
      });
    }

    // 6. If quiz required, check ACTUAL quiz attempt from DB
    let quizPassed = false;
    let quizScore = null;

    if (course.hasQuiz && course.quizId) {
      const bestAttempt = await QuizAttempt.findOne({
        userId,
        quizId: course.quizId,
        passed: true,
      }).sort({ percentage: -1 });

      if (!bestAttempt) {
        return res.status(403).json({
          success: false,
          message: 'You need to pass the final quiz to unlock your certificate.',
          requiresQuiz: true,
        });
      }
      quizPassed = true;
      quizScore = bestAttempt.percentage;
    }

    // 7. All conditions met — check if certificate already exists, else create it
    let certificate = await Certificate.findOne({ studentId: userId, courseId });

    if (!certificate) {
      const certNumber = await generateCertificateNumber();
      certificate = await Certificate.create({
        studentId: userId,
        studentName: user.name,
        courseId,
        courseName: course.title,
        instructorName: course.instructor,
        courseStartDate: progress.startedAt,
        courseCompletionDate: progress.completedAt || new Date(),
        quizCompleted: course.hasQuiz ? quizPassed : false,
        quizScore: course.hasQuiz ? quizScore : null,
        certificateNumber: certNumber,
        issuedAt: new Date(),
      });

      // Sync the unlocked flag to progress
      progress.certificateUnlocked = true;
      await progress.save();
    }

    return res.status(200).json({
      success: true,
      certificate: {
        _id: certificate._id,
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        instructorName: certificate.instructorName,
        courseStartDate: certificate.courseStartDate,
        courseCompletionDate: certificate.courseCompletionDate,
        quizCompleted: certificate.quizCompleted,
        quizScore: certificate.quizScore,
        issuedAt: certificate.issuedAt,
      },
    });
  } catch (error) {
    console.error('Get Certificate Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error generating certificate.' });
  }
};

// @desc    Get the quiz for a specific course (final quiz metadata)
// @route   GET /api/courses/:id/quiz
// @access  Private (Student)
export const getCourseQuiz = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!course.hasQuiz || !course.quizId) {
      return res.status(404).json({ success: false, message: 'This course does not have a final quiz' });
    }

    const quiz = await Quiz.findById(course.quizId);
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ success: false, message: 'Quiz not found or inactive' });
    }

    // Return questions WITHOUT correct answers for the student
    const questionsForStudent = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      points: q.points,
      difficulty: q.difficulty,
    }));

    return res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        questionsCount: quiz.questions.length,
        passingScore: quiz.passingScore,
        timeLimitMinutes: quiz.timeLimitMinutes,
        questions: questionsForStudent,
      },
    });
  } catch (error) {
    console.error('Get Course Quiz Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching quiz.' });
  }
};

// @desc    Submit final quiz attempt for a course
// @route   POST /api/courses/:id/quiz/submit
// @access  Private (Student)
export const submitCourseQuiz = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const { answers, timeSpentSeconds } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    // Verify enrollment
    const user = await User.findById(userId);
    const isEnrolled = user?.enrolledCourses?.some((e) => e.toString() === courseId);
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.hasQuiz || !course.quizId) {
      return res.status(404).json({ success: false, message: 'Course or quiz not found' });
    }

    const quiz = await Quiz.findById(course.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Prevent duplicate submission within 60 seconds
    const recentAttempt = await QuizAttempt.findOne({
      userId,
      quizId: course.quizId,
      completedAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });
    if (recentAttempt) {
      return res.status(429).json({ success: false, message: 'Please wait before submitting again' });
    }

    // Calculate score
    let score = 0;
    let correctAnswers = 0;
    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const attemptAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? (question.points || 10) : 0;
      if (isCorrect) {
        score += pointsEarned;
        correctAnswers++;
      }
      attemptAnswers.push({
        questionIndex: index,
        selectedAnswer: userAnswer ?? -1,
        isCorrect,
        pointsEarned,
      });
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= (quiz.passingScore || 60);

    // Create attempt
    const attempt = await QuizAttempt.create({
      userId,
      quizId: course.quizId,
      courseId,
      answers: attemptAnswers,
      score,
      maxScore,
      percentage,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      xpEarned: passed ? (quiz.xpReward || 100) : 0,
      passed,
      completedAt: new Date(),
      timeSpentSeconds: timeSpentSeconds || 0,
    });

    // Update user XP and quiz stats
    if (user) {
      user.xp = (user.xp || 0) + (passed ? (quiz.xpReward || 100) : 0);
      user.quizzesCompleted = (user.quizzesCompleted || 0) + 1;
      user.quizAttempts = (user.quizAttempts || 0) + 1;
      await user.save();
    }

    // Update progress record with quiz result
    let progress = await CourseProgress.findOne({ studentId: userId, courseId });
    if (progress) {
      progress.quizCompleted = true;
      if (passed) {
        progress.quizPassed = true;
        progress.quizScore = percentage;
      }
      // Recompute certificate unlock
      progress.certificateUnlocked = computeCertificateUnlocked(progress, course);
      await progress.save();
    }

    // Return result with correct answers for review
    const questionsWithAnswers = quiz.questions.map((q, index) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: attemptAnswers[index]?.selectedAnswer,
      isCorrect: attemptAnswers[index]?.isCorrect,
      points: q.points,
    }));

    return res.status(201).json({
      success: true,
      attempt: {
        id: attempt._id,
        score,
        maxScore,
        percentage,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passed,
        completedAt: attempt.completedAt,
      },
      questions: questionsWithAnswers,
      certificateUnlocked: progress?.certificateUnlocked || false,
      message: passed ? 'Quiz passed! 🎉' : 'Keep practicing! 💪',
    });
  } catch (error) {
    console.error('Submit Course Quiz Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error submitting quiz.' });
  }
};

// @desc    Get best quiz attempt for a specific course
// @route   GET /api/courses/:id/quiz/my-result
// @access  Private (Student)
export const getCourseQuizResult = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course || !course.quizId) {
      return res.status(404).json({ success: false, message: 'No quiz for this course' });
    }

    const attempts = await QuizAttempt.find({ userId, quizId: course.quizId })
      .sort({ completedAt: -1 })
      .limit(10);

    const bestPassing = attempts.find((a) => a.passed);

    return res.status(200).json({
      success: true,
      attempts: attempts.map((a) => ({
        id: a._id,
        score: a.score,
        maxScore: a.maxScore,
        percentage: a.percentage,
        correctAnswers: a.correctAnswers,
        totalQuestions: a.totalQuestions,
        passed: a.passed,
        completedAt: a.completedAt,
      })),
      bestAttempt: bestPassing
        ? {
            percentage: bestPassing.percentage,
            passed: bestPassing.passed,
            completedAt: bestPassing.completedAt,
          }
        : null,
      hasPassedQuiz: !!bestPassing,
    });
  } catch (error) {
    console.error('Get Quiz Result Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

// @desc    Manage final quiz for a course (create/update)
// @route   POST /api/courses/:id/quiz
// @access  Private (Faculty/Admin)
export const manageCourseQuiz = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const { title, description, questions, passingScore, timeLimitMinutes, xpReward } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one question is required' });
    }

    let quiz;
    if (course.quizId) {
      // Update existing quiz
      quiz = await Quiz.findByIdAndUpdate(
        course.quizId,
        { title, description, questions, passingScore, timeLimitMinutes, xpReward },
        { new: true }
      );
    } else {
      // Create new quiz
      quiz = await Quiz.create({
        title: title || `${course.title} — Final Quiz`,
        description: description || '',
        subject: course.subject || 'General',
        courseId: course._id,
        questions,
        passingScore: passingScore || 70,
        timeLimitMinutes: timeLimitMinutes || 30,
        xpReward: xpReward || 100,
        isFinalQuiz: true,
        isActive: true,
        createdBy: req.user?._id || null,
      });
      course.hasQuiz = true;
      course.quizId = quiz._id;
      await course.save();
    }

    return res.status(200).json({
      success: true,
      quiz,
      message: course.quizId ? 'Quiz updated successfully!' : 'Quiz created successfully!',
    });
  } catch (error) {
    console.error('Manage Course Quiz Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

// @desc    Delete final quiz for a course
// @route   DELETE /api/courses/:id/quiz
// @access  Private (Faculty/Admin)
export const deleteCourseQuiz = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!course.quizId) {
      return res.status(404).json({ success: false, message: 'No quiz found for this course' });
    }

    await Quiz.findByIdAndDelete(course.quizId);
    course.hasQuiz = false;
    course.quizId = null;
    await course.save();

    return res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete Course Quiz Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

// @desc    Admin: Get course stats with quiz and certificate info
// @route   GET /api/courses/:id/stats
// @access  Private (Admin)
export const getCourseStats = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const totalEnrolled = await CourseProgress.countDocuments({ courseId });
    const completed = await CourseProgress.countDocuments({ courseId, progressPercentage: 100 });
    const certificatesIssued = await Certificate.countDocuments({ courseId });
    let quizPassRate = null;

    if (course.hasQuiz && course.quizId) {
      const totalAttempts = await QuizAttempt.countDocuments({ quizId: course.quizId });
      const passedAttempts = await QuizAttempt.countDocuments({ quizId: course.quizId, passed: true });
      quizPassRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalEnrolled,
        completed,
        certificatesIssued,
        hasQuiz: course.hasQuiz,
        quizPassRate,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
