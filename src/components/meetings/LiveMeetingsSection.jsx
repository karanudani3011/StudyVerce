import React, { useState, useEffect, useCallback } from 'react';
import { Video, Plus, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { meetingService } from '../../services/meetingService';
import { MeetingCard } from './MeetingCard';
import { CreateMeetingModal } from './CreateMeetingModal';
import { EditMeetingModal } from './EditMeetingModal';
import { EmptyState } from '../dashboard/EmptyState';
import { Button } from '../ui/Button';

export const LiveMeetingsSection = ({
  title = 'Live Classes & Interactive Sessions',
  subtitle = 'Join real-time lecture office hours, webinars, and revision sessions',
  showCreateButton = false,
  customEmptyMessage = '',
  className = '',
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('active'); // 'active' (live + upcoming), 'all', 'live', 'upcoming', 'completed'

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'tutor' || user?.role === 'admin';
  const canCreate = showCreateButton || isFacultyOrAdmin;

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await meetingService.getMeetings();
      if (res && res.success && Array.isArray(res.data)) {
        setMeetings(res.data);
      }
    } catch (err) {
      console.warn('Live meetings fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Handle meeting cancel
  const handleCancelMeeting = async (meeting) => {
    if (!window.confirm(`Are you sure you want to cancel "${meeting.title}"?`)) return;
    try {
      const res = await meetingService.cancelMeeting(meeting._id || meeting.id);
      if (res.success) {
        addToast('Meeting marked as cancelled.', 'info');
        fetchMeetings();
      }
    } catch (err) {
      addToast(err.message || 'Failed to cancel meeting.', 'error');
    }
  };

  // Handle meeting delete
  const handleDeleteMeeting = async (meeting) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${meeting.title}"?`)) return;
    try {
      const res = await meetingService.deleteMeeting(meeting._id || meeting.id);
      if (res.success) {
        addToast('Meeting deleted from platform.', 'success');
        fetchMeetings();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete meeting.', 'error');
    }
  };

  // Filter meetings based on selected tab
  const filteredMeetings = meetings.filter((m) => {
    if (activeFilter === 'live') return m.status === 'live';
    if (activeFilter === 'upcoming') return m.status === 'upcoming';
    if (activeFilter === 'completed') return m.status === 'completed';
    if (activeFilter === 'active') return m.status === 'live' || m.status === 'upcoming';
    return true; // 'all'
  });

  const liveCount = meetings.filter((m) => m.status === 'live').length;
  const upcomingCount = meetings.filter((m) => m.status === 'upcoming').length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-[10px] bg-rose-50 text-rose-600 border border-rose-100">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
                {title}
                {liveCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                    {liveCount} LIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#64748B]">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {canCreate && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsCreateOpen(true)}
              className="shadow-md shadow-blue-500/20"
            >
              Create Live Meeting
            </Button>
          )}

          <button
            onClick={fetchMeetings}
            className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-slate-100 text-[#64748B] transition-colors cursor-pointer"
            title="Refresh Meetings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto no-scrollbar text-xs font-bold">
        {[
          { id: 'active', label: 'Active & Upcoming', count: liveCount + upcomingCount },
          { id: 'live', label: '🔴 Live Now', count: liveCount },
          { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
          { id: 'all', label: 'All Sessions', count: meetings.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-[#1E293B] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B] border border-[#E2E8F0]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Meetings Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-[22px] bg-white border border-[#E2E8F0] space-y-3 animate-pulse">
              <div className="h-4 w-1/3 bg-slate-200 rounded-full" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/2 bg-slate-200 rounded" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-8 w-28 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <EmptyState
          icon={Video}
          title={customEmptyMessage || (
            activeFilter === 'live'
              ? 'No live meetings currently broadcasting'
              : user?.role === 'student'
              ? 'No live classes scheduled yet'
              : 'No upcoming live meetings'
          )}
          description={
            user?.role === 'student'
              ? 'When faculty educators schedule interactive sessions or office hours, they will appear right here.'
              : 'Schedule a Google Meet, Zoom, or Microsoft Teams live session for your students.'
          }
          actionLabel={canCreate ? '+ Create Live Meeting' : undefined}
          onAction={canCreate ? () => setIsCreateOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting._id || meeting.id}
              meeting={meeting}
              onEdit={(m) => setEditingMeeting(m)}
              onCancel={handleCancelMeeting}
              onDelete={handleDeleteMeeting}
            />
          ))}
        </div>
      )}

      {/* Create Meeting Modal */}
      {isCreateOpen && (
        <CreateMeetingModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onMeetingCreated={(newMeeting) => {
            fetchMeetings();
          }}
        />
      )}

      {/* Edit Meeting Modal */}
      {editingMeeting && (
        <EditMeetingModal
          isOpen={Boolean(editingMeeting)}
          meeting={editingMeeting}
          onClose={() => setEditingMeeting(null)}
          onMeetingUpdated={(updatedMeeting) => {
            fetchMeetings();
          }}
        />
      )}
    </div>
  );
};
