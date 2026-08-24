import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  Flag, Trash2, CheckCircle2, Search, MessageSquare,
  User, ShieldAlert, AlertCircle, RefreshCw, Loader2,
  ChevronDown, ChevronUp, FileText, Clock
} from 'lucide-react';
import { apiGet } from '../../config/api';
import { api } from '../../config/api';

const priorityConfig = {
  high:   { label: 'High Priority', cls: 'text-rose-400 bg-rose-500/15 border-rose-500/30'    },
  medium: { label: 'Medium',        cls: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  low:    { label: 'Low',           cls: 'text-slate-400 bg-slate-500/15 border-slate-500/30' },
};

const contentTypeConfig = {
  post:    { label: 'Post',    icon: Flag,          cls: 'text-rose-400 bg-rose-500/15 border-rose-500/30'   },
  comment: { label: 'Comment', icon: MessageSquare, cls: 'text-amber-400 bg-amber-500/15 border-amber-500/30'},
  user:    { label: 'User',    icon: User,          cls: 'text-purple-400 bg-purple-500/15 border-purple-500/30'},
  note:    { label: 'Note',    icon: FileText,      cls: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30'   },
  course:  { label: 'Course',  icon: FileText,      cls: 'text-blue-400 bg-blue-500/15 border-blue-500/30'   },
};

function ReportCard({ report, onDismiss, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(null);

  const priCfg = priorityConfig[report.priority] || priorityConfig.low;
  const typeCfg = contentTypeConfig[report.contentType] || contentTypeConfig.post;
  const TypeIcon = typeCfg.icon;
  const isResolved = report.status === 'resolved';

  const reportedOn = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const handleDismiss = async () => {
    setLoading('dismiss');
    await onDismiss(report._id);
    setLoading(null);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this flagged content permanently?')) return;
    setLoading('delete');
    await onDelete(report._id);
    setLoading(null);
  };

  return (
    <div className={`rounded-2xl border backdrop-blur-sm transition-all duration-200 overflow-hidden ${
      isResolved
        ? 'bg-[#0B1522]/40 border-[#1E293B]/40 opacity-60'
        : report.priority === 'high'
          ? 'bg-[#0B1522] border-rose-500/20 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5'
          : 'bg-[#0B1522] border-[#1E293B] hover:border-[#2D3F52] hover:shadow-lg hover:shadow-black/20'
    }`}>
      <div className="p-5 space-y-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${isResolved ? 'bg-slate-800/50 border-slate-700/50' : typeCfg.cls}`}>
              <TypeIcon className={`w-4 h-4 ${isResolved ? 'text-slate-500' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-white capitalize">{typeCfg.label} Reported</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${priCfg.cls}`}>
                  {priCfg.label}
                </span>
                {isResolved && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Resolved ✓
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={report.reporterAvatar || 'https://i.pravatar.cc/40'}
                  alt={report.reporterName}
                  className="w-4 h-4 rounded-full object-cover ring-1 ring-[#1E293B]"
                />
                <span className="text-[11px] text-slate-500">
                  Reported by <span className="text-slate-400 font-semibold">@{report.reporterName}</span>
                  {' · '}{reportedOn}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isResolved && (
              <>
                <button
                  disabled={!!loading}
                  onClick={handleDismiss}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/30 text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading === 'dismiss' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Dismiss
                </button>
                <button
                  disabled={!!loading}
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/35 text-rose-300 border border-rose-500/30 text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading === 'delete' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete Content
                </button>
              </>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl bg-[#132235] hover:bg-[#1C2F47] border border-[#1E293B] text-slate-400 transition-all cursor-pointer"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reason always visible */}
        <div className="p-3 rounded-xl bg-[#060D17] border border-[#1E293B]">
          <p className="text-[10px] text-rose-400 font-black uppercase tracking-wider mb-1">Reported Reason</p>
          <p className="text-xs font-semibold text-slate-200">{report.reason}</p>
        </div>

        {/* Expandable Preview & Notes */}
        {expanded && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#060D17] border border-[#1E293B]">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1">Content Preview</p>
              <p className="text-xs text-slate-300 italic leading-relaxed">{report.contentPreview}</p>
            </div>
            {report.adminNotes && (
              <div className="p-3 rounded-xl bg-[#060D17] border border-emerald-500/20">
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider mb-1">Admin Notes</p>
                <p className="text-xs text-slate-300">{report.adminNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet('/admin/reports');
      setReports(data.reports || []);
    } catch (err) {
      setError(err.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleDismiss = async (id) => {
    try {
      await api(`/admin/reports/${id}/dismiss`, { method: 'PATCH', body: JSON.stringify({}) });
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved' } : r));
    } catch (err) { alert(err.message || 'Failed to dismiss report.'); }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/admin/reports/${id}/content`, { method: 'DELETE' });
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved', adminNotes: 'Content removed by admin.' } : r));
    } catch (err) { alert(err.message || 'Failed to delete content.'); }
  };

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.reason?.toLowerCase().includes(q) ||
      r.reporterName?.toLowerCase().includes(q) ||
      r.contentPreview?.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || r.status === filter || r.priority === filter;
    return matchSearch && matchFilter;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const highCount    = reports.filter(r => r.priority === 'high' && r.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flag className="w-5 h-5 text-rose-400" />
              <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-[11px] font-black tracking-widest uppercase">
                Content Moderation
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Flagged Content Reports</h1>
            <p className="text-sm text-slate-400 mt-1">Review, dismiss, or remove flagged posts, comments, and users</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {highCount > 0 && (
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/30 animate-pulse">
                🚨 {highCount} High Priority
              </span>
            )}
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${pendingCount > 0 ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-[#0B1522] text-slate-500 border-[#1E293B]'}`}>
              {pendingCount} Pending
            </span>
            <button
              onClick={fetchReports}
              className="p-2 rounded-xl bg-[#0B1522] border border-[#1E293B] text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Search & Filter ─── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by reason, reporter, or content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1522] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all',      label: 'All' },
              { key: 'pending',  label: 'Pending' },
              { key: 'resolved', label: 'Resolved' },
              { key: 'high',     label: '🚨 High' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 rounded-xl text-xs font-black cursor-pointer border transition-all ${
                  filter === key
                    ? key === 'high'
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25'
                    : 'bg-[#0B1522] text-slate-400 border-[#1E293B] hover:border-[#2D3F52] hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Content ─── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
            <span className="ml-3 text-slate-400 font-semibold">Loading reports...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-20 text-center rounded-2xl bg-[#0B1522] border border-dashed border-[#1E293B]">
            <ShieldAlert className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-500">
              {search || filter !== 'all'
                ? 'No reports match your search criteria.'
                : '🎉 All clear — no flagged content right now.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(report => (
              <ReportCard
                key={report._id}
                report={report}
                onDismiss={handleDismiss}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
