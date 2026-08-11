import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge } from '../../components/ui/index.jsx';
import { MOCK_ACHIEVEMENTS } from '../../data/mockData';

export default function AchievementsPage() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Achievements & Badges</h1>
          <p className="text-sm text-[#64748B]">Milestones unlocked through continuous study and community contributions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_ACHIEVEMENTS.map(ach => (
            <Card key={ach.id} className={`p-4 space-y-3 ${!ach.earned ? 'opacity-60 bg-[#F8FAFC]' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{ach.icon}</span>
                {ach.earned ? <CheckCircle2 className="w-5 h-5 text-[#22C55E]" /> : <Lock className="w-4 h-4 text-[#94A3B8]" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E293B]">{ach.title}</h4>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{ach.desc}</p>
              </div>
              {ach.earned && <Badge variant="success" size="sm">Unlocked {ach.date}</Badge>}
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
