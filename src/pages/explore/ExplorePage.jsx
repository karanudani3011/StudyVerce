import React, { useState } from 'react';
import { Search, Compass, BookOpen, Users, Filter, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { MOCK_CATEGORIES, MOCK_COURSES, MOCK_COMMUNITIES } from '../../data/mockData';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'AI & ML', 'Quantum Physics', 'Computer Science', 'UPSC'];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Explore StudyVerse</h1>
          <p className="text-sm text-[#64748B]">Discover trending academic categories, courses, and communities.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer transition-all ${activeTab === tab ? 'bg-[#4F7DF6] text-white border-[#4F7DF6]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F5F7FB]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1E293B]">Top Academic Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOCK_CATEGORIES.map(cat => (
              <Card key={cat.id} hover onClick={() => navigate('/categories')} className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-[12px] ${cat.color} flex items-center justify-center text-lg`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1E293B] line-clamp-1">{cat.name}</h3>
                  <p className="text-[10px] text-[#94A3B8]">{cat.count}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1E293B]">Featured Courses</h2>
            <button onClick={() => navigate('/courses')} className="text-xs font-semibold text-[#4F7DF6] hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_COURSES.map(course => (
              <Card key={course.id} hover onClick={() => navigate(`/courses/${course.id}`)} className="space-y-3">
                <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-[14px] border border-[#E2E8F0]" />
                <Badge variant="primary" size="sm">{course.subject}</Badge>
                <h3 className="text-sm font-bold text-[#1E293B] line-clamp-2">{course.title}</h3>
                <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#EDF2F7]">
                  <span>{course.lessons} Lessons</span>
                  <span className="font-bold text-[#22C55E]">{course.price}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
