import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2, Sparkles, BookOpen, HelpCircle, FileText, CheckCircle2, Flame, MoreHorizontal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge, Modal, EmptyState, Spinner } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet, apiPost } from '../../config/api';

export default function FeedPage() {
  const { addXP, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [quizModal, setQuizModal] = useState(null);
  const [notesModal, setNotesModal] = useState(null);
  const [summaryModal, setSummaryModal] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, trending
  const [filterSubject, setFilterSubject] = useState('All');

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: 10,
        sort: sortBy,
      });
      if (filterSubject !== 'All') params.append('subject', filterSubject);

      const res = await apiGet(`/posts?${params.toString()}`);
      if (res.success && res.data) {
        const formattedPosts = res.data.map(post => ({
          ...post,
          id: post._id || post.id,
          userLiked: post.likes?.includes(user?._id) || false,
          userBookmarked: false, // Will be checked via separate API or localStorage
          likes: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          savesCount: post.savesCount || 0,
          timestamp: formatTimeAgo(post.createdAt),
        }));

        if (append) {
          setPosts(prev => [...prev, ...formattedPosts]);
        } else {
          setPosts(formattedPosts);
        }
        setHasMore(res.data.length === 10);
        setPage(res.currentPage || pageNum);
      }
    } catch (error) {
      console.error('Feed fetch error:', error.message);
      setError(error.message || 'Failed to load feed');
      if (!append) setPosts([]);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, [user?._id, sortBy, filterSubject]);

  const toggleLike = useCallback(async (id) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const wasLiked = post.userLiked;
    const newLikes = wasLiked ? post.likes - 1 : post.likes + 1;

    // Optimistic update
    setPosts(p => p.map(x => x.id === id ? { ...x, userLiked: !x.userLiked, likes: newLikes } : x));

    try {
      const res = await apiPost(`/posts/${id}/like`);
      if (!res.success) {
        // Revert on failure
        setPosts(p => p.map(x => x.id === id ? { ...x, userLiked: wasLiked, likes: wasLiked ? post.likes + 1 : post.likes - 1 } : x));
        addToast('Failed to update like', 'error');
      }
    } catch (error) {
      setPosts(p => p.map(x => x.id === id ? { ...x, userLiked: wasLiked, likes: post.likes } : x));
      addToast('Failed to update like', 'error');
    }
  }, [posts, addToast]);

  const toggleBookmark = useCallback(async (id) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const wasBookmarked = post.userBookmarked;
    const newSaves = wasBookmarked ? post.savesCount - 1 : post.savesCount + 1;

    // Optimistic update
    setPosts(p => p.map(x => x.id === id ? { ...x, userBookmarked: !x.userBookmarked, savesCount: newSaves } : x));

    try {
      const res = await apiPost(`/posts/${id}/bookmark`);
      if (!res.success) {
        setPosts(p => p.map(x => x.id === id ? { ...x, userBookmarked: wasBookmarked, savesCount: wasBookmarked ? post.savesCount + 1 : post.savesCount - 1 } : x));
        addToast('Failed to update bookmark', 'error');
      } else {
        addToast(wasBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks!', 'success');
      }
    } catch (error) {
      setPosts(p => p.map(x => x.id === id ? { ...x, userBookmarked: wasBookmarked, savesCount: post.savesCount } : x));
      addToast('Failed to update bookmark', 'error');
    }
  }, [posts, addToast]);

  const submitQuiz = () => {
    setSubmitted(true);
    addXP(100);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    addToast('+100 XP earned! 🎉', 'success');
  };

  const openQuiz = (post) => { setQuizModal(post); setAnswers({}); setSubmitted(false); };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">Educational Feed</h1>
            <p className="text-sm text-[#64748B]">Curated notes, quizzes, and AI breakdowns from educators.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" icon={Flame}>Distraction-Free</Badge>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 cursor-pointer appearance-none pr-8"
              >
                <option value="latest">Latest First 📅</option>
                <option value="popular">Most Popular ❤️</option>
                <option value="trending">Trending 📈</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="bg-white border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 cursor-pointer appearance-none pr-8"
              >
                <option value="All">All Subjects</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Quantum Physics">Quantum Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Web Development">Web Development</option>
              </select>
            </div>
          </div>
        </div>

        {/* Post Cards */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="h-48 bg-slate-200 rounded-[16px]" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-200 rounded" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="h-5 w-20 bg-slate-200 rounded" />
                    <div className="h-5 w-20 bg-slate-200 rounded" />
                    <div className="h-5 w-20 bg-slate-200 rounded" />
                  </div>
                  <div className="h-5 w-10 bg-slate-200 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<Flame className="w-12 h-12 text-rose-500" />}
            title="Failed to Load Feed"
            description={error}
            action={{ label: 'Retry', onClick: () => fetchPosts(1, false) }}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-slate-400" />}
            title="No Posts Yet"
            description="No educational posts found for this filter. Try adjusting your filters or check back later!"
            action={{ label: 'Clear Filters', onClick: () => { setFilterSubject('All'); setSortBy('latest'); }} }
          />
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post, idx) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
                  <Card className="space-y-4">
                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
                        <Avatar src={post.authorAvatar} alt={post.author} size="md" verified={post.authorVerified} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#1E293B]">{post.author}</span>
                            <Badge variant="primary" size="sm">{post.subject}</Badge>
                          </div>
                          <p className="text-xs text-[#94A3B8]">{post.authorRole} · {post.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="xs">Follow</Button>
                        <button className="p-1.5 text-[#94A3B8] hover:text-[#64748B] rounded-full hover:bg-[#F5F7FB]"><MoreHorizontal className="w-4 h-4" strokeWidth={2} /></button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 cursor-pointer" onClick={() => navigate(`/feed/${post.id}`)}>
                      <h2 className="text-base font-bold text-[#1E293B]">{post.caption}</h2>
                      <div className="relative rounded-[16px] overflow-hidden border border-[#E2E8F0]">
                        <img src={post.image} alt={post.topic} className="w-full max-h-80 object-cover" />
                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#1E293B] border border-[#E2E8F0]">{post.topic}</div>
                      </div>
                      <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3">{post.explanation}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map(t => <span key={t} className="px-2.5 py-1 rounded-[10px] bg-[#F5F7FB] text-xs text-[#64748B] border border-[#E2E8F0]">#{t}</span>)}
                    </div>

                    {/* AI Tools */}
                    <div className="p-3.5 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F7DF6]">
                        <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> AI Tools
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setSummaryModal(post)} className="px-3 py-1.5 bg-white rounded-[10px] text-xs font-semibold text-[#64748B] hover:text-[#4F7DF6] border border-[#E2E8F0] flex items-center gap-1 cursor-pointer transition-colors">
                          <BookOpen className="w-3.5 h-3.5" strokeWidth={2} /> Summary
                        </button>
                        <button onClick={() => setNotesModal(post)} className="px-3 py-1.5 bg-white rounded-[10px] text-xs font-semibold text-[#64748B] hover:text-[#4F7DF6] border border-[#E2E8F0] flex items-center gap-1 cursor-pointer transition-colors">
                          <FileText className="w-3.5 h-3.5" strokeWidth={2} /> Notes
                        </button>
                        <button onClick={() => openQuiz(post)} className="px-3 py-1.5 bg-[#4F7DF6] text-white rounded-[10px] text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#3D6CF2] transition-colors">
                          <HelpCircle className="w-3.5 h-3.5" strokeWidth={2} /> Quiz +100 XP
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#EDF2F7]">
                      <div className="flex items-center gap-4">
                        <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${post.userLiked ? 'text-rose-500' : 'text-[#64748B] hover:text-rose-500'}`}>
                          <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} strokeWidth={2} /> {post.likes}
                        </button>
                        <button onClick={() => navigate(`/feed/${post.id}`)} className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#4F7DF6]">
                          <MessageCircle className="w-4 h-4" strokeWidth={2} /> {post.commentsCount}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#8B5CF6]">
                          <Share2 className="w-4 h-4" strokeWidth={2} /> Share
                        </button>
                      </div>
                      <button onClick={() => toggleBookmark(post.id)} className={`p-2 rounded-[10px] hover:bg-[#F5F7FB] transition-colors ${post.userBookmarked ? 'text-[#4F7DF6]' : 'text-[#64748B]'}`}>
                        <Bookmark className={`w-4 h-4 ${post.userBookmarked ? 'fill-current' : ''}`} strokeWidth={2} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="w-full max-w-xs"
                >
                  {loadingMore ? (
                    <>
                      <Spinner size="sm" className="mr-2" /> Loading more...
                    </>
                  ) : (
                    'Load More Posts'
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Quiz Modal */}
        <Modal isOpen={!!quizModal} onClose={() => setQuizModal(null)} title={quizModal ? `Quiz: ${quizModal.topic}` : ''}>
          {quizModal && (
            <div className="space-y-4">
              {!submitted ? (
                <>
                  <p className="text-xs text-[#64748B]">Answer all questions to earn <span className="font-bold text-[#4F7DF6]">+100 XP</span>.</p>
                  {quizModal.quizQuestions.map((q, qi) => (
                    <div key={qi} className="p-4 bg-[#F5F7FB] rounded-[14px] border border-[#E2E8F0] space-y-2.5">
                      <p className="text-sm font-bold text-[#1E293B]">{qi + 1}. {q.q}</p>
                      <div className="space-y-1.5">
                        {q.a.map((opt, ai) => (
                          <button key={ai} onClick={() => setAnswers(prev => ({ ...prev, [qi]: ai }))}
                            className={`w-full text-left p-3 rounded-[12px] text-sm font-medium border cursor-pointer transition-all ${answers[qi] === ai ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6] font-bold' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#4F7DF6]/40'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button variant="primary" fullWidth size="lg" disabled={Object.keys(answers).length < quizModal.quizQuestions.length} onClick={submitQuiz}>Submit & Earn XP</Button>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#22C55E] mx-auto flex items-center justify-center border border-emerald-100">
                    <CheckCircle2 className="w-9 h-9" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Quiz Complete! 🎉</h3>
                  <p className="text-sm text-[#64748B]">You earned <span className="font-bold text-[#4F7DF6]">+100 XP</span>!</p>
                  <Button variant="primary" onClick={() => setQuizModal(null)}>Done</Button>
                </div>
            )}
          </div>
        )}
      </Modal>

      {/* Notes Modal */}
          <Modal isOpen={!!notesModal} onClose={() => setNotesModal(null)} title={notesModal ? `Study Notes: ${notesModal.topic}` : ''}>
            {notesModal && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F5F7FB] rounded-[14px] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4F7DF6] mb-3"><Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Key Takeaways</div>
                  {notesModal.notes.map((n, i) => <p key={i} className="text-sm text-[#64748B] leading-relaxed">{n}</p>)}
                </div>
                <Button variant="primary" fullWidth onClick={() => setNotesModal(null)}>Save to Bookmarks</Button>
              </div>
            )}
          </Modal>

          {/* Summary Modal */}
          <Modal isOpen={!!summaryModal} onClose={() => setSummaryModal(null)} title={summaryModal ? `AI Summary: ${summaryModal.topic}` : ''}>
            {summaryModal && (
              <div className="space-y-4">
                <p className="text-sm text-[#64748B] leading-relaxed">{summaryModal.aiSummary}</p>
                <div>
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Related Topics</p>
                  <div className="flex flex-wrap gap-2">{summaryModal.relatedTopics.map(t => <Badge key={t} variant="primary" size="sm">{t}</Badge>)}</div>
                </div>
                <Button variant="secondary" fullWidth onClick={() => setSummaryModal(null)}>Close</Button>
              </div>
            )}
          </Modal>
      </div>
    </AppLayout>
  );
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}