import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Zap,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { MOCK_COURSES, MOCK_FEED_POSTS } from '../data/mockData';

export const DashboardPage = () => {
  const { user, setActiveTab } = useAuth();

  const stats = [
    { title: 'Current Streak', value: `${user.streak} Days`, desc: 'Active daily habit', icon: Flame, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
    { title: 'Total XP Earned', value: `${user.xp.toLocaleString()} XP`, desc: 'Top 5% of students', icon: Zap, color: 'text-[#4F7DF6]', bg: 'bg-[#EEF4FF]' },
    { title: 'Study Time', value: '32.5 hrs', desc: 'This week total', icon: Clock, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
    { title: 'Daily Target Goal', value: '85%', desc: '53/60 mins completed', icon: Target, color: 'text-[#22C55E]', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          {/* Greeting Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#4F7DF6] uppercase tracking-wider">Student Dashboard</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                You have completed <span className="font-bold text-[#1E293B]">85%</span> of your daily target goal. Keep up the streak!
              </p>
            </div>
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={() => setActiveTab('feed')}
              className="shrink-0"
            >
              Resume Learning Feed
            </Button>
          </div>

          {/* Large Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} hover className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64748B]">{stat.title}</span>
                    <div className={`p-2 rounded-[12px] ${stat.bg} ${stat.color} border border-[#E2E8F0]`}>
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" strokeWidth={2} />
                    <span>{stat.desc}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Continue Learning Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E293B]">Continue Learning</h2>
              <button
                onClick={() => setActiveTab('explore')}
                className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1"
              >
                Browse All Courses <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_COURSES.map((course) => (
                <Card key={course.id} hover className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-[14px] border border-[#E2E8F0]"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4F7DF6]">{course.tags[0]}</span>
                      <span className="text-xs font-semibold text-[#64748B]">{course.duration}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1E293B] line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-[#64748B]">{course.instructor}</p>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-[#EDF2F7]">
                    <Progress value={course.progress} showPercent color="bg-[#4F7DF6]" size="sm" />
                    <Button variant="secondary" size="sm" fullWidth onClick={() => setActiveTab('feed')}>
                      Continue Course
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Educational Notes Highlight */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1E293B]">Recent Educational Breakdown</h2>
            <Card hover className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <img
                src={MOCK_FEED_POSTS[0].image}
                alt="Diagram"
                className="w-full md:w-64 h-40 object-cover rounded-[14px] border border-[#E2E8F0]"
              />
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-[8px] text-xs font-bold bg-[#EEF4FF] text-[#4F7DF6]">
                    {MOCK_FEED_POSTS[0].subject}
                  </span>
                  <span className="text-xs text-[#64748B]">by {MOCK_FEED_POSTS[0].teacher.name}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1E293B]">{MOCK_FEED_POSTS[0].caption}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2">{MOCK_FEED_POSTS[0].explanation}</p>
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="primary" size="sm" onClick={() => setActiveTab('feed')}>
                    Read Explanation
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('ai-tutor')}>
                    Ask AI Tutor
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <RightSidebar />
    </div>
  );
};
