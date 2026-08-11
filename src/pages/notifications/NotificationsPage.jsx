import React from 'react';
import { Bell, Heart, Trophy, MessageCircle } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge } from '../../components/ui/index.jsx';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export default function NotificationsPage() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Notifications</h1>
          <Badge variant="primary">Mark all as read</Badge>
        </div>

        <Card className="divide-y divide-[#EDF2F7] p-0">
          {MOCK_NOTIFICATIONS.map(n => (
            <div key={n.id} className="p-4 flex gap-4 hover:bg-[#F8FAFC] transition-colors items-center">
              <span className="text-2xl">{n.icon}</span>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1E293B]">{n.title}</h4>
                <p className="text-xs text-[#64748B] mt-0.5">{n.desc}</p>
                <span className="text-[10px] text-[#94A3B8] mt-1 block">{n.time}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </AppLayout>
  );
}
