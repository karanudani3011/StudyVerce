import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Clock, Target, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export const DashboardStats = ({ stats = {}, user = {} }) => {
  const streak = Number(stats?.streak ?? user?.streak ?? 0);
  const xp = Number(stats?.xp ?? user?.xp ?? 0);
  const studyTime = stats?.studyHours || stats?.studyThisWeek || stats?.studyToday || '0 min';
  const currentGoalMinutes = Number(stats?.currentGoalMinutes ?? 0);
  const dailyGoalMinutes = Number(stats?.dailyGoalMinutes ?? 60);
  
  const dailyGoalPercentage = dailyGoalMinutes > 0
    ? Math.min(100, Math.max(0, Math.round((currentGoalMinutes / dailyGoalMinutes) * 100)))
    : 0;

  const statCards = [
    {
      title: 'Current Streak',
      value: `${streak} Days`,
      desc: streak > 0 ? 'Active daily learning habit 🔥' : 'Start your daily habit 🔥',
      icon: Flame,
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    },
    {
      title: 'Total XP Earned',
      value: `${xp.toLocaleString()} XP`,
      desc: 'Track your learning journey ⚡',
      icon: Zap,
      color: 'text-[#4F7DF6]',
      bg: 'bg-[#4F7DF6]/10 border-[#4F7DF6]/20 text-[#4F7DF6]',
    },
    {
      title: 'Study Time',
      value: studyTime,
      desc: 'Time spent learning this week ⏱️',
      icon: Clock,
      color: 'text-[#8B5CF6]',
      bg: 'bg-purple-500/10 border-purple-500/20 text-[#8B5CF6]',
    },
    {
      title: 'Daily Target Goal',
      value: `${dailyGoalPercentage}%`,
      desc: `${currentGoalMinutes}/${dailyGoalMinutes} mins completed 🎯`,
      icon: Target,
      color: 'text-[#22C55E]',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05 } }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statCards.map((stat, idx) => {
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
  );
};
