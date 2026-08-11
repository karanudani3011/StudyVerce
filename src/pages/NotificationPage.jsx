import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

export const NotificationPage = () => {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Notifications</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Replies, quiz challenges, community events and achievement updates.
            </p>
          </div>

          <div className="space-y-6">
            {['Today', 'Yesterday', 'This Week'].map((group) => {
              const items = MOCK_NOTIFICATIONS.filter(n => n.group === group);
              if (!items.length) return null;
              return (
                <div key={group} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{group}</h3>
                  {items.map((n) => (
                    <Card key={n.id} hover className="flex items-start gap-4 p-4">
                      <span className="text-xl leading-none">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-[#1E293B] truncate">{n.title}</h4>
                          <span className="text-[10px] text-[#94A3B8] shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{n.desc}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};
