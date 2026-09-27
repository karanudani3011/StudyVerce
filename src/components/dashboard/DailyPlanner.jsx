import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Card } from '../ui/Card';

export const DailyPlanner = ({
  tasks = [],
  onTaskClick,
  completedCount = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }}
    >
      <Card className="space-y-4 border border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-[10px] bg-blue-50 text-[#4F7DF6]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Interactive Daily Study Planner</h2>
              <p className="text-xs text-[#64748B]">Check off tasks as you complete them to earn bonus XP!</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF4FF] text-[#4F7DF6]">
            {completedCount} / {tasks.length} Done
          </span>
        </div>

        <div className="space-y-2.5 pt-2">
          {tasks.length === 0 ? (
            <div className="text-center py-6 text-[#64748B] text-xs">
              No daily study tasks scheduled for today.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id || task.id}
                onClick={() => onTaskClick && onTaskClick(task)}
                className={`flex items-center justify-between p-3.5 rounded-[14px] border transition-all cursor-pointer select-none ${
                  task.completed
                    ? 'bg-slate-50 border-[#E2E8F0] opacity-85'
                    : 'bg-white border-[#E2E8F0] hover:border-[#4F7DF6]/40 hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      task.completed ? 'line-through text-[#94A3B8]' : 'text-[#1E293B]'
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-[#64748B]">
                    {task.subject}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#4F7DF6]">
                    +{task.xp} XP
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
};
