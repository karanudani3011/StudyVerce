import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AITutorCard = ({ enrolledCourses = [] }) => {
  const navigate = useNavigate();

  const hasCourses = enrolledCourses && enrolledCourses.length > 0;
  const primaryCourse = hasCourses ? enrolledCourses[0] : null;

  const promptTitle = hasCourses
    ? `Practice ${primaryCourse.subject || 'Coursework'}:`
    : 'Ask AI Tutor anything:';

  const promptText = hasCourses
    ? `Ask me to explain any difficult concept from "${primaryCourse.title}" or generate a custom quiz!`
    : 'Start your learning journey! Ask questions on Mathematics, Computer Science, Physics, or general studies.';

  return (
    <Card className="space-y-4 border-l-4 border-l-[#8B5CF6] bg-gradient-to-br from-purple-50/50 to-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 text-[#8B5CF6] rounded-[10px]">
            <Bot className="w-5 h-5" strokeWidth={2} />
          </div>
          <h4 className="text-sm font-bold text-[#1E293B]">AI Tutor Assistant</h4>
        </div>
        <Badge variant="accent" size="sm">Active 🤖</Badge>
      </div>

      <div className="bg-white p-3 rounded-[12px] border border-purple-100 text-xs text-[#475569] space-y-1">
        <p className="font-bold text-[#1E293B] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
          {promptTitle}
        </p>
        <p className="italic text-[#64748B] line-clamp-2">{promptText}</p>
      </div>

      <Button
        variant="accent"
        size="sm"
        fullWidth
        icon={Bot}
        onClick={() => navigate('/ai-tutor')}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Ask AI Tutor Now
      </Button>
    </Card>
  );
};
