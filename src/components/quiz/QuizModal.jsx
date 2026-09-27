import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  Zap,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge, Progress, Spinner } from '../ui/index.jsx';
import { apiGet, apiPost } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

export default function QuizModal({ isOpen, onClose, quizId, onQuizCompleted }) {
  const { user, updateUser, refreshUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [result, setResult] = useState(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);

    try {
      const res = await apiGet(`/quizzes/${quizId}`);
      if (res.success && res.quiz) {
        setQuiz(res.quiz);
        setTimeRemaining((res.quiz.timeLimitMinutes || 10) * 60);
      } else {
        throw new Error(res.message || 'Failed to load quiz');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch quiz');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (isOpen && quizId) {
      fetchQuiz();
    }
  }, [isOpen, quizId, fetchQuiz]);

  useEffect(() => {
    if (!isOpen || !quiz || result || loading || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, quiz, result, loading, timeRemaining]);

  const handleSelectOption = (optionIndex) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || submitting || result) return;
    setSubmitting(true);
    setError(null);

    try {
      const formattedAnswers = quiz.questions.map((_, i) => answers[i] ?? -1);
      const totalTime = (quiz.timeLimitMinutes || 10) * 60;
      const timeSpent = Math.max(1, totalTime - timeRemaining);

      const res = await apiPost(`/quizzes/${quiz._id}/submit`, {
        answers: formattedAnswers,
        timeSpentSeconds: timeSpent,
      });

      if (res.success) {
        setResult(res);
        if (user && res.attempt?.xpEarned) {
          const newXP = (user.xp || 0) + res.attempt.xpEarned;
          if (updateUser) {
            updateUser({ ...user, xp: newXP });
          }
        }
        // Refresh user data from server to get latest streak, XP, etc.
        if (refreshUser) {
          refreshUser();
        }
        if (onQuizCompleted) {
          onQuizCompleted(res);
        }
      } else {
        throw new Error(res.message || 'Failed to submit quiz');
      }
    } catch (err) {
      setError(err.message || 'Error submitting quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = quiz?.questions ? quiz.questions[currentIndex] : null;
  const totalQuestions = quiz?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[24px] shadow-2xl border border-[#E2E8F0] z-10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[12px] bg-[#EEF4FF] text-[#4F7DF6]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E293B] line-clamp-1">
                  {quiz?.title || 'Knowledge Assessment'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {quiz?.subject || 'General'} · {totalQuestions} Questions · +{quiz?.xpReward || 50} XP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!result && quiz && (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    timeRemaining < 60
                      ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                      : 'bg-white text-[#1E293B] border-[#E2E8F0]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(timeRemaining)}</span>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <Spinner size="lg" />
                <p className="text-xs text-[#64748B] font-semibold">Loading quiz questions...</p>
              </div>
            ) : error && !result ? (
              <div className="py-12 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <p className="text-sm font-bold text-[#1E293B]">{error}</p>
                <Button variant="secondary" size="sm" onClick={fetchQuiz}>
                  Try Again
                </Button>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="p-6 rounded-[20px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white text-center space-y-3 relative overflow-hidden">
                  <div className="space-y-2">
                    <span className="text-3xl">{result.attempt?.passed ? '🎉' : '💪'}</span>
                    <h2 className="text-2xl font-extrabold">
                      {result.attempt?.passed ? 'Quiz Passed!' : 'Good Effort!'}
                    </h2>
                    <p className="text-xs text-slate-300">{result.message}</p>

                    <div className="flex items-center justify-center gap-6 pt-3">
                      <div className="text-center">
                        <span className="text-xs text-slate-400 font-semibold block">Score</span>
                        <span className="text-2xl font-black text-white">
                          {result.attempt?.score} / {result.attempt?.maxScore}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-slate-700" />
                      <div className="text-center">
                        <span className="text-xs text-slate-400 font-semibold block">Accuracy</span>
                        <span className="text-2xl font-black text-[#60A5FA]">
                          {result.attempt?.percentage}%
                        </span>
                      </div>
                      <div className="h-8 w-px bg-slate-700" />
                      <div className="text-center">
                        <span className="text-xs text-slate-400 font-semibold block">XP Earned</span>
                        <span className="text-2xl font-black text-[#F59E0B] flex items-center justify-center gap-1">
                          <Zap className="w-5 h-5 fill-current" /> +{result.attempt?.xpEarned || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#1E293B]">Detailed Review</h4>
                  {result.questions?.map((q, idx) => {
                    const isCorrect = q.isCorrect;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-[16px] border space-y-3 ${
                          isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                            )}
                            <h5 className="text-xs font-bold text-[#1E293B]">
                              Q{idx + 1}. {q.question}
                            </h5>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isCorrect ? `+${q.points} pts` : '0 pts'}
                          </span>
                        </div>

                        <div className="space-y-1.5 pl-6">
                          {q.options.map((opt, optIdx) => {
                            const isUserPick = q.userAnswer === optIdx;
                            const isCorrectPick = q.correctAnswer === optIdx;
                            let style = 'bg-white border-[#E2E8F0] text-[#64748B]';
                            if (isCorrectPick) {
                              style = 'bg-emerald-100/70 border-emerald-300 text-emerald-800 font-bold';
                            } else if (isUserPick && !isCorrect) {
                              style = 'bg-rose-100/70 border-rose-300 text-rose-800 line-through';
                            }
                            return (
                              <div
                                key={optIdx}
                                className={`text-xs p-2.5 rounded-[10px] border flex items-center justify-between ${style}`}
                              >
                                <span>{opt}</span>
                                {isCorrectPick && (
                                  <span className="text-[10px] uppercase font-extrabold text-emerald-700">
                                    Correct Answer
                                  </span>
                                )}
                                {isUserPick && !isCorrect && (
                                  <span className="text-[10px] uppercase font-extrabold text-rose-700">
                                    Your Choice
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="pl-6 text-[11px] text-[#64748B] bg-white/60 p-2.5 rounded-[10px] border border-slate-200/60">
                            <span className="font-bold text-[#1E293B]">Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                    <span>Question {currentIndex + 1} of {totalQuestions}</span>
                    <span>{answeredCount} / {totalQuestions} Answered</span>
                  </div>
                  <Progress
                    value={currentIndex + 1}
                    max={totalQuestions}
                    color="bg-[#4F7DF6]"
                    size="sm"
                  />
                </div>

                <div className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="primary" size="sm">
                      {currentQuestion.topic || quiz?.subject || 'Question'}
                    </Badge>
                    <span className="text-xs font-bold text-[#4F7DF6]">
                      {currentQuestion.points || 10} Points
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#1E293B] leading-relaxed">
                    {currentQuestion.question}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentIndex] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 rounded-[14px] border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6] shadow-xs'
                            : 'bg-white border-[#E2E8F0] text-[#1E293B] hover:border-[#4F7DF6]/40 hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                              isSelected
                                ? 'bg-[#4F7DF6] text-white border-[#4F7DF6]'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4F7DF6] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            {result ? (
              <div className="w-full flex items-center justify-between gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={RotateCcw}
                  onClick={fetchQuiz}
                >
                  Retake Quiz
                </Button>
                <Button variant="primary" size="sm" onClick={onClose}>
                  Done & Back to Dashboard
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={currentIndex === 0 || loading || submitting}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {currentIndex < totalQuestions - 1 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ChevronRight}
                      disabled={loading || submitting}
                      onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Sparkles}
                      disabled={loading || submitting}
                      onClick={handleSubmit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {submitting ? 'Scoring Quiz...' : 'Submit Quiz'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
