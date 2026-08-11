import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  CheckCircle2,
  Flame,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { MOCK_FEED_POSTS } from '../data/mockData';

export const FeedPage = () => {
  const { addXP } = useAuth();
  const [posts, setPosts] = useState(MOCK_FEED_POSTS);
  const [activeQuizPost, setActiveQuizPost] = useState(null);
  const [activeNotesPost, setActiveNotesPost] = useState(null);
  const [activeSummaryPost, setActiveSummaryPost] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.userLiked;
        return { ...p, userLiked: !isLiked, likes: isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const toggleBookmark = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, userBookmarked: !p.userBookmarked } : p
    ));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    addXP(100);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />

        <main className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-6 overflow-y-auto pb-24 md:pb-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Educational Feed</h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Curated knowledge breakdowns, notes, and AI-generated quizzes.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#22C55E] text-xs font-semibold border border-emerald-200/60">
              <Flame className="w-3.5 h-3.5" strokeWidth={2} /> Distraction-Free
            </span>
          </div>

          {/* Posts Stream */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="space-y-5">
                {/* Author Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={post.teacher.avatar} alt={post.teacher.name} size="md" verified />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#1E293B]">{post.teacher.name}</h3>
                        <span className="px-2 py-0.5 rounded-[8px] text-[10px] font-bold uppercase bg-[#EEF4FF] text-[#4F7DF6]">
                          {post.subject}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">{post.teacher.role} · {post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="text-xs px-3 py-1.5">Follow</Button>
                    <button className="p-1.5 text-[#94A3B8] hover:text-[#64748B] rounded-full hover:bg-[#F5F7FB] transition-colors">
                      <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Title & Image */}
                <div className="space-y-3">
                  <h2 className="text-base sm:text-lg font-bold text-[#1E293B]">{post.caption}</h2>
                  <div className="relative rounded-[16px] overflow-hidden border border-[#E2E8F0]">
                    <img
                      src={post.image}
                      alt={post.topic}
                      className="w-full max-h-96 object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#1E293B] text-xs font-semibold px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs">
                      Topic: {post.topic}
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {post.explanation}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-[10px] text-xs font-medium bg-[#F5F7FB] text-[#64748B] border border-[#E2E8F0]">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* AI Action Strip */}
                <div className="p-4 rounded-[16px] bg-[#EEF4FF] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F7DF6]">
                    <Sparkles className="w-4 h-4" strokeWidth={2} />
                    <span>AI Learning Tools</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveSummaryPost(post)}
                      className="px-3 py-1.5 rounded-[12px] bg-white text-xs font-semibold text-[#64748B] hover:text-[#4F7DF6] border border-[#E2E8F0] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" strokeWidth={2} /> AI Summary
                    </button>
                    <button
                      onClick={() => setActiveNotesPost(post)}
                      className="px-3 py-1.5 rounded-[12px] bg-white text-xs font-semibold text-[#64748B] hover:text-[#4F7DF6] border border-[#E2E8F0] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" strokeWidth={2} /> Generate Notes
                    </button>
                    <button
                      onClick={() => { setActiveQuizPost(post); setSelectedAnswers({}); setQuizSubmitted(false); }}
                      className="px-3 py-1.5 rounded-[12px] bg-[#4F7DF6] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#3D6CF2] transition-colors shadow-xs"
                    >
                      <HelpCircle className="w-3.5 h-3.5" strokeWidth={2} /> Take Quiz +100 XP
                    </button>
                  </div>
                </div>

                {/* Social Interaction Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EDF2F7]">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${post.userLiked ? 'text-rose-500' : 'text-[#64748B] hover:text-rose-500'}`}
                    >
                      <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} strokeWidth={2} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#4F7DF6] transition-colors">
                      <MessageCircle className="w-4 h-4" strokeWidth={2} />
                      <span>{post.commentsCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#8B5CF6] transition-colors">
                      <Share2 className="w-4 h-4" strokeWidth={2} />
                      <span>Share</span>
                    </button>
                  </div>
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className={`p-2 rounded-[10px] hover:bg-[#F5F7FB] transition-colors ${post.userBookmarked ? 'text-[#4F7DF6]' : 'text-[#64748B]'}`}
                  >
                    <Bookmark className={`w-4 h-4 ${post.userBookmarked ? 'fill-current' : ''}`} strokeWidth={2} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <RightSidebar />

      {/* QUIZ MODAL */}
      <Modal isOpen={!!activeQuizPost} onClose={() => setActiveQuizPost(null)} title={activeQuizPost ? `Quiz: ${activeQuizPost.topic}` : ''}>
        {activeQuizPost && (
          <div className="space-y-5">
            {!quizSubmitted ? (
              <>
                <p className="text-xs text-[#64748B]">Answer all questions to earn <span className="font-bold text-[#4F7DF6]">+100 XP</span> towards your daily goal.</p>
                <div className="space-y-4">
                  {activeQuizPost.quizQuestions.map((question, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-[16px] bg-[#F5F7FB] border border-[#E2E8F0] space-y-3">
                      <h4 className="text-sm font-bold text-[#1E293B]">{qIdx + 1}. {question.q}</h4>
                      <div className="space-y-2">
                        {question.a.map((option, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: aIdx }))}
                            className={`w-full text-left p-3 rounded-[12px] text-xs font-medium transition-all border cursor-pointer ${
                              selectedAnswers[qIdx] === aIdx
                                ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6] font-bold'
                                : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#4F7DF6]/40'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="primary" fullWidth size="lg"
                  disabled={Object.keys(selectedAnswers).length < activeQuizPost.quizQuestions.length}
                  onClick={submitQuiz}
                >
                  Submit & Claim XP
                </Button>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#22C55E] mx-auto flex items-center justify-center border border-emerald-200/60">
                  <CheckCircle2 className="w-9 h-9" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#1E293B]">Quiz Complete! 🎉</h3>
                <p className="text-sm text-[#64748B]">Perfect score! You earned <span className="font-bold text-[#4F7DF6]">+100 XP</span>.</p>
                <Button variant="primary" onClick={() => setActiveQuizPost(null)}>Done</Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* AI NOTES MODAL */}
      <Modal isOpen={!!activeNotesPost} onClose={() => setActiveNotesPost(null)} title={activeNotesPost ? `Study Notes: ${activeNotesPost.topic}` : ''}>
        {activeNotesPost && (
          <div className="space-y-4">
            <div className="p-4 rounded-[16px] bg-[#F5F7FB] border border-[#E2E8F0] text-xs font-mono text-[#4F7DF6] space-y-2">
              <div className="font-bold text-xs text-[#1E293B] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F7DF6]" strokeWidth={2} /> Key Takeaways
              </div>
              {activeNotesPost.notes.map((note, i) => (
                <div key={i} className="leading-relaxed text-[#64748B] font-sans">{note}</div>
              ))}
            </div>
            <Button variant="primary" fullWidth onClick={() => setActiveNotesPost(null)}>Save to Bookmarks</Button>
          </div>
        )}
      </Modal>

      {/* AI SUMMARY MODAL */}
      <Modal isOpen={!!activeSummaryPost} onClose={() => setActiveSummaryPost(null)} title={activeSummaryPost ? `AI Summary: ${activeSummaryPost.topic}` : ''}>
        {activeSummaryPost && (
          <div className="space-y-4">
            <p className="text-sm text-[#64748B] leading-relaxed">{activeSummaryPost.aiSummary}</p>
            <div className="pt-2">
              <h5 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Related Topics</h5>
              <div className="flex flex-wrap gap-2">
                {activeSummaryPost.relatedTopics.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-[10px] text-xs font-medium bg-[#EEF4FF] text-[#4F7DF6]">{t}</span>
                ))}
              </div>
            </div>
            <Button variant="secondary" fullWidth onClick={() => setActiveSummaryPost(null)}>Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
