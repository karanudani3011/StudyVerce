import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  BookOpen, 
  Download, 
  Heart, 
  Eye, 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Check, 
  Share2,
  Bookmark,
  Layers,
  GraduationCap,
  Plus
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { MOCK_HANDMADE_NOTES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { UploadNotebookModal } from '../../components/explore/UploadNotebookModal';
import { apiGet } from '../../config/api';

export default function ExplorePage() {
  const { setActiveTab, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedNote, setSelectedNote] = useState(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeView, setActiveView] = useState('all'); // 'all' | 'saved' | 'liked'
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [exploreNotesList, setExploreNotesList] = useState(MOCK_HANDMADE_NOTES);

  // Fetch persisted Explore notes from MongoDB backend
  useEffect(() => {
    const fetchExploreNotes = async () => {
      try {
        const res = await apiGet('/notes?destination=explore');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const formattedBackendNotes = res.data.map(n => ({
            id: n._id || n.id,
            title: n.title,
            subject: n.subject || 'General Study',
            type: n.type || n.format || 'Handwritten Pages',
            format: n.format || n.type || 'Handwritten Pages',
            description: n.description || '',
            coverImage: n.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
            previewImages: n.previewImages && n.previewImages.length > 0 ? n.previewImages : [n.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
            pdfUrl: n.pdfUrl || n.coverImage,
            tags: n.tags || ['handwritten', 'notes'],
            author: n.author || {
              name: n.creatorId?.name || 'Scholar Contributor',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              university: 'Stanford University',
            },
            likesCount: n.likesCount || 5,
            savesCount: n.savesCount || 2,
            pagesCount: n.pagesCount || (n.previewImages?.length || 10),
            rating: n.rating || 4.9,
          }));
          setExploreNotesList([...formattedBackendNotes, ...MOCK_HANDMADE_NOTES]);
        }
      } catch (err) {
        console.warn('Backend Explore notes fetch skipped/offline:', err.message);
      }
    };
    fetchExploreNotes();
  }, []);

  const handleNotebookUploaded = (newNote) => {
    const formattedNote = {
      id: newNote._id || `note_new_${Date.now()}`,
      title: newNote.title,
      subject: newNote.subject || 'Computer Science',
      type: newNote.type || 'Handwritten Pages',
      format: newNote.format || newNote.type || 'Handwritten Pages',
      description: newNote.description || '',
      coverImage: newNote.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      previewImages: newNote.previewImages || [newNote.coverImage],
      pdfUrl: newNote.pdfUrl || newNote.coverImage,
      tags: newNote.tags || ['handwritten', 'notes'],
      author: newNote.author || {
        name: user?.name || 'Scholar Contributor',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        university: user?.institution || 'Stanford University',
      },
      likesCount: 1,
      savesCount: 1,
      pagesCount: newNote.pagesCount || 8,
      rating: 4.9,
    };
    setExploreNotesList(prev => [formattedNote, ...prev]);
  };

  // Persist bookmarked notes in localStorage
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('studyverse_saved_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist liked notes in localStorage
  const [likedNotes, setLikedNotes] = useState(() => {
    try {
      const liked = localStorage.getItem('studyverse_liked_notes');
      return liked ? JSON.parse(liked) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('studyverse_saved_notes', JSON.stringify(savedNotes));
    } catch (e) {
      console.error('Saved notes sync error:', e);
    }
  }, [savedNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('studyverse_liked_notes', JSON.stringify(likedNotes));
    } catch (e) {
      console.error('Liked notes sync error:', e);
    }
  }, [likedNotes]);

  const categories = [
    'All',
    'Computer Science',
    'Physics & Quantum',
    'Mathematics',
    'Organic Chemistry',
    'Biology & Medical',
    'UPSC & History',
    'Engineering'
  ];

  const formats = [
    { label: 'All Formats', value: 'All' },
    { label: 'Handwritten Pages 📝', value: 'handwritten' },
    { label: 'Notebook Photos 📷', value: 'photo' },
    { label: 'Diagrams & Mindmaps 🎨', value: 'diagram' },
    { label: 'Formula Sheets ⚡', value: 'formula' }
  ];

  const savedCount = Object.values(savedNotes).filter(Boolean).length;
  const likedCount = Object.values(likedNotes).filter(Boolean).length;

  // Filter notes
  const filteredNotes = exploreNotesList.filter((note) => {
    if (activeView === 'saved' && !savedNotes[note.id]) return false;
    if (activeView === 'liked' && !likedNotes[note.id]) return false;

    const matchesCategory = selectedCategory === 'All' || note.subject === selectedCategory;
    const matchesFormat = selectedFormat === 'All' || note.formatKey === selectedFormat || note.type === selectedFormat || note.format === selectedFormat;
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.author?.name && note.author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.tags && note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCategory && matchesFormat && matchesSearch;
  }).sort((a, b) => {
    const aLikes = (a.likes || a.likesCount || 0) + (likedNotes[a.id] ? 1 : 0);
    const bLikes = (b.likes || b.likesCount || 0) + (likedNotes[b.id] ? 1 : 0);
    if (sortBy === 'popular') return bLikes - aLikes;
    if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
    if (sortBy === 'pages') return (b.pagesCount || 10) - (a.pagesCount || 10);
    return 0;
  });

  const toggleSave = (noteId, e) => {
    if (e) e.stopPropagation();
    setSavedNotes(prev => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  const toggleLike = (noteId, e) => {
    if (e) e.stopPropagation();
    setLikedNotes(prev => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  const openModal = (note) => {
    setSelectedNote(note);
    setActivePageIndex(0);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setActivePageIndex(0);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-6 sm:p-8 rounded-[24px] shadow-xl relative overflow-hidden border border-slate-700/50">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#4F7DF6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F7DF6]/20 border border-[#4F7DF6]/40 text-[#60A5FA] text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" /> Handmade & Notebook Notes Vault
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Handmade Notebook & Notes Hub 📝
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Discover real student notebook pictures, handwritten diagrams, lab journals, and formula cheat sheets verified by AI and top educators.
            </p>
            
            {/* Search Input */}
            <div className="relative pt-2">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search handwritten notes, formula sheets, notebook pictures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md text-white placeholder-slate-400 rounded-[16px] border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#4F7DF6] transition-all text-xs sm:text-sm shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* View Selection Tabs: All Notebooks | Bookmarked 🔖 | Liked ❤️ | Upload Notebook 📝 */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#F8FAFC] rounded-[18px] border border-[#E2E8F0]">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveView('all')}
              className={`px-4 py-2.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'all'
                  ? 'bg-[#1E293B] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#4F7DF6]" />
              All Notebooks ({exploreNotesList.length})
            </button>

            <button
              onClick={() => setActiveView('saved')}
              className={`px-4 py-2.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'saved'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0]'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500 fill-current" />
              Bookmarked Notebooks ({savedCount})
            </button>

            <button
              onClick={() => setActiveView('liked')}
              className={`px-4 py-2.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'liked'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0]'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
              Liked Notebooks ({likedCount})
            </button>
          </div>

          <button
            onClick={() => setIsNotebookModalOpen(true)}
            className="px-4 py-2.5 rounded-[14px] bg-gradient-to-r from-[#4F7DF6] to-[#3B82F6] hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer border border-blue-400/30"
          >
            <Plus className="w-4 h-4 text-white" />
            Upload Handmade Notebook 📝
          </button>
        </div>

        {/* Upload Notebook Modal */}
        <UploadNotebookModal
          isOpen={isNotebookModalOpen}
          onClose={() => setIsNotebookModalOpen(false)}
          onNotebookUploaded={handleNotebookUploaded}
          currentUser={user}
        />

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          
          {/* Subject Categories Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-[14px] text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#4F7DF6] text-white shadow-md shadow-blue-500/20'
                      : 'bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Format & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-semibold text-[#64748B] whitespace-nowrap flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#4F7DF6]" /> Format:
              </span>
              {formats.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setSelectedFormat(fmt.value)}
                  className={`px-3 py-1.5 rounded-[10px] text-xs font-medium cursor-pointer transition-all ${
                    selectedFormat === fmt.value
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 justify-end">
              <span className="text-xs text-[#64748B]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white text-xs text-[#1E293B] font-semibold border border-[#E2E8F0] rounded-[10px] px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value="popular">Most Popular ❤️</option>
                <option value="rating">Highest Rated ⭐</option>
                <option value="pages">Most Pages 📄</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notebook Notes Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
              <span>
                {activeView === 'saved' ? 'Bookmarked Notebook Notes 🔖' : activeView === 'liked' ? 'Liked Notebook Notes ❤️' : 'Handwritten Notebook Notes'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4F7DF6]">
                {filteredNotes.length} notes available
              </span>
            </h2>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                {activeView === 'saved' ? (
                  <Bookmark className="w-8 h-8 text-amber-500" />
                ) : activeView === 'liked' ? (
                  <Heart className="w-8 h-8 text-rose-500" />
                ) : (
                  <FileText className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1E293B]">
                  {activeView === 'saved'
                    ? 'No bookmarked notebook notes yet'
                    : activeView === 'liked'
                    ? 'No liked notebook notes yet'
                    : 'No notebook notes found'}
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto">
                  {activeView === 'saved'
                    ? 'Click the bookmark icon 🔖 on any notebook card or page preview to save it here for fast revision!'
                    : activeView === 'liked'
                    ? 'Click the heart icon ❤️ on notebook notes to save your favorite study material here.'
                    : 'Try selecting a different subject category or clearing your search filter.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                {activeView !== 'all' && (
                  <Button variant="primary" size="sm" onClick={() => setActiveView('all')}>
                    Browse All Notebooks
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => { setSelectedCategory('All'); setSelectedFormat('All'); setSearchQuery(''); }}>
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => {
                const isSaved = savedNotes[note.id];
                const isLiked = likedNotes[note.id];
                const totalLikes = note.likes + (isLiked ? 1 : 0);

                return (
                  <Card
                    key={note.id}
                    hover
                    className="flex flex-col justify-between overflow-hidden group cursor-pointer border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all shadow-xs hover:shadow-lg"
                    onClick={() => openModal(note)}
                  >
                    <div className="space-y-3">
                      {/* Notebook Thumbnail with Overlay Badges */}
                      <div className="relative w-full h-48 bg-slate-100 rounded-[14px] overflow-hidden border border-[#E2E8F0]">
                        <img
                          src={note.thumbnail}
                          alt={note.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-[8px] bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wide">
                            {note.format}
                          </span>
                          <button
                            onClick={(e) => toggleSave(note.id, e)}
                            title={isSaved ? 'Remove Bookmark' : 'Bookmark Notebook'}
                            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                              isSaved
                                ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-white/50'
                                : 'bg-slate-900/60 text-white hover:bg-slate-900'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>

                        {/* Bottom Stats Badge */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                          <span className="px-2 py-0.5 rounded-[6px] bg-black/50 backdrop-blur-md flex items-center gap-1">
                            <Layers className="w-3 h-3" /> {note.pagesCount} Pages
                          </span>
                          <span className="px-2 py-0.5 rounded-[6px] bg-amber-500/90 text-white font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {note.rating}
                          </span>
                        </div>
                      </div>

                      {/* Note Subject & Title */}
                      <div className="space-y-1.5 px-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F7DF6]">
                          {note.subject}
                        </span>
                        <h3 className="text-sm font-bold text-[#1E293B] line-clamp-2 leading-snug group-hover:text-[#4F7DF6] transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                          {note.summary}
                        </p>
                      </div>
                    </div>

                    {/* Author & Footer Actions */}
                    <div className="pt-3 mt-3 border-t border-[#EDF2F7] flex items-center justify-between px-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar src={note.author.avatar} alt={note.author.name} size="xs" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-[#1E293B] truncate">{note.author.name}</p>
                          <p className="text-[10px] text-[#94A3B8] truncate">{note.author.university}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleLike(note.id, e)}
                        title={isLiked ? 'Unlike Note' : 'Like Note'}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'text-[#64748B] hover:bg-slate-100'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                        <span className={isLiked ? 'text-rose-600 font-bold' : ''}>{totalLikes}</span>
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Lightbox Note Preview Modal */}
        {selectedNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div 
              className="bg-white rounded-[24px] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={selectedNote.author.avatar} alt={selectedNote.author.name} size="sm" />
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#1E293B] truncate">{selectedNote.title}</h3>
                    <p className="text-xs text-[#64748B] truncate">
                      by {selectedNote.author.name} ({selectedNote.author.university}) · <span className="text-[#4F7DF6] font-semibold">{selectedNote.subject}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Viewer & Details */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Multi-page Image Viewer */}
                <div className="space-y-3">
                  <div className="relative bg-slate-900 rounded-[16px] overflow-hidden flex items-center justify-center min-h-[340px] max-h-[480px]">
                    <img
                      src={selectedNote.pages[activePageIndex] || selectedNote.thumbnail}
                      alt={`Page ${activePageIndex + 1}`}
                      className="max-h-[460px] w-auto object-contain select-none"
                    />

                    {/* Page Navigation Overlay Controls */}
                    {selectedNote.pages.length > 1 && (
                      <>
                        <button
                          disabled={activePageIndex === 0}
                          onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
                          className="absolute left-3 p-2 rounded-full bg-slate-900/80 text-white disabled:opacity-30 hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          disabled={activePageIndex === selectedNote.pages.length - 1}
                          onClick={() => setActivePageIndex(prev => Math.min(selectedNote.pages.length - 1, prev + 1))}
                          className="absolute right-3 p-2 rounded-full bg-slate-900/80 text-white disabled:opacity-30 hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Page Indicator Pill */}
                    <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-bold backdrop-blur-md">
                      Page {activePageIndex + 1} of {selectedNote.pages.length}
                    </span>
                  </div>

                  {/* Thumbnail Strip */}
                  {selectedNote.pages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {selectedNote.pages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePageIndex(idx)}
                          className={`w-16 h-16 rounded-[10px] overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            activePageIndex === idx ? 'border-[#4F7DF6] ring-2 ring-[#4F7DF6]/30' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Handwritten OCR Summary & Key Highlights */}
                <div className="bg-slate-50 rounded-[16px] p-5 border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4F7DF6] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#4F7DF6]" /> AI Notebook Summary & Overview
                  </div>
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                    {selectedNote.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedNote.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-[8px] bg-white border border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 border-t border-[#E2E8F0] bg-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1 font-bold text-[#1E293B]">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {selectedNote.rating}
                  </span>
                  <span>· {selectedNote.downloads} Downloads</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggleSave(selectedNote.id)}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      savedNotes[selectedNote.id]
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                    {savedNotes[selectedNote.id] ? 'Bookmarked 🔖' : 'Bookmark Note'}
                  </button>

                  <button
                    onClick={() => toggleLike(selectedNote.id)}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      likedNotes[selectedNote.id]
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedNotes[selectedNote.id] ? 'fill-current' : ''}`} />
                    {likedNotes[selectedNote.id] ? 'Liked ❤️' : 'Like Note'}
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Sparkles}
                    onClick={() => {
                      closeModal();
                      if (setActiveTab) setActiveTab('ai-tutor');
                    }}
                  >
                    Ask AI Tutor
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    onClick={() => alert(`Downloading high-resolution notebook PDF for ${selectedNote.title}...`)}
                  >
                    Download Notebook PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
