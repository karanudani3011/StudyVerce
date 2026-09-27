import React, { useState } from 'react';
import { X, Video, Calendar, Clock, Link as LinkIcon, Sparkles, AlertCircle, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { meetingService } from '../../services/meetingService';
import { Button } from '../ui/Button';

export const CreateMeetingModal = ({
  isOpen,
  onClose,
  onMeetingCreated,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const isFaculty = user?.role === 'tutor' || user?.role === 'faculty';
  const isAdmin = user?.role === 'admin';
  const targetAudienceLabel = isAdmin ? 'Faculty & Educators' : 'Enrolled Students';

  // Get today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingPlatform: 'Google Meet',
    meetingUrl: '',
    scheduledDate: todayStr,
    startTime: '18:00',
    endTime: '19:00',
    subject: 'Computer Science',
    courseName: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
    if (!formData.meetingUrl.trim()) {
      setError('Please provide a valid meeting link / URL.');
      return;
    }
    if (!validateUrl(formData.meetingUrl)) {
      setError('Meeting link must be a valid HTTP or HTTPS URL (e.g. https://meet.google.com/abc-defg-hij)');
      return;
    }
    if (!formData.scheduledDate) {
      setError('Please select a scheduled date.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Please specify both start time and end time.');
      return;
    }
    if (formData.endTime <= formData.startTime) {
      setError('End time must be later than start time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await meetingService.createMeeting(formData);
      if (res.success) {
        addToast('Live meeting created successfully! 🎉', 'success');
        if (onMeetingCreated) {
          onMeetingCreated(res.data);
        }
        onClose();
      } else {
        throw new Error(res.message || 'Failed to create meeting');
      }
    } catch (err) {
      console.error('Create Meeting Error:', err);
      setError(err.message || 'Unable to create meeting. Please check inputs and try again.');
      addToast(err.message || 'Unable to create meeting. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EDF2F7] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[12px] bg-blue-50 text-[#4F7DF6] border border-blue-100">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1E293B]">Schedule Live Meeting</h2>
              <p className="text-xs text-[#64748B]">Create a Google Meet, Zoom, or Teams live class</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-[14px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Automatic Target Audience Notice */}
          <div className="p-3 rounded-[14px] bg-[#EEF4FF] border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E293B]">
              {isAdmin ? (
                <Shield className="w-4 h-4 text-slate-700" />
              ) : (
                <GraduationCap className="w-4 h-4 text-[#4F7DF6]" />
              )}
              <span>Target Audience:</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#4F7DF6] border border-blue-200 text-xs font-black">
              {targetAudienceLabel}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Meeting / Class Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Mathematics — Linear Algebra Live Revision"
              className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all"
              required
            />
          </div>

          {/* Subject & Platform Grid */}
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
                placeholder="e.g. Computer Science, Physics"
                className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Meeting Link URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#4F7DF6]" />
              Meeting Link (Paste URL here) *
            </label>
            <input
              type="url"
              name="meetingUrl"
              value={formData.meetingUrl}
              onChange={handleChange}
              placeholder="https://meet.google.com/abc-defg-hij or https://zoom.us/j/..."
              className="w-full px-3.5 py-2.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#4F7DF6] focus:outline-none transition-all"
              required
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Scheduled Date *</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                min={todayStr}
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
            <label className="text-xs font-bold text-[#1E293B]">Session Agenda / Instructions</label>
            <textarea
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Please bring your practice problem set for Chapter 4 discussion."
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
              className="shadow-lg shadow-blue-500/25"
            >
              {submitting ? 'Creating Meeting...' : 'Create Live Meeting'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
