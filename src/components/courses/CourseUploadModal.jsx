import React, { useState } from 'react';
import { X, Upload, Sparkles, Plus, Trash2, Video, FileText, CheckCircle2, Award, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiPost } from '../../config/api';
import confetti from 'canvas-confetti';

export function CourseUploadModal({ isOpen, onClose, onCourseCreated, currentUser }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [category, setCategory] = useState('Technology & CS');
  const [subcategory, setSubcategory] = useState('Artificial Intelligence');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('Free');
  const [duration, setDuration] = useState('12 hrs');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('AI, MachineLearning, Python');

  // Lectures State
  const [lectures, setLectures] = useState([
    { title: 'Lecture 1: Course Overview & Prerequisites', duration: '15 mins', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', pdfUrl: '' },
    { title: 'Lecture 2: Core Concepts & Principles', duration: '25 mins', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', pdfUrl: '' }
  ]);

  if (!isOpen) return null;

  const handleAddLecture = () => {
    setLectures(prev => [
      ...prev,
      { title: `Lecture ${prev.length + 1}: Key Topic Details`, duration: '20 mins', videoUrl: '', pdfUrl: '' }
    ]);
  };

  const handleRemoveLecture = (index) => {
    setLectures(prev => prev.filter((_, i) => i !== index));
  };

  const handleLectureChange = (index, field, value) => {
    setLectures(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const coursePayload = {
        title,
        instructor: currentUser?.name || 'Dr. Sarah Chen (Faculty)',
        instructorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&q=80&w=100',
        image,
        tags: tagArray.length > 0 ? tagArray : ['Education', 'Online Course'],
        duration,
        lessons: lectures.length,
        level,
        price,
        subject,
        category,
        subcategory,
        description,
        lectures,
      };

      const res = await apiPost('/courses', coursePayload);
      const newCourse = res.data || coursePayload;

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onCourseCreated(newCourse);
      onClose();
    } catch (err) {
      console.error('Failed to publish course:', err);
      alert(err.message || 'Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white rounded-[24px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Upload New Course 🎓</h3>
              <p className="text-xs text-slate-300">Tutor & Faculty Course Creator Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-bold text-[#64748B]">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${step === 1 ? 'text-[#4F7DF6]' : ''}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-[#4F7DF6] text-white' : 'bg-slate-200'}`}>1</span>
            Basic Information
          </button>
          <div className="w-8 h-px bg-[#E2E8F0]" />
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${step === 2 ? 'text-[#4F7DF6]' : ''}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-[#4F7DF6] text-white' : 'bg-slate-200'}`}>2</span>
            Syllabus & Lectures ({lectures.length})
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <Input
                label="Course Title *"
                placeholder="e.g. Advanced Quantum Computing for Machine Learning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
                  >
                    <option value="Technology & CS">Technology & CS</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Subcategory *</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Subject Tag</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Price / Access</label>
                  <input
                    type="text"
                    placeholder="Free or $29.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Estimated Duration"
                  placeholder="e.g. 18 hrs"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <Input
                  label="Tags (comma separated)"
                  placeholder="AI, Qiskit, Python"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <Input
                label="Thumbnail Banner Image URL"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Course Description & Learning Outcomes</label>
                <textarea
                  rows={3}
                  placeholder="Write a clear summary of what students will master..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs text-[#1E293B] outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B]">Syllabus Modules & Video Lectures</h4>
                <button
                  type="button"
                  onClick={handleAddLecture}
                  className="px-3 py-1.5 rounded-lg bg-[#EEF4FF] text-[#4F7DF6] hover:bg-[#D9E6FF] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Lecture Module
                </button>
              </div>

              <div className="space-y-3">
                {lectures.map((lec, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4F7DF6]">Lecture #{idx + 1}</span>
                      {lectures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLecture(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Lecture Title"
                          value={lec.title}
                          onChange={(e) => handleLectureChange(idx, 'title', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-[#1E293B] outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Duration (e.g. 15 mins)"
                          value={lec.duration}
                          onChange={(e) => handleLectureChange(idx, 'duration', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                        <Video className="w-3.5 h-3.5 text-[#4F7DF6] shrink-0" />
                        <input
                          type="text"
                          placeholder="Video Embed URL (YouTube/Vimeo)"
                          value={lec.videoUrl}
                          onChange={(e) => handleLectureChange(idx, 'videoUrl', e.target.value)}
                          className="w-full text-xs text-[#1E293B] outline-none bg-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <input
                          type="text"
                          placeholder="Lecture Slides / PDF Resource URL"
                          value={lec.pdfUrl}
                          onChange={(e) => handleLectureChange(idx, 'pdfUrl', e.target.value)}
                          className="w-full text-xs text-[#1E293B] outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
            {step === 2 ? (
              <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)}>
                Back to Basic Info
              </Button>
            ) : (
              <span className="text-xs text-[#64748B]">Fill required details to proceed</span>
            )}

            {step === 1 ? (
              <Button type="button" variant="primary" size="sm" onClick={() => { if (title) setStep(2); else alert('Please provide a course title'); }}>
                Next: Add Syllabus
              </Button>
            ) : (
              <Button type="submit" variant="accent" size="sm" icon={Sparkles} disabled={isSubmitting}>
                {isSubmitting ? 'Publishing Course...' : 'Publish Course 🚀'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
