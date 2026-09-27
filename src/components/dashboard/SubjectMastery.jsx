import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Card } from '../ui/Card';
import { Progress } from '../ui/Progress';

const SUBJECT_COLORS = {
  'Computer Science': 'bg-[#4F7DF6]',
  'AI & ML': 'bg-[#8B5CF6]',
  'Quantum Physics': 'bg-[#8B5CF6]',
  'Physics': 'bg-[#8B5CF6]',
  'Chemistry': 'bg-[#F59E0B]',
  'Biology': 'bg-[#EC4899]',
  'Mathematics': 'bg-[#22C55E]',
  'Mathematics & Calculus': 'bg-[#22C55E]',
  'Web Development': 'bg-[#06B6D4]',
  'Data Structures & Algorithms': 'bg-[#F97316]',
  'Artificial Intelligence': 'bg-[#8B5CF6]',
};

export const SubjectMastery = ({ enrolledCourses = [] }) => {
  const subjectsProgress = useMemo(() => {
    if (!enrolledCourses || enrolledCourses.length === 0) return [];

    const subjectMap = {};
    enrolledCourses.forEach(course => {
      const subject = course.subject || 'General Study';
      if (!subjectMap[subject]) {
        subjectMap[subject] = { totalProgress: 0, count: 0, notesCount: 0 };
      }
      subjectMap[subject].totalProgress += Number(course.progress || 0);
      subjectMap[subject].count += 1;
      subjectMap[subject].notesCount += Number(course.lectures?.length || course.lessons || 0);
    });

    return Object.entries(subjectMap).map(([name, data]) => ({
      name,
      progress: Math.round(data.totalProgress / data.count),
      notesCount: data.notesCount,
      color: SUBJECT_COLORS[name] || 'bg-[#64748B]',
    }));
  }, [enrolledCourses]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.15 } }}
    >
      <Card className="space-y-4 border border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-[10px] bg-purple-50 text-[#8B5CF6]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Subject Mastery & Progress</h2>
              <p className="text-xs text-[#64748B]">Your overall retention and activity across enrolled subjects</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {subjectsProgress.length > 0 ? (
            subjectsProgress.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#1E293B] flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${sub.color}`} />
                    {sub.name}
                  </span>
                  <span className="text-[#64748B]">
                    {sub.progress}% Mastery ({sub.notesCount} lessons)
                  </span>
                </div>
                <Progress value={sub.progress} size="sm" color={sub.color} />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-[#64748B] text-xs">
              Enroll in courses to track subject mastery
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
