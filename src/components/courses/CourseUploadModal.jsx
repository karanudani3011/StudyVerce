import React, { useState } from 'react';
import {
  X, Upload, Sparkles, Plus, Trash2, Video, FileText, CheckCircle2,
  Award, BookOpen, Layers, FolderPlus, Edit3, HelpCircle, ToggleLeft,
  ToggleRight, ChevronDown, ChevronUp, AlertCircle, GripVertical
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiPost } from '../../config/api';
import confetti from 'canvas-confetti';

// ─── Quiz Question Editor ────────────────────────────────────────────────────
function QuestionEditor({ question, index, onChange, onDelete, onMoveUp, onMoveDown, totalQuestions }) {
  const [expanded, setExpanded] = useState(true);

  const updateField = (field, value) => {
    onChange(index, { ...question, [field]: value });
  };

  const updateOption = (optIdx, value) => {
    const newOptions = [...question.options];
    newOptions[optIdx] = value;
    onChange(index, { ...question, options: newOptions });
  };

  const addOption = () => {
    if (question.options.length >= 6) return;
    onChange(index, { ...question, options: [...question.options, ''] });
  };

  const removeOption = (optIdx) => {
    if (question.options.length <= 2) return;
    const newOptions = question.options.filter((_, i) => i !== optIdx);
    const newCorrect = question.correctAnswer >= newOptions.length
      ? newOptions.length - 1
      : question.correctAnswer;
    onChange(index, { ...question, options: newOptions, correctAnswer: newCorrect });
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Question Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
        <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
        <span className="text-xs font-extrabold text-[#4F7DF6] flex-1">
          Q{index + 1} — {question.question?.slice(0, 50) || 'New Question'}
          {question.question?.length > 50 ? '...' : ''}
        </span>
        <div className="flex items-center gap-1">
          {index > 0 && (
            <button type="button" onClick={() => onMoveUp(index)}
              className="p-1 text-slate-400 hover:text-[#4F7DF6] transition-colors cursor-pointer">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
          {index < totalQuestions - 1 && (
            <button type="button" onClick={() => onMoveDown(index)}
              className="p-1 text-slate-400 hover:text-[#4F7DF6] transition-colors cursor-pointer">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
          <button type="button" onClick={() => setExpanded(!expanded)}
            className="p-1 text-slate-400 hover:text-[#1E293B] transition-colors cursor-pointer">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={() => onDelete(index)}
            className="p-1 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-1.5">
              Question Text *
            </label>
            <textarea
              rows={2}
              value={question.question}
              onChange={(e) => updateField('question', e.target.value)}
              placeholder="Enter your question here..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#1E293B] outline-none resize-none transition-all"
              required
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                Answer Options *
              </label>
              {question.options.length < 6 && (
                <button type="button" onClick={addOption}
                  className="text-[10px] font-bold text-[#4F7DF6] hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add Option
                </button>
              )}
            </div>
            <div className="space-y-2">
              {question.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('correctAnswer', optIdx)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      question.correctAnswer === optIdx
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-slate-300 hover:border-emerald-400'
                    }`}
                    title="Set as correct answer"
                  >
                    {question.correctAnswer === optIdx && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                  <span className="text-[10px] font-extrabold text-[#64748B] w-4 shrink-0">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(optIdx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                    className={`flex-1 bg-[#F8FAFC] border rounded-xl px-3 py-1.5 text-xs font-bold text-[#1E293B] outline-none transition-all ${
                      question.correctAnswer === optIdx
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-[#E2E8F0] focus:border-[#4F7DF6]'
                    }`}
                  />
                  {question.options.length > 2 && (
                    <button type="button" onClick={() => removeOption(optIdx)}
                      className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {question.correctAnswer !== null && question.correctAnswer !== undefined && (
              <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Correct: Option {String.fromCharCode(65 + question.correctAnswer)}
              </p>
            )}
          </div>

          {/* Explanation (optional) + Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-1.5">
                Explanation (Optional)
              </label>
              <input
                type="text"
                value={question.explanation || ''}
                onChange={(e) => updateField('explanation', e.target.value)}
                placeholder="Why is this the correct answer?"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl px-3 py-2 text-xs text-[#1E293B] outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-1.5">
                Points
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={question.points || 10}
                onChange={(e) => updateField('points', Number(e.target.value))}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Default new question ────────────────────────────────────────────────────
const defaultQuestion = () => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  points: 10,
  difficulty: 'medium',
});

// ─── Main Modal ─────────────────────────────────────────────────────────────
export function CourseUploadModal({ isOpen, onClose, onCourseCreated, currentUser }) {
  const [step, setStep] = useState(1); // 1=Basic, 2=Syllabus, 3=Quiz
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
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

  // Sections State
  const [sections, setSections] = useState([
    {
      sectionTitle: 'Section 1: Introduction & Foundations',
      lectures: [
        { title: 'Lecture 1: Overview & Prerequisites', duration: '15 mins', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', pdfUrl: '' },
        { title: 'Lecture 2: Core Concepts & Principles', duration: '25 mins', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', pdfUrl: '' }
      ]
    }
  ]);

  // Quiz State
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [questions, setQuestions] = useState([defaultQuestion()]);

  if (!isOpen) return null;

  // ─── Category Handlers ────────────────────────────────────────────────────
  const handleCategorySelectChange = (e) => {
    const val = e.target.value;
    setCategorySelect(val);
    if (val !== 'CUSTOM') setCategoryInput(val);
    else setCategoryInput('');
  };

  const handleSubcategorySelectChange = (e) => {
    const val = e.target.value;
    setSubcategorySelect(val);
    if (val !== 'CUSTOM') setSubcategoryInput(val);
    else setSubcategoryInput('');
  };

  // ─── Section Handlers ────────────────────────────────────────────────────
  const handleAddSection = () => {
    setSections(prev => [...prev, {
      sectionTitle: `Section ${prev.length + 1}: Advanced Topics & Projects`,
      lectures: [{ title: 'Lecture 1: Key Topic Details', duration: '20 mins', videoUrl: '', pdfUrl: '' }]
    }]);
  };

  const handleRemoveSection = (secIndex) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, i) => i !== secIndex));
  };

  const handleSectionTitleChange = (secIndex, val) => {
    setSections(prev => {
      const updated = [...prev];
      updated[secIndex].sectionTitle = val;
      return updated;
    });
  };

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

  const handleRemoveLectureFromSection = (secIndex, lecIndex) => {
    setSections(prev => {
      const updated = [...prev];
      if (updated[secIndex].lectures.length <= 1) return updated;
      updated[secIndex].lectures = updated[secIndex].lectures.filter((_, i) => i !== lecIndex);
      return updated;
    });
  };

  const handleLectureChange = (secIndex, lecIndex, field, value) => {
    setSections(prev => {
      const updated = [...prev];
      const lectures = [...updated[secIndex].lectures];
      lectures[lecIndex] = { ...lectures[lecIndex], [field]: value };
      updated[secIndex].lectures = lectures;
      return updated;
    });
  };

  // ─── Quiz Handlers ───────────────────────────────────────────────────────
  const handleQuestionChange = (index, updatedQuestion) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = updatedQuestion;
      return updated;
    });
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, defaultQuestion()]);
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setQuestions(prev => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated;
    });
  };

  const handleMoveDown = (index) => {
    if (index === questions.length - 1) return;
    setQuestions(prev => {
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated;
    });
  };

  // Validate quiz before submission
  const validateQuiz = () => {
    if (!hasQuiz) return true;
    if (!quizTitle.trim()) {
      alert('Please provide a quiz title.');
      return false;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1}: Question text is required.`);
        return false;
      }
      if (q.options.some(o => !o.trim())) {
        alert(`Question ${i + 1}: All options must be filled.`);
        return false;
      }
      if (q.correctAnswer === null || q.correctAnswer === undefined || q.correctAnswer < 0) {
        alert(`Question ${i + 1}: Please select the correct answer.`);
        return false;
      }
    }
    return true;
  };

  // ─── Form Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateQuiz()) return;
    setIsSubmitting(true);

    try {
      const finalCategory = categoryInput.trim() || 'General';
      const finalSubcategory = subcategoryInput.trim() || 'General';
      const allLecturesFlat = sections.flatMap(s => s.lectures.map(l => ({ ...l, section: s.sectionTitle })));
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      const coursePayload = {
        title,
        instructor: currentUser?.role === 'admin'
          ? '🛡️ StudyVerse Admin'
          : (currentUser?.name || 'Dr. Sarah Chen (Faculty)'),
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
        // Quiz (optional)
        hasQuiz,
        quiz: hasQuiz ? {
          title: quizTitle || `${title} — Final Quiz`,
          description: quizDescription,
          questions,
          passingScore,
          timeLimitMinutes,
          xpReward: 100,
        } : null,
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

  const steps = [
    { num: 1, label: 'Basic Details' },
    { num: 2, label: 'Sections & Syllabus' },
    { num: 3, label: 'Final Quiz' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white rounded-[24px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {currentUser?.role === 'admin' ? '🛡️ Admin Course Creator' : 'Upload New Course 🎓'}
              </h3>
              <p className="text-xs text-slate-300">Add course, sections, and optional final quiz</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-bold text-[#64748B] shrink-0">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => s.num <= 2 || title ? setStep(s.num) : null}
                className={`flex items-center gap-2 transition-colors cursor-pointer ${step === s.num ? 'text-[#4F7DF6]' : ''}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] transition-colors ${
                  step === s.num ? 'bg-[#4F7DF6] text-white' : step > s.num ? 'bg-emerald-500 text-white' : 'bg-slate-200'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-3 h-3" /> : s.num}
                </span>
                <span className="hidden sm:block">{s.label}</span>
              </button>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-[#E2E8F0] mx-2" />}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ─── STEP 1: BASIC DETAILS ─────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Course Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advanced React Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-[#1E293B]">Category *</label>
                  <select value={categorySelect} onChange={handleCategorySelectChange}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-bold text-[#1E293B] outline-none cursor-pointer">
                    <option value="Technology & CS">Technology & CS</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="CUSTOM">✍️ Type Custom...</option>
                  </select>
                  <input type="text" placeholder="Type category manually..." value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full bg-white border border-[#4F7DF6]/50 focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-black text-[#1E293B] outline-none"
                    required />
                </div>

                {/* Subcategory */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-[#1E293B]">Subcategory *</label>
                  <select value={subcategorySelect} onChange={handleSubcategorySelectChange}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-bold text-[#1E293B] outline-none cursor-pointer">
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                    <option value="Quantum Physics">Quantum Physics</option>
                    <option value="Organic Chemistry">Organic Chemistry</option>
                    <option value="CUSTOM">✍️ Type Custom...</option>
                  </select>
                  <input type="text" placeholder="Type subcategory..." value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    className="w-full bg-white border border-[#4F7DF6]/50 focus:border-[#4F7DF6] rounded-xl p-2.5 text-xs font-black text-[#1E293B] outline-none"
                    required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none cursor-pointer">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">Price</label>
                  <input type="text" placeholder="Free or $29.99" value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Estimated Duration" placeholder="e.g. 18 hrs" value={duration}
                  onChange={(e) => setDuration(e.target.value)} />
                <Input label="Tags (comma separated)" placeholder="React, JavaScript, Web"
                  value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>

              <Input label="Thumbnail Banner Image URL" placeholder="https://images.unsplash.com/..."
                value={image} onChange={(e) => setImage(e.target.value)} />

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">
                  Course Description
                </label>
                <textarea rows={3} placeholder="Write a clear summary of what students will master..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl p-3 text-xs text-[#1E293B] outline-none resize-none" />
              </div>
            </div>
          )}

          {/* ─── STEP 2: SECTIONS & SYLLABUS ──────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1E293B]">Course Sections & Syllabus</h4>
                  <p className="text-[11px] text-[#64748B]">Organize course materials into sections and video lectures</p>
                </div>
                <button type="button" onClick={handleAddSection}
                  className="px-3.5 py-2 rounded-xl bg-[#4F7DF6] text-white hover:bg-blue-600 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                  <FolderPlus className="w-4 h-4" /> + Add Section
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((sec, secIdx) => (
                  <div key={secIdx} className="p-5 rounded-2xl border border-blue-200 bg-[#F8FAFC] space-y-4">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Layers className="w-4 h-4 text-[#4F7DF6] shrink-0" />
                        <input type="text" value={sec.sectionTitle}
                          onChange={(e) => handleSectionTitleChange(secIdx, e.target.value)}
                          placeholder="Section Title"
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl px-3 py-2 text-xs font-black text-[#1E293B] outline-none" />
                      </div>
                      {sections.length > 1 && (
                        <button type="button" onClick={() => handleRemoveSection(secIdx)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3 pl-2">
                      {sec.lectures.map((lec, lecIdx) => (
                        <div key={lecIdx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-[#4F7DF6]">Lecture #{lecIdx + 1}</span>
                            {sec.lectures.length > 1 && (
                              <button type="button" onClick={() => handleRemoveLectureFromSection(secIdx, lecIdx)}
                                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="sm:col-span-2">
                              <input type="text" placeholder="Lecture Title" value={lec.title}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'title', e.target.value)}
                                className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1E293B] outline-none" />
                            </div>
                            <div>
                              <input type="text" placeholder="Duration (e.g. 15 mins)" value={lec.duration}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'duration', e.target.value)}
                                className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#1E293B] outline-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                              <Video className="w-3.5 h-3.5 text-[#4F7DF6] shrink-0" />
                              <input type="text" placeholder="Video URL (YouTube/Vimeo)" value={lec.videoUrl}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'videoUrl', e.target.value)}
                                className="w-full text-xs text-[#1E293B] outline-none bg-transparent" />
                            </div>
                            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                              <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <input type="text" placeholder="PDF Resource URL" value={lec.pdfUrl}
                                onChange={(e) => handleLectureChange(secIdx, lecIdx, 'pdfUrl', e.target.value)}
                                className="w-full text-xs text-[#1E293B] outline-none bg-transparent" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddLectureToSection(secIdx)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#4F7DF6] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5" /> + Add Lecture
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 3: OPTIONAL FINAL QUIZ ──────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Toggle */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-gradient-to-br from-slate-50 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${hasQuiz ? 'bg-[#4F7DF6]/10 border-[#4F7DF6]/30 text-[#4F7DF6]' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1E293B]">Final Quiz</h4>
                      <p className="text-xs text-[#64748B]">
                        {hasQuiz
                          ? 'Quiz enabled — students must pass to earn certificate'
                          : 'Quiz disabled — students get certificate on 100% course completion'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasQuiz(!hasQuiz)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${hasQuiz ? 'bg-[#4F7DF6]' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${hasQuiz ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                {!hasQuiz && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-700 font-semibold">
                      Students will receive a certificate automatically after completing all lessons (100% progress).
                    </p>
                  </div>
                )}
              </div>

              {/* Quiz Builder */}
              {hasQuiz && (
                <div className="space-y-5">
                  {/* Quiz Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">Quiz Title *</label>
                      <input type="text" placeholder="e.g. Web Development Final Quiz"
                        value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none transition-all"
                        required={hasQuiz} />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">
                        Passing Score *
                      </label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={50} max={100} step={5}
                          value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))}
                          className="flex-1 accent-[#4F7DF6]" />
                        <span className="text-sm font-extrabold text-[#4F7DF6] w-12 text-center">{passingScore}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">
                        Time Limit (minutes)
                      </label>
                      <input type="number" min={5} max={120} value={timeLimitMinutes}
                        onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl p-3 text-xs font-bold text-[#1E293B] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#64748B] mb-1.5">Quiz Description (optional)</label>
                    <textarea rows={2} placeholder="Brief description of what the quiz covers..."
                      value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl p-3 text-xs text-[#1E293B] outline-none resize-none" />
                  </div>

                  {/* Quiz Stats */}
                  <div className="flex items-center gap-4 p-3 bg-[#EEF4FF] rounded-xl border border-[#4F7DF6]/20">
                    <div className="text-center">
                      <div className="text-xl font-extrabold text-[#4F7DF6]">{questions.length}</div>
                      <div className="text-[10px] text-[#64748B] font-bold">Questions</div>
                    </div>
                    <div className="w-px h-8 bg-[#E2E8F0]" />
                    <div className="text-center">
                      <div className="text-xl font-extrabold text-emerald-600">{passingScore}%</div>
                      <div className="text-[10px] text-[#64748B] font-bold">Pass Score</div>
                    </div>
                    <div className="w-px h-8 bg-[#E2E8F0]" />
                    <div className="text-center">
                      <div className="text-xl font-extrabold text-purple-600">{timeLimitMinutes}m</div>
                      <div className="text-[10px] text-[#64748B] font-bold">Time Limit</div>
                    </div>
                    <div className="ml-auto">
                      <p className="text-[10px] text-[#64748B]">
                        Total points: <strong className="text-[#1E293B]">{questions.reduce((s, q) => s + (q.points || 10), 0)}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#1E293B]">
                        Questions ({questions.length})
                      </h4>
                      <button type="button" onClick={handleAddQuestion}
                        className="px-3.5 py-2 rounded-xl bg-[#4F7DF6] text-white hover:bg-blue-600 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer">
                        <Plus className="w-4 h-4" /> Add Question
                      </button>
                    </div>
                    {questions.map((q, idx) => (
                      <QuestionEditor
                        key={idx}
                        question={q}
                        index={idx}
                        onChange={handleQuestionChange}
                        onDelete={handleDeleteQuestion}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        totalQuestions={questions.length}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── FOOTER NAVIGATION ─────────────────────────────────────── */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3 shrink-0">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => setStep(step - 1)}>
                  ← Back
                </Button>
              )}
              {step === 1 && <span className="text-xs text-[#64748B]">Fill required details to proceed</span>}
            </div>
            <div className="flex items-center gap-2">
              {step < 3 ? (
                <Button type="button" variant="primary" size="sm"
                  onClick={() => {
                    if (step === 1 && !title.trim()) {
                      alert('Please provide a course title.');
                      return;
                    }
                    setStep(step + 1);
                  }}>
                  {step === 2 ? 'Next: Final Quiz →' : 'Next: Sections →'}
                </Button>
              ) : (
                <Button type="submit" variant="accent" size="sm" icon={Sparkles} disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : `Publish Course 🚀${hasQuiz ? ' + Quiz' : ''}`}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
