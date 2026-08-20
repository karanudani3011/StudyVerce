import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  BarChart3, TrendingUp, Users, Star, BookOpen,
  ArrowUp, ArrowDown, Calendar, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ENROLLMENT_DATA = [
  { month: 'Mar', value: 24 },
  { month: 'Apr', value: 38 },
  { month: 'May', value: 52 },
  { month: 'Jun', value: 47 },
  { month: 'Jul', value: 71 },
  { month: 'Aug', value: 93 },
];

const RATING_BREAKDOWN = [
  { stars: 5, pct: 62 },
  { stars: 4, pct: 24 },
  { stars: 3, pct: 9 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 2 },
];

const TOP_COURSES = [
  { title: 'Advanced ML with Python', enrolled: 120, rating: 4.9, trend: 'up' },
  { title: 'Data Science Fundamentals', enrolled: 87, rating: 4.7, trend: 'up' },
  { title: 'Quantum Mechanics Intro', enrolled: 54, rating: 4.8, trend: 'down' },
];

const ACTIVITY_HEATMAP = Array.from({ length: 35 }, (_, i) => ({
  day: i,
  intensity: Math.floor(Math.random() * 5),
}));

const intensityColors = ['bg-slate-100', 'bg-blue-100', 'bg-[#4F7DF6]/30', 'bg-[#4F7DF6]/60', 'bg-[#4F7DF6]'];

export default function TutorAnalytics() {
  const { user } = useAuth();
  const maxVal = Math.max(...ENROLLMENT_DATA.map(d => d.value));

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">

        {/* Header */}
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#4F7DF6] text-[11px] font-extrabold border border-[#D1E0FF] mb-2 inline-block">
            📊 Tutor Analytics
          </span>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Course Performance & Analytics</h1>
          <p className="text-sm text-[#64748B]">Insights for {user?.name || 'Educator'} · Last 6 months</p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: '261', delta: '+18%', up: true, icon: Users, color: 'text-[#4F7DF6]', bg: 'bg-[#EEF4FF]' },
            { label: 'Avg Rating', value: '4.8 ⭐', delta: '+0.2', up: true, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Courses Published', value: '3', delta: 'All Active', up: true, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'XP Awarded to Students', value: '14,820', delta: '+840 this week', up: true, icon: Award, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="p-4 bg-white rounded-[18px] border border-[#E2E8F0]">
              <div className={`w-8 h-8 rounded-[10px] ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-extrabold text-[#1E293B]">{s.value}</p>
              <p className="text-xs text-[#64748B] font-semibold">{s.label}</p>
              <p className={`text-[11px] font-bold mt-0.5 flex items-center gap-0.5 ${s.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {s.delta}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrollment Trend Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4F7DF6]" />
                Monthly Enrollment Trend
              </h2>
              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">↑ +89% Growth</span>
            </div>
            <div className="flex items-end gap-3 h-36">
              {ENROLLMENT_DATA.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-[#4F7DF6]">{d.value}</span>
                  <div
                    className="w-full rounded-t-[8px] bg-gradient-to-t from-[#4F7DF6] to-[#93C5FD] transition-all"
                    style={{ height: `${(d.value / maxVal) * 100}%`, minHeight: '8px' }}
                  />
                  <span className="text-[10px] text-[#94A3B8] font-semibold">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2 mb-5">
              <Star className="w-4 h-4 text-amber-400" />
              Rating Breakdown
            </h2>
            <div className="space-y-2.5">
              {RATING_BREAKDOWN.map(r => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#64748B] w-10 shrink-0">{r.stars} ★</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#1E293B] w-8 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Overall Rating</span>
              <span className="text-lg font-extrabold text-amber-500">4.8 ★</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Courses Performance */}
          <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#4F7DF6]" />
              Course Performance Leaderboard
            </h2>
            <div className="space-y-3">
              {TOP_COURSES.map((c, i) => (
                <div key={c.title} className="flex items-center gap-4 p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-lg font-black text-[#CBD5E1] w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1E293B] truncate">{c.title}</p>
                    <p className="text-[11px] text-[#64748B]">{c.enrolled} students · {c.rating} ★</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${c.trend === 'up' ? 'text-emerald-500' : 'text-rose-400'}`}>
                    {c.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {c.trend === 'up' ? 'Growing' : 'Declining'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#8B5CF6]" />
              Student Activity (Last 35 days)
            </h2>
            <div className="grid grid-cols-7 gap-1.5">
              {ACTIVITY_HEATMAP.map((cell) => (
                <div
                  key={cell.day}
                  className={`aspect-square rounded-[5px] ${intensityColors[cell.intensity]}`}
                  title={`${cell.intensity * 20} active students`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-[#94A3B8] font-semibold">
              <span>Less</span>
              {intensityColors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
