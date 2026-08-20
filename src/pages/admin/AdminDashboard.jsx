import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  Shield, Users, BookOpen, Flag, TrendingUp, ToggleLeft, ToggleRight,
  Activity, CheckCircle2, Clock, AlertTriangle, Zap, Bell
} from 'lucide-react';

const MOCK_ACTIVITY = [
  { id: 1, action: 'New tutor application from Dr. Rahul Mehta', time: '5 mins ago', type: 'verify' },
  { id: 2, action: 'Post reported by student "alex_j" — spam', time: '12 mins ago', type: 'report' },
  { id: 3, action: 'New course published: "Quantum Entanglement Basics"', time: '34 mins ago', type: 'course' },
  { id: 4, action: 'Student "priya_s" completed the AI Mastery certificate', time: '1 hr ago', type: 'cert' },
  { id: 5, action: 'Community "UPSC Toppers 2025" reached 100 members', time: '2 hrs ago', type: 'community' },
  { id: 6, action: 'New report: Comment flagged in "Physics & Quantum" community', time: '3 hrs ago', type: 'report' },
];

const typeConfig = {
  verify: { color: 'text-emerald-500 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-400' },
  report: { color: 'text-rose-500 bg-rose-50 border-rose-200', dot: 'bg-rose-400' },
  course: { color: 'text-[#4F7DF6] bg-blue-50 border-blue-200', dot: 'bg-[#4F7DF6]' },
  cert: { color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
  community: { color: 'text-[#8B5CF6] bg-purple-50 border-purple-200', dot: 'bg-purple-400' },
};

export default function AdminDashboard() {
  const [toggles, setToggles] = useState({
    aiTutor: true,
    maintenance: false,
    newRegistrations: true,
    communityCreation: true,
    notebookHub: true,
  });

  const flip = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const TOGGLES = [
    { key: 'aiTutor', label: 'AI Tutor', desc: 'Enable the StudyVerse AI chat assistant for all students' },
    { key: 'maintenance', label: 'Maintenance Mode', desc: 'Take the platform offline for maintenance' },
    { key: 'newRegistrations', label: 'New Registrations', desc: 'Allow new students and tutors to sign up' },
    { key: 'communityCreation', label: 'Community Creation', desc: 'Allow students to create new study communities' },
    { key: 'notebookHub', label: 'Notebook Upload Hub', desc: 'Enable handwritten notebook uploads in Explore' },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-200 text-[11px] font-extrabold mb-1 inline-block">
              🛡️ Admin Control Center
            </span>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">Platform Overview</h1>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Daily Active Users', value: '2,847', delta: '↑ +12% today', icon: Activity, color: 'text-[#4F7DF6]', bg: 'bg-[#EEF4FF]' },
            { label: 'Total Tutors', value: '38', delta: '4 pending verification', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Pending Reports', value: '9', delta: '2 high priority', icon: Flag, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Courses Published', value: '124', delta: '↑ 6 this week', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className="p-4 bg-white rounded-[18px] border border-[#E2E8F0]">
              <div className={`w-8 h-8 rounded-[10px] ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-extrabold text-[#1E293B]">{s.value}</p>
              <p className="text-xs text-[#64748B] font-semibold">{s.label}</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.delta}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature Toggles */}
          <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2 mb-5">
              <Zap className="w-4 h-4 text-amber-500" />
              Platform Feature Toggles
            </h2>
            <div className="space-y-3">
              {TOGGLES.map(t => (
                <div key={t.key} className="flex items-start justify-between gap-4 p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all">
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">{t.label}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{t.desc}</p>
                  </div>
                  <button
                    onClick={() => flip(t.key)}
                    className={`shrink-0 transition-colors cursor-pointer ${toggles[t.key] ? 'text-emerald-500' : 'text-slate-300'}`}
                  >
                    {toggles[t.key]
                      ? <ToggleRight className="w-7 h-7" strokeWidth={1.5} />
                      : <ToggleLeft className="w-7 h-7" strokeWidth={1.5} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Platform Activity */}
          <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2 mb-5">
              <Bell className="w-4 h-4 text-[#8B5CF6]" />
              Recent Platform Activity
            </h2>
            <div className="space-y-2.5">
              {MOCK_ACTIVITY.map(a => {
                const cfg = typeConfig[a.type];
                return (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot} mt-1.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#1E293B] font-semibold leading-snug">{a.action}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
