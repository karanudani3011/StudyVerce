import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  GraduationCap, BookOpen, Star, Users, TrendingUp,
  Plus, Award, BarChart3, MessageSquare, Edit3, Trash2,
  Sparkles, Clock, CheckCircle2, ChevronRight, Video,
  Calendar, FileText, Download, ShieldCheck, Zap, Send,
  Share2, ArrowUpRight, Check, Eye, HelpCircle, Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CourseUploadModal } from '../../components/courses/CourseUploadModal';
import { UploadNotebookModal } from '../../components/explore/UploadNotebookModal';
import { MOCK_COURSES } from '../../data/mockData';
import confetti from 'canvas-confetti';

const MOCK_TEACHING_NOTES = [
  { id: 'n1', title: 'Complete Backpropagation & Matrix Calculus Handbook', subject: 'Machine Learning', format: 'Handwritten Pages', downloads: 1420, likes: 380, pages: 28, uploaded: '3 days ago' },
  { id: 'n2', title: 'Quantum Superposition & Wavefunction Collapse Summary', subject: 'Physics', format: 'Formula Sheets', downloads: 890, likes: 215, pages: 14, uploaded: '1 week ago' },
  { id: 'n3', title: 'Data Structures & Algorithmic Complexity Cheatsheet', subject: 'Computer Science', format: 'Diagrams & Mindmaps', downloads: 2310, likes: 640, pages: 8, uploaded: '2 weeks ago' },
];

const INITIAL_STUDENT_QUESTIONS = [
  { id: 1, student: 'Alex Johnson', avatar: 'https://i.pravatar.cc/40?img=1', question: 'Can you explain backpropagation in neural networks in simpler terms?', course: 'Advanced ML with Python', time: '2 mins ago', status: 'pending' },
  { id: 2, student: 'Priya Sharma', avatar: 'https://i.pravatar.cc/40?img=5', question: 'What is the exact distinction between bias and variance error?', course: 'Data Science Fundamentals', time: '18 mins ago', status: 'pending' },
  { id: 3, student: 'Marcus Lee', avatar: 'https://i.pravatar.cc/40?img=3', question: 'Is there a recommended textbook for Kalman Filtering in robotics?', course: 'Advanced ML with Python', time: '1 hr ago', status: 'answered', answer: 'Check out "Optimal State Estimation" by Dan Simon. Chapter 3 covers it clearly.' },
  { id: 4, student: 'Sofia Karan', avatar: 'https://i.pravatar.cc/40?img=7', question: 'Could you re-explain step 4 of the Quantum Tunneling derivation?', course: 'Quantum Mechanics Intro', time: '3 hrs ago', status: 'answered', answer: 'See lecture video 4 at timestamp 14:20 where we solve the Schrödinger boundary condition.' },
];

const MOCK_LIVE_SESSIONS = [
  { id: 's1', title: 'Live Q&A: Deep Learning Model Debugging & Exam Prep', date: 'Tomorrow, 5:00 PM', duration: '60 mins', enrolled: 84, link: 'https://meet.google.com/studyverse-live-1' },
  { id: 's2', title: 'Office Hours: Quantum Mechanics Problem Solving', date: 'Friday, 3:00 PM', duration: '90 mins', enrolled: 62, link: 'https://meet.google.com/studyverse-live-2' },
];

export default function TutorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, notes, qa, live
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Dynamic Course State
  const [courses, setCourses] = useState(
    MOCK_COURSES.slice(0, 3).map((c, i) => ({
      ...c,
      enrolled: [142, 98, 65][i],
      status: 'published',
      completionRate: [88, 74, 91][i],
    }))
  );

  // Dynamic Notes State
  const [notes, setNotes] = useState(MOCK_TEACHING_NOTES);

  // Dynamic Q&A State
  const [questions, setQuestions] = useState(INITIAL_STUDENT_QUESTIONS);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Handlers
  const handleCourseCreated = (newCourse) => {
    setCourses(prev => [{
      ...newCourse,
      id: newCourse._id || `c_${Date.now()}`,
      enrolled: 0,
      completionRate: 100,
      status: 'published',
    }, ...prev]);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleNoteUploaded = (newNote) => {
    setNotes(prev => [{
      id: `note_${Date.now()}`,
      title: newNote.title,
      subject: newNote.subject,
      format: newNote.format || 'Handwritten Pages',
      downloads: 1,
      likes: 1,
      pages: 12,
      uploaded: 'Just now',
    }, ...prev]);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleSendReply = (qId) => {
    if (!replyText.trim()) return;
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, status: 'answered', answer: replyText } : q));
    setReplyText('');
    setSelectedQuestion(null);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0);
  const avgRating = (courses.reduce((sum, c) => sum + (c.rating || 4.9), 0) / courses.length).toFixed(1);
  const totalDownloads = notes.reduce((sum, n) => sum + n.downloads, 0);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">

        {/* 🏆 EDUCATOR HERO STUDIO BANNER */}
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] text-white p-6 sm:p-8 shadow-2xl border border-slate-700/60">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F7DF6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-400/30 flex items-center gap-1.5 uppercase tracking-wider">
                  👨‍🏫 Educator Studio & Command Center
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-400/30 flex items-center gap-1">
                  ✓ Verified Faculty
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-extrabold border border-blue-400/30 flex items-center gap-1">
                  ⭐ {avgRating} Faculty Score
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Welcome to your Teaching Studio, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">{user?.name || 'Professor'}</span> 👋
              </h1>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                {user?.institution || 'Stanford University'} · {user?.department || 'Computer Science & AI Department'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap shrink-0">
              <button
                onClick={() => setIsCourseModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#4F7DF6] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs font-extrabold shadow-lg shadow-blue-500/30 transition-all cursor-pointer border border-blue-400/40"
              >
                <Plus className="w-4 h-4 text-white" />
                Upload Course
              </button>
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all cursor-pointer border border-amber-400/40"
              >
                <FileText className="w-4 h-4" />
                Publish Notes
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Active Students</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalStudents.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Published Courses</p>
              <p className="text-2xl font-black text-white mt-0.5">{courses.length}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Note Downloads</p>
              <p className="text-2xl font-black text-amber-300 mt-0.5">{totalDownloads.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Student XP Awarded</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">14,820</p>
            </div>
          </div>
        </div>

        {/* 🎛️ STUDIO SUB-NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'overview', label: '📊 Studio Overview', badge: null },
            { id: 'courses', label: '📚 My Courses & Lectures', badge: courses.length },
            { id: 'notes', label: '📝 Teaching Notes & Vault', badge: notes.length },
            { id: 'qa', label: '💬 Student Q&A Desk', badge: questions.filter(q => q.status === 'pending').length },
            { id: 'live', label: '🗓️ Live Office Hours', badge: MOCK_LIVE_SESSIONS.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1E293B] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B] border border-[#E2E8F0]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: STUDIO OVERVIEW ────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Courses Quick Overview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#1E293B] flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#4F7DF6]" />
                    Featured Courses & Student Engagement
                  </h2>
                  <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-[#4F7DF6] hover:underline flex items-center gap-1">
                    View All ({courses.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map(course => (
                    <div key={course.id} className="p-4 bg-white rounded-[22px] border border-[#E2E8F0] hover:shadow-lg transition-all space-y-3">
                      <div className="relative rounded-[14px] overflow-hidden h-36">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold border border-amber-400/30">
                          ⭐ {course.rating}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold text-[#1E293B] line-clamp-1">{course.title}</h3>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{course.enrolled} Enrolled Students</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B]">
                          <span>Completion Rate</span>
                          <span className="text-emerald-600 font-extrabold">{course.completionRate}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.completionRate}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Q&A Widget */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#1E293B] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />
                    Pending Questions
                  </h2>
                  <button onClick={() => setActiveTab('qa')} className="text-xs font-bold text-[#8B5CF6] hover:underline">
                    Q&A Desk →
                  </button>
                </div>

                <div className="space-y-3">
                  {questions.filter(q => q.status === 'pending').slice(0, 3).map(q => (
                    <div key={q.id} className="p-4 rounded-[18px] bg-purple-50/60 border border-purple-200/80 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img src={q.avatar} alt={q.student} className="w-6 h-6 rounded-full" />
                          <span className="text-xs font-extrabold text-[#1E293B]">{q.student}</span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] font-medium">{q.time}</span>
                      </div>
                      <p className="text-xs text-[#475569] font-medium leading-relaxed">"{q.question}"</p>
                      <button
                        onClick={() => { setSelectedQuestion(q); setActiveTab('qa'); }}
                        className="w-full py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Answer Question ✍️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: MY COURSES & LECTURES ───────────────────────────────────── */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#1E293B]">Course Management & Curriculum Builder</h2>
                <p className="text-xs text-[#64748B]">Manage your video lectures, assignments, and curriculum</p>
              </div>
              <button
                onClick={() => setIsCourseModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F7DF6] hover:bg-blue-600 text-white text-xs font-extrabold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Course
              </button>
            </div>

            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="p-5 bg-white rounded-[22px] border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={course.image} alt={course.title} className="w-20 h-20 rounded-[16px] object-cover border border-[#E2E8F0]" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[#1E293B]">{course.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-extrabold border border-emerald-200">
                          Published
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B]">{course.category || 'Computer Science'} · {course.duration || '8 hours'}</p>
                      <div className="flex items-center gap-4 text-xs text-[#64748B] font-semibold pt-1">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#4F7DF6]" /> {course.enrolled} Students</span>
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {course.rating}</span>
                        <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5 text-purple-500" /> {course.lessons || 24} Lectures</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <button className="px-3.5 py-2 rounded-xl bg-[#EEF4FF] text-[#4F7DF6] hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Edit Curriculum
                    </button>
                    <button className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: TEACHING NOTES & VAULT ─────────────────────────────────── */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#1E293B]">Handwritten Teaching Notes & Vault</h2>
                <p className="text-xs text-[#64748B]">Notes published directly to the Explore Vault for students</p>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Publish New Notes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map(note => (
                <div key={note.id} className="p-5 bg-white rounded-[22px] border border-[#E2E8F0] hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 uppercase">
                      {note.format}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">{note.uploaded}</span>
                  </div>

                  <h3 className="text-xs font-extrabold text-[#1E293B] leading-snug line-clamp-2">{note.title}</h3>
                  <p className="text-[11px] text-[#64748B]">{note.subject} · {note.pages} Pages</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B] font-bold">
                    <span className="flex items-center gap-1 text-[#4F7DF6]">
                      <Download className="w-3.5 h-3.5" /> {note.downloads} Downloads
                    </span>
                    <span className="flex items-center gap-1 text-rose-500">
                      ❤️ {note.likes} Likes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: STUDENT Q&A DESK ───────────────────────────────────────── */}
        {activeTab === 'qa' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-lg font-extrabold text-[#1E293B]">Faculty Student Q&A Desk</h2>
              <p className="text-xs text-[#64748B]">Answer questions from students enrolled in your courses</p>
            </div>

            <div className="space-y-4">
              {questions.map(q => (
                <div key={q.id} className={`p-5 rounded-[22px] border transition-all space-y-3 ${
                  q.status === 'pending' ? 'bg-purple-50/50 border-purple-200' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={q.avatar} alt={q.student} className="w-10 h-10 rounded-full border border-[#E2E8F0]" />
                      <div>
                        <h4 className="text-xs font-extrabold text-[#1E293B]">{q.student}</h4>
                        <p className="text-[10px] text-[#4F7DF6] font-semibold">{q.course} · {q.time}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      q.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {q.status === 'pending' ? '⏳ Pending Answer' : '✓ Answered'}
                    </span>
                  </div>

                  <p className="text-xs text-[#334155] font-semibold bg-white/80 p-3 rounded-[14px] border border-[#E2E8F0] leading-relaxed">
                    "{q.question}"
                  </p>

                  {q.status === 'answered' ? (
                    <div className="p-3.5 rounded-[14px] bg-emerald-50/80 border border-emerald-200 space-y-1">
                      <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Faculty Response:</p>
                      <p className="text-xs text-emerald-900 font-medium">{q.answer}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      {selectedQuestion?.id === q.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Type detailed answer for the student..."
                            className="w-full p-3 rounded-[14px] bg-white border border-purple-300 text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-400"
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setSelectedQuestion(null)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendReply(q.id)}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-purple-700 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" /> Submit & Award +50 XP
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setSelectedQuestion(q); setReplyText(''); }}
                          className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
                        >
                          Write Answer ✍️
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 5: LIVE OFFICE HOURS ────────────────────────────────────── */}
        {activeTab === 'live' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#1E293B]">Live Office Hours & Webinars</h2>
                <p className="text-xs text-[#64748B]">Schedule interactive live video sessions for your students</p>
              </div>
              <button
                onClick={() => alert('Scheduled new Live Session!')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
              >
                <Video className="w-4 h-4" /> Schedule Session
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_LIVE_SESSIONS.map(session => (
                <div key={session.id} className="p-5 bg-white rounded-[22px] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase">
                        🔴 Upcoming Live
                      </span>
                      <h3 className="text-sm font-extrabold text-[#1E293B]">{session.title}</h3>
                    </div>
                    <p className="text-xs text-[#64748B] font-semibold">{session.date} · {session.duration}</p>
                    <p className="text-[11px] text-emerald-600 font-bold">{session.enrolled} Students Enrolled</p>
                  </div>

                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Video className="w-4 h-4" /> Join Room ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Course Upload Modal */}
      <CourseUploadModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onCourseCreated={handleCourseCreated}
        currentUser={user}
      />

      {/* Notebook Upload Modal */}
      <UploadNotebookModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onNotebookUploaded={handleNoteUploaded}
        currentUser={user}
      />
    </AppLayout>
  );
}
