import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Search, Bell, Menu, X, LayoutDashboard,
  Newspaper, Compass, Users, Bot, PlusCircle, Trophy,
  MessageSquare, User, Settings, LogOut, Flame, Zap,
  BookOpen, ChevronDown, Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar, Badge } from '../ui/index.jsx';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

// ─── SIDEBAR NAV ITEMS ───────────────────────────────────────────────────────
const sidebarNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/feed', label: 'Home Feed', icon: Newspaper, badge: 'Live' },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/ai-tutor', label: 'AI Tutor', icon: Bot, isAi: true },
  { to: '/messages', label: 'Messages', icon: MessageSquare, badgeCount: 3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/upload/image', label: 'Upload Note', icon: PlusCircle },
];

const sidebarBottom = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
export const Sidebar = ({ mobile = false, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const NavItem = ({ to, label, icon: Icon, badge, badgeCount, isAi }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link to={to} onClick={mobile ? onClose : undefined}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-sm font-medium transition-all group ${
          isActive ? 'bg-[#EEF4FF] text-[#4F7DF6]' : isAi ? 'text-[#8B5CF6] hover:bg-purple-50' : 'text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#1E293B]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F7DF6]' : isAi ? 'text-[#8B5CF6]' : 'text-[#94A3B8] group-hover:text-[#64748B]'}`} strokeWidth={2} />
          <span>{label}</span>
        </div>
        {badge && <span className="text-[10px] font-bold bg-emerald-50 text-[#22C55E] px-2 py-0.5 rounded-full">{badge}</span>}
        {badgeCount > 0 && <span className="text-[10px] font-bold bg-[#4F7DF6] text-white w-5 h-5 rounded-full flex items-center justify-center">{badgeCount}</span>}
      </Link>
    );
  };

  return (
    <aside className={`${mobile ? 'w-full' : 'w-64'} flex flex-col h-full bg-white border-r border-[#E2E8F0] p-4`}>
      {/* Logo */}
      <div onClick={() => { navigate('/'); if (mobile && onClose) onClose(); }}
        className="flex items-center gap-3 px-2 py-3 mb-4 cursor-pointer group">
        <div className="w-9 h-9 rounded-[14px] bg-[#EEF4FF] flex items-center justify-center text-[#4F7DF6] group-hover:scale-105 transition-transform border border-[#E2E8F0]">
          <Sparkles className="w-5 h-5" strokeWidth={2} />
        </div>
        <div>
          <span className="text-lg font-bold text-[#1E293B] leading-none block">StudyVerse</span>
          <span className="text-[10px] font-semibold text-[#94A3B8] tracking-wider uppercase">Educational Platform</span>
        </div>
        {mobile && <button onClick={onClose} className="ml-auto p-1 text-[#94A3B8]"><X className="w-5 h-5" strokeWidth={2} /></button>}
      </div>

      {/* Streak widget */}
      <div className="mx-1 mb-4 p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-[#F59E0B] rounded-[10px] border border-amber-100">
            <Flame className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1E293B]">{user.streak} Day Streak</div>
            <div className="text-[10px] text-[#94A3B8]">Keep it up!</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#4F7DF6] bg-[#EEF4FF] px-2 py-0.5 rounded-full">
          <Zap className="w-3 h-3" strokeWidth={2} /> {user.xp}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto no-scrollbar">
        {sidebarNav.map(item => <NavItem key={item.to} {...item} />)}
        <div className="border-t border-[#EDF2F7] my-3" />
        {sidebarBottom.map(item => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* User Row */}
      <div className="pt-3 border-t border-[#EDF2F7] mt-2 space-y-1">
        <Link to="/profile" onClick={mobile ? onClose : undefined}
          className="flex items-center gap-3 p-2.5 rounded-[14px] hover:bg-[#F5F7FB] transition-colors cursor-pointer">
          <Avatar src={user.avatar} alt={user.name} size="sm" verified />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#1E293B] truncate">{user.name}</div>
            <div className="text-[11px] text-[#94A3B8] truncate">{user.username}</div>
          </div>
        </Link>
        <button onClick={() => { logout(); navigate('/'); if (mobile && onClose) onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs font-medium text-[#64748B] hover:bg-rose-50 hover:text-[#EF4444] transition-colors cursor-pointer">
          <LogOut className="w-3.5 h-3.5" strokeWidth={2} /> Log Out
        </button>
      </div>
    </aside>
  );
};

// ─── TOP HEADER ──────────────────────────────────────────────────────────────
export const TopHeader = ({ onMenuToggle }) => {
  const { user, searchQuery, setSearchQuery, notificationsCount, setNotificationsCount } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-20 glass-nav border-b border-[#E2E8F0] px-4 sm:px-6 h-16 flex items-center gap-4">
      <button onClick={onMenuToggle} className="md:hidden p-2 text-[#64748B] hover:bg-[#F5F7FB] rounded-[12px]">
        <Menu className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" strokeWidth={2} />
        <input type="text" placeholder="Search subjects, courses, teachers..."
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white pl-10 pr-10 py-2.5 rounded-[14px] text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/15 transition-all"
        />
        <button type="button" onClick={() => navigate('/search')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
          <Filter className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </form>

      <div className="ml-auto flex items-center gap-2">
        {/* AI tutor shortcut */}
        <button onClick={() => navigate('/ai-tutor')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-[12px] bg-purple-50 text-[#8B5CF6] text-xs font-semibold hover:bg-purple-100 transition-colors border border-purple-100 cursor-pointer">
          <Bot className="w-3.5 h-3.5" strokeWidth={2} /> AI Tutor
        </button>

        {/* Notifications */}
        <div ref={ref} className="relative">
          <button onClick={() => { setShowNotif(v => !v); setNotificationsCount(0); }}
            className="relative p-2.5 rounded-full bg-[#F5F7FB] hover:bg-[#EEF4FF] text-[#64748B] hover:text-[#4F7DF6] border border-[#E2E8F0] transition-colors cursor-pointer">
            <Bell className="w-4 h-4" strokeWidth={2} />
            {notificationsCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full ring-2 ring-white" />}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-[20px] border border-[#E2E8F0] card-shadow z-50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EDF2F7]">
                  <h4 className="text-sm font-bold text-[#1E293B]">Notifications</h4>
                  <button onClick={() => { navigate('/notifications'); setShowNotif(false); }} className="text-xs font-semibold text-[#4F7DF6] hover:underline">View All</button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#EDF2F7]">
                  {MOCK_NOTIFICATIONS.slice(0, 4).map(n => (
                    <div key={n.id} onClick={() => { navigate('/notifications'); setShowNotif(false); }}
                      className="flex gap-3 px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                      <span className="text-xl shrink-0">{n.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1E293B] truncate">{n.title}</p>
                        <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-[#94A3B8]">{n.time}</span>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-[#4F7DF6] rounded-full mt-1 shrink-0" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <button onClick={() => navigate('/profile')} className="cursor-pointer hover:opacity-85 transition-opacity">
          <Avatar src={user.avatar} alt={user.name} size="sm" verified />
        </button>
      </div>
    </header>
  );
};

// ─── APP LAYOUT ──────────────────────────────────────────────────────────────
export const AppLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-40 bg-[#1E293B]/30 backdrop-blur-sm md:hidden" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
              <Sidebar mobile onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopHeader onMenuToggle={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── MOBILE BOTTOM NAV ───────────────────────────────────────────────────────
export const MobileBottomNav = () => {
  const location = useLocation();
  const items = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/feed', icon: Newspaper, label: 'Feed' },
    { to: '/ai-tutor', icon: Bot, label: 'AI', special: true },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];
  const isApp = !['/', '/login', '/register', '/forgot-password', '/otp', '/reset-password'].includes(location.pathname);
  if (!isApp) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-nav border-t border-[#E2E8F0] px-2 py-2 flex items-center justify-around">
      {items.map(item => {
        const isActive = location.pathname.startsWith(item.to);
        const Icon = item.icon;
        if (item.special) return (
          <Link key={item.to} to={item.to} className="flex flex-col items-center -mt-5">
            <div className="w-12 h-12 rounded-full bg-[#4F7DF6] flex items-center justify-center text-white shadow-lg">
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold text-[#4F7DF6] mt-1">{item.label}</span>
          </Link>
        );
        return (
          <Link key={item.to} to={item.to} className={`flex flex-col items-center px-3 py-1.5 rounded-[10px] transition-colors ${isActive ? 'text-[#4F7DF6]' : 'text-[#94A3B8]'}`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
