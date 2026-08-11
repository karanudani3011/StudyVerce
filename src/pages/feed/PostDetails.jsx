import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Sparkles, Send } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { MOCK_FEED_POSTS } from '../../data/mockData';

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = MOCK_FEED_POSTS.find(p => p.id === postId) || MOCK_FEED_POSTS[0];
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', text: 'This explanation of chain rule in backpropagation made it click for me!', time: '1 hr ago' },
    { id: 2, user: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', text: 'Could you share the derivation for the gradient update formula as well?', time: '30 mins ago' },
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, { id: Date.now(), user: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', text: commentText, time: 'Just now' }]);
    setCommentText('');
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </button>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={post.teacher.avatar} alt={post.teacher.name} size="md" verified />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1E293B]">{post.teacher.name}</h3>
                  <Badge variant="primary" size="sm">{post.subject}</Badge>
                </div>
                <p className="text-xs text-[#94A3B8]">{post.teacher.role} · {post.timestamp}</p>
              </div>
            </div>
            <Button variant="outline" size="xs">Follow</Button>
          </div>

          <div className="space-y-4">
            <h1 className="text-xl font-extrabold text-[#1E293B]">{post.caption}</h1>
            <div className="rounded-[16px] overflow-hidden border border-[#E2E8F0]">
              <img src={post.image} alt={post.topic} className="w-full max-h-96 object-cover" />
            </div>
            <p className="text-sm text-[#1E293B] leading-relaxed">{post.explanation}</p>
          </div>

          <div className="p-4 bg-[#F5F7FB] rounded-[16px] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4F7DF6]">
              <Sparkles className="w-4 h-4" /> AI Summary & Key Notes
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">{post.aiSummary}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#EDF2F7]">
            <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B]">
              <button className="flex items-center gap-1.5 hover:text-rose-500"><Heart className="w-4 h-4" /> {post.likes}</button>
              <button className="flex items-center gap-1.5 hover:text-[#4F7DF6]"><MessageCircle className="w-4 h-4" /> {comments.length}</button>
              <button className="flex items-center gap-1.5 hover:text-[#8B5CF6]"><Share2 className="w-4 h-4" /> Share</button>
            </div>
            <button className="text-[#64748B] hover:text-[#4F7DF6]"><Bookmark className="w-4 h-4" /></button>
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-[#1E293B]">Discussion ({comments.length})</h3>
          
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Add to the academic discussion..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 bg-[#F5F7FB] border border-[#E2E8F0] rounded-[14px] px-4 py-2.5 text-sm focus:outline-none focus:border-[#4F7DF6]"
            />
            <Button type="submit" variant="primary" size="sm" icon={Send}>Post</Button>
          </form>

          <div className="space-y-3 pt-2">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3 p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                <Avatar src={c.avatar} alt={c.user} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E293B]">{c.user}</span>
                    <span className="text-[10px] text-[#94A3B8]">{c.time}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
