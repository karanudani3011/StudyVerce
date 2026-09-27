import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Avatar } from '../components/ui/Avatar';
import { apiGet } from '../config/api';

export const LeaderboardPage = () => {
  const [activeFilter, setActiveFilter] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'global', label: 'Global' },
    { id: 'college', label: 'College League' },
    { id: 'friends', label: 'Friends' },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiGet('/leaderboard?limit=50');
        if (res.success && res.data) {
          setLeaderboardData(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch leaderboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const safeData = loading ? [] : leaderboardData;
  const top3 = safeData.slice(0, 3);
  const remaining = safeData.slice(3);

  const podiumEntries = [
    top3[1] ? { ...top3[1], config: { label: '2nd', medal: '🥈', height: 'h-28 sm:h-36', ring: 'ring-slate-300', bg: 'bg-[#F5F7FB]', textColor: 'text-[#64748B]', delay: 0.1 } } : null,
    top3[0] ? { ...top3[0], config: { label: '1st', medal: '👑', height: 'h-36 sm:h-48', ring: 'ring-amber-400', bg: 'bg-[#EEF4FF]', textColor: 'text-[#4F7DF6]', delay: 0 } } : null,
    top3[2] ? { ...top3[2], config: { label: '3rd', medal: '🥉', height: 'h-24 sm:h-28', ring: 'ring-amber-600', bg: 'bg-[#F8FAFC]', textColor: 'text-[#94A3B8]', delay: 0.2 } } : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Global Leaderboard 🏆</h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">Compete by completing quizzes and maintaining daily streaks.</p>
            </div>
            <Tabs tabs={tabs} activeTab={activeFilter} onChange={setActiveFilter} variant="pills" />
          </div>

          {/* Podium */}
          <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end pt-6">
            {podiumEntries.map((entry, _idx) => {
              const { config, ...u } = entry;
              const isGold = u.rank === 1;
              return (
                <motion.div
                  key={u.rank}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: config.delay, duration: 0.25 }}
                  className={`flex flex-col items-center ${isGold ? '-mt-6' : ''}`}
                >
                  <div className="relative mb-2">
                    {isGold && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl">{config.medal}</span>}
                    <Avatar src={u.avatar} alt={u.name} size={isGold ? 'xl' : 'lg'} className={`ring-4 ${config.ring}`} />
                  </div>
                  <div className="text-center mb-2">
                    <h4 className={`text-xs sm:text-sm font-bold text-[#1E293B] ${isGold ? 'sm:text-base' : ''}`}>{u.name}</h4>
                    <span className={`text-[11px] font-bold ${config.textColor}`}>{(u.xp || 0).toLocaleString()} XP</span>
                  </div>
                  <div className={`w-full ${config.bg} border border-[#E2E8F0] ${config.height} rounded-t-[20px] flex items-center justify-center text-xl sm:text-2xl font-extrabold text-[#64748B] shadow-[0_-4px_10px_rgba(15,23,42,0.04)]`}>
                    {!isGold && config.medal} {config.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rankings List */}
          <div className="space-y-3">
            {remaining.map((u) => (
              <Card key={u.rank} hover className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <span className="w-7 text-center text-sm font-extrabold text-[#94A3B8]">#{u.rank}</span>
                  <Avatar src={u.avatar} alt={u.name} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1E293B]">{u.name}</h4>
                    <p className="text-xs text-[#64748B]">{u.badge} · {u.streak} Day Streak 🔥</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#4F7DF6]">{(u.xp || 0).toLocaleString()} XP</span>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};
