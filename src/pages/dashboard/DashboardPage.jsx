import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, GraduationCap, ChevronRight } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';

import TutorDashboard from '../tutor/TutorDashboard';
import QuizModal from '../../components/quiz/QuizModal';
import StudySessionTracker from '../../components/study/StudySessionTracker';

import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { ContinueLearning } from '../../components/dashboard/ContinueLearning';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { SubjectMastery } from '../../components/dashboard/SubjectMastery';
import { DailyPlanner } from '../../components/dashboard/DailyPlanner';
import { AITutorCard } from '../../components/dashboard/AITutorCard';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { DashboardError } from '../../components/dashboard/DashboardError';
import { LiveMeetingsSection } from '../../components/meetings/LiveMeetingsSection';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    loading,
    error,
    stats,
    enrolledCourses,
    recentActivity,
    dailyTasks,
    toggleTask,
    leaderboard,
    loadingLeaderboard,
    educators,
    loadingEducators,
    availableQuizzes,
    refreshDashboard,
  } = useStudentDashboard();

  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Early return for tutors/faculty - show TutorDashboard
  if (user?.role === 'tutor' || user?.role === 'faculty') {
    return <TutorDashboard />;
  }

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <DashboardError error={error} onRetry={refreshDashboard} />
      </AppLayout>
    );
  }

  const completedTasksCount = dailyTasks.filter((t) => t.completed).length;
  const taskProgressPercent = dailyTasks.length > 0
    ? Math.round((completedTasksCount / dailyTasks.length) * 100)
    : 0;

  const handleTaskClick = (task) => {
    if (
      task.action === 'quiz' ||
      task.type === 'quiz' ||
      task.text?.toLowerCase().includes('quiz')
    ) {
      if (availableQuizzes.length > 0) {
        setSelectedQuizId(availableQuizzes[0]._id);
        setIsQuizModalOpen(true);
        return;
      }
    }
    toggleTask(task._id || task.id);
  };

  const currentUserName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
        
        {/* 1. Dynamic Hero Welcome Banner */}
        <DashboardHero
          user={user}
          stats={stats}
          taskProgressPercent={taskProgressPercent}
          hasTasks={dailyTasks.length > 0}
        />

        {/* 2. Dynamic 4 Stat Cards */}
        <DashboardStats stats={stats} user={user} />

        {/* 3. Main Content Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column (Live Meetings, Continue Learning, Daily Planner, Subject Mastery, Recent Activity) */}
          <div className="xl:col-span-2 space-y-6">

            {/* Live Classes & Interactive Sessions */}
            <LiveMeetingsSection
              title="Live Classes & Office Hours"
              subtitle="Join real-time lecture office hours, webinars, and interactive sessions"
              showCreateButton={false}
            />

            {/* A. Continue Learning Section (Dynamic & Empty State) */}
            <ContinueLearning
              courses={enrolledCourses}
              loading={false}
            />

            {/* B. Interactive Daily Planner */}
            <DailyPlanner
              tasks={dailyTasks}
              completedCount={completedTasksCount}
              onTaskClick={handleTaskClick}
            />

            {/* C. Subject Mastery Radar */}
            <SubjectMastery enrolledCourses={enrolledCourses} />

            {/* D. Recent Learning Activity */}
            <RecentActivity activities={recentActivity} />

          </div>

          {/* Right Column Widgets */}
          <motion.div {...fadeUp(0.15)} className="space-y-5">

            {/* AITutor Contextual Card */}
            <AITutorCard enrolledCourses={enrolledCourses} />

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
                  className="text-xs text-[#4F7DF6] font-semibold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {loadingLeaderboard ? (
                  [1, 2, 3].map((i) => (
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
                        u.name === currentUserName ? 'bg-[#EEF4FF] border border-[#4F7DF6]/20' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-[#94A3B8] w-5 text-center">#{u.rank}</span>
                      <Avatar src={u.avatar} alt={u.name} size="xs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1E293B] truncate">{u.name}</p>
                        <p className="text-[10px] text-[#94A3B8] truncate">{u.institution || 'StudyVerse Scholar'}</p>
                      </div>
                      <span className="text-xs font-bold text-[#4F7DF6]">{(u.xp || 0).toLocaleString()} XP</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#64748B] text-xs">
                    No leaderboard data available yet
                  </div>
                )}
              </div>
            </Card>

            {/* Recommended Featured Educators - Real API */}
            <Card className="space-y-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#4F7DF6]" /> Featured Educators
                </h4>
                <button
                  onClick={() => navigate('/explore')}
                  className="text-xs text-[#4F7DF6] font-semibold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {loadingEducators ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-2 w-20 bg-slate-200 rounded" />
                      </div>
                      <div className="w-20 h-6 bg-slate-200 rounded" />
                    </div>
                  ))
                ) : educators.length > 0 ? (
                  educators.map((t) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <Avatar src={t.avatar} alt={t.name} size="sm" verified={t.verified} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1E293B] truncate">{t.name}</p>
                        <p className="text-[11px] text-[#94A3B8] truncate">{t.subject} · {t.followers} followers</p>
                      </div>
                      <Button variant="outline" size="xs" onClick={() => navigate(`/messages/${t.id}`)}>
                        Contact
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#64748B] text-xs">
                    No educators available yet
                  </div>
                )}
              </div>
            </Card>

            {/* Study Session Tracker - Real-time active tracker */}
            <StudySessionTracker onSessionCompleted={refreshDashboard} />

          </motion.div>

        </div>

      </div>

      {selectedQuizId && (
        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          quizId={selectedQuizId}
          onQuizCompleted={() => {
            refreshDashboard();
          }}
        />
      )}
    </AppLayout>
  );
}