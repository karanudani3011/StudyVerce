import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  StopCircle,
  Clock,
  Zap,
  Target,
  X,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Progress } from '../ui/index.jsx';
import { useStudySession } from '../../hooks/useStudySession';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../config/api';

export default function StudySessionTracker({ onSessionCompleted }) {
  const { user } = useAuth();
  const { activeSession, stats, elapsedTime, startSession, stopSession, fetchStats } = useStudySession();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;
    if (hours > 0) {
      return `${hours}h ${displayMins}m ${secs}s`;
    }
    return `${displayMins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) return;
    setLoadingCourses(true);
    try {
      const res = await apiGet('/courses/enrolled/my');
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err.message);
    } finally {
      setLoadingCourses(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  const handleStartSession = async () => {
    try {
      await startSession(selectedCourseId, selectedLectureId);
      setShowCoursePicker(false);
    } catch (err) {
      console.error('Start session error:', err.message);
    }
  };

  const handleStopSession = async (pause = false) => {
    if (!activeSession) return;
    try {
      await stopSession(activeSession._id, pause);
      if (onSessionCompleted) {
        onSessionCompleted();
      }
    } catch (err) {
      console.error('Stop session error:', err.message);
    }
  };

  const todayProgress = stats?.dailyGoalMinutes > 0
    ? Math.min(Math.round((stats.currentGoalMinutes / stats.dailyGoalMinutes) * 100), 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Active Session Timer */}
      {activeSession ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[20px] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white border border-slate-800 shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#4F7DF6]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-[10px]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Active Study Session</h3>
              </div>
              <button
                onClick={() => setShowCoursePicker(true)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timer Display */}
            <div className="text-center py-4">
              <div className="text-4xl sm:text-6xl font-mono font-extrabold tabular-nums">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {activeSession.courseId ? 'Studying...' : 'General study session'}
              </p>
            </div>

            {/* Daily Goal Progress */}
            {stats && stats.dailyGoalMinutes > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Daily Goal</span>
                  <span>{stats.currentGoalMinutes || 0} / {stats.dailyGoalMinutes} mins</span>
                </div>
                <Progress
                  value={Math.min(todayProgress, 100)}
                  max={100}
                  color="bg-[#4F7DF6]"
                  size="md"
                  showPercent
                />
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="lg"
                icon={Pause}
                onClick={() => handleStopSession(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Pause
              </Button>
              <Button
                variant="danger"
                size="lg"
                icon={StopCircle}
                onClick={() => handleStopSession(false)}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                End Session
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[20px] bg-white border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#EEF4FF] text-[#4F7DF6] rounded-[10px]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B]">Start Study Session</h3>
              </div>
            </div>

            <p className="text-sm text-[#64748B]">
              Track your study time, earn XP, and build your daily streak!
            </p>

            {/* Quick Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-[14px] bg-[#F5F7FB] border border-[#E2E8F0] text-center">
                  <div className="text-2xl font-extrabold text-[#1E293B]">{stats.streak || 0}</div>
                  <div className="text-xs text-[#64748B]">Day Streak</div>
                </div>
                <div className="p-3 rounded-[14px] bg-[#F5F7FB] border border-[#E2E8F0] text-center">
                  <div className="text-2xl font-extrabold text-[#1E293B]">{stats.dailyGoalMinutes || 60} min</div>
                  <div className="text-xs text-[#64748B]">Daily Goal</div>
                </div>
                <div className="p-3 rounded-[14px] bg-[#F5F7FB] border border-[#E2E8F0] text-center">
                  <div className="text-2xl font-extrabold text-[#4F7DF6]">{todayProgress}%</div>
                  <div className="text-xs text-[#64748B]">Today's Progress</div>
                </div>
              </div>
            )}

            {/* Course Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                What are you studying? <span className="text-[#F59E0B]">(Optional)</span>
              </label>
              <select
                value={selectedCourseId || ''}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value || null);
                  setSelectedLectureId(null);
                }}
                className="w-full px-4 py-3 rounded-[14px] bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/15 text-sm text-[#1E293B] cursor-pointer appearance-none"
              >
                <option value="">General Study (No specific course)</option>
                {courses.map(course => (
                  <option key={course.id || course._id} value={course.id || course._id}>
                    {course.title} ({course.subject})
                  </option>
                ))}
              </select>

              {selectedCourseId && courses.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                    Specific Lecture/Module (Optional)
                  </label>
                  <select
                    value={selectedLectureId || ''}
                    onChange={(e) => setSelectedLectureId(e.target.value || null)}
                    className="w-full px-4 py-3 rounded-[14px] bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/15 text-sm text-[#1E293B] cursor-pointer appearance-none"
                  >
                    <option value="">Entire Course</option>
                    {courses.find(c => (c.id || c._id) === selectedCourseId)?.lectures?.map((lecture, i) => (
                      <option key={i} value={lecture.title}>
                        {lecture.title} ({lecture.duration || '15 mins'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Start Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={Play}
                onClick={handleStartSession}
                disabled={loadingCourses || !user}
                className="bg-gradient-to-r from-[#4F7DF6] to-[#8B5CF6] hover:from-[#3D6CF2] hover:to-[#7C3AED] text-white shadow-lg shadow-blue-600/30"
              >
                {loadingCourses ? 'Loading Courses...' : 'Start Study Session'}
              </Button>

              <p className="text-xs text-[#94A3B8] text-center">
                Earn 2 XP per minute (max 50 XP/session) • Daily goal bonus: +20 XP
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Today's Study Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <div className="p-4 rounded-[14px] bg-white border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Today</span>
              <div className="p-2 rounded-[10px] bg-blue-50 text-[#4F7DF6] border border-blue-100">
                <Clock className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1E293B] mt-2">
              {stats.studyTodayMinutes || 0} min
            </div>
            <div className="text-xs text-[#64748B] mt-1">Study Time</div>
          </div>

          <div className="p-4 rounded-[14px] bg-white border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">This Week</span>
              <div className="p-2 rounded-[10px] bg-purple-50 text-[#8B5CF6] border border-purple-100">
                <Target className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1E293B] mt-2">
              {Math.floor((stats.studyWeekMinutes || 0) / 60)}h {(stats.studyWeekMinutes || 0) % 60}m
            </div>
            <div className="text-xs text-[#64748B] mt-1">Study Time</div>
          </div>

          <div className="p-4 rounded-[14px] bg-white border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Total</span>
              <div className="p-2 rounded-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Zap className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1E293B] mt-2">
              {Math.floor((stats.totalStudyMinutes || 0) / 60)}h
            </div>
            <div className="text-xs text-[#64748B] mt-1">Total Hours</div>
          </div>

          <div className="p-4 rounded-[14px] bg-white border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Sessions</span>
              <div className="p-2 rounded-[10px] bg-amber-50 text-amber-600 border border-amber-100">
                <Zap className="w-4 h-4" strokeWidth={2} fill="currentColor" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1E293B] mt-2">
              {stats.sessionCount || 0}
            </div>
            <div className="text-xs text-[#64748B] mt-1">This Week</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}