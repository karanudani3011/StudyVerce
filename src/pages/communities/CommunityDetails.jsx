import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Mic, Calendar, MessageSquare, ArrowLeft, Volume2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { MOCK_COMMUNITIES } from '../../data/mockData';

export default function CommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const comm = MOCK_COMMUNITIES.find(c => c.id === id) || MOCK_COMMUNITIES[0];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]">
          <ArrowLeft className="w-4 h-4" /> Back to Communities
        </button>

        {/* Banner Card */}
        <div className="relative rounded-[24px] overflow-hidden border border-[#E2E8F0] bg-white card-shadow">
          <img src={comm.banner} alt="" className="w-full h-48 object-cover" />
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[20px] bg-white shadow-lg flex items-center justify-center text-3xl border border-[#E2E8F0] -mt-10 z-10">
                {comm.icon}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#1E293B]">{comm.name}</h1>
                <p className="text-xs text-[#64748B]">{comm.members} members · {comm.subject}</p>
              </div>
            </div>
            <Button variant={comm.joined ? "secondary" : "primary"}>
              {comm.joined ? "Joined Community" : "Join Community"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4 flex gap-3 items-center">
              <Avatar size="sm" />
              <input type="text" placeholder="Share a question or study note with the community..." className="flex-1 bg-[#F5F7FB] border border-[#E2E8F0] rounded-[14px] px-4 py-2 text-sm" />
              <Button size="sm">Post</Button>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">Dr. Sarah Chen</h4>
                  <p className="text-[10px] text-[#94A3B8]">2 hrs ago</p>
                </div>
              </div>
              <p className="text-sm text-[#1E293B]">Welcome to all new members! Check out our pinned events for the weekly Attention Mechanism paper review on Saturday.</p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Live Voice Rooms */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1E293B]">Live Voice Lounges</h3>
                <Badge variant="success" icon={Volume2}>Live</Badge>
              </div>
              <div className="p-3 bg-emerald-50 rounded-[14px] border border-emerald-100 space-y-2">
                <p className="text-xs font-bold text-[#1E293B]">Quiet Study Lounge #1</p>
                <p className="text-[10px] text-[#64748B]">8 students currently studying together</p>
                <Button variant="success" size="xs" fullWidth>Join Voice Lounge</Button>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="space-y-3">
              <h3 className="text-sm font-bold text-[#1E293B]">Upcoming Events</h3>
              <div className="space-y-2">
                {comm.events.map((ev, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0]">
                    <p className="text-xs font-bold text-[#1E293B]">{ev.title}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{ev.time}</p>
                    <p className="text-[10px] text-[#4F7DF6] font-semibold mt-1">Host: {ev.host}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
