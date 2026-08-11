import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Users,
  BookOpen,
  Bookmark,
  Award,
  Trophy,
  Bot,
  PlusCircle,
  Settings,
  Sparkles,
  LogOut,
  Flame,
  Newspaper
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

export const Sidebar = () => {
  const { activeTab, setActiveTab, user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feed', label: 'Feed', icon: Newspaper, badge: 'Live' },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'community', label: 'Communities', icon: Users },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, isAi: true },
    { id: 'upload', label: 'Upload Notes', icon: PlusCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-[#E2E8F0] p-4 justify-between z-30">
      <div className="space-y-6">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6] group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1E293B] leading-none tracking-tight">
              StudyVerse
            </h1>
            <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase">
              Educational Platform
            </span>
          </div>
        </div>

        {/* Learning Streak Widget */}
        <div className="mx-1 p-3.5 rounded-[16px] bg-[#F5F7FB] border border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-[#F59E0B] rounded-[10px] border border-amber-200/60">
              <Flame className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1E293B]">
                {user.streak} Day Streak
              </div>
              <div className="text-[11px] text-[#64748B]">
                Daily habit active
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#4F7DF6] bg-white px-2 py-0.5 rounded-[8px] border border-[#E2E8F0]">
            +{user.xp}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EEF4FF] text-[#4F7DF6]'
                    : item.isAi
                    ? 'text-[#8B5CF6] hover:bg-purple-50'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F5F7FB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-[#4F7DF6]' : item.isAi ? 'text-[#8B5CF6]' : 'text-[#64748B]'}`}
                    strokeWidth={2}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-[#4F7DF6]' : 'bg-emerald-50 text-[#22C55E] border border-emerald-200/60'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile bottom bar */}
      <div className="pt-3 border-t border-[#EDF2F7] space-y-1">
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 p-2 rounded-[14px] hover:bg-[#F5F7FB] cursor-pointer transition-colors"
        >
          <Avatar src={user.avatar} alt={user.name} size="md" verified />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#1E293B] truncate">
              {user.name}
            </h4>
            <p className="text-[11px] text-[#64748B] truncate">
              {user.username}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#EF4444] hover:bg-rose-50 rounded-[12px] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
