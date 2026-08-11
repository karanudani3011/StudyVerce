import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Users, User, FileText } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar, EmptyState } from '../../components/ui/index.jsx';
import { MOCK_COURSES, MOCK_FEED_POSTS, MOCK_TEACHERS } from '../../data/mockData';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-xl font-extrabold text-[#1E293B]">
            Search Results for <span className="text-[#4F7DF6]">"{query || 'All Topics'}"</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">Showing matches across courses, notes, and educators.</p>
        </div>

        <div className="space-y-6">
          {/* Courses */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider text-[#94A3B8]">Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_COURSES.map(course => (
                <Card key={course.id} hover onClick={() => navigate(`/courses/${course.id}`)} className="flex gap-3 p-3 items-center">
                  <img src={course.image} alt="" className="w-16 h-16 rounded-[12px] object-cover shrink-0" />
                  <div className="min-w-0">
                    <Badge variant="primary" size="sm">{course.subject}</Badge>
                    <h3 className="text-xs font-bold text-[#1E293B] truncate mt-1">{course.title}</h3>
                    <p className="text-[10px] text-[#94A3B8]">{course.instructor}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Educators */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider text-[#94A3B8]">Educators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MOCK_TEACHERS.map(t => (
                <Card key={t.id} hover className="flex items-center gap-3 p-3">
                  <Avatar src={t.avatar} size="sm" verified={t.verified} />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#1E293B] truncate">{t.name}</h3>
                    <p className="text-[10px] text-[#94A3B8] truncate">{t.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
