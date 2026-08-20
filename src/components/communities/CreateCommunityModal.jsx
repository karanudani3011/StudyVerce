import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Image as ImageIcon, ShieldAlert, Check, Users, Plus, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCommunities } from '../../context/CommunityContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const EMOJI_ICONS = ['🤖', '⚛️', '📚', '💻', '🧠', '🎨', '🔬', '📐', '🎓', '⚡', '🌌', '🚀', '🎯', '🧪', '💼', '🏆'];

const BANNER_PRESETS = [
  { id: 'b1', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200', label: 'AI & Data Tech' },
  { id: 'b2', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200', label: 'Quantum Physics' },
  { id: 'b3', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200', label: 'Academic Library' },
  { id: 'b4', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200', label: 'Code & Math' }
];

const PRESET_SUBJECTS = [
  'Artificial Intelligence',
  'Quantum Physics',
  'Computer Science',
  'UPSC & Gov Exams',
  'Mathematics',
  'Medicine & USMLE',
  'Design & UX',
  'General Study'
];

export const CreateCommunityModal = ({ isOpen, onClose }) => {
  const { createCommunity } = useCommunities();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState(PRESET_SUBJECTS[0]);
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [description, setDescription] = useState('');
  
  const [icon, setIcon] = useState('🤖');
  const [customIcon, setCustomIcon] = useState('');
  
  const [bannerMode, setBannerMode] = useState('preset'); // 'preset' | 'custom'
  const [banner, setBanner] = useState(BANNER_PRESETS[0].url);
  const [customBanner, setCustomBanner] = useState('');
  
  const [joiningFee, setJoiningFee] = useState(199);
  const [creatorUpiId, setCreatorUpiId] = useState(user?.email ? `${user.name?.toLowerCase().replace(/\s+/g, '') || 'creator'}@upi` : 'creator@upi');
  const [creatorAccountName, setCreatorAccountName] = useState(user?.name || 'Community Creator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a community name', 'error');
      return;
    }

    const finalSubject = isCustomSubject
      ? (customSubject.trim() || 'General Study')
      : subject;

    const finalIcon = customIcon.trim() || icon || '🚀';
    const finalBanner = (bannerMode === 'custom' && customBanner.trim())
      ? customBanner.trim()
      : banner;

    setIsSubmitting(true);

    setTimeout(() => {
      const newComm = createCommunity(
        {
          name: name.trim(),
          subject: finalSubject,
          description: description.trim(),
          icon: finalIcon,
          banner: finalBanner,
          joiningFee: Number(joiningFee),
          creatorPayoutDetails: {
            upiId: creatorUpiId || 'creator@upi',
            accountName: creatorAccountName || user?.name || 'Community Creator',
            payoutNote: `Direct payment to creator ${creatorAccountName || user?.name || 'Community Creator'}`,
          },
        },
        user
      );
      setIsSubmitting(false);
      showToast(`Community "${newComm.name}" created successfully! 🎉`, 'success');
      onClose();
      navigate(`/communities/${newComm.id}`);
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-[24px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDF2F7] bg-gradient-to-r from-blue-50/60 to-purple-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#EEF4FF] border border-[#4F7DF6]/20 flex items-center justify-center text-[#4F7DF6]">
                <Users className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1E293B]">Create a Study Community</h3>
                <p className="text-xs text-[#64748B]">Customize category, icon, banner, share link & collaborate</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Free Cap Notice */}
            <div className="p-3.5 rounded-[14px] bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">First 10 Members Join Free!</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  The first 10 students join your community for free. After 10 members, new members pay your pass fee.
                </p>
              </div>
            </div>

            {/* Name Input */}
            <Input
              label="Community Name *"
              placeholder="e.g. Stanford AI & Robotics Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Subject Selector & Custom Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Subject Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomSubject(!isCustomSubject)}
                  className="text-xs text-[#4F7DF6] font-semibold hover:underline flex items-center gap-1"
                >
                  {isCustomSubject ? 'Choose from Presets' : '+ Type Custom Category'}
                </button>
              </div>

              {isCustomSubject ? (
                <Input
                  placeholder="Type custom category (e.g. Robotics & Automation, Bio-Tech...)"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  autoFocus
                />
              ) : (
                <select
                  value={subject}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM_OPTION') {
                      setIsCustomSubject(true);
                    } else {
                      setSubject(e.target.value);
                    }
                  }}
                  className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] p-3 text-sm text-[#1E293B] focus:outline-none transition-all"
                >
                  {PRESET_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="CUSTOM_OPTION">✏️ + Create Custom Category...</option>
                </select>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Community Description
              </label>
              <textarea
                rows={3}
                placeholder="What will members discuss, research, or study together?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white p-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all resize-none"
              />
            </div>

            {/* Icon Picker & Custom Icon Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Choose Community Icon / Emoji
              </label>
              
              <div className="flex flex-wrap gap-2">
                {EMOJI_ICONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => {
                      setIcon(e);
                      setCustomIcon('');
                    }}
                    className={`w-10 h-10 rounded-[12px] text-xl flex items-center justify-center transition-all ${
                      icon === e && !customIcon
                        ? 'bg-[#EEF4FF] border-2 border-[#4F7DF6] scale-110 shadow-sm'
                        : 'bg-[#F5F7FB] border border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              {/* Custom Emoji / Text Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Or type custom emoji (e.g. 🎯)"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-[12px] px-3 py-1.5 text-xs text-[#1E293B] outline-none w-48 font-bold"
                />
                <span className="text-[11px] text-[#94A3B8]">
                  Active Icon: <span className="text-lg">{customIcon || icon}</span>
                </span>
              </div>
            </div>

            {/* Banner Style Selector & Custom Banner Image URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Choose Banner Style
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBannerMode('preset')}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      bannerMode === 'preset'
                        ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6]'
                        : 'bg-slate-100 border-transparent text-[#64748B]'
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerMode('custom')}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      bannerMode === 'custom'
                        ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6]'
                        : 'bg-slate-100 border-transparent text-[#64748B]'
                    }`}
                  >
                    + Custom URL
                  </button>
                </div>
              </div>

              {bannerMode === 'preset' ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BANNER_PRESETS.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setBanner(b.url)}
                      className={`relative h-16 rounded-[12px] overflow-hidden cursor-pointer border-2 transition-all ${
                        banner === b.url ? 'border-[#4F7DF6] ring-2 ring-[#4F7DF6]/30' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={b.url} alt={b.label} className="w-full h-full object-cover" />
                      {banner === b.url && (
                        <div className="absolute inset-0 bg-[#4F7DF6]/30 flex items-center justify-center text-white">
                          <Check className="w-5 h-5" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    icon={LinkIcon}
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    value={customBanner}
                    onChange={(e) => setCustomBanner(e.target.value)}
                  />
                  {customBanner && (
                    <div className="relative h-20 rounded-[12px] overflow-hidden border border-[#E2E8F0] bg-slate-100">
                      <img
                        src={customBanner}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = BANNER_PRESETS[0].url;
                          showToast('Invalid image URL, using default', 'error');
                        }}
                      />
                      <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">
                        Live Preview
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Paid Fee & Direct Payout Receive Inputs */}
            <div className="p-4 rounded-[16px] bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Joining Fee & Direct Payout Details 💳
                </label>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  100% Direct Payout to Creator
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Pass Fee after 10 Free Members (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={joiningFee}
                    onChange={(e) => setJoiningFee(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-[#4F7DF6] focus:bg-slate-900 pl-8 pr-4 py-2 rounded-[12px] text-sm text-white font-bold focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Your Creator UPI ID (To Receive Payment) *
                  </label>
                  <input
                    type="text"
                    placeholder="creator@okaxis or creator@upi"
                    value={creatorUpiId}
                    onChange={(e) => setCreatorUpiId(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-[#4F7DF6] focus:bg-slate-900 px-3 py-2 rounded-[12px] text-xs text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Creator Account / Payee Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Sarah Chen / Alex Johnson"
                    value={creatorAccountName}
                    onChange={(e) => setCreatorAccountName(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-[#4F7DF6] focus:bg-slate-900 px-3 py-2 rounded-[12px] text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-300 italic">
                ℹ️ When students join past slot #10, their ₹{joiningFee || 199} fee will be paid directly to <span className="text-amber-300 font-bold">{creatorAccountName || 'You (Creator)'}</span> via <span className="text-blue-300 font-mono font-bold">{creatorUpiId || 'your UPI ID'}</span>.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF2F7]">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={Sparkles} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create & Generate Link'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
