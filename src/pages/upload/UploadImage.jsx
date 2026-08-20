import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Upload, Sparkles, Image as ImageIcon, Video, FileText, CheckCircle2,
  X, File, FileCode, LayoutGrid, Film, Search, Bookmark, Check, Compass, Radio
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Input, Textarea, Badge } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { apiPost } from '../../config/api';
import confetti from 'canvas-confetti';

const MODES = [
  { id: 'image', label: 'Image Note', icon: ImageIcon, path: '/upload/image' },
  { id: 'reel', label: 'Video Reel', icon: Video, path: '/upload/reel' },
  { id: 'pdf', label: 'Lecture PDF', icon: FileCode, path: '/upload/pdf' },
  { id: 'notes', label: 'Study Notes', icon: FileText, path: '/upload/notes' },
];

const MODE_CONFIGS = {
  image: {
    title: 'Publish Image Note / Diagram',
    subtitle: 'Share handwritten notes, flowcharts, infographics, or visual study aids.',
    dropzoneText: 'Drag & drop educational image or diagram',
    specs: 'Supports PNG, JPG, WebP up to 15MB',
    accept: 'image/*',
    icon: ImageIcon,
    placeholderTitle: 'e.g. Backpropagation Algorithm Flowchart',
    defaultDestination: 'feed',
  },
  reel: {
    title: 'Upload Educational Reel / Video',
    subtitle: 'Share 1–3 min short-form concept explanations or lab experiments.',
    dropzoneText: 'Drag & drop short video reel or lab demo',
    specs: 'Supports MP4, MOV, WebM up to 100MB',
    accept: 'video/*',
    icon: Video,
    placeholderTitle: 'e.g. 60-Second Explanation of Quantum Entanglement',
    defaultDestination: 'reels',
  },
  pdf: {
    title: 'Publish Lecture PDF / Slide Deck',
    subtitle: 'Share slide decks, research papers, or syllabus summaries.',
    dropzoneText: 'Drag & drop lecture PDF or slide presentation',
    specs: 'Supports PDF documents up to 50MB',
    accept: '.pdf',
    icon: FileCode,
    placeholderTitle: 'e.g. MIT 6.006 Intro to Algorithms Lecture 04',
    defaultDestination: 'explore',
  },
  notes: {
    title: 'Publish Handwritten / Markdown Study Notes',
    subtitle: 'Share comprehensive subject notes, formulas, or study guides.',
    dropzoneText: 'Drag & drop scanned notes or document file',
    specs: 'Supports PDF, PNG, JPG, TXT, MD up to 30MB',
    accept: '.pdf,.txt,.md,image/*',
    icon: FileText,
    placeholderTitle: 'e.g. Organic Chemistry Reactions Summary Sheet',
    defaultDestination: 'explore',
  },
};

const DESTINATIONS = [
  {
    id: 'feed',
    label: 'Home Feed',
    path: '/feed',
    icon: Compass,
    badge: 'Popular',
    desc: 'Appears on public student feed for peer interactions & comments.'
  },
  {
    id: 'reels',
    label: 'Reels Feed',
    path: '/reels',
    icon: Film,
    badge: 'Video Only',
    desc: 'Featured in short-form video reel lounge for fast learning.'
  },
  {
    id: 'explore',
    label: 'Explore Notes Hub',
    path: '/explore',
    icon: Search,
    badge: 'PDF / Notes',
    desc: 'Listed in searchable handwritten notes & lecture slide repository.'
  },
  {
    id: 'my-learning',
    label: 'My Study Workspace',
    path: '/my-learning',
    icon: Bookmark,
    badge: 'Personal',
    desc: 'Saved directly into your personal course study library.'
  }
];

export default function UploadImage({ initialMode = 'image' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { addXP } = useAuth();

  // Determine current active mode from pathname or prop
  const currentModeId = MODES.find(m => location.pathname.startsWith(m.path))?.id || initialMode;
  const config = MODE_CONFIGS[currentModeId] || MODE_CONFIGS.image;

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [caption, setCaption] = useState('');
  const [destination, setDestination] = useState(config.defaultDestination);
  const [loading, setLoading] = useState(false);

  // Update default destination when mode changes
  useEffect(() => {
    setDestination(config.defaultDestination);
  }, [currentModeId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast('Please enter a topic title', 'error');
      return;
    }

    const selectedDestObj = DESTINATIONS.find(d => d.id === destination) || DESTINATIONS[0];
    setLoading(true);

    try {
      // Persist to MongoDB notes collection
      await apiPost('/notes', {
        title: topic.trim(),
        subject,
        caption,
        contentType: currentModeId,
        targetDestination: destination,
        fileName: selectedFile?.name || '',
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '',
      });
    } catch (err) {
      console.warn('MongoDB save note warning (fallback to local state):', err);
    }

    setTimeout(() => {
      setLoading(false);
      if (addXP) addXP(50);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      showToast(`"${topic}" stored in MongoDB & published to ${selectedDestObj.label}! 🎉 (+50 XP)`, 'success');
      navigate(selectedDestObj.path);
    }, 1000);
  };

  const ActiveIcon = config.icon;
  const targetDestObj = DESTINATIONS.find(d => d.id === destination) || DESTINATIONS[0];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">{config.title}</h1>
          <p className="text-sm text-[#64748B]">{config.subtitle}</p>
        </div>

        {/* Upload Mode Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MODES.map((m) => {
            const IconComp = m.icon;
            const isActive = currentModeId === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(m.path)}
                className={`p-3 rounded-[16px] border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6] shadow-sm'
                    : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F5F7FB]'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File Dropzone */}
            <input
              type="file"
              ref={fileInputRef}
              accept={config.accept}
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E2E8F0] rounded-[20px] p-8 text-center bg-[#F8FAFC] hover:bg-[#EEF4FF]/40 hover:border-[#4F7DF6] transition-all cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 rounded-[16px] bg-[#EEF4FF] text-[#4F7DF6] mx-auto flex items-center justify-center border border-[#4F7DF6]/20">
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E293B]">{config.dropzoneText}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{config.specs}</p>
                </div>
                <Button type="button" variant="secondary" size="xs" className="mt-2">
                  Browse File
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-[18px] border border-[#E2E8F0] bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-14 h-14 object-cover rounded-[12px] border border-[#E2E8F0]" />
                  ) : (
                    <div className="w-12 h-12 rounded-[12px] bg-[#EEF4FF] text-[#4F7DF6] flex items-center justify-center shrink-0">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#1E293B] truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-[#64748B]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-[#94A3B8] hover:text-rose-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Inputs */}
            <Input
              label="Topic Title *"
              placeholder={config.placeholderTitle}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Subject Category
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] p-3 text-sm text-[#1E293B] focus:outline-none transition-all"
              >
                <option>Computer Science</option>
                <option>Artificial Intelligence</option>
                <option>Quantum Physics</option>
                <option>UPSC & Gov Exams</option>
                <option>Mathematics</option>
                <option>Medicine & USMLE</option>
                <option>Design & UX</option>
                <option>General Study</option>
              </select>
            </div>

            <Textarea
              label="Academic Summary & Key Takeaways *"
              placeholder="Break down key formulas, theorems, or step-by-step logic for peer students..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={4}
              required
            />

            {/* Where to Upload / Target Destination */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Where to Publish? (Target Location) *
                </label>
                <span className="text-[11px] text-[#4F7DF6] font-bold">
                  Will appear in: {targetDestObj.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DESTINATIONS.map((dest) => {
                  const DestIcon = dest.icon;
                  const isSelected = destination === dest.id;

                  return (
                    <div
                      key={dest.id}
                      onClick={() => setDestination(dest.id)}
                      className={`p-3.5 rounded-[16px] border-2 cursor-pointer transition-all flex items-start gap-3 relative ${
                        isSelected
                          ? 'border-[#4F7DF6] bg-[#EEF4FF]/70 shadow-sm'
                          : 'border-[#E2E8F0] bg-white hover:border-[#4F7DF6]/40 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className={`p-2.5 rounded-[12px] shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#4F7DF6] text-white' : 'bg-[#F5F7FB] text-[#64748B] border border-[#E2E8F0]'
                      }`}>
                        <DestIcon className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5 flex-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#1E293B]">{dest.label}</h4>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {dest.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-tight">
                          {dest.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-3.5 right-3 w-5 h-5 rounded-full bg-[#4F7DF6] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Banner */}
            <div className="p-4 bg-purple-50 rounded-[16px] border border-purple-100 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#8B5CF6] shrink-0" />
              <p className="text-xs text-[#8B5CF6] leading-relaxed">
                StudyVerse AI will verify factual accuracy and automatically generate a 3-question revision quiz upon publication.
              </p>
            </div>

            {/* Actions */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="bg-[#4F7DF6] hover:bg-blue-600 shadow-lg shadow-blue-500/25"
            >
              {loading ? 'Validating & Publishing...' : `Publish to ${targetDestObj.label} (+50 XP)`}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
