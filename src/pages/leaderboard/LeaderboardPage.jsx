import React from 'react';
import { Trophy, Flame, Zap, Award } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge } from '../../components/ui/index.jsx';
import { MOCK_LEADERBOARD } from '../../data/mockData';

export default function LeaderboardPage() {
  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 pb-24 md:pb-8">
        <div className="text-center space-y-2">
          <Badge variant="warning" icon={Trophy}>Global Rankings</Badge>
          <h1 className="text-3xl font-extrabold text-[#1E293B]">StudyVerse Leaderboard</h1>
          <p className="text-sm text-[#64748B]">Compete with top scholars around the world based on XP & streaks.</p>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-3 gap-4 items-end max-w-lg mx-auto pt-4">
          {/* #2 */}
          <Card className="p-4 text-center space-y-2 border-2 border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-xs font-bold text-[#94A3B8]">#2</span>
            <Avatar src={top3[1].avatar} size="lg" className="mx-auto" />
            <h4 className="text-xs font-bold text-[#1E293B] truncate">{top3[1].name}</h4>
            <span className="text-xs font-extrabold text-[#4F7DF6]">{top3[1].xp.toLocaleString()} XP</span>
          </Card>
          {/* #1 */}
          <Card className="p-5 text-center space-y-2 border-2 border-[#F59E0B] bg-amber-50/40 -mt-6">
            <span className="text-sm font-bold text-[#F59E0B]">👑 #1</span>
            <Avatar src={top3[0].avatar} size="xl" className="mx-auto ring-4 ring-amber-400" />
            <h4 className="text-sm font-bold text-[#1E293B] truncate">{top3[0].name}</h4>
            <span className="text-sm font-extrabold text-[#F59E0B]">{top3[0].xp.toLocaleString()} XP</span>
          </Card>
          {/* #3 */}
          <Card className="p-4 text-center space-y-2 border-2 border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-xs font-bold text-[#94A3B8]">#3</span>
            <Avatar src={top3[2].avatar} size="lg" className="mx-auto" />
            <h4 className="text-xs font-bold text-[#1E293B] truncate">{top3[2].name}</h4>
            <span className="text-xs font-extrabold text-[#4F7DF6]">{top3[2].xp.toLocaleString()} XP</span>
          </Card>
        </div>

        {/* List */}
        <Card className="divide-y divide-[#EDF2F7] p-0">
          {MOCK_LEADERBOARD.map(u => (
            <div key={u.rank} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-extrabold text-[#94A3B8] w-6">#{u.rank}</span>
                <Avatar src={u.avatar} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">{u.name}</h4>
                  <p className="text-[10px] text-[#94A3B8]">{u.institution}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#F59E0B] font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {u.streak}d</span>
                <span className="text-xs font-extrabold text-[#4F7DF6]">{u.xp.toLocaleString()} XP</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </AppLayout>
  );
}
