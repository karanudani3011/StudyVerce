import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  Flag,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../config/api';

export function AdminLayout({ children }) {
  const { user, logout, activeTab, setActiveTab } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [badgeCounts, setBadgeCounts] = useState({ applications: 0, reports: 0 });

  // Fetch live pending badge counts every 30s
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await apiGet('/admin/stats');
        setBadgeCounts({
          applications: data.stats?.pendingApplications || 0,
          reports: data.stats?.pendingReports || 0,
        });
      } catch { /* silent fail */ }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const NAV_ITEMS = [
    { id: 'admin-dashboard', path: '/admin/dashboard', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'admin-users', path: '/admin/users', label: 'All Student Users', icon: Users, badge: 'Field' },
    { id: 'admin-faculty', path: '/admin/faculty', label: 'All Faculty & Tutors', icon: GraduationCap, badge: 'Field' },
    { id: 'admin-verifications', path: '/admin/verifications', label: 'Tutor Applications', icon: ShieldCheck, liveCount: badgeCounts.applications },
    { id: 'admin-reports', path: '/admin/reports', label: 'Flagged Content', icon: Flag, liveCount: badgeCounts.reports },
  ];

  const handleNav = (item) => {
    if (setActiveTab) setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-[#060D17] text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Ambient Glow Blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ─── Cyber Admin Sidebar ─── */}
      <aside className="w-68 bg-[#0B1522]/90 border-r border-[#1E293B]/80 backdrop-blur-2xl flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen z-20 shadow-2xl">
        {/* Brand Header */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/25">
              <div className="w-full h-full bg-[#0B1522] rounded-[14px] flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-white tracking-tight">StudyVerse</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-black text-emerald-400 uppercase tracking-wide">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wide">Cyber Control Center</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

          {/* Navigation */}
          <nav className="space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-black text-emerald-400/80 tracking-widest uppercase">
              Management Fields
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id || location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40 translate-x-1'
                      : 'text-slate-400 hover:text-white hover:bg-[#132235]/80 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {/* Live pending count badge */}
                  {item.liveCount > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px] text-center ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.id === 'admin-reports'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.liveCount}
                    </span>
                  )}
                  {/* Static label badge */}
                  {item.badge && !item.liveCount && !isActive && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#132235] text-emerald-300 border border-emerald-900/60 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-[#1E293B]/80 space-y-3 bg-[#08101C]/60">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0F1B2B] border border-[#1E293B]">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'Admin'}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-white truncate">{user?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-emerald-400 font-mono font-semibold">ID: {user?.adminId || 'admin'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { if (setActiveTab) setActiveTab('dashboard'); navigate('/dashboard'); }}
              className="py-2 px-3 rounded-xl bg-[#132235] hover:bg-[#1C2F47] border border-[#1E293B] text-slate-300 hover:text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> App
            </button>
            <button
              onClick={() => { logout(); if (setActiveTab) setActiveTab('admin-login'); navigate('/admin/login'); }}
              className="py-2 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 text-rose-300 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Mobile Header ─── */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="bg-[#0B1522]/95 backdrop-blur-md border-b border-[#1E293B] px-4 py-3 md:hidden flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">Admin Center</span>
          </div>
          <div className="flex items-center gap-1.5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={`relative p-2 rounded-xl text-xs font-bold ${activeTab === item.id || location.pathname === item.path ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-[#132235]'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.liveCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {item.liveCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 bg-[#060D17] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
