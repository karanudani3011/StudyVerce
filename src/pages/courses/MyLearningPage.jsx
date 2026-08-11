import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Progress } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { MOCK_COURSES } from '../../data/mockData';

export default function MyLearningPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">My Learning Dashboard</h1>
          <p className="text-sm text-[#64748B]">Track your enrolled courses and active progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_COURSES.map(course => (
            <Card key={course.id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="flex gap-4 items-start">
                <img src={course.image} alt="" className="w-24 h-24 rounded-[14px] object-cover shrink-0 border border-[#E2E8F0]" />
                <div className="space-y-1">
                  <Badge variant="primary" size="sm">{course.subject}</Badge>
                  <h3 className="text-sm font-bold text-[#1E293B]">{course.title}</h3>
                  <p className="text-xs text-[#94A3B8]">{course.instructor}</p>
                </div>
              </div>
              <Progress value={course.progress} showLabel size="md" />
              <Button variant="primary" size="sm" icon={Play} onClick={() => navigate(`/courses/${course.id}`)}>
                Resume Course ({course.progress}%)
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
