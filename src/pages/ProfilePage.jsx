import React, { useState } from 'react';
import { Award, Share2, Edit, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Tabs } from '../components/ui/Tabs';

export const ProfilePage = () => {
  const { user, setActiveTab } = useAuth();
  const [activeProfileTab, setActiveProfileTab] = useState('certificates');

  const tabs = [
    { id: 'certificates', label: 'Certificates', count: 2 },
    { id: 'posts', label: 'My Notes', count: 14 },
    { id: 'saved', label: 'Saved', count: 32 },
    { id: 'achievements', label: 'Achievements' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          {/* Profile Header Card */}
          <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden">
            <img src={user.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'} alt="Cover" className="w-full h-40 sm:h-52 object-cover" />
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 -mt-12 relative z-10">
              <div className="flex items-end gap-4">
                <Avatar src={user.avatar} alt={user.name} size="2xl" verified className="ring-4 ring-white" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">{user.name}</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">Level 12 Scholar</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">{user.username}</p>
                  <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mt-2 leading-relaxed">{user.bio}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="secondary" icon={Share2} size="sm">Share</Button>
                <Button variant="primary" icon={Edit} size="sm" onClick={() => setActiveTab('settings')}>Edit Profile</Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="px-6 py-4 border-t border-[#EDF2F7] bg-[#F8FAFC] flex items-center gap-8 text-xs font-semibold text-[#64748B]">
              <div><span className="font-extrabold text-[#1E293B] text-base mr-1">{user.xp.toLocaleString()}</span>XP Earned</div>
              <div><span className="font-extrabold text-[#4F7DF6] text-base mr-1">{user.streak}</span>Day Streak</div>
              <div><span className="font-extrabold text-[#1E293B] text-base mr-1">{user.followers}</span>Followers</div>
              <div><span className="font-extrabold text-[#1E293B] text-base mr-1">{user.following}</span>Following</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeProfileTab} onChange={setActiveProfileTab} variant="pills" />

          {/* Certificates */}
          {activeProfileTab === 'certificates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Machine Learning & Deep Neural Networks', date: 'Aug 2026', id: 'SV-84920' },
                { title: 'Quantum Computing Foundations', date: 'Jul 2026', id: 'SV-73910' }
              ].map((cert, idx) => (
                <Card key={idx} hover className="space-y-4 border-l-4 border-l-[#4F7DF6]">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-[#EEF4FF] text-[#4F7DF6] rounded-[14px] border border-[#E2E8F0]">
                      <Award className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-mono text-[#94A3B8]">ID: {cert.id}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E293B]">{cert.title}</h3>
                    <p className="text-xs text-[#64748B] mt-1">Verified by StudyVerse Academic Board · {cert.date}</p>
                  </div>
                  <Button variant="secondary" size="sm" icon={Download} fullWidth>Download Certificate PDF</Button>
                </Card>
              ))}
            </div>
          )}

          {/* Achievements */}
          {activeProfileTab === 'achievements' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(user.badges || ['Early Adopter', 'Streak Master', 'Top Scholar', 'Quiz Champion']).map((badge, i) => (
                <Card key={i} className="p-4 text-center space-y-2 border border-[#E2E8F0]">
                  <div className="text-3xl">🏆</div>
                  <div className="text-xs font-bold text-[#1E293B]">{badge}</div>
                  <div className="text-[10px] text-[#94A3B8]">Unlocked</div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};
