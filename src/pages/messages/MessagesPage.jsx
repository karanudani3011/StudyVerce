import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge } from '../../components/ui/index.jsx';
import { MOCK_MESSAGES } from '../../data/mockData';

export default function MessagesPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Messages</h1>
          <p className="text-sm text-[#64748B]">Direct study chats with peers and educators.</p>
        </div>

        <Card className="divide-y divide-[#EDF2F7] p-0">
          {MOCK_MESSAGES.map(m => (
            <div key={m.id} onClick={() => navigate(`/messages/${m.id}`)} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Avatar src={m.user.avatar} alt={m.user.name} size="md" status={m.user.online ? 'online' : 'offline'} />
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">{m.user.name}</h4>
                  <p className="text-xs text-[#64748B] line-clamp-1">{m.lastMessage}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#94A3B8] block mb-1">{m.time}</span>
                {m.unread > 0 && <span className="bg-[#4F7DF6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{m.unread}</span>}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </AppLayout>
  );
}
