import React, { useState } from 'react';
import { Users, Volume2, Pin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { MOCK_COMMUNITIES } from '../data/mockData';

export const CommunityPage = () => {
  const { setActiveTab } = useAuth();
  const [activeCommunity] = useState(MOCK_COMMUNITIES[0]);
  const [activeTabId, setActiveTabId] = useState('posts');
  const [joined, setJoined] = useState(activeCommunity.joined);

  const tabs = [
    { id: 'posts', label: 'Feed & Announcements' },
    { id: 'rooms', label: 'Study Rooms', count: activeCommunity.activeVoiceRooms },
    { id: 'events', label: 'Events', count: activeCommunity.events?.length ?? 0 },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          {/* Banner */}
          <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden">
            <img src={activeCommunity.banner} alt={activeCommunity.name} className="w-full h-44 sm:h-56 object-cover" />
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 -mt-10 relative z-10">
              <div className="flex items-end gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-white text-3xl sm:text-4xl flex items-center justify-center ring-4 ring-white border border-[#E2E8F0] shadow-sm">
                  {activeCommunity.icon}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">{activeCommunity.name}</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">{activeCommunity.members} members · {activeCommunity.subject}</p>
                </div>
              </div>
              <Button
                variant={joined ? 'secondary' : 'primary'}
                onClick={() => setJoined(!joined)}
                className="shrink-0"
              >
                {joined ? '✓ Member Joined' : '+ Join Community'}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeTabId} onChange={setActiveTabId} variant="underline" />

          {/* Pinned Announcement */}
          {activeTabId === 'posts' && (
            <div className="space-y-4">
              <Card className="border-l-4 border-l-[#4F7DF6] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4F7DF6]">
                  <Pin className="w-4 h-4" strokeWidth={2} /> PINNED ANNOUNCEMENT
                </div>
                <h3 className="text-base font-bold text-[#1E293B]">Welcome to {activeCommunity.name}!</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Respect all fellow students, maintain high clarity when uploading notes, and use the live voice study lounges for focused group work.
                </p>
              </Card>
            </div>
          )}

          {/* Voice Study Rooms */}
          {activeTabId === 'rooms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {['Quiet Study Room — Pomodoro 25/5', 'Python & PyTorch Discussion', 'Exam Sprint Prep Room'].map((room, idx) => (
                <Card key={idx} hover className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-[#22C55E] rounded-[14px] border border-emerald-200/60">
                      <Volume2 className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E293B]">{room}</h4>
                      <p className="text-xs text-[#64748B]">12 students currently inside</p>
                    </div>
                  </div>
                  <Button variant="primary" size="sm">Join</Button>
                </Card>
              ))}
            </div>
          )}

          {/* Events */}
          {activeTabId === 'events' && (
            <div className="space-y-4">
              {(activeCommunity.events || []).map((ev, i) => (
                <Card key={i} hover className="flex items-center justify-between p-5">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#8B5CF6]">{ev.time}</span>
                    <h4 className="text-base font-bold text-[#1E293B]">{ev.title}</h4>
                    <p className="text-xs text-[#64748B]">Hosted by {ev.host}</p>
                  </div>
                  <Button variant="secondary" size="sm">RSVP</Button>
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
