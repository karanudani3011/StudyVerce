import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { apiPost } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const REPORT_REASONS = [
  'Incorrect / Misleading academic content',
  'Spam / Self-promotion',
  'Hate speech / Offensive content',
  'Plagiarism / Copyright violation',
  'Inappropriate for educational platform',
  'Duplicate / Repeated content',
  'Phishing / Suspicious payment links',
  'Other',
];

/**
 * ReportContentModal – A floating modal for tutors/students to flag content.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - contentType: 'post' | 'comment' | 'user' | 'note' | 'course'
 *  - contentId: string (optional)
 *  - contentPreview: string (short text snippet of the content)
 */
export default function ReportContentModal({ isOpen, onClose, contentType = 'post', contentId = '', contentPreview = '' }) {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const finalReason = reason === 'Other' ? customReason : reason;

  const handleSubmit = async () => {
    if (!finalReason) { setError('Please select or describe a reason.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await apiPost('/reports', {
        contentType,
        contentId,
        contentPreview: contentPreview.slice(0, 300),
        reason: finalReason,
        priority,
        reporterName: user?.username || user?.name || 'Community Member',
        reporterAvatar: user?.avatar,
        reporterId: user?.id,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setCustomReason('');
    setPriority('medium');
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[28px] border border-[#E2E8F0] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-rose-50 border border-rose-200 flex items-center justify-center">
              <Flag className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#1E293B]">Report Content</h2>
              <p className="text-[11px] text-[#94A3B8] capitalize">{contentType} · Flagging for review</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1E293B]">Report Submitted ✅</h3>
                <p className="text-sm text-[#64748B] mt-1">
                  Thank you for keeping the community safe. Our admin team will review this report within 24 hours.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-[14px] bg-[#1E293B] text-white text-sm font-extrabold hover:bg-slate-700 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Content Preview */}
              {contentPreview && (
                <div className="p-3 rounded-[12px] bg-[#FFF8F8] border border-rose-100">
                  <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">REPORTING THIS CONTENT</p>
                  <p className="text-xs text-[#64748B] italic line-clamp-2">"{contentPreview}"</p>
                </div>
              )}

              {/* Reason Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Reason for Reporting *
                </label>
                <div className="space-y-1.5">
                  {REPORT_REASONS.map(r => (
                    <button
                      key={r}
                      onClick={() => { setReason(r); setError(''); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-[12px] text-xs font-semibold border transition-all cursor-pointer ${
                        reason === r
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#1E293B]'
                      }`}
                    >
                      {reason === r ? '✓ ' : ''}{r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reason Input */}
              {reason === 'Other' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Describe the issue *</label>
                  <textarea
                    rows={3}
                    value={customReason}
                    onChange={e => { setCustomReason(e.target.value); setError(''); }}
                    placeholder="Describe why you're reporting this content..."
                    className="w-full rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] focus:border-rose-400 p-3 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none resize-none transition-all"
                  />
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">Priority Level</label>
                <div className="flex gap-2">
                  {[
                    { key: 'low',    label: 'Low',    cls: 'text-slate-600 border-slate-300 bg-slate-50' },
                    { key: 'medium', label: 'Medium', cls: 'text-amber-600 border-amber-300 bg-amber-50' },
                    { key: 'high',   label: '🚨 High',   cls: 'text-rose-600 border-rose-300 bg-rose-50' },
                  ].map(({ key, label, cls }) => (
                    <button
                      key={key}
                      onClick={() => setPriority(key)}
                      className={`flex-1 py-2 rounded-[10px] text-xs font-extrabold border transition-all cursor-pointer ${
                        priority === key ? cls : 'bg-white border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !finalReason}
                className="w-full py-3.5 rounded-[14px] bg-rose-500 hover:bg-rose-600 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Report...</>
                ) : (
                  <><Flag className="w-4 h-4" /> Submit Report to Admin</>
                )}
              </button>

              <p className="text-center text-[10px] text-[#94A3B8]">
                False reports may result in account restriction. Only report genuine policy violations.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
