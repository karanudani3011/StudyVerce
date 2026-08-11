import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2, Sparkles, BookOpen, HelpCircle, FileText, CheckCircle2, Flame, MoreHorizontal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge, Modal, EmptyState } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_FEED_POSTS } from '../../data/mockData';

export default function FeedPage() {
  const { addXP } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_FEED_POSTS);
  const [quizModal, setQuizModal] = useState(null);
  const [notesModal, setNotesModal] = useState(null);
  const [summaryModal, setSummaryModal] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const toggleLike = (id) => setPosts(p => p.map(x => x.id === id ? { ...x, userLiked: !x.userLiked, likes: x.userLiked ? x.likes - 1 : x.likes + 1 } : x));
  const toggleBookmark = (id) => { setPosts(p => p.map(x => x.id === id ? { ...x, userBookmarked: !x.userBookmarked } : x)); addToast('Saved to bookmarks!', 'success'); };

  const submitQuiz = () => {
    setSubmitted(true); addXP(100);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    addToast('+100 XP earned! 🎉', 'success');
  };

  const openQuiz = (post) => { setQuizModal(post); setAnswers({}); setSubmitted(false); };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">Educational Feed</h1>
            <p className="text-sm text-[#64748B]">Curated notes, quizzes, and AI breakdowns.</p>
          </div>
          <Badge variant="success" icon={Flame}>Distraction-Free</Badge>
        </div>

        {/* Post Cards */}
        {posts.map((post, idx) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
            <Card className="space-y-4">
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
                  <Avatar src={post.teacher.avatar} alt={post.teacher.name} size="md" verified={post.teacher.verified} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#1E293B]">{post.teacher.name}</span>
                      <Badge variant="primary" size="sm">{post.subject}</Badge>
                    </div>
                    <p className="text-xs text-[#94A3B8]">{post.teacher.role} · {post.timestamp}</p>
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
    </AppLayout>
  );
}
