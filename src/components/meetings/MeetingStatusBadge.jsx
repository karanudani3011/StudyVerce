import React from 'react';

export const MeetingStatusBadge = ({ status = 'upcoming', className = '' }) => {
  switch (status?.toLowerCase()) {
    case 'live':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-black tracking-wide ${className}`}>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
          </span>
          LIVE NOW
        </span>
      );
    case 'upcoming':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#4F7DF6] text-[11px] font-bold ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F7DF6]" />
          Upcoming
        </span>
      );
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[#64748B] text-[11px] font-bold ${className}`}>
          ✓ Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold ${className}`}>
          ✕ Cancelled
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold ${className}`}>
          {status}
        </span>
      );
  }
};
