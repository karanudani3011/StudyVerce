import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Zap, Clock, Target, TrendingUp, ArrowRight, Sparkles, BookOpen, Trophy, Bot } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge, Progress } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../config/api';
import { MOCK_COURSES, MOCK_FEED_POSTS, MOCK_LEADERBOARD, MOCK_TEACHERS } from '../../data/mockData';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } }
});

const StatCard = ({ title, value, desc, icon: Icon, iconColor, iconBg, trend }) => (
  <Card hover className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-[#64748B]">{title}</span>
      <div className={`p-2 rounded-[12px] ${iconBg} border border-[#E2E8F0]`}><Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} /></div>
    </div>
    <div className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">{value}</div>
    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
      <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" strokeWidth={2} />{desc}
    </div>
  </Card>
);

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [dashStats, setDashStats] = useState(null);

  // Fetch live dashboard stats from backend
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

  const s = dashStats || user;

  const stats = [
    { title: 'Current Streak', value: `${s.streak} Days`, desc: 'Personal best: 21 days', icon: Flame, iconColor: 'text-[#F59E0B]', iconBg: 'bg-amber-50' },
    { title: 'Total XP Earned', value: (s.xp || 0).toLocaleString(), desc: 'Top 5% globally', icon: Zap, iconColor: 'text-[#4F7DF6]', iconBg: 'bg-[#EEF4FF]' },
    { title: 'Study Time', value: s.studyHours || '32.5 hrs', desc: 'This week', icon: Clock, iconColor: 'text-[#8B5CF6]', iconBg: 'bg-purple-50' },
    { title: 'Daily Goal', value: `${Math.round(((s.currentGoalMinutes || 45) / (s.dailyGoalMinutes || 60)) * 100)}%`, desc: `${s.currentGoalMinutes || 45}/${s.dailyGoalMinutes || 60} mins`, icon: Target, iconColor: 'text-[#22C55E]', iconBg: 'bg-emerald-50' },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
        {/* Greeting Banner */}
        <motion.div {...fadeUp()} className="bg-white rounded-[20px] border border-[#E2E8F0] card-shadow p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#4F7DF6]">{greeting}, {user.name.split(' ')[0]}! 👋</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Your Learning Dashboard</h1>
            <p className="text-sm text-[#64748B]">
              You've completed <span className="font-bold text-[#1E293B]">{Math.round((user.currentGoalMinutes / user.dailyGoalMinutes) * 100)}%</span> of today's goal. Keep the streak going!
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="ghost" icon={BookOpen} onClick={() => navigate('/my-learning')}>My Learning</Button>
            <Button variant="primary" icon={Sparkles} iconRight={ArrowRight} onClick={() => navigate('/feed')}>Resume Feed</Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <motion.div {...fadeUp(0.1)} className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1E293B]">Continue Learning</h2>
              <Link to="/courses" className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} /></Link>
            </div>
            <div className="space-y-4">
              {MOCK_COURSES.map(course => (
                <Card key={course.id} hover onClick={() => navigate(`/courses/${course.id}`)} className="flex gap-4 items-center">
                  <img src={course.image} alt={course.title} className="w-20 h-16 rounded-[14px] object-cover border border-[#E2E8F0] shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="primary" size="sm">{course.tags[0]}</Badge>
                      <span className="text-xs text-[#94A3B8]">{course.lessons} lessons</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1E293B] line-clamp-1">{course.title}</h3>
                    <Progress value={course.progress} size="sm" showLabel />
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div {...fadeUp(0.15)} className="space-y-5">
            {/* Daily Goal Card */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#EEF4FF] text-[#4F7DF6] rounded-[10px]"><Target className="w-4 h-4" strokeWidth={2} /></div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Daily Study Goal</h4>
                </div>
                <span className="text-xs font-semibold text-[#4F7DF6]">{user.currentGoalMinutes}/{user.dailyGoalMinutes} min</span>
              </div>
              <Progress value={user.currentGoalMinutes} max={user.dailyGoalMinutes} showLabel size="md" />
              <p className="text-xs text-[#64748B]">Only {user.dailyGoalMinutes - user.currentGoalMinutes} minutes left to hit your daily goal and keep the streak! 🔥</p>
            </Card>

            {/* AI Tutor Widget */}
            <Card className="space-y-3 border-l-4 border-l-[#8B5CF6]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 text-[#8B5CF6] rounded-[10px]"><Bot className="w-4 h-4" strokeWidth={2} /></div>
                  <h4 className="text-sm font-bold text-[#1E293B]">AI Tutor</h4>
                </div>
                <Badge variant="accent" size="sm">GPT-4o</Badge>
              </div>
              <p className="text-xs text-[#64748B]">Ask me anything — formulas, code, essay outlines, or generate flashcards instantly.</p>
              <Button variant="accent" size="sm" fullWidth icon={Bot} onClick={() => navigate('/ai-tutor')}>Open AI Tutor</Button>
            </Card>

            {/* Mini Leaderboard */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-[#F59E0B] rounded-[10px]"><Trophy className="w-4 h-4" strokeWidth={2} /></div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Global Leaderboard</h4>
                </div>
                <Link to="/leaderboard" className="text-xs text-[#4F7DF6] font-semibold hover:underline">See all</Link>
              </div>
              <div className="space-y-2">
                {MOCK_LEADERBOARD.slice(0, 4).map((u, i) => (
                  <div key={u.rank} className={`flex items-center gap-3 p-2 rounded-[12px] ${u.name === user.name ? 'bg-[#EEF4FF]' : 'hover:bg-[#F8FAFC]'}`}>
                    <span className="text-xs font-extrabold text-[#94A3B8] w-5">#{u.rank}</span>
                    <Avatar src={u.avatar} alt={u.name} size="xs" />
                    <span className="text-xs font-semibold text-[#1E293B] flex-1 truncate">{u.name}</span>
                    <span className="text-xs font-bold text-[#4F7DF6]">{u.xp.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Teachers */}
            <Card className="space-y-3">
              <h4 className="text-sm font-bold text-[#1E293B]">Top Teachers</h4>
              <div className="space-y-3">
                {MOCK_TEACHERS.map(t => (
                  <div key={t.id} className="flex items-center gap-3">
                    <Avatar src={t.avatar} alt={t.name} size="sm" verified={t.verified} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate">{t.name}</p>
                      <p className="text-[11px] text-[#94A3B8]">{t.followers} followers</p>
                    </div>
                    <Button variant="outline" size="xs">Follow</Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Feed Highlight */}
        <motion.div {...fadeUp(0.2)} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1E293B]">Recent Educational Content</h2>
            <Link to="/feed" className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1">View Feed <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} /></Link>
          </div>
          <Card hover onClick={() => navigate('/feed')} className="flex flex-col md:flex-row gap-5 items-start md:items-center">
            <img src={MOCK_FEED_POSTS[0].image} alt="" className="w-full md:w-56 h-36 object-cover rounded-[14px] border border-[#E2E8F0]" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary">{MOCK_FEED_POSTS[0].subject}</Badge>
                <span className="text-xs text-[#94A3B8]">by {MOCK_FEED_POSTS[0].teacher.name} · {MOCK_FEED_POSTS[0].timestamp}</span>
              </div>
              <h3 className="text-base font-bold text-[#1E293B]">{MOCK_FEED_POSTS[0].caption}</h3>
              <p className="text-sm text-[#64748B] line-clamp-2">{MOCK_FEED_POSTS[0].explanation}</p>
              <div className="flex gap-2 pt-1">
                <Button variant="primary" size="sm" onClick={e => { e.stopPropagation(); navigate('/feed'); }}>Read Explanation</Button>
                <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); navigate('/ai-tutor'); }}>Ask AI Tutor</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
