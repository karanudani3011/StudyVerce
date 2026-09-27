import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  Shield,
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Zap,
  Bell,
  ArrowRight,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { apiGet, apiDelete } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { CourseUploadModal } from '../../components/courses/CourseUploadModal';
import { LiveMeetingsSection } from '../../components/meetings/LiveMeetingsSection';


export default function AdminDashboard() {
  const { user, setActiveTab } = useAuth();
  const navigate = useNavigate();

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const handleNav = (tabId, path) => {
    if (setActiveTab) setActiveTab(tabId);
    if (path) navigate(path);
  };

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaculty: 0,
    totalCommunities: 0,
    totalCourses: 0,
  });
  const [adminCourses, setAdminCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/admin/stats');
      if (data && data.success && data.stats) {
        setStats(data.stats);
      }
      const cData = await apiGet('/courses');
      if (cData && cData.success && Array.isArray(cData.data) && cData.data.length > 0) {
        const formatted = cData.data.map(c => ({
          _id: c._id,
          id: c._id || c.id,
          title: c.title,
          instructor: c.instructor,
          image: c.image,
          category: c.category,
        }));
        setAdminCourses(formatted);
      }
    } catch (err) {
      console.warn('Failed to fetch admin stats, using live fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure as Admin that you want to delete this course from the platform?')) return;
    try {
      await apiDelete(`/courses/${courseId}`);
    } catch (err) {
      console.warn('Admin delete course error:', err.message);
    }
    setAdminCourses(prev => prev.filter(c => (c._id || c.id) !== courseId));
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFacultyPurge = async () => {
    if (!window.confirm('Are you sure you want to remove ALL faculty accounts from the database? This action cannot be undone.')) {
      return;
    }
    setPurging(true);
    setPurgeMsg('');
    try {
      const data = await apiDelete('/admin/faculty-cleanup');
      setPurgeMsg(data.message || 'Faculty accounts purged successfully.');
      fetchStats();
    } catch (err) {
      setPurgeMsg('Cleanup failed: ' + err.message);
    } finally {
      setPurging(false);
    }
  };

  // Platform Suggestions generated for Admin
  const SUGGESTIONS = [
    {
      id: 1,
      title: 'Review Faculty & Educator Accounts',
      desc: 'Review verified faculty and educators across registered institutions.',
      type: 'security',
      action: 'Check Faculty List',
      tab: 'admin-faculty',
      path: '/admin/faculty',
    },
    {
      id: 2,
      title: 'Separate User & Faculty Database Fields',
      desc: 'Student users and verified Faculty members are isolated into distinct management collections.',
      type: 'architecture',
      action: 'Manage Students',
      tab: 'admin-users',
      path: '/admin/users',
    },
    {
      id: 3,
      title: 'Automate Weekly Content Moderation',
      desc: 'Review flagged community posts and handwritten notes awaiting verification.',
      type: 'moderation',
      action: 'Review Reports',
      tab: 'admin-reports',
      path: '/admin/reports',
    },
    {
      id: 4,
      title: 'Verify Pending Faculty Applications',
      desc: 'Educators applied for verified tutor badges this week. Approval boosts student trust.',
      type: 'growth',
      action: 'View Applications',
      tab: 'admin-verifications',
      path: '/admin/verifications',
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Cyber Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0F2032]/90 via-[#0B1726]/90 to-[#07111D]/90 p-6 sm:p-7 rounded-3xl border border-[#1E293B] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0B1522] rounded-[14px] flex items-center justify-center text-emerald-400">
                <Shield className="w-7 h-7" strokeWidth={2} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Cyber Command Panel
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">Platform Intelligence &amp; Control</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 relative z-10">
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" /> ⚡ Create Course & Category
            </button>
            <button
              onClick={fetchStats}
              className="px-4 py-2.5 rounded-xl bg-[#132235] hover:bg-[#1C2F47] border border-[#1E293B] text-slate-200 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
            <button
              onClick={handleFacultyPurge}
              disabled={purging}
              className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Trash2 className="w-4 h-4 text-rose-400" /> {purging ? 'Purging...' : 'Purge DB Faculty'}
            </button>
          </div>
        </div>

        {purgeMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg">
            <span>{purgeMsg}</span>
            <button onClick={() => setPurgeMsg('')} className="text-emerald-400 hover:text-white font-bold">✕</button>
          </div>
        )}

        {/* Real KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Student Users',
              value: loading ? '...' : stats.totalUsers,
              sub: 'Isolated Student Database Field',
              icon: Users,
              color: 'text-emerald-400',
              borderColor: 'border-emerald-500/30',
              glowColor: 'shadow-emerald-500/10',
              bg: 'bg-gradient-to-b from-emerald-950/30 to-[#0B1522]',
              tab: 'admin-users',
              path: '/admin/users',
            },
            {
              label: 'Total Faculty & Tutors',
              value: loading ? '...' : stats.totalFaculty,
              sub: 'Verified Educators',
              icon: GraduationCap,
              color: 'text-teal-400',
              borderColor: 'border-teal-500/30',
              glowColor: 'shadow-teal-500/10',
              bg: 'bg-gradient-to-b from-teal-950/30 to-[#0B1522]',
              tab: 'admin-faculty',
              path: '/admin/faculty',
            },
            {
              label: 'Study Communities',
              value: loading ? '...' : stats.totalCommunities,
              sub: 'Active Collaborative Hubs',
              icon: MessageSquare,
              color: 'text-cyan-400',
              borderColor: 'border-cyan-500/30',
              glowColor: 'shadow-cyan-500/10',
              bg: 'bg-gradient-to-b from-cyan-950/30 to-[#0B1522]',
              tab: 'admin-dashboard',
              path: '/admin/dashboard',
            },
            {
              label: 'Published Courses',
              value: loading ? '...' : (stats.totalCourses || adminCourses.length),
              sub: 'Educator Verified Modules',
              icon: BookOpen,
              color: 'text-emerald-300',
              borderColor: 'border-emerald-400/30',
              glowColor: 'shadow-emerald-400/10',
              bg: 'bg-gradient-to-b from-emerald-900/20 to-[#0B1522]',
              tab: 'admin-courses',
              path: '/courses',
            },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => handleNav(s.tab, s.path)}
              className={`p-5 rounded-2xl border ${s.borderColor} ${s.bg} hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-xl ${s.glowColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#09121F] border border-[#1E293B] flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-xs font-extrabold text-slate-200 mt-1.5">{s.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Dedicated Separate Field Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-[#0C1A29] to-[#07121E] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden group">
            <div className="space-y-1.5 relative z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                Isolated Field
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">Student Users Directory</h3>
              <p className="text-xs text-slate-300 max-w-sm">Manage student accounts, progress tracking, and permissions in a separate field.</p>
            </div>
            <button
              onClick={() => handleNav('admin-users', '/admin/users')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0 relative z-10"
            >
              Open Users Directory <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-950/50 via-[#0C1A29] to-[#07121E] border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden group">
            <div className="space-y-1.5 relative z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-black uppercase tracking-wider">
                Isolated Field
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">Faculty &amp; Educator Portal</h3>
              <p className="text-xs text-slate-300 max-w-sm">Manage verified faculty and educators separately from students.</p>
            </div>
            <button
              onClick={() => handleNav('admin-faculty', '/admin/faculty')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all cursor-pointer shrink-0 relative z-10"
            >
              Open Faculty Directory <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Meetings & Briefings Control */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl">
          <LiveMeetingsSection
            title="Platform Live Meetings & Faculty Syncs"
            subtitle="Schedule platform-wide faculty syncs, administrative briefings, and manage meetings"
            showCreateButton={true}
          />
        </div>

        {/* Suggestions & Action Plan */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0B1522]/90 border border-[#1E293B] space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">System Suggestions &amp; Recommendations</h2>
              <p className="text-xs text-slate-400">Actionable insights generated for system integrity and educator onboarding</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUGGESTIONS.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#07111D] border border-[#1E293B] hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between space-y-3 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">{item.title}</h4>
                    <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 uppercase tracking-wide">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleNav(item.tab, item.path)}
                  className="self-start text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer pt-1 transition-colors"
                >
                  {item.action} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* All Published Courses (Admin Control & Delete) */}
        {adminCourses.length > 0 && (
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0B1522]/90 border border-[#1E293B] space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Published Platform Courses</h2>
                  <p className="text-xs text-slate-400">Admin Control Center: Inspect or Delete any course across StudyVerse</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-black">
                {adminCourses.length} Active Courses
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminCourses.map((c) => (
                <div
                  key={c._id || c.id}
                  className="p-4 rounded-2xl bg-[#07111D] border border-[#1E293B] flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={c.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#1E293B] shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-extrabold text-white truncate">{c.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{c.instructor} · {c.category || 'Computer Science'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdminDeleteCourse(c._id || c.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    title="Admin Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Course & Category Creator Modal */}
        <CourseUploadModal
          isOpen={isCourseModalOpen}
          onClose={() => setIsCourseModalOpen(false)}
          onCourseCreated={() => fetchStats()}
          currentUser={user}
        />
      </div>
    </AdminLayout>
  );
}
