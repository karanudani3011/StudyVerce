import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Users,
  BookOpen,
  Award,
  Trophy,
  Bot,
  PlusCircle,
  Settings,
  Sparkles,
  LogOut,
  Flame,
  Newspaper,
  GraduationCap,
  BarChart3,
  Shield,
  CheckCircle2,
  Flag,
  FileEdit,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

const getMenuItems = (role) => {
  if (role === 'admin') {
    return [
      { id: 'admin-dashboard', label: 'Admin Control', icon: Shield, isAdmin: true },
      { id: 'admin-verifications', label: 'Verifications', icon: CheckCircle2, isAdmin: true, badge: 'Review' },
      { id: 'admin-reports', label: 'Flagged Content', icon: Flag, isAdmin: true },
      { id: 'feed', label: 'Feed', icon: Newspaper },
      { id: 'explore', label: 'Explore', icon: Compass },
      { id: 'community', label: 'Communities', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  if (role === 'tutor' || role === 'faculty') {
    return [
      { id: 'tutor-dashboard', label: 'Faculty Studio', icon: GraduationCap, isTutor: true },
      { id: 'courses', label: 'My Courses', icon: BookOpen },
      { id: 'explore', label: 'Lecture Notes Vault', icon: Compass },
      { id: 'community', label: 'My Communities', icon: Users },
      { id: 'messages', label: 'Student Messages', icon: MessageSquare, badge: '3' },
      { id: 'tutor-analytics', label: 'Revenue & Analytics', icon: BarChart3, isTutor: true },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  // Default: student
  return [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feed', label: 'Home Feed', icon: Newspaper, badge: 'Live' },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'community', label: 'Communities', icon: Users },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, isAi: true },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '3' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'upload', label: 'Upload Note', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
};

export const Sidebar = () => {
  const { activeTab, setActiveTab, user, logout } = useAuth();

  const menuItems = getMenuItems(user?.role);
  const isTutorUser = user?.role === 'tutor' || user?.role === 'faculty';

  return (
    <aside className="w-64 hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-[#E2E8F0] p-4 justify-between z-30">
      <div className="space-y-6">
        {/* Logo */}
        <div
          onClick={() => setActiveTab(isTutorUser ? 'tutor-dashboard' : 'landing')}
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
              {isTutorUser ? 'Faculty Portal' : 'Educational Platform'}
            </span>
          </div>
        </div>

        {/* Status / Streak Widget */}
        <div className="mx-1 p-3.5 rounded-[16px] bg-[#F5F7FB] border border-[#E2E8F0] flex items-center justify-between">
          {isTutorUser ? (
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-[10px] border border-amber-200/60">
                <GraduationCap className="w-4 h-4" strokeWidth={2} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1E293B]">Faculty Member</div>
                <div className="text-[11px] font-bold text-emerald-600">✓ Verified Educator</div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-[#F59E0B] rounded-[10px] border border-amber-200/60">
                  <Flame className="w-4 h-4" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E293B]">
                    {user?.streak || 1} Day Streak
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Daily habit active
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4F7DF6] bg-white px-2 py-0.5 rounded-[8px] border border-[#E2E8F0]">
                +{user?.xp || 0}
              </span>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 overflow-y-auto max-h-[50vh]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const itemColor = isActive
              ? 'bg-[#EEF4FF] text-[#4F7DF6]'
              : item.isAdmin
              ? 'text-slate-700 hover:bg-slate-100 hover:text-[#1E293B]'
              : item.isTutor
              ? 'text-amber-700 hover:bg-amber-50'
              : item.isAi
              ? 'text-[#8B5CF6] hover:bg-purple-50'
              : item.isApply
              ? 'text-emerald-600 hover:bg-emerald-50'
              : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F5F7FB]';
            const iconColor = isActive
              ? 'text-[#4F7DF6]'
              : item.isAdmin ? 'text-slate-600'
              : item.isTutor ? 'text-amber-600'
              : item.isAi ? 'text-[#8B5CF6]'
              : item.isApply ? 'text-emerald-500'
              : 'text-[#64748B]';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-xs sm:text-sm font-semibold transition-all cursor-pointer ${itemColor}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-[#4F7DF6]'
                    : item.isAdmin ? 'bg-slate-800 text-slate-200'
                    : 'bg-emerald-50 text-[#22C55E] border border-emerald-200/60'
                  }`}>
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
            <div className="flex items-center gap-1.5 mt-0.5">
              {user?.role === 'admin' && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-slate-200 text-[9px] font-extrabold">🛡️ ADMIN</span>
              )}
              {(user?.role === 'tutor' || user?.role === 'faculty') && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-extrabold">👨‍🏫 TUTOR</span>
              )}
              <p className="text-[11px] text-[#64748B] truncate">{user.username}</p>
            </div>
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
