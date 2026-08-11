import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Clock, Users } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { MOCK_COURSES } from '../../data/mockData';

export default function CoursesPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">All Courses</h1>
          <p className="text-sm text-[#64748B]">Structured learning paths curated by top professors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_COURSES.map(course => (
            <Card key={course.id} hover onClick={() => navigate(`/courses/${course.id}`)} className="space-y-4">
              <img src={course.image} alt="" className="w-full h-44 object-cover rounded-[14px] border border-[#E2E8F0]" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">{course.subject}</Badge>
                  <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" /> {course.rating}</span>
                </div>
                <h3 className="text-base font-bold text-[#1E293B]">{course.title}</h3>
                <p className="text-xs text-[#94A3B8]">{course.instructor}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#EDF2F7]">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                <span className="font-bold text-[#22C55E]">{course.price}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
