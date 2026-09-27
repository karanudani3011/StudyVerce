import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Zap,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Trophy,
  Bot,
  PlusCircle,
  CheckCircle2,
  Circle,
  Brain,
  Play,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge, Progress } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../config/api';

import TutorDashboard from '../tutor/TutorDashboard';
import QuizModal from '../../components/quiz/QuizModal';
import StudySessionTracker from '../../components/study/StudySessionTracker';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } }
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashStats, setDashStats] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [subjectsProgress, setSubjectsProgress] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [educators, setEducators] = useState([]);
  const [loadingEducators, setLoadingEducators] = useState(true);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await apiGet('/users/dashboard');
      if (data.success) {
        setDashStats(data.stats);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error.message);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await apiGet('/study-tasks');
      if (res.success && res.data) {
        setDailyTasks(res.data);
      }
    } catch (error) {
      console.error('Study tasks fetch error:', error.message);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    if (user?.role === 'student') {
      fetchTasks();
    }
  }, [user, fetchDashboard, fetchTasks]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await apiGet('/quizzes');
        if (res.success && Array.isArray(res.quizzes)) {
          setAvailableQuizzes(res.quizzes);
        }
      } catch (err) {
        console.warn('Failed to load quizzes:', err.message);
      }
    };
    fetchQuizzes();
  }, []);

  const toggleTask = (taskId) => {
    setDailyTasks(prev =>
      prev.map(task =>
        (task._id === taskId || task.id === taskId)
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleTaskClick = (task) => {
    if (task.action === 'quiz' || task.type === 'quiz' || task.text?.toLowerCase().includes('quiz')) {
      if (availableQuizzes.length > 0) {
        setSelectedQuizId(availableQuizzes[0]._id);
        setIsQuizModalOpen(true);
        return;
      }
    }
    toggleTask(task._id || task.id);
  };

  const completedTasksCount = dailyTasks.filter(t => t.completed).length;
  const taskProgressPercent = dailyTasks.length > 0 ? Math.round((completedTasksCount / dailyTasks.length) * 100) : 0;

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) return;
      setLoadingCourses(true);
      try {
        const res = await apiGet('/courses/enrolled/my');
        if (res.success && res.data) {
          setEnrolledCourses(res.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Enrolled courses fetch error:', error.message);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchEnrolledCourses();
  }, [user]);

  // Fetch subject mastery based on enrolled courses
  const fetchSubjectMastery = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiGet('/courses/enrolled/my');
      if (res.success && res.data) {
        // Group courses by subject and calculate average progress
        const subjectMap = {};
        res.data.forEach(course => {
          const subject = course.subject || 'General';
          if (!subjectMap[subject]) {
            subjectMap[subject] = { totalProgress: 0, count: 0, notesCount: 0 };
          }
          subjectMap[subject].totalProgress += course.progress || 0;
          subjectMap[subject].count += 1;
          subjectMap[subject].notesCount += course.lectures?.length || course.lessons || 0;
        });

        const colors = {
          'Computer Science': 'bg-[#4F7DF6]',
          'AI & ML': 'bg-[#8B5CF6]',
          'Quantum Physics': 'bg-[#8B5CF6]',
          'Chemistry': 'bg-[#F59E0B]',
          'Biology': 'bg-[#EC4899]',
          'Mathematics & Calculus': 'bg-[#22C55E]',
          'Web Development': 'bg-[#06B6D4]',
          'Data Structures & Algorithms': 'bg-[#F97316]',
          'Artificial Intelligence': 'bg-[#8B5CF6]',
        };

        const progress = Object.entries(subjectMap).map(([name, data]) => ({
          name,
          progress: Math.round(data.totalProgress / data.count),
          notesCount: data.notesCount,
          color: colors[name] || 'bg-[#64748B]',
        }));

        setSubjectsProgress(progress);
      }
    } catch (error) {
      console.error('Subject mastery fetch error:', error.message);
    }
  }, [user]);

  useEffect(() => {
    fetchSubjectMastery();
  }, [fetchSubjectMastery]);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await apiGet('/leaderboard?limit=10');
      if (res.success && res.data) {
        setLeaderboard(res.data);
      }
    } catch (error) {
      console.error('Leaderboard fetch error:', error.message);
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Fetch featured educators
  const fetchEducators = useCallback(async () => {
    setLoadingEducators(true);
    try {
      const res = await apiGet('/tutors?limit=5');
      if (res.success && res.data) {
        setEducators(res.data.map(t => ({
          id: t._id,
          name: t.name,
          avatar: t.avatar,
          subject: t.department || t.title || 'Education',
          followers: `${t.followers || '0'}`,
          verified: t.isVerified || false,
        })));
      }
    } catch (error) {
      console.error('Educators fetch error:', error.message);
    } finally {
      setLoadingEducators(false);
    }
  }, []);

  useEffect(() => {
    fetchEducators();
  }, [fetchEducators]);

  // Early return for tutors/faculty - show TutorDashboard
  if (user?.role === 'tutor' || user?.role === 'faculty') {
    return <TutorDashboard />;
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const s = dashStats || user || {};

  const stats = [
    {
      title: 'Current Streak',
      value: `${s.streak || 0} Days`,
      desc: 'Active daily learning habit 🔥',
      icon: Flame,
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500'
    },
    {
      title: 'Total XP Earned',
      value: `${(s.xp || 0).toLocaleString()} XP`,
      desc: 'Track your learning journey ⚡',
      icon: Zap,
      color: 'text-[#4F7DF6]',
      bg: 'bg-[#4F7DF6]/10 border-[#4F7DF6]/20 text-[#4F7DF6]'
    },
    {
      title: 'Study Time',
      value: s.studyHours || '0 hrs',
      desc: 'Time spent learning this week ⏱️',
      icon: Clock,
      color: 'text-[#8B5CF6]',
      bg: 'bg-purple-500/10 border-purple-500/20 text-[#8B5CF6]'
    },
    {
      title: 'Daily Target Goal',
      value: `${Math.max(taskProgressPercent, 0)}%`,
      desc: `${s.currentGoalMinutes || 0}/${s.dailyGoalMinutes || 60} mins completed 🎯`,
      icon: Target,
      color: 'text-[#22C55E]',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
    },
  ];

  const userName = s.user?.name ? s.user.name.split(' ')[0] : (user?.name ? user.name.split(' ')[0] : 'Student');
  const userStreak = s.streak || 0;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
        
        {/* Next-Gen Hero Welcome Banner */}
        <motion.div
          {...fadeUp(0)}
          className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] rounded-[24px] p-6 sm:p-8 text-white border border-slate-800 shadow-2xl overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#4F7DF6]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-slate-200">
                  {greeting}, {userName} 👋
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {userStreak} Day Streak Active
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Welcome back to your <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent">Study Dashboard</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You've completed <span className="font-bold text-white">{taskProgressPercent}%</span> of today's study planner. Keep your learning momentum strong!
              </p>

              {/* Progress Bar inside Hero */}
              <div className="space-y-1.5 max-w-md pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Daily Goal Tracker</span>
                  <span>{s.currentGoalMinutes || 0} / {s.dailyGoalMinutes || 60} mins</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-[#4F7DF6] to-[#8B5CF6] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, taskProgressPercent)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-wrap sm:flex-col lg:flex-row gap-3 shrink-0">
              <Button
                variant="primary"
                icon={PlusCircle}
                onClick={() => navigate('/upload/notes')}
                className="shadow-lg shadow-blue-600/30"
              >
                Upload Notebook Note
              </Button>
              <Button
                variant="accent"
                icon={Bot}
                onClick={() => navigate('/ai-tutor')}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30"
              >
                Launch AI Tutor
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 4 Stat Cards */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} hover className="space-y-3 border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">{stat.title}</span>
                  <div className={`p-2 rounded-[12px] ${stat.bg} border`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#64748B]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" strokeWidth={2} />
                  <span>{stat.desc}</span>
                </div>
              </Card>
            );
          })}
        </motion.div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column (Continue Learning, Planner, Subject Radar) */}
          <div className="xl:col-span-2 space-y-6">

            {/* Continue Learning Section - Dynamic from enrolled courses */}
            <motion.div {...fadeUp(0.08)} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#4F7DF6]" />
                    <span>Continue Learning</span>
                  </h2>
                  <p className="text-xs text-[#64748B]">Pick up where you left off in your enrolled courses</p>
                </div>
                <button
                  onClick={() => navigate('/my-learning')}
                  className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {loadingCourses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <Card key={i} className="p-4 space-y-3 animate-pulse border border-[#E2E8F0]">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-[14px] bg-slate-200 shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-3/4 bg-slate-200 rounded" />
                          <div className="h-3 w-1/2 bg-slate-200 rounded" />
                          <div className="h-3 w-1/3 bg-slate-200 rounded" />
                        </div>
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-full" />
                    </Card>
                  ))}
                </div>
              ) : enrolledCourses.length === 0 ? (
                <Card className="p-8 text-center space-y-4 border-2 border-dashed border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E293B]">No Courses Yet</h3>
                    <p className="text-xs text-[#64748B] mt-1">Enroll in courses to see them here</p>
                  </div>
                  <Button variant="primary" size="sm" icon={ExternalLink} onClick={() => navigate('/courses')}>
                    Browse Courses
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledCourses.map(course => (
                    <Card
                      key={course.id || course._id}
                      hover
                      className="p-4 space-y-3 cursor-pointer group border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all"
                      onClick={() => navigate(`/courses/${course.id || course._id}/learn`)}
                    >
                      <div className="flex gap-4 items-start">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-20 h-20 rounded-[12px] object-cover shrink-0 border border-[#E2E8F0] group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="space-y-1 flex-1 min-w-0">
                          <Badge variant="primary" size="xs">{course.subject}</Badge>
                          <h3 className="text-xs font-bold text-[#1E293B] line-clamp-1 group-hover:text-[#4F7DF6] transition-colors">{course.title}</h3>
                          <p className="text-[10px] text-[#94A3B8] truncate">{course.instructor}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-[#1E293B]">{course.progress}% Complete</span>
                          <span className="text-[#64748B]">{course.duration}</span>
                        </div>
                        <Progress value={course.progress || 0} size="xs" color="bg-[#4F7DF6]" />
                      </div>

                      <div className="pt-2 border-t border-[#EDF2F7] flex items-center justify-between text-[10px] text-[#64748B]">
                        <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {course.lectures?.length || course.lessons} lessons</span>
                        <Button variant="ghost" size="xs" icon={Play} className="h-7 px-2">
                          Continue
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Interactive Daily Planner & Checklist Widget */}
            <motion.div {...fadeUp(0.1)}>
              <Card className="space-y-4 border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-[10px] bg-blue-50 text-[#4F7DF6]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#1E293B]">Interactive Daily Study Planner</h2>
                      <p className="text-xs text-[#64748B]">Check off tasks as you complete them to earn bonus XP!</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF4FF] text-[#4F7DF6]">
                    {completedTasksCount} / {dailyTasks.length} Done
                  </span>
                </div>

                <div className="space-y-2.5 pt-2">
                  {dailyTasks.map((task) => (
                    <div
                      key={task._id || task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`flex items-center justify-between p-3.5 rounded-[14px] border transition-all cursor-pointer select-none ${
                        task.completed
                          ? 'bg-slate-50 border-[#E2E8F0] opacity-85'
                          : 'bg-white border-[#E2E8F0] hover:border-[#4F7DF6]/40 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                        )}
                        <span className={`text-xs sm:text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-[#94A3B8]' : 'text-[#1E293B]'
                        }`}>
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-[#64748B]">
                          {task.subject}
                        </span>
                        <span className="text-[11px] font-extrabold text-[#4F7DF6]">
                          +{task.xp} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Subject Mastery Radar - Dynamic */}
            <motion.div {...fadeUp(0.2)}>
              <Card className="space-y-4 border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-[10px] bg-purple-50 text-[#8B5CF6]">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#1E293B]">Subject Mastery & Progress</h2>
                      <p className="text-xs text-[#64748B]">Your overall retention and activity across core subjects</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  {subjectsProgress.length > 0 ? (
                    subjectsProgress.map((sub, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#1E293B] flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${sub.color}`} />
                            {sub.name}
                          </span>
                          <span className="text-[#64748B]">{sub.progress}% Mastery ({sub.notesCount} lessons)</span>
                        </div>
                        <Progress value={sub.progress} size="sm" color={sub.color} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-[#64748B] text-xs">
                      Enroll in courses to track subject mastery
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

          </div>

          {/* Right Column Widgets */}
          <motion.div {...fadeUp(0.15)} className="space-y-5">

            {/* AI Tutor Prompt Launcher Card */}
            <Card className="space-y-4 border-l-4 border-l-[#8B5CF6] bg-gradient-to-br from-purple-50/50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 text-[#8B5CF6] rounded-[10px]">
                    <Bot className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h4 className="text-sm font-bold text-[#1E293B]">AI Tutor Assistant</h4>
                </div>
                <Badge variant="accent" size="sm">Active 🤖</Badge>
              </div>

              <div className="bg-white p-3 rounded-[12px] border border-purple-100 text-xs text-[#475569] space-y-1">
                <p className="font-bold text-[#1E293B]">Suggested Practice Question:</p>
                <p className="italic">What would you like to learn today?</p>
              </div>

              <Button
                variant="accent"
                size="sm"
                fullWidth
                icon={Bot}
                onClick={() => navigate('/ai-tutor')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Ask AI Tutor Now
              </Button>
            </Card>

            {/* Global Leaderboard Snippet - Real API */}
            <Card className="space-y-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-[#F59E0B] rounded-[10px]">
                    <Trophy className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Top Peer Scholars</h4>
                </div>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="text-xs text-[#4F7DF6] font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {loadingLeaderboard ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-[12px] animate-pulse">
                      <div className="w-5 h-5 rounded bg-slate-200" />
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-2 w-16 bg-slate-200 rounded" />
                      </div>
                      <div className="w-20 h-4 bg-slate-200 rounded" />
                    </div>
                  ))
                ) : leaderboard.length > 0 ? (
                  leaderboard.map((u) => (
                    <div
                      key={u.rank}
                      className={`flex items-center gap-3 p-2.5 rounded-[12px] transition-all ${
                        u.name === userName ? 'bg-[#EEF4FF] border border-[#4F7DF6]/20' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-[#94A3B8] w-5 text-center">#{u.rank}</span>
                      <Avatar src={u.avatar} alt={u.name} size="xs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1E293B] truncate">{u.name}</p>
                        <p className="text-[10px] text-[#94A3B8] truncate">{u.institution}</p>
                      </div>
                      <span className="text-xs font-bold text-[#4F7DF6]">{u.xp.toLocaleString()} XP</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#64748B] text-xs">
                    No leaderboard data available yet
                  </div>
                )}
              </div>
            </Card>

            {/* Recommended Teachers / Mentors - Real API */}
            <Card className="space-y-4 border border-[#E2E8F0]">
              <h4 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#4F7DF6]" /> Featured Educators
              </h4>
              <div className="space-y-3">
                {loadingEducators ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded_full bg-slate-200" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-2 w-20 bg-slate-200 rounded" />
                      </div>
                      <div className="w-20 h-6 bg-slate-200 rounded" />
                    </div>
                  ))
                ) : educators.length > 0 ? (
                  educators.map(t => (
                    <div key={t.id} className="flex items-center gap-3">
                      <Avatar src={t.avatar} alt={t.name} size="sm" verified={t.verified} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1E293B] truncate">{t.name}</p>
                        <p className="text-[11px] text-[#94A3B8] truncate">{t.subject} · {t.followers} followers</p>
                      </div>
                      <Button variant="outline" size="xs">Follow</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#64748B] text-xs">
                    No educators available yet
                  </div>
                )}
              </div>
            </Card>

            {/* Study Session Tracker - Dynamic Real-time */}
            <StudySessionTracker />

          </motion.div>

        </div>

      </div>

      {selectedQuizId && (
        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          quizId={selectedQuizId}
          onQuizCompleted={() => {
            fetchDashboard();
            fetchTasks();
            fetchLeaderboard();
          }}
        />
      )}
    </AppLayout>
  );
}