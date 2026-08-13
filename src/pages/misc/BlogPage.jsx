import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'How to Build an Effective Study Routine in 2026',
    excerpt: 'Discover the science-backed learning habits, time-blocking methods, and workspace organization secrets that high-achieving students use to maintain top grades without burnout.',
    category: 'STUDY TIPS',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800',
    date: 'Aug 10, 2026',
    readTime: '6 min read',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&q=80&w=100'
    }
  },
  {
    id: 2,
    title: 'The Future of AI Tutors: Bridging the Educational Gap',
    excerpt: 'AI is transforming personalized learning. Explore how localized language models and custom study avatars are helping students grasp complex STEM subjects at their own pace.',
    category: 'AI & EDUCATION',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    date: 'Aug 04, 2026',
    readTime: '8 min read',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    }
  },
  {
    id: 3,
    title: 'Overcoming Procrastination: The Power of Social Learning',
    excerpt: 'Why studying alone might be holding you back. We analyze peer accountability networks, virtual study streams, and community-driven milestones that keep motivation high.',
    category: 'STUDENT LIFE',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    date: 'Jul 28, 2026',
    readTime: '5 min read',
    author: {
      name: 'Prof. Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    }
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <div>
        <LandingNavbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
              <BookOpen className="w-3.5 h-3.5" /> StudyVerse Insights
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">
              The StudyVerse Blog
            </h1>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Tips, guides, and updates on AI tutoring, active recall, and collaborative study methods designed to supercharge your learning.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group">
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] text-[#4F7DF6] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
                      {post.category}
                    </span>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#1E293B] hover:text-[#4F7DF6] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#F1F5F9] mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="w-8 h-8 rounded-full border border-[#E2E8F0]"
                    />
                    <span className="text-xs font-semibold text-[#475569]">{post.author.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#4F7DF6] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
      <LandingFooter />
    </div>
  );
}
