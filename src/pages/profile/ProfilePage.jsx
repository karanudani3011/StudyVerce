import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Flame, Zap, Edit3, Shield, BookOpen, Bookmark } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge, Tabs } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { MOCK_FEED_POSTS } from '../../data/mockData';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'My Notes & Posts', count: user.postsCount },
    { id: 'saved', label: 'Saved Bookmarks', count: 12 },
    { id: 'certificates', label: 'Certificates', count: 4 },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Cover & Avatar Header */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] card-shadow overflow-hidden">
          <img src={user.coverImage} alt="" className="w-full h-44 object-cover" />
          <div className="p-6 relative pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
              <Avatar src={user.avatar} size="2xl" verified className="ring-4 ring-white" />
              <Button variant="outline" icon={Edit3} onClick={() => navigate('/profile/edit')}>Edit Profile</Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#1E293B]">{user.name}</h1>
                <Badge variant="primary">Level {user.level}</Badge>
              </div>
              <p className="text-xs text-[#94A3B8]">{user.username} · {user.institution}</p>
              <p className="text-sm text-[#64748B] max-w-2xl">{user.bio}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-[#EDF2F7] text-center">
              <div>
                <span className="text-lg font-extrabold text-[#4F7DF6]">{user.xp.toLocaleString()}</span>
                <span className="text-[10px] text-[#94A3B8] block uppercase">Total XP</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-[#F59E0B] flex items-center justify-center gap-1"><Flame className="w-4 h-4" /> {user.streak}</span>
                <span className="text-[10px] text-[#94A3B8] block uppercase">Day Streak</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-[#1E293B]">{user.followers}</span>
                <span className="text-[10px] text-[#94A3B8] block uppercase">Followers</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-[#1E293B]">{user.following}</span>
                <span className="text-[10px] text-[#94A3B8] block uppercase">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs tabs={tabs} active={tab} onChange={setTab} variant="pills" />

        {/* Tab Content */}
        {tab === 'posts' && (
          <div className="space-y-4">
            {MOCK_FEED_POSTS.map(post => (
              <Card key={post.id} className="space-y-3">
                <Badge variant="primary" size="sm">{post.subject}</Badge>
                <h3 className="text-sm font-bold text-[#1E293B]">{post.caption}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2">{post.explanation}</p>
              </Card>
            ))}
          </div>
        )}

        {tab === 'certificates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['AI & Deep Learning Masterclass', 'Quantum Superposition Fundamentals', 'Data Structures & Algorithms', 'USMLE Step 1 Prep'].map((cert, i) => (
              <Card key={i} className="p-4 flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-[#F59E0B] rounded-[12px]"><Award className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">{cert}</h4>
                  <p className="text-[10px] text-[#94A3B8]">Verified by StudyVerse Blockchain</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
