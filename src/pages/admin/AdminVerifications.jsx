import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  CheckCircle2, XCircle, Clock, GraduationCap,
  Building2, BookOpen, Link2, Search, ShieldCheck,
  RefreshCw, AlertCircle, Loader2, ChevronDown, ChevronUp,
  User, BadgeCheck, FileText
} from 'lucide-react';
import { apiGet } from '../../config/api';
import { api } from '../../config/api';

const statusConfig = {
  pending:  { label: 'Pending Review', cls: 'text-amber-400 bg-amber-500/15 border-amber-500/30',  dot: 'bg-amber-400'  },
  approved: { label: 'Approved ✓',    cls: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', dot: 'bg-emerald-400' },
  rejected: { label: 'Rejected',      cls: 'text-rose-400 bg-rose-500/15 border-rose-500/30',      dot: 'bg-rose-400'   },
};

function ApplicationCard({ app, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const cfg = statusConfig[app.status] || statusConfig.pending;

  const handleApprove = async () => {
    setLoading(true);
    await onAction(app._id, 'approved', '');
    setLoading(false);
  };

  const handleReject = async () => {
    if (!showRejectInput) { setShowRejectInput(true); return; }
    setLoading(true);
    await onAction(app._id, 'rejected', rejectionReason);
    setLoading(false);
    setShowRejectInput(false);
  };

  const appliedAgo = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Unknown date';

  return (
    <div className={`rounded-2xl border backdrop-blur-sm transition-all duration-200 overflow-hidden ${
      app.status === 'pending'
        ? 'bg-[#0B1522] border-[#1E293B] hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5'
        : 'bg-[#0B1522]/60 border-[#1E293B]/50 opacity-80'
    }`}>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar & Name */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-emerald-700/20">
              {app.fullName?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-white">{app.fullName}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${cfg.cls}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{app.email}</p>
              {app.title && <p className="text-[11px] text-slate-500 mt-0.5">{app.title}</p>}
              <p className="text-[10px] text-slate-600 mt-0.5">Applied {appliedAgo}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {app.status === 'pending' && (
              <>
                <button
                  disabled={loading}
                  onClick={handleApprove}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Approve
                </button>
                <button
                  disabled={loading}
                  onClick={handleReject}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {showRejectInput ? 'Confirm Reject' : 'Reject'}
                </button>
              </>
            )}
            {app.status === 'approved' && (
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-black">
                <BadgeCheck className="w-5 h-5" /> Verified Tutor
              </span>
            )}
            {app.status === 'rejected' && (
              <span className="flex items-center gap-1.5 text-rose-400 text-xs font-black">
                <XCircle className="w-4 h-4" /> Rejected
              </span>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl bg-[#132235] hover:bg-[#1C2F47] border border-[#1E293B] text-slate-400 transition-all cursor-pointer"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Rejection reason input */}
        {showRejectInput && app.status === 'pending' && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Optional: reason for rejection..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="flex-1 bg-[#060D17] border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
            />
            <button
              onClick={() => { setShowRejectInput(false); setRejectionReason(''); }}
              className="px-3 py-2 rounded-xl bg-[#132235] text-slate-400 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#060D17] border border-[#1E293B]">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">SUBJECT</p>
                  <p className="text-xs font-bold text-white">{app.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#060D17] border border-[#1E293B]">
                <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">INSTITUTION</p>
                  <p className="text-xs font-bold text-white">{app.institution}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#060D17] border border-[#1E293B]">
                <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">EXPERIENCE</p>
                  <p className="text-xs font-bold text-white">{app.teachingExp || '—'} yrs</p>
                </div>
              </div>
            </div>

            {app.credentialsUrl && (
              <a
                href={app.credentialsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#060D17] border border-emerald-500/20 hover:border-emerald-400/40 transition-all group"
              >
                <Link2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">CREDENTIAL DOCUMENT</p>
                  <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 truncate">{app.credentialsUrl}</p>
                </div>
              </a>
            )}

            {app.bio && (
              <div className="p-3 rounded-xl bg-[#060D17] border border-[#1E293B]">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1.5">BIO / ABOUT</p>
                <p className="text-xs text-slate-300 leading-relaxed">{app.bio}</p>
              </div>
            )}

            {app.rejectionReason && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20">
                <p className="text-[10px] text-rose-400 font-black uppercase tracking-wider mb-1">REJECTION REASON</p>
                <p className="text-xs text-rose-300">{app.rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminVerifications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet('/admin/applications');
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleAction = async (id, status, rejectionReason) => {
    try {
      await api(`/admin/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason }),
      });
      setApplications(prev => prev.map(a =>
        a._id === id ? { ...a, status, rejectionReason } : a
      ));
    } catch (err) {
      alert(err.message || 'Failed to update application.');
    }
  };

  const filtered = applications.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.fullName?.toLowerCase().includes(q) ||
      a.subject?.toLowerCase().includes(q) ||
      a.institution?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-black tracking-widest uppercase">
                Tutor Applications
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Application Review Portal</h1>
            <p className="text-sm text-slate-400 mt-1">Review credentials, verify educators, and grant tutor access</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 text-xs font-black border border-amber-500/30">
              {counts.pending} Pending
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-black border border-emerald-500/30">
              {counts.approved} Approved
            </span>
            <button
              onClick={fetchApplications}
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
              placeholder="Search by name, subject, institution, or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1522] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-black capitalize cursor-pointer border transition-all ${
                  filter === f
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25'
                    : 'bg-[#0B1522] text-slate-400 border-[#1E293B] hover:border-emerald-500/30 hover:text-slate-200'
                }`}
              >
                {f} {counts[f] > 0 && f !== 'all' && <span className="ml-1 opacity-70">({counts[f]})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Content ─── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="ml-3 text-slate-400 font-semibold">Loading applications...</span>
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
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-500">
              {search || filter !== 'all' ? 'No applications match your search.' : 'No applications yet. They will appear here when students apply.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(app => (
              <ApplicationCard key={app._id} app={app} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
