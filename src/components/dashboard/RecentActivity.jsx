import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Trophy, FileText, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';

const getIcon = (type) => {
  switch (type) {
    case 'study_session':
      return { icon: Clock, bg: 'bg-purple-50 text-[#8B5CF6] border-purple-100' };
    case 'quiz':
      return { icon: Trophy, bg: 'bg-amber-50 text-[#F59E0B] border-amber-100' };
    case 'note':
      return { icon: FileText, bg: 'bg-blue-50 text-[#4F7DF6] border-blue-100' };
    case 'enrollment':
      return { icon: BookOpen, bg: 'bg-emerald-50 text-[#22C55E] border-emerald-100' };
    default:
      return { icon: Activity, bg: 'bg-slate-100 text-[#64748B] border-slate-200' };
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';
  
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const RecentActivity = ({ activities = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.12 } }}
    >
      <Card className="space-y-4 border border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-[10px] bg-slate-100 text-[#4F7DF6]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Recent Activity</h2>
              <p className="text-xs text-[#64748B]">Your real-time study sessions, quizzes, and learning milestones</p>
            </div>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 text-[#64748B] text-xs space-y-1">
            <p className="font-semibold text-[#1E293B]">No recent activity yet.</p>
            <p>Complete study sessions, quizzes, or upload notes to see your learning history.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EDF2F7]">
            {activities.map((act) => {
              const { icon: ItemIcon, bg } = getIcon(act.type);
              return (
                <div key={act.id} className="py-3 flex items-center justify-between gap-3 first:pt-1 last:pb-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-[10px] border shrink-0 ${bg}`}>
                      <ItemIcon className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate">{act.title}</p>
                      <p className="text-[11px] text-[#64748B] truncate">{act.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#94A3B8] block">{formatDate(act.date)}</span>
                    {act.xp > 0 && (
                      <span className="text-[10px] font-bold text-[#4F7DF6]">+{act.xp} XP</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
