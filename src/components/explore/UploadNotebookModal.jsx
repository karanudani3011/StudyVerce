import React, { useState } from 'react';
import { X, Sparkles, FileText, Image as ImageIcon, BookOpen, Upload, Layers, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiPost } from '../../config/api';
import confetti from 'canvas-confetti';

export function UploadNotebookModal({ isOpen, onClose, onNotebookUploaded, currentUser }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [formatType, setFormatType] = useState('Handwritten Pages'); // Handwritten Pages, Notebook Photos, Diagrams & Mindmaps, Formula Sheets
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
  const [pageImages, setPageImages] = useState([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
  ]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [tags, setTags] = useState('handwritten, notes, study');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a Notebook Title');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagArray = tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

      const notePayload = {
        title,
        subject,
        type: formatType,
        format: formatType,
        description,
        coverImage,
        previewImages: pageImages,
        pdfUrl: pdfUrl || coverImage,
        tags: tagArray,
        targetDestination: 'explore',
        author: {
          name: currentUser?.name || 'Academic Scholar',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          university: currentUser?.institution || 'Stanford University',
        },
        likesCount: 1,
        savesCount: 1,
        pagesCount: pageImages.length || 12,
        rating: 4.9,
      };

      const res = await apiPost('/notes', notePayload);
      const createdNote = res.data || notePayload;

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onNotebookUploaded(createdNote);
      onClose();
    } catch (err) {
      console.error('Notebook Upload Error:', err);
      alert(err.message || 'Failed to upload notebook scan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#4F7DF6] to-[#3B82F6] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 border border-white/30 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Upload Handmade Notebook 📝</h3>
              <p className="text-xs text-blue-100">Publish handwritten notes & diagrams to Explore Vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <Input
            label="Notebook / Notes Title *"
            placeholder="e.g. Organic Chemistry Reaction Mechanisms - Full Class Scans"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">
                Subject Category *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="UPSC & Competitive Exam">UPSC & Competitive Exam</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">
                Notebook Format *
              </label>
              <select
                value={formatType}
                onChange={(e) => setFormatType(e.target.value)}
                className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
              >
                <option value="Handwritten Pages">Handwritten Pages 📝</option>
                <option value="Notebook Photos">Notebook Photos 📷</option>
                <option value="Diagrams & Mindmaps">Diagrams & Mindmaps 🎨</option>
                <option value="Formula Sheets">Formula Sheets ⚡</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">
              Notebook Cover Image / First Page Scan URL
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs text-[#1E293B] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">
              Summary & Topics Covered
            </label>
            <textarea
              rows={3}
              placeholder="Briefly describe what formulas, theorems, or topics are written in these notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs text-[#1E293B] outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="PDF Download URL (Optional)"
              placeholder="https://drive.google.com/..."
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
            <Input
              label="Tags (Comma Separated)"
              placeholder="handwritten, physics, formulas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Sparkles} disabled={isSubmitting}>
              {isSubmitting ? 'Uploading to Hub...' : 'Publish to Notes Hub 🚀'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
