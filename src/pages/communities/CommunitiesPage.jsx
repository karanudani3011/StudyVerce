import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mic, Calendar, Plus } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { MOCK_COMMUNITIES } from '../../data/mockData';

export default function CommunitiesPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">Study Communities</h1>
            <p className="text-sm text-[#64748B]">Join live academic hubs, voice study lounges, and paper reviews.</p>
          </div>
          <Button variant="primary" icon={Plus}>Create Community</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_COMMUNITIES.map(comm => (
            <Card key={comm.id} hover onClick={() => navigate(`/communities/${comm.id}`)} className="space-y-4">
              <div className="relative h-28 -mx-6 -mt-6 overflow-hidden rounded-t-[20px]">
                <img src={comm.banner} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#1E293B] border border-[#E2E8F0]">
                  {comm.icon} {comm.subject}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">{comm.name}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2 mt-1">{comm.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDF2F7]">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Users className="w-4 h-4 text-[#4F7DF6]" />
                  <span className="font-bold text-[#1E293B]">{comm.members}</span> members
                </div>
                {comm.activeVoiceRooms > 0 && (
                  <Badge variant="success" icon={Mic}>{comm.activeVoiceRooms} Voice Room</Badge>
                )}
              </div>

              <Button variant={comm.joined ? "secondary" : "primary"} size="sm" fullWidth>
                {comm.joined ? "Joined" : "Join Community"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
