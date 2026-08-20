import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  Flag, Trash2, CheckCircle2, AlertTriangle, Search,
  MessageSquare, User, ExternalLink, ShieldAlert, Clock
} from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 'rpt_1',
    contentType: 'post',
    contentPreview: '"This shortcut for JEE mains is completely wrong! The formula shown is misguiding students..."',
    reportedBy: 'priya_sharma_s',
    reporterAvatar: 'https://i.pravatar.cc/40?img=5',
    reason: 'Misinformation / Incorrect academic content',
    priority: 'high',
    status: 'pending',
    reportedAt: '10 mins ago',
  },
  {
    id: 'rpt_2',
    contentType: 'comment',
    contentPreview: '"This post is just spam and advertisement for a third-party Telegram channel..."',
    reportedBy: 'alex_johnson_u',
    reporterAvatar: 'https://i.pravatar.cc/40?img=1',
    reason: 'Spam / Self-promotion',
    priority: 'medium',
    status: 'pending',
    reportedAt: '45 mins ago',
  },
  {
    id: 'rpt_3',
    contentType: 'user',
    contentPreview: 'User "exam_cracker99" posting duplicate content across 20+ communities',
    reportedBy: 'marcus_l',
    reporterAvatar: 'https://i.pravatar.cc/40?img=3',
    reason: 'Duplicate / Repeated content posting',
    priority: 'medium',
    status: 'pending',
    reportedAt: '2 hrs ago',
  },
  {
    id: 'rpt_4',
    contentType: 'post',
    contentPreview: '"Contains offensive language targeting a specific student group..."',
    reportedBy: 'sofia_karan_u',
    reporterAvatar: 'https://i.pravatar.cc/40?img=7',
    reason: 'Hate speech / Offensive content',
    priority: 'high',
    status: 'pending',
    reportedAt: '3 hrs ago',
  },
  {
    id: 'rpt_5',
    contentType: 'comment',
    contentPreview: '"@user_123 pay for my notes through this link..."',
    reportedBy: 'raj_verma_s',
    reporterAvatar: 'https://i.pravatar.cc/40?img=10',
    reason: 'Phishing / Suspicious payment links',
    priority: 'high',
    status: 'resolved',
    reportedAt: '1 day ago',
  },
];

const priorityConfig = {
  high: { label: 'High Priority', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  low: { label: 'Low', color: 'text-slate-500 bg-slate-50 border-slate-200' },
};

const typeIcon = { post: Flag, comment: MessageSquare, user: User };

export default function AdminReports() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleDismiss = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  const handleDelete = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reports.filter(r => {
    const matchSearch =
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
      r.contentPreview.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter || r.priority === filter;
    return matchSearch && matchFilter;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 pb-24 md:pb-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold mb-2 inline-block">
              🚩 Content Moderation
            </span>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">Reported Content Queue</h1>
            <p className="text-sm text-[#64748B]">Review and take action on flagged posts, comments, and users</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pendingCount > 0 ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              {pendingCount} Pending Action
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search reports by reason, reporter, or content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-white border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'resolved', 'high'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-[12px] text-xs font-bold capitalize cursor-pointer border transition-all ${
                  filter === f
                    ? 'bg-[#1E293B] text-white border-transparent'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="p-10 bg-white rounded-[20px] border border-dashed border-[#CBD5E1] text-center">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-[#64748B]">No reports found</p>
            </div>
          )}

          {filtered.map(report => {
            const priCfg = priorityConfig[report.priority] || priorityConfig.low;
            const TypeIcon = typeIcon[report.contentType] || Flag;
            const isResolved = report.status === 'resolved';

            return (
              <div key={report.id} className={`bg-white rounded-[20px] border transition-all ${isResolved ? 'opacity-60 border-[#E2E8F0]' : 'border-[#E2E8F0] hover:shadow-md hover:border-[#CBD5E1]'}`}>
                <div className="p-5 space-y-4">
                  {/* Report Header */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-[10px] ${isResolved ? 'bg-slate-100' : 'bg-rose-50 border border-rose-100'}`}>
                        <TypeIcon className={`w-4 h-4 ${isResolved ? 'text-slate-400' : 'text-rose-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-[#1E293B] capitalize">{report.contentType} Reported</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priCfg.color}`}>
                            {priCfg.label}
                          </span>
                          {isResolved && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              Resolved ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <img src={report.reporterAvatar} alt={report.reportedBy} className="w-4 h-4 rounded-full" />
                          <span className="text-[11px] text-[#94A3B8]">Reported by <strong className="text-[#64748B]">@{report.reportedBy}</strong> · {report.reportedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {!isResolved && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDismiss(report.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dismiss
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Content
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Report Details */}
                  <div className="space-y-2">
                    <div className="p-3 rounded-[12px] bg-[#FFF8F8] border border-rose-100/80">
                      <p className="text-[11px] font-bold text-rose-400 mb-1 uppercase tracking-wider">Reported Reason</p>
                      <p className="text-xs font-semibold text-[#1E293B]">{report.reason}</p>
                    </div>
                    <div className="p-3 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]">
                      <p className="text-[11px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider">Content Preview</p>
                      <p className="text-xs text-[#64748B] italic">{report.contentPreview}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
