import React, { useState, useEffect } from 'react';
import { X, Video, Calendar, Clock, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { meetingService } from '../../services/meetingService';
import { Button } from '../ui/Button';

export const EditMeetingModal = ({
  isOpen,
  onClose,
  meeting,
  onMeetingUpdated,
}) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingPlatform: 'Google Meet',
    meetingUrl: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    subject: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (meeting) {
      const dateFormatted = meeting.scheduledDate
        ? new Date(meeting.scheduledDate).toISOString().split('T')[0]
        : '';
      setFormData({
        title: meeting.title || '',
        description: meeting.description || '',
        meetingPlatform: meeting.meetingPlatform || 'Google Meet',
        meetingUrl: meeting.meetingUrl || '',
        scheduledDate: dateFormatted,
        startTime: meeting.startTime || '18:00',
        endTime: meeting.endTime || '19:00',
        subject: meeting.subject || 'General',
      });
    }
  }, [meeting]);

  if (!isOpen || !meeting) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateUrl = (urlStr) => {
    try {
      const u = new URL(urlStr.trim());
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a meeting title.');
      return;
    }
    if (!formData.meetingUrl.trim() || !validateUrl(formData.meetingUrl)) {
      setError('Please provide a valid HTTP or HTTPS meeting URL.');
      return;
    }
    if (!formData.scheduledDate || !formData.startTime || !formData.endTime) {
      setError('Please provide date, start time, and end time.');
      return;
    }
    if (formData.endTime <= formData.startTime) {
      setError('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await meetingService.updateMeeting(meeting._id || meeting.id, formData);
      if (res.success) {
        addToast('Meeting updated successfully! ✏️', 'success');
        if (onMeetingUpdated) {
          onMeetingUpdated(res.data);
        }
        onClose();
      } else {
        throw new Error(res.message || 'Failed to update meeting');
      }
    } catch (err) {
      console.error('Update Meeting Error:', err);
      setError(err.message || 'Unable to update meeting.');
      addToast(err.message || 'Unable to update meeting.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDF2F7] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[12px] bg-blue-50 text-[#4F7DF6] border border-blue-100">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1E293B]">Edit Live Meeting</h2>
              <p className="text-xs text-[#64748B]">Update scheduled session details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-[14px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Meeting Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all"
              required
            />
          </div>

          {/* Subject & Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Meeting Platform *</label>
              <select
                name="meetingPlatform"
                value={formData.meetingPlatform}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all cursor-pointer"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom Video</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Other">Other Platform</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Subject / Category</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Meeting Link URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#4F7DF6]" />
              Meeting Link *
            </label>
            <input
              type="url"
              name="meetingUrl"
              value={formData.meetingUrl}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all"
              required
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Scheduled Date *</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all cursor-pointer"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all cursor-pointer"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">End Time *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Agenda / Notes</label>
            <textarea
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Video}
              disabled={submitting}
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
