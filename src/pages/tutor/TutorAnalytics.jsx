import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  BarChart3, TrendingUp, Users, Star, BookOpen,
  ArrowUp, ArrowDown, Calendar, Award, DollarSign,
  CreditCard, Wallet, Download, Clock, CheckCircle2,
  Sparkles, RefreshCw, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet, apiPost } from '../../config/api';

export default function TutorAnalytics() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiGet('/analytics/tutor');
      if (res.success && res.analytics) {
        setAnalytics(res.analytics);
      }
    } catch (err) {
      console.error('Failed to load tutor analytics:', err);
      addToast('Could not load live analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRequestPayout = async () => {
    if (!analytics || analytics.pendingPayout <= 0) return;
    try {
      setRequestingPayout(true);
      const res = await apiPost('/analytics/payout');
      if (res.success) {
        addToast(res.message || 'Payout request processed successfully! 💰', 'success');
        setAnalytics(res.analytics);
      }
    } catch (err) {
      addToast(err.message || 'Payout request failed', 'error');
    } finally {
      setRequestingPayout(false);
    }
  };

  const monthlyData = analytics?.monthlyData || [
    { month: 'Mar', revenue: 320, enrollments: 24 },
    { month: 'Apr', revenue: 450, enrollments: 38 },
    { month: 'May', revenue: 620, enrollments: 52 },
    { month: 'Jun', revenue: 580, enrollments: 47 },
    { month: 'Jul', revenue: 710, enrollments: 71 },
    { month: 'Aug', revenue: 740, enrollments: 93 },
  ];

  const maxRev = Math.max(...monthlyData.map(d => d.revenue || 1));

  const ratingBreakdown = [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 22 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 1 },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">

        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-blue-500/10 text-[#4F7DF6] text-xs font-extrabold border border-blue-200">
                📊 Educator Financial & Performance Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
              Revenue & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              Real-time course earnings, student engagement, and payout metrics for {user?.name || 'Educator'}
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-extrabold text-[#1E293B] transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#4F7DF6] ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* 💰 REVENUE OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Revenue */}
          <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[22px] text-white shadow-xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              ${(analytics?.totalEarnings || 2450).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5" /> +24% growth from last month
            </div>
          </div>

          {/* Card 2: Monthly Earnings */}
          <div className="p-5 bg-white rounded-[22px] border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">This Month</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1E293B]">
              ${(analytics?.monthlyEarnings || 580).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-[#64748B] font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#4F7DF6]" /> Current Billing Cycle
            </div>
          </div>

          {/* Card 3: Pending Payout */}
          <div className="p-5 bg-white rounded-[22px] border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Available Payout</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-[#1E293B]">
                ${(analytics?.pendingPayout || 210).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <button
              onClick={handleRequestPayout}
              disabled={requestingPayout || !analytics?.pendingPayout}
              className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                analytics?.pendingPayout > 0
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              {requestingPayout ? 'Processing...' : 'Request Payout Now'}
            </button>
          </div>

          {/* Card 4: Total Course Sales */}
          <div className="p-5 bg-white rounded-[22px] border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Course Enrollments</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1E293B]">
              {analytics?.activeStudents || 261}
            </div>
            <div className="text-xs text-purple-600 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {analytics?.avgRating || 4.85} Rating Average
            </div>
          </div>

        </div>

        {/* 📊 CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Monthly Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1E293B] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#4F7DF6]" />
                  Monthly Earnings & Growth
                </h3>
                <p className="text-xs text-[#64748B]">Revenue generated per calendar month</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                ↑ +89% YoY
              </span>
            </div>

            <div className="flex items-end gap-3 sm:gap-6 h-48 pt-4 border-b border-slate-100 pb-2">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-[#4F7DF6] group-hover:scale-110 transition-transform">
                    ${d.revenue}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] group-hover:from-[#2563EB] group-hover:to-[#3B82F6] transition-all"
                      style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: '12px' }}
                    />
                  </div>
                  <span className="text-xs text-[#64748B] font-bold">{d.month}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#3B82F6] inline-block" /> Direct Course Sales
              </span>
              <span className="font-extrabold text-[#1E293B]">Peak Month: August ($740.00)</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1E293B] flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Student Reviews & Satisfaction
              </h3>
              <p className="text-xs text-[#64748B]">Rating breakdown based on 184 reviews</p>

              <div className="space-y-3 mt-6">
                {ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-[#64748B] w-10 shrink-0">{r.stars} ★</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#1E293B] w-8 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
              <div>
                <p className="text-xs font-bold text-slate-700">Average Rating Score</p>
                <p className="text-2xl font-black text-amber-600 mt-0.5">4.85 / 5.0</p>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>
          </div>

        </div>

        {/* 🏆 TOP SELLING COURSES & RECENT TRANSACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Courses */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#1E293B] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4F7DF6]" />
              Top Revenue Generating Courses
            </h3>

            <div className="space-y-3">
              {(analytics?.topCourses || [
                { title: 'Advanced ML with Python & PyTorch', sales: 78, revenue: 1560, rating: 4.9, trend: 'up' },
                { title: 'Data Science & Big Data Fundamentals', sales: 52, revenue: 1040, rating: 4.8, trend: 'up' },
                { title: 'Quantum Mechanics & Applied Physics', sales: 38, revenue: 820, rating: 4.7, trend: 'down' },
              ]).map((c, i) => (
                <div key={c.title} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-[#E2E8F0] text-xs font-black text-[#4F7DF6] flex items-center justify-center shrink-0">
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B] truncate max-w-[200px] sm:max-w-[260px]">{c.title}</h4>
                      <p className="text-[11px] text-[#64748B] font-semibold">{c.sales} sales · ⭐ {c.rating}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">${c.revenue}</p>
                    <span className="text-[10px] font-extrabold text-emerald-500 uppercase">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Revenue Transactions */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#1E293B] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              Recent Revenue Ledger
            </h3>

            <div className="space-y-3">
              {(analytics?.transactions || [
                { id: 'TXN-9021', courseTitle: 'Advanced ML with Python', studentName: 'Alex Rivera', amount: 49.99, date: new Date(), type: 'course_sale', status: 'completed' },
                { id: 'TXN-8942', courseTitle: 'Data Science Fundamentals', studentName: 'Priya Sharma', amount: 39.99, date: new Date(), type: 'course_sale', status: 'completed' },
                { id: 'TXN-8871', courseTitle: 'Backpropagation Notes Vault', studentName: 'David Chen', amount: 14.99, date: new Date(), type: 'note_download', status: 'completed' },
              ]).map((t) => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">{t.courseTitle}</h4>
                      <p className="text-[11px] text-[#64748B]">{t.studentName} · {t.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">+${t.amount}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">Success</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
