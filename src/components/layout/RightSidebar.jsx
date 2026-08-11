import React from 'react';
import { Trophy, Calendar, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { MOCK_TEACHERS } from '../../data/mockData';

export const RightSidebar = () => {
  const { user, setActiveTab } = useAuth();

  return (
    <aside className="w-80 hidden lg:block h-screen sticky top-0 border-l border-[#E2E8F0] p-6 overflow-y-auto space-y-6 z-10 bg-white">
      {/* Daily Study Goal Card */}
      <Card className="relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#EEF4FF] text-[#4F7DF6] rounded-[10px]">
              <Trophy className="w-4 h-4" strokeWidth={2} />
            </div>
            <h4 className="text-sm font-bold text-[#1E293B]">Daily Study Goal</h4>
          </div>
          <span className="text-xs font-semibold text-[#4F7DF6]">
            {user.currentGoalMinutes}/{user.dailyGoalMinutes} mins
          </span>
        </div>
        <Progress value={user.currentGoalMinutes} max={user.dailyGoalMinutes} color="bg-[#4F7DF6]" size="sm" />
        <p className="text-xs text-[#64748B]">
          Almost there! 7 mins remaining to complete today's streak badge.
        </p>
      </Card>

      {/* Upcoming Challenge Banner */}
      <div className="rounded-[20px] p-5 bg-[#EEF4FF] border border-[#E2E8F0] text-[#1E293B] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F7DF6]">
          <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Live Challenge</span>
        </div>
        <h4 className="text-base font-bold text-[#1E293B]">Weekly Quantum Physics Quiz</h4>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Compete against 1,200+ students & earn +500 Bonus XP.
        </p>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => setActiveTab('feed')}
        >
          Join Quiz Room
        </Button>
      </div>

      {/* Featured Teachers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1E293B]">Featured Teachers</h4>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1"
          >
            See All <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-2">
          {MOCK_TEACHERS.map((teacher, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-[14px] hover:bg-[#F5F7FB] transition-colors border border-transparent hover:border-[#E2E8F0]"
            >
              <div className="flex items-center gap-3">
                <Avatar src={teacher.avatar} alt={teacher.name} size="sm" verified />
                <div>
                  <h5 className="text-xs font-bold text-[#1E293B] leading-tight">
                    {teacher.name}
                  </h5>
                  <p className="text-[11px] text-[#64748B]">
                    {teacher.followers} followers
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="px-2.5 py-1 text-xs">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-[#1E293B]">Trending Topics</h4>
        <div className="flex flex-wrap gap-2">
          {['#MachineLearning', '#QuantumComputing', '#UPSC2026', '#SystemDesign', '#React19', '#NeetPrep'].map((tag, i) => (
            <button
              key={i}
              onClick={() => setActiveTab('search')}
              className="px-3 py-1.5 rounded-[10px] text-xs font-semibold bg-[#F5F7FB] hover:bg-[#EEF4FF] text-[#64748B] hover:text-[#4F7DF6] transition-colors cursor-pointer border border-[#E2E8F0]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
