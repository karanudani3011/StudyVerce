import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Clock,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  Bot,
  PlusCircle,
  CheckCircle2,
  Circle,
  FileText,
  Bookmark,
  Layers,
  ChevronRight,
  Brain,
  Star,
  Users,
  GraduationCap
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge, Progress } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../config/api';
import { MOCK_COURSES, MOCK_HANDMADE_NOTES, MOCK_LEADERBOARD, MOCK_TEACHERS } from '../../data/mockData';

import TutorDashboard from '../tutor/TutorDashboard';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } }
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, setActiveTab } = useAuth();

  // If user is a Tutor or Faculty member, show the specialized Educator Studio Command Center
  if (user?.role === 'tutor' || user?.role === 'faculty') {
    return <TutorDashboard />;
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [dashStats, setDashStats] = useState(null);
  const [selectedNotebookNote, setSelectedNotebookNote] = useState(null);

  // Daily Study Planner Tasks state
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, text: 'Review Organic Chemistry Handwritten Notes', completed: true, subject: 'Chemistry', xp: 50 },
    { id: 2, text: 'Solve 5 Dynamic Programming Tree Problems', completed: true, subject: 'Computer Science', xp: 75 },
    { id: 3, text: 'Read Quantum Wave Mechanics Lab Journal', completed: false, subject: 'Physics', xp: 60 },
    { id: 4, text: 'Complete AI Tutor Daily Quiz Challenge', completed: false, subject: 'AI & ML', xp: 100 },
  ]);

  // Fetch live dashboard stats from backend if available
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiGet('/users/dashboard');
        if (data.success) {
          setDashStats(data.stats);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error.message);
      }
    };
    fetchDashboard();
  }, []);

  const s = dashStats || user || {};

  const toggleTask = (taskId) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasksCount = dailyTasks.filter(t => t.completed).length;
  const taskProgressPercent = Math.round((completedTasksCount / dailyTasks.length) * 100);

  const stats = [
    {
      title: 'Current Streak',
      value: `${s.streak || 14} Days`,
      desc: 'Active daily learning habit 🔥',
      icon: Flame,
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500'
    },
    {
      title: 'Total XP Earned',
      value: `${(s.xp || 4850).toLocaleString()} XP`,
      desc: 'Top 5% scholar globally ⚡',
      icon: Zap,
      color: 'text-[#4F7DF6]',
      bg: 'bg-[#4F7DF6]/10 border-[#4F7DF6]/20 text-[#4F7DF6]'
    },
    {
      title: 'Study Time',
      value: s.studyHours || '32.5 hrs',
      desc: '+4.2 hrs vs last week ⏱️',
      icon: Clock,
      color: 'text-[#8B5CF6]',
      bg: 'bg-purple-500/10 border-purple-500/20 text-[#8B5CF6]'
    },
    {
      title: 'Daily Target Goal',
      value: `${Math.max(taskProgressPercent, 75)}%`,
      desc: `${s.currentGoalMinutes || 51}/${s.dailyGoalMinutes || 60} mins completed 🎯`,
      icon: Target,
      color: 'text-[#22C55E]',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
    },
  ];

  const subjectsProgress = [
    { name: 'Computer Science', progress: 88, notesCount: 28, color: 'bg-[#4F7DF6]' },
    { name: 'Quantum Physics', progress: 74, notesCount: 16, color: 'bg-[#8B5CF6]' },
    { name: 'Organic Chemistry', progress: 92, notesCount: 22, color: 'bg-[#F59E0B]' },
    { name: 'Mathematics & Calculus', progress: 80, notesCount: 19, color: 'bg-[#22C55E]' },
  ];

  const userName = user?.name ? user.name.split(' ')[0] : 'Student';
  const userStreak = user?.streak || 14;

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
                  <span>{s.currentGoalMinutes || 51} / {s.dailyGoalMinutes || 60} mins</span>
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

          {/* Left Column (Planner, Handmade Notes Showcase, Subject Radar) */}
          <div className="xl:col-span-2 space-y-6">

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
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
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

            {/* Handmade Notebook Notes Showcase */}
            <motion.div {...fadeUp(0.15)} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#4F7DF6]" />
                    <span>Top Handmade Notebook Notes</span>
                  </h2>
                  <p className="text-xs text-[#64748B]">Handwritten notes and picture notebook uploads from fellow students</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/explore')}
                    className="text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1 transition-all"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" /> Bookmarked Notes
                  </button>
                  <button
                    onClick={() => navigate('/explore')}
                    className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1"
                  >
                    Explore Hub <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_HANDMADE_NOTES.slice(0, 4).map((note) => (
                  <Card
                    key={note.id}
                    hover
                    className="flex flex-col justify-between p-4 space-y-3 cursor-pointer group border border-[#E2E8F0] hover:border-[#4F7DF6]/40"
                    onClick={() => navigate('/explore')}
                  >
                    <div className="space-y-3">
                      <div className="relative h-36 rounded-[12px] overflow-hidden bg-slate-100 border border-[#E2E8F0]">
                        <img
                          src={note.thumbnail}
                          alt={note.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[6px] bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                          {note.format}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[6px] bg-amber-500/90 text-white text-[10px] font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> {note.rating}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#4F7DF6] uppercase tracking-wider">{note.subject}</span>
                        <h3 className="text-xs font-bold text-[#1E293B] line-clamp-1 group-hover:text-[#4F7DF6] transition-colors">{note.title}</h3>
                        <p className="text-[11px] text-[#64748B] line-clamp-2">{note.summary}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EDF2F7] flex items-center justify-between text-[11px] text-[#64748B]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Avatar src={note.author.avatar} alt={note.author.name} size="xs" />
                        <span className="font-semibold text-[#1E293B] truncate">{note.author.name}</span>
                      </div>
                      <span className="font-semibold">{note.pagesCount} Pages</span>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Subject Mastery Radar */}
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
                  {subjectsProgress.map((sub, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#1E293B] flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${sub.color}`} />
                          {sub.name}
                        </span>
                        <span className="text-[#64748B]">{sub.progress}% Mastery ({sub.notesCount} notes)</span>
                      </div>
                      <Progress value={sub.progress} size="sm" color={sub.color} />
                    </div>
                  ))}
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
                <p className="italic">"Can you explain the difference between SN1 and SN2 reaction mechanisms in organic chemistry?"</p>
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

            {/* Global Leaderboard Snippet */}
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
                {MOCK_LEADERBOARD.slice(0, 4).map((u) => (
                  <div
                    key={u.rank}
                    className={`flex items-center gap-3 p-2.5 rounded-[12px] transition-all ${
                      u.name === user?.name ? 'bg-[#EEF4FF] border border-[#4F7DF6]/20' : 'hover:bg-[#F8FAFC]'
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
                ))}
              </div>
            </Card>

            {/* Recommended Teachers / Mentors */}
            <Card className="space-y-4 border border-[#E2E8F0]">
              <h4 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#4F7DF6]" /> Featured Educators
              </h4>
              <div className="space-y-3">
                {MOCK_TEACHERS.map(t => (
                  <div key={t.id} className="flex items-center gap-3">
                    <Avatar src={t.avatar} alt={t.name} size="sm" verified={t.verified} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate">{t.name}</p>
                      <p className="text-[11px] text-[#94A3B8] truncate">{t.subject} · {t.followers} followers</p>
                    </div>
                    <Button variant="outline" size="xs">Follow</Button>
                  </div>
                ))}
              </div>
            </Card>

          </motion.div>

        </div>

      </div>
    </AppLayout>
  );
}
