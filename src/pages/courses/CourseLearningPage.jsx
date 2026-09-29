import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, CheckCircle2, Lock, BookOpen, Award, ChevronRight,
  ChevronLeft, AlertCircle, FileText, ExternalLink, Trophy, XCircle,
  RotateCcw, Download, Eye, Clock, Star, Loader2
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Progress, Button } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet, apiPost, apiPut } from '../../config/api';
import CertificateModal from '../../components/courses/CertificateModal';

// ─── Helper: convert YouTube/Vimeo URL to embed ──────────────────────────────
function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // If already an embed URL, return as-is
  if (url.includes('/embed/') || url.includes('player.vimeo')) return url;
  return url;
}

// ─── Quiz Component ──────────────────────────────────────────────────────────
function QuizSection({ courseId, quiz, onQuizPassed }) {
  const { addToast } = useToast();
  const [quizState, setQuizState] = useState('intro'); // intro|taking|result
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const startQuiz = () => {
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    setStartTime(Date.now());
    setQuizState('taking');
  };

  const selectAnswer = (optionIndex) => {
    setAnswers(prev => ({ ...prev, [currentQ]: optionIndex }));
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      const answersArray = quiz.questions.map((_, i) =>
        answers[i] !== undefined ? answers[i] : -1
      );
      const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      const res = await apiPost(`/courses/${courseId}/quiz/submit`, {
        answers: answersArray,
        timeSpentSeconds: timeSpent,
      });
      if (res.success) {
        setResult(res);
        setQuizState('result');
        if (res.attempt.passed) {
          onQuizPassed(res.attempt.percentage);
          addToast('🎉 Quiz passed! Certificate unlocked!', 'success');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);

  if (quizState === 'intro') {
    return (
      <div className="space-y-6">
        <div className="text-center p-8 bg-gradient-to-br from-[#EEF4FF] to-purple-50 rounded-2xl border border-[#4F7DF6]/20">
          <div className="w-16 h-16 bg-[#4F7DF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-[#4F7DF6]" />
          </div>
          <h2 className="text-xl font-extrabold text-[#1E293B] mb-2">Final Quiz</h2>
          <p className="text-sm text-[#64748B] mb-6">{quiz.description || 'Test your understanding of this course.'}</p>
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#4F7DF6]">{quiz.questionsCount || quiz.questions?.length}</div>
              <div className="text-xs text-[#64748B] font-semibold">Questions</div>
            </div>
            <div className="w-px h-10 bg-[#E2E8F0]" />
            <div className="text-center">
              <div className="text-2xl font-extrabold text-emerald-600">{quiz.passingScore}%</div>
              <div className="text-xs text-[#64748B] font-semibold">Passing Score</div>
            </div>
            <div className="w-px h-10 bg-[#E2E8F0]" />
            <div className="text-center">
              <div className="text-2xl font-extrabold text-purple-600">{quiz.timeLimitMinutes || 30}m</div>
              <div className="text-xs text-[#64748B] font-semibold">Time Limit</div>
            </div>
          </div>
          <Button variant="primary" size="lg" icon={Play} onClick={startQuiz}>
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  if (quizState === 'taking') {
    const q = quiz.questions[currentQ];
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#64748B]">
            Question {currentQ + 1} of {quiz.questions.length}
          </span>
          <span className="text-xs font-semibold text-[#64748B]">
            {answeredCount}/{quiz.questions.length} answered
          </span>
        </div>
        <Progress value={((currentQ + 1) / quiz.questions.length) * 100} size="sm" />

        {/* Question */}
        <Card className="p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#4F7DF6] text-white flex items-center justify-center text-sm font-extrabold shrink-0">
              {currentQ + 1}
            </span>
            <h3 className="text-base font-bold text-[#1E293B] leading-relaxed">{q.question}</h3>
          </div>

          <div className="space-y-3">
            {q.options.map((option, optIdx) => (
              <button
                key={optIdx}
                type="button"
                onClick={() => selectAnswer(optIdx)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer font-semibold text-sm ${
                  answers[currentQ] === optIdx
                    ? 'border-[#4F7DF6] bg-[#EEF4FF] text-[#1E293B]'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                  answers[currentQ] === optIdx
                    ? 'bg-[#4F7DF6] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </Card>

        {/* Question Nav Grid */}
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                i === currentQ
                  ? 'bg-[#4F7DF6] text-white ring-2 ring-[#4F7DF6]/30'
                  : answers[i] !== undefined
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            icon={ChevronLeft}
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentQ < quiz.questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentQ(Math.min(quiz.questions.length - 1, currentQ + 1))}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="accent"
                icon={submitting ? Loader2 : CheckCircle2}
                onClick={() => setShowConfirm(true)}
                disabled={submitting || !allAnswered}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>
        </div>

        {/* Confirm Submit Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-2xl">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-extrabold text-[#1E293B]">Submit Quiz?</h3>
                <p className="text-sm text-[#64748B] mt-2">
                  {allAnswered
                    ? 'You have answered all questions. Are you sure you want to submit?'
                    : `You have only answered ${answeredCount} of ${quiz.questions.length} questions. Unanswered questions will be marked wrong.`}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button variant="primary" fullWidth onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Yes, Submit'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (quizState === 'result' && result) {
    const { attempt, questions: reviewQ } = result;
    return (
      <div className="space-y-6">
        {/* Result Banner */}
        <div className={`p-6 rounded-2xl text-center border-2 ${
          attempt.passed
            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
            : 'bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200'
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            attempt.passed ? 'bg-emerald-100' : 'bg-rose-100'
          }`}>
            {attempt.passed
              ? <Trophy className="w-10 h-10 text-emerald-600" />
              : <XCircle className="w-10 h-10 text-rose-500" />}
          </div>
          <h2 className="text-2xl font-extrabold text-[#1E293B] mb-1">
            {attempt.passed ? 'Quiz Passed! 🎉' : 'Not Passed'}
          </h2>
          <p className="text-sm text-[#64748B] mb-6">
            {attempt.passed
              ? 'Congratulations! You have passed the final quiz.'
              : `You need ${quiz.passingScore}% to pass. Keep practicing!`}
          </p>

          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-[#1E293B]">{attempt.correctAnswers}/{attempt.totalQuestions}</div>
              <div className="text-xs text-[#64748B] font-semibold">Score</div>
            </div>
            <div className="w-px h-12 bg-[#E2E8F0]" />
            <div className="text-center">
              <div className={`text-3xl font-extrabold ${attempt.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                {attempt.percentage}%
              </div>
              <div className="text-xs text-[#64748B] font-semibold">Percentage</div>
            </div>
            <div className="w-px h-12 bg-[#E2E8F0]" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-purple-600">{quiz.passingScore}%</div>
              <div className="text-xs text-[#64748B] font-semibold">Required</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          {!attempt.passed && (
            <Button variant="outline" icon={RotateCcw} onClick={startQuiz} fullWidth={false}>
              Retake Quiz
            </Button>
          )}
          {attempt.passed && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold">
              <Award className="w-4 h-4" /> Certificate Unlocked!
            </div>
          )}
        </div>

        {/* Question Review */}
        {reviewQ && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#1E293B]">Answer Review</h3>
            {reviewQ.map((q, i) => (
              <Card key={i} className={`p-4 space-y-3 border-l-4 ${q.isCorrect ? 'border-emerald-500' : 'border-rose-400'}`}>
                <div className="flex items-start gap-2">
                  {q.isCorrect
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                  <p className="text-sm font-bold text-[#1E293B]">{i + 1}. {q.question}</p>
                </div>
                <div className="pl-6 space-y-1">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${
                      optIdx === q.correctAnswer
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : optIdx === q.userAnswer && !q.isCorrect
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'text-[#64748B]'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}. {opt}
                      {optIdx === q.correctAnswer && ' ✓'}
                      {optIdx === q.userAnswer && optIdx !== q.correctAnswer && ' ✗'}
                    </div>
                  ))}
                  {q.explanation && (
                    <p className="text-xs text-[#64748B] mt-2 italic pl-1">💡 {q.explanation}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ─── Certificate Section ──────────────────────────────────────────────────────
function CertificateSection({ courseId, certificateUnlocked, hasQuiz, quizPassed, progress }) {
  const { addToast } = useToast();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchCertificate = useCallback(async () => {
    if (!certificateUnlocked) return;
    setLoading(true);
    try {
      const res = await apiGet(`/courses/${courseId}/certificate`);
      if (res.success) setCert(res.certificate);
    } catch (err) {
      // cert not yet unlocked from backend — silently fail
    } finally {
      setLoading(false);
    }
  }, [courseId, certificateUnlocked]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-[#4F7DF6] animate-spin" />
      </div>
    );
  }

  if (!certificateUnlocked) {
    return (
      <div className="p-6 rounded-2xl border-2 border-dashed border-[#E2E8F0] text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-[#1E293B]">🔒 Certificate Locked</h3>
          <p className="text-sm text-[#64748B] mt-1">
            {hasQuiz
              ? 'Complete all lessons and pass the final quiz to unlock your certificate.'
              : 'Complete all lessons to unlock your certificate.'}
          </p>
        </div>
        <div className="space-y-2 text-left max-w-xs mx-auto">
          <div className={`flex items-center gap-2 text-sm ${progress >= 100 ? 'text-emerald-600' : 'text-[#64748B]'}`}>
            {progress >= 100 ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            Complete all lessons ({progress}% done)
          </div>
          {hasQuiz && (
            <div className={`flex items-center gap-2 text-sm ${quizPassed ? 'text-emerald-600' : 'text-[#64748B]'}`}>
              {quizPassed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              Pass the final quiz
            </div>
          )}
        </div>
        <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
          🔒 Certificate Locked
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
        <Award className="w-8 h-8 text-emerald-600" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-[#1E293B]">🎓 Certificate Available!</h3>
        <p className="text-sm text-[#64748B] mt-1">
          Congratulations! Your certificate has been generated.
        </p>
        {cert && (
          <p className="text-xs text-emerald-600 font-bold mt-2">ID: {cert.certificateNumber}</p>
        )}
      </div>
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="primary" icon={Eye} onClick={() => {
          if (!cert) fetchCertificate().then(() => setShowModal(true));
          else setShowModal(true);
        }}>
          View Certificate
        </Button>
        <Button variant="outline" icon={Download} onClick={() => setShowModal(true)}>
          Download PDF
        </Button>
      </div>

      {showModal && cert && (
        <CertificateModal
          certificate={cert}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ─── Main Learning Page ───────────────────────────────────────────────────────
export default function CourseLearningPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('lecture'); // 'lecture' | 'quiz' | 'certificate'
  const [activeLectureIdx, setActiveLectureIdx] = useState(0);
  const [markingComplete, setMarkingComplete] = useState(false);

  const loadCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const [courseRes, progressRes] = await Promise.all([
        apiGet(`/courses/${courseId}`),
        apiGet(`/courses/${courseId}/progress`).catch(() => null),
      ]);

      if (courseRes.success) {
        setCourse(courseRes.data);
        // Load quiz if exists
        if (courseRes.data.hasQuiz) {
          const quizRes = await apiGet(`/courses/${courseId}/quiz`).catch(() => null);
          if (quizRes?.success) setQuiz(quizRes.quiz);
        }
      }

      if (progressRes?.success) {
        setProgressData(progressRes);
      }
    } catch (err) {
      addToast('Failed to load course', 'error');
    } finally {
      setLoading(false);
    }
  }, [courseId, addToast]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCourseData();
  }, [courseId, user, navigate, loadCourseData]);

  const lectures = course?.lectures || [];

  const isLectureCompleted = (lectureId) => {
    return progressData?.completedLectures?.includes(lectureId);
  };

  const handleMarkLectureComplete = async (lecture) => {
    const lectureId = lecture._id || `lecture_${activeLectureIdx}`;
    if (isLectureCompleted(lectureId)) return;

    setMarkingComplete(true);
    try {
      const res = await apiPut(`/courses/${courseId}/progress`, {
        completedLectureId: lectureId,
      });
      if (res.success) {
        setProgressData(prev => ({
          ...prev,
          progress: res.progress,
          completedLectures: [...(prev?.completedLectures || []), lectureId],
          certificateUnlocked: res.certificateUnlocked,
        }));
        addToast('Lesson marked complete! 🎉', 'success');

        // If all done, check if we should show quiz or certificate
        if (res.progress >= 100) {
          if (course.hasQuiz && !progressData?.quizPassed) {
            addToast('All lessons done! Take the final quiz to earn your certificate.', 'info');
          } else if (!course.hasQuiz) {
            setActiveView('certificate');
          }
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to mark lecture complete', 'error');
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleQuizPassed = async (score) => {
    setProgressData(prev => ({
      ...prev,
      quizPassed: true,
      quizScore: score,
      certificateUnlocked: true,
    }));
    setActiveView('certificate');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#4F7DF6] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#64748B] font-medium">Loading course...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!course) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-xl font-bold text-[#1E293B]">Course Not Found</h2>
          <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/courses')} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </AppLayout>
    );
  }

  const currentLecture = lectures[activeLectureIdx];
  const progressPct = progressData?.progress || 0;
  const completedCount = progressData?.completedLectures?.length || 0;
  const certificateUnlocked = progressData?.certificateUnlocked || false;
  const quizPassed = progressData?.quizPassed || false;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button onClick={() => navigate(`/courses/${courseId}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]">
            <ArrowLeft className="w-4 h-4" /> Back to Course Details
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-[#64748B]">Progress</p>
              <p className="text-sm font-extrabold text-[#4F7DF6]">{progressPct}% ({completedCount}/{lectures.length})</p>
            </div>
            <div className="w-24">
              <Progress value={progressPct} size="sm" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar: Lecture List */}
          <div className="lg:col-span-1">
            <Card className="p-4 space-y-1 sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] px-2 pb-3 border-b border-[#EDF2F7]">
                {lectures.length} Lessons
              </h3>

              {lectures.map((lec, i) => {
                const lecId = lec._id || `lecture_${i}`;
                const completed = isLectureCompleted(lecId);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActiveLectureIdx(i);
                      setActiveView('lecture');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer text-xs ${
                      activeLectureIdx === i && activeView === 'lecture'
                        ? 'bg-[#EEF4FF] text-[#4F7DF6] font-bold'
                        : 'text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#1E293B]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      completed ? 'bg-emerald-500 text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'
                    }`}>
                      {completed ? <CheckCircle2 className="w-3 h-3" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                    </div>
                    <span className="line-clamp-2 flex-1">{lec.title}</span>
                  </button>
                );
              })}

              {/* Quiz Link */}
              {course.hasQuiz && quiz && (
                <button
                  type="button"
                  onClick={() => setActiveView('quiz')}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer text-xs mt-1 border-t border-[#EDF2F7] pt-3 ${
                    activeView === 'quiz'
                      ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                      : 'text-[#64748B] hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    quizPassed ? 'bg-emerald-500 text-white' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {quizPassed ? <CheckCircle2 className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                  </div>
                  <span className="font-bold">Final Quiz</span>
                  {quizPassed && <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Passed</span>}
                </button>
              )}

              {/* Certificate Link */}
              <button
                type="button"
                onClick={() => setActiveView('certificate')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer text-xs mt-1 ${
                  activeView === 'certificate'
                    ? 'bg-amber-50 text-amber-700 font-bold border border-amber-200'
                    : 'text-[#64748B] hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  certificateUnlocked ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {certificateUnlocked ? <Award className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                </div>
                <span className="font-bold">Certificate</span>
                {certificateUnlocked && (
                  <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Ready</span>
                )}
              </button>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">

            {/* ─── LECTURE VIEW ─────────────────────────────────────────── */}
            {activeView === 'lecture' && currentLecture && (
              <>
                {/* Video Player */}
                <Card className="p-0 overflow-hidden">
                  {currentLecture.videoUrl ? (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={getEmbedUrl(currentLecture.videoUrl)}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={currentLecture.title}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <Play className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No video for this lecture</p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Lecture Info */}
                <Card className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <Badge variant="primary" size="sm">Lesson {activeLectureIdx + 1}</Badge>
                      <h2 className="text-lg font-extrabold text-[#1E293B]">{currentLecture.title}</h2>
                      <p className="text-xs text-[#94A3B8]">{currentLecture.duration || '15 mins'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkLectureComplete(currentLecture)}
                      disabled={markingComplete || isLectureCompleted(currentLecture._id || `lecture_${activeLectureIdx}`)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
                        isLectureCompleted(currentLecture._id || `lecture_${activeLectureIdx}`)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : markingComplete
                          ? 'bg-[#4F7DF6]/50 text-white cursor-wait'
                          : 'bg-[#4F7DF6] text-white hover:bg-blue-700 cursor-pointer'
                      }`}
                    >
                      {markingComplete
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : isLectureCompleted(currentLecture._id || `lecture_${activeLectureIdx}`)
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isLectureCompleted(currentLecture._id || `lecture_${activeLectureIdx}`)
                        ? 'Completed ✓'
                        : markingComplete ? 'Marking...' : 'Mark Complete'}
                    </button>
                  </div>

                  {currentLecture.pdfUrl && (
                    <a
                      href={currentLecture.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#4F7DF6] hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View Lecture Slides / PDF
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </Card>

                {/* Next/Prev Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    icon={ChevronLeft}
                    onClick={() => setActiveLectureIdx(Math.max(0, activeLectureIdx - 1))}
                    disabled={activeLectureIdx === 0}
                  >
                    Previous
                  </Button>

                  {activeLectureIdx < lectures.length - 1 ? (
                    <Button
                      variant="primary"
                      onClick={() => setActiveLectureIdx(activeLectureIdx + 1)}
                    >
                      Next Lesson <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      {course.hasQuiz && !quizPassed && (
                        <Button variant="primary" icon={Award} onClick={() => setActiveView('quiz')}>
                          Take Final Quiz
                        </Button>
                      )}
                      {(!course.hasQuiz || quizPassed) && (
                        <Button variant="accent" icon={Award} onClick={() => setActiveView('certificate')}>
                          View Certificate
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Course Completion Banner (shown when 100% done) */}
                {progressPct >= 100 && (
                  <Card className={`p-5 border-2 ${
                    certificateUnlocked
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-amber-200 bg-amber-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        certificateUnlocked ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        {certificateUnlocked ? <Trophy className="w-5 h-5 text-emerald-600" /> : <Award className="w-5 h-5 text-amber-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-extrabold text-[#1E293B]">
                          {certificateUnlocked
                            ? '🎉 Course Completed! Certificate Ready'
                            : course.hasQuiz && !quizPassed
                            ? '✅ All Lessons Done — Take the Final Quiz'
                            : '🎉 Course Completed!'}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {certificateUnlocked
                            ? 'Your certificate is now available.'
                            : course.hasQuiz
                            ? 'Pass the final quiz to unlock your certificate.'
                            : 'All content completed!'}
                        </p>
                      </div>
                      <Button
                        variant={certificateUnlocked ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setActiveView(certificateUnlocked ? 'certificate' : 'quiz')}
                      >
                        {certificateUnlocked ? '🎓 Get Certificate' : '📝 Take Quiz'}
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* ─── QUIZ VIEW ────────────────────────────────────────────── */}
            {activeView === 'quiz' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveView('lecture')}
                    className="text-xs text-[#64748B] hover:text-[#1E293B] flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Lessons
                  </button>
                </div>
                {quiz ? (
                  <QuizSection
                    courseId={courseId}
                    quiz={quiz}
                    onQuizPassed={handleQuizPassed}
                  />
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <p className="text-sm text-[#64748B]">Quiz not available</p>
                  </div>
                )}
              </div>
            )}

            {/* ─── CERTIFICATE VIEW ─────────────────────────────────────── */}
            {activeView === 'certificate' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveView('lecture')}
                    className="text-xs text-[#64748B] hover:text-[#1E293B] flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Lessons
                  </button>
                </div>
                <CertificateSection
                  courseId={courseId}
                  certificateUnlocked={certificateUnlocked}
                  hasQuiz={course.hasQuiz}
                  quizPassed={quizPassed}
                  progress={progressPct}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
