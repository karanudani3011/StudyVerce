import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Bot, PlusCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const DashboardHero = ({
  user,
  stats = {},
  taskProgressPercent = 0,
  hasTasks = true,
}) => {
  const navigate = useNavigate();

  // Calculate local time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const userName = user?.name ? user.name.split(' ')[0] : 'Student';
  const streak = Number(stats?.streak ?? user?.streak ?? 0);
  const currentGoalMinutes = Number(stats?.currentGoalMinutes ?? 0);
  const dailyGoalMinutes = Number(stats?.dailyGoalMinutes ?? 60);

  // Calculate daily goal percentage clamped between 0 and 100
  const dailyGoalPercent = dailyGoalMinutes > 0
    ? Math.min(100, Math.max(0, Math.round((currentGoalMinutes / dailyGoalMinutes) * 100)))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
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
            <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
              streak > 0
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
                : 'bg-slate-700/50 border-slate-600 text-slate-300'
            }`}>
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'fill-current text-amber-400' : 'text-slate-400'}`} />
              {streak > 0 ? `${streak} Day Streak Active` : 'Start Your Learning Streak'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back to your <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent">Study Dashboard</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {hasTasks ? (
              <>
                You've completed <span className="font-bold text-white">{taskProgressPercent}%</span> of today's study planner. Keep your learning momentum strong!
              </>
            ) : (
              'No study plan for today. Start learning by exploring your courses.'
            )}
          </p>

          {/* Progress Bar inside Hero */}
          <div className="space-y-1.5 max-w-md pt-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Daily Goal Tracker</span>
              <span>{currentGoalMinutes} / {dailyGoalMinutes} mins ({dailyGoalPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#4F7DF6] to-[#8B5CF6] rounded-full transition-all duration-500"
                style={{ width: `${dailyGoalPercent}%` }}
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
  );
};
