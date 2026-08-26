import React, { useState } from 'react';
import { X, Upload, Sparkles, Plus, Trash2, Video, FileText, CheckCircle2, Award, BookOpen, Layers, FolderPlus, Edit3 } from 'lucide-react';
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
  
  // Category & Subcategory State (Dual Dropdown + Manual Textbox)
  const [categorySelect, setCategorySelect] = useState('Technology & CS');
  const [categoryInput, setCategoryInput] = useState('Technology & CS');

  const [subcategorySelect, setSubcategorySelect] = useState('Artificial Intelligence');
  const [subcategoryInput, setSubcategoryInput] = useState('Artificial Intelligence');

  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('Free');
  const [duration, setDuration] = useState('12 hrs');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('AI, MachineLearning, Python');

  // Course Sections & Lectures State
  const [sections, setSections] = useState([
    {
      sectionTitle: 'Section 1: Introduction & Foundations',
      lectures: [
        { title: 'Lecture 1: Overview & Prerequisites', duration: '15 mins', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', pdfUrl: '' },
        { title: 'Lecture 2: Core Concepts & Principles', duration: '25 mins', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', pdfUrl: '' }
      ]
    }
  ]);

  if (!isOpen) return null;

  // Handle Category Select Change
  const handleCategorySelectChange = (e) => {
    const val = e.target.value;
    setCategorySelect(val);
    if (val !== 'CUSTOM') {
      setCategoryInput(val);
    } else {
      setCategoryInput('');
    }
  };

  // Handle Subcategory Select Change
  const handleSubcategorySelectChange = (e) => {
    const val = e.target.value;
    setSubcategorySelect(val);
    if (val !== 'CUSTOM') {
      setSubcategoryInput(val);
    } else {
      setSubcategoryInput('');
    }
  };

  // Add Section
  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      {
        sectionTitle: `Section ${prev.length + 1}: Advanced Topics & Projects`,
        lectures: [
          { title: 'Lecture 1: Key Topic Details', duration: '20 mins', videoUrl: '', pdfUrl: '' }
        ]
      }
    ]);
  };

  // Remove Section
  const handleRemoveSection = (secIndex) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, i) => i !== secIndex));
  };

  // Update Section Title
  const handleSectionTitleChange = (secIndex, val) => {
    setSections(prev => {
      const updated = [...prev];
      updated[secIndex].sectionTitle = val;
      return updated;
    });
  };

  // Add Lecture to Section
  const handleAddLectureToSection = (secIndex) => {
    setSections(prev => {
      const updated = [...prev];
      const curLectures = updated[secIndex].lectures;
      updated[secIndex].lectures = [
        ...curLectures,
        { title: `Lecture ${curLectures.length + 1}: Lesson Details`, duration: '15 mins', videoUrl: '', pdfUrl: '' }
      ];
      return updated;
    });
  };

  // Remove Lecture from Section
  const handleRemoveLectureFromSection = (secIndex, lecIndex) => {
    setSections(prev => {
      const updated = [...prev];
      if (updated[secIndex].lectures.length <= 1) return updated;
      updated[secIndex].lectures = updated[secIndex].lectures.filter((_, i) => i !== lecIndex);
      return updated;
    });
  };

  // Update Lecture Field
  const handleLectureChange = (secIndex, lecIndex, field, value) => {
    setSections(prev => {
      const updated = [...prev];
      const lectures = [...updated[secIndex].lectures];
      lectures[lecIndex] = { ...lectures[lecIndex], [field]: value };
      updated[secIndex].lectures = lectures;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalCategory = categoryInput.trim() || 'General';
      const finalSubcategory = subcategoryInput.trim() || 'General';
      
      const allLecturesFlat = sections.flatMap(s => s.lectures.map(l => ({ ...l, section: s.sectionTitle })));

      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const coursePayload = {
        title,
        instructor: currentUser?.role === 'admin' ? '🛡️ StudyVerse Admin' : (currentUser?.name || 'Dr. Sarah Chen (Faculty)'),
        instructorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&w=800&q=80',
        image,
        tags: tagArray.length > 0 ? tagArray : ['Education', 'Online Course'],
        duration,
        lessons: allLecturesFlat.length,
        level,
        price,
        subject,
        category: finalCategory,
        subcategory: finalSubcategory,
        description,
        sections,
        lectures: allLecturesFlat,
      };

      const res = await apiPost('/courses', coursePayload);
      const newCourse = res.data || coursePayload;

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onCourseCreated) onCourseCreated(newCourse);
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
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {currentUser?.role === 'admin' ? '🛡️ Admin Course & Category Creator' : 'Upload New Course 🎓'}
              </h3>
              <p className="text-xs text-slate-300">Add & Manage Category, Subcategory, Course & Sections</p>
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
            Basic Details & Categories
          </button>
          <div className="w-8 h-px bg-[#E2E8F0]" />
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${step === 2 ? 'text-[#4F7DF6]' : ''}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-[#4F7DF6] text-white' : 'bg-slate-200'}`}>2</span>
            Course Sections & Syllabus
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-5">
              {/* COURSE TITLE TEXTBOX */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Course Title (Manual Textbox) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Quantum Computing for Machine Learning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none transition-all shadow-sm"
                  required
                />
              </div>

              {/* DUAL DROPDOWN & TEXTBOX FOR CATEGORY & SUBCATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                
                {/* CATEGORY DROPDOWN + TEXTBOX */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#1E293B]">
                      Category *
                    </label>
                    <span className="text-[10px] text-blue-600 font-extrabold flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Select or Type Below
                    </span>
                  </div>

                  {/* Category Dropdown */}
                  <select
                    value={categorySelect}
                    onChange={handleCategorySelectChange}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-bold text-[#1E293B] outline-none shadow-sm cursor-pointer"
                  >
                    <option value="Technology & CS">Technology & CS</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="CUSTOM">✍️ Type Custom Category...</option>
                  </select>

                  {/* Category Manual Textbox */}
                  <input
                    type="text"
                    placeholder="Type category manually..."
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full bg-white border border-[#4F7DF6]/50 focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-black text-[#1E293B] outline-none shadow-inner"
                    required
                  />
                </div>

                {/* SUBCATEGORY DROPDOWN + TEXTBOX */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#1E293B]">
                      Subcategory *
                    </label>
                    <span className="text-[10px] text-blue-600 font-extrabold flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Select or Type Below
                    </span>
                  </div>

                  {/* Subcategory Dropdown */}
                  <select
                    value={subcategorySelect}
                    onChange={handleSubcategorySelectChange}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-bold text-[#1E293B] outline-none shadow-sm cursor-pointer"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Quantum Physics">Quantum Physics</option>
                    <option value="Organic Chemistry">Organic Chemistry</option>
                    <option value="Molecular Biology">Molecular Biology</option>
                    <option value="CUSTOM">✍️ Type Custom Subcategory...</option>
                  </select>

                  {/* Subcategory Manual Textbox */}
                  <input
                    type="text"
                    placeholder="Type subcategory manually..."
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    className="w-full bg-white border border-[#4F7DF6]/50 focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-black text-[#1E293B] outline-none shadow-inner"
                    required
                  />
                </div>

              </div>

              {/* SUBJECT & LEVEL & PRICE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Subject / Domain Textbox</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Price / Access Textbox</label>
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
                <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5 ml-0.5">Course Description & Learning Outcomes</label>
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
            /* STEP 2: SECTIONS & SYLLABUS MANAGEMENT */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1E293B]">Course Sections & Syllabus Structure</h4>
                  <p className="text-[11px] text-[#64748B]">Organize course materials into sections and video lectures</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3.5 py-2 rounded-xl bg-[#4F7DF6] text-white hover:bg-blue-600 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <FolderPlus className="w-4 h-4" /> + Add Section
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((sec, secIdx) => (
                  <div key={secIdx} className="p-5 rounded-2xl border border-blue-200 bg-[#F8FAFC] space-y-4 relative shadow-sm">
                    
                    {/* Section Header Input */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Layers className="w-4 h-4 text-[#4F7DF6] shrink-0" />
                        <input
                          type="text"
                          value={sec.sectionTitle}
                          onChange={(e) => handleSectionTitleChange(secIdx, e.target.value)}
                          placeholder="Section Title (e.g. Section 1: Core Mechanics)"
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl px-3 py-2 text-xs font-black text-[#1E293B] outline-none"
                        />
                      </div>
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(secIdx)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          title="Remove Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Section Lectures List */}
                    <div className="space-y-3 pl-2">
                      {sec.lectures.map((lec, lecIdx) => (
                        <div key={lecIdx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-[#4F7DF6]">Lecture #{lecIdx + 1}</span>
                            {sec.lectures.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLectureFromSection(secIdx, lecIdx)}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                placeholder="Lecture Title"
                                value={lec.title}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'title', e.target.value)}
                                className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1E293B] outline-none"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Duration (e.g. 15 mins)"
                                value={lec.duration}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'duration', e.target.value)}
                                className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#1E293B] outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                              <Video className="w-3.5 h-3.5 text-[#4F7DF6] shrink-0" />
                              <input
                                type="text"
                                placeholder="Video Embed URL (YouTube/Vimeo)"
                                value={lec.videoUrl}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'videoUrl', e.target.value)}
                                className="w-full text-xs text-[#1E293B] outline-none bg-transparent"
                              />
                            </div>
                            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                              <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <input
                                type="text"
                                placeholder="Lecture Slides / PDF Resource URL"
                                value={lec.pdfUrl}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'pdfUrl', e.target.value)}
                                className="w-full text-xs text-[#1E293B] outline-none bg-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddLectureToSection(secIdx)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#4F7DF6] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> + Add Lecture to {sec.sectionTitle.split(':')[0]}
                      </button>
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
                Back to Basic Info & Category
              </Button>
            ) : (
              <span className="text-xs text-[#64748B]">Fill required details to proceed</span>
            )}

            {step === 1 ? (
              <Button type="button" variant="primary" size="sm" onClick={() => { if (title) setStep(2); else alert('Please provide a course title'); }}>
                Next: Configure Sections & Syllabus
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
