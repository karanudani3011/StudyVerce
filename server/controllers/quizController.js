import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';
import XPTransaction from '../models/XPTransaction.js';
import Course from '../models/Course.js';

// @desc    Get all quizzes (with filters)
// @route   GET /api/quizzes
// @access  Private
export const getQuizzes = async (req, res) => {
  try {
    const { subject, courseId, isActive = true, limit = 20, page = 1 } = req.query;
    
    const query = { isActive: isActive === 'true' };
    if (subject) query.subject = subject;
    if (courseId) query.courseId = courseId;

    const quizzes = await Quiz.find(query)
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Quiz.countDocuments(query);

    res.status(200).json({
      success: true,
      quizzes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get Quizzes Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get single quiz with full questions (for taking quiz)
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    if (!quiz.isActive) {
      return res.status(403).json({ success: false, message: 'Quiz is not active' });
    }

    // Return questions without correct answers
    const questionsForClient = quiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      points: q.points,
      difficulty: q.difficulty,
      topic: q.topic,
    }));

    res.status(200).json({
      success: true,
      quiz: {
        ...quiz.toObject(),
        questions: questionsForClient,
      },
    });
  } catch (error) {
    console.error('Get Quiz Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const quizId = req.params.id;
    const { answers, timeSpentSeconds } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Check if user already has a recent attempt (prevent spam)
    const recentAttempt = await QuizAttempt.findOne({
      userId,
      quizId,
      completedAt: { $gte: new Date(Date.now() - 60 * 1000) }, // 1 minute
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
        timeSpentSeconds: 0, // Could track per-question time if needed
      });
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= (quiz.passingScore || 60);

    // Calculate XP
    let xpEarned = 0;
    if (passed) {
      xpEarned = quiz.xpReward || 50;
      // Bonus for perfect score
      if (percentage === 100) {
        xpEarned += 25;
      }
    }

    // Create attempt record
    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      courseId: quiz.courseId,
      answers: attemptAnswers,
      score,
      maxScore,
      percentage,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      xpEarned,
      passed,
      completedAt: new Date(),
      timeSpentSeconds: timeSpentSeconds || 0,
    });

    // Update user XP and stats
    const user = await User.findById(userId);
    if (user) {
      user.xp = (user.xp || 0) + xpEarned;
      user.quizzesCompleted = (user.quizzesCompleted || 0) + 1;
      user.quizAttempts = (user.quizAttempts || 0) + 1;
      
      // Update average quiz score
      const prevTotal = (user.averageQuizScore || 0) * (user.quizAttempts - 1);
      user.averageQuizScore = Math.round((prevTotal + percentage) / user.quizAttempts);

      await user.save();

      // Record XP transaction
      if (xpEarned > 0) {
        let xpType = 'quiz_completion';
        let description = `Completed quiz: ${quiz.title}`;
        if (percentage === 100) {
          xpType = 'quiz_perfect_score';
          description = `Perfect score on quiz: ${quiz.title}`;
        }
        
        await XPTransaction.create({
          userId,
          amount: xpEarned,
          type: xpType,
          description,
          referenceId: attempt._id,
          referenceType: 'QuizAttempt',
          balanceAfter: user.xp,
        });
      }
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

    res.status(201).json({
      success: true,
      attempt: {
        id: attempt._id,
        score,
        maxScore,
        percentage,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        xpEarned,
        passed,
        completedAt: attempt.completedAt,
        timeSpentSeconds: attempt.timeSpentSeconds,
      },
      questions: questionsWithAnswers,
      message: passed ? 'Quiz passed! 🎉' : 'Keep practicing! 💪',
    });
  } catch (error) {
    console.error('Submit Quiz Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get user's quiz attempts/history
// @route   GET /api/quizzes/attempts/my
// @access  Private
export const getMyQuizAttempts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, page = 1 } = req.query;

    const attempts = await QuizAttempt.find({ userId })
      .populate('quizId', 'title subject topic')
      .sort({ completedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await QuizAttempt.countDocuments({ userId });

    res.status(200).json({
      success: true,
      attempts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get Quiz Attempts Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get single quiz attempt result
// @route   GET /api/quizzes/attempts/:attemptId
// @access  Private
export const getQuizAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      userId,
    }).populate('quizId');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Get full quiz with correct answers for review
    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questionsWithAnswers = quiz.questions.map((q, index) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: attempt.answers[index]?.selectedAnswer,
      isCorrect: attempt.answers[index]?.isCorrect,
      points: q.points,
    }));

    res.status(200).json({
      success: true,
      attempt: {
        ...attempt.toObject(),
        questions: questionsWithAnswers,
      },
    });
  } catch (error) {
    console.error('Get Quiz Attempt Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get quizzes for a specific course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      courseId: req.params.courseId,
      isActive: true,
    })
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error('Get Quizzes By Course Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create a quiz (admin/tutor only)
// @route   POST /api/quizzes
// @access  Private (Tutor/Admin)
export const createQuiz = async (req, res) => {
  try {
    const { title, description, subject, topic, courseId, lectureId, questions, timeLimitMinutes, passingScore, xpReward } = req.body;

    if (!title || !questions || !questions.length) {
      return res.status(400).json({ success: false, message: 'Title and at least one question required' });
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question || !q.options || q.options.length < 2) {
        return res.status(400).json({ success: false, message: 'Each question must have text and at least 2 options' });
      }
      if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        return res.status(400).json({ success: false, message: 'Each question must have a valid correctAnswer index' });
      }
    }

    const quiz = await Quiz.create({
      title,
      description,
      subject: subject || 'General',
      topic: topic || '',
      courseId: courseId || null,
      lectureId: lectureId || null,
      questions,
      timeLimitMinutes: timeLimitMinutes || 10,
      passingScore: passingScore || 60,
      xpReward: xpReward || 50,
      createdBy: req.user._id,
      tutorId: req.user.role === 'tutor' || req.user.role === 'faculty' ? req.user._id : null,
    });

    res.status(201).json({ success: true, quiz, message: 'Quiz created successfully!' });
  } catch (error) {
    console.error('Create Quiz Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};