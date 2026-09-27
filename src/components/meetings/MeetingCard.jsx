import React from 'react';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  Edit2,
  XCircle,
  Trash2,
  Users,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { MeetingStatusBadge } from './MeetingStatusBadge';

// Helper to format date
const formatMeetingDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Platform helper icon & styling
const getPlatformStyle = (platform) => {
  switch (platform) {
    case 'Google Meet':
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconColor: 'text-emerald-600',
        label: 'Google Meet',
      };
    case 'Zoom':
      return {
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        iconColor: 'text-blue-600',
        label: 'Zoom Video',
      };
    case 'Microsoft Teams':
      return {
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        iconColor: 'text-indigo-600',
        label: 'MS Teams',
      };
    default:
      return {
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        iconColor: 'text-purple-600',
        label: platform || 'Live Meeting',
      };
  }
};

export const MeetingCard = ({
  meeting,
  onEdit,
  onCancel,
  onDelete,
}) => {
  const isCancelled = meeting.status === 'cancelled';
  const isLive = meeting.status === 'live';
  const isCompleted = meeting.status === 'completed';
  const platformStyle = getPlatformStyle(meeting.meetingPlatform);

  const canJoin = !isCancelled && !isCompleted && Boolean(meeting.meetingUrl);

  const handleJoinClick = () => {
    if (!canJoin) return;
    window.open(meeting.meetingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      hover
      className={`p-5 rounded-[22px] border transition-all space-y-4 ${
        isLive
          ? 'border-rose-300/80 bg-gradient-to-br from-rose-50/20 via-white to-white shadow-md'
          : isCancelled
          ? 'border-slate-200 bg-slate-50/60 opacity-80'
          : 'border-[#E2E8F0] bg-white hover:border-[#4F7DF6]/40'
      }`}
    >
      {/* Header with Title, Platform and Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold flex items-center gap-1 ${platformStyle.badgeBg}`}>
              <Video className="w-3 h-3" />
              {platformStyle.label}
            </span>
            {meeting.subject && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                {meeting.subject}
              </span>
            )}
            {meeting.targetRole === 'faculty' && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Faculty Briefing
              </span>
            )}
          </div>

          <h3 className="text-base font-extrabold text-[#1E293B] leading-tight line-clamp-2 pt-0.5">
            {meeting.title}
          </h3>

          {meeting.description && (
            <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
              {meeting.description}
            </p>
          )}
        </div>

        <MeetingStatusBadge status={meeting.status} />
      </div>

      {/* Date, Time and Creator Info */}
      <div className="pt-2 border-t border-[#EDF2F7] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#64748B]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#1E293B]">
            <Calendar className="w-4 h-4 text-[#4F7DF6] shrink-0" />
            <span>{formatMeetingDate(meeting.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-[#64748B]">
            <Clock className="w-4 h-4 text-purple-500 shrink-0" />
            <span>{meeting.startTime} – {meeting.endTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Avatar
            src={meeting.createdByAvatar}
            alt={meeting.createdByName}
            size="sm"
            verified={meeting.createdByRole === 'faculty' || meeting.createdByRole === 'admin'}
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1E293B] truncate">{meeting.createdByName}</p>
            <p className="text-[11px] text-[#94A3B8] flex items-center gap-1 truncate">
              {meeting.createdByRole === 'admin' ? (
                <>
                  <Shield className="w-3 h-3 text-slate-600" /> Administrator
                </>
              ) : (
                <>
                  <GraduationCap className="w-3 h-3 text-[#4F7DF6]" /> Faculty Educator
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between gap-3 flex-wrap">
        {/* Management Controls (Edit / Cancel / Delete) */}
        <div className="flex items-center gap-2">
          {meeting.canManage && !isCancelled && onEdit && (
            <button
              onClick={() => onEdit(meeting)}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#4F7DF6] hover:bg-blue-50 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Edit Meeting"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          {meeting.canManage && !isCancelled && onCancel && (
            <button
              onClick={() => onCancel(meeting)}
              className="p-2 rounded-xl text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Cancel Meeting"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          )}

          {meeting.canManage && onDelete && (
            <button
              onClick={() => onDelete(meeting)}
              className="p-2 rounded-xl text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold cursor-pointer"
              title="Delete Meeting"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Join Meeting Action Button */}
        <div>
          {isCancelled ? (
            <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed inline-block">
              Meeting Cancelled
            </span>
          ) : isCompleted ? (
            <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold inline-block">
              Session Completed
            </span>
          ) : (
            <button
              onClick={handleJoinClick}
              className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isLive
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-rose-500/25 animate-pulse'
                  : 'bg-gradient-to-r from-[#4F7DF6] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] text-white shadow-blue-500/25'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{isLive ? 'Join Live Now' : 'Join Live Class'}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
