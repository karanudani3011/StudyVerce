import React, { useState } from 'react';
import { Search, Filter, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MOCK_COURSES, MOCK_COMMUNITIES } from '../data/mockData';

export const ExplorePage = () => {
  const { setActiveTab } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = ['All', 'Programming', 'AI & ML', 'Quantum Physics', 'UPSC', 'Medical', 'Design'];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Explore Knowledge</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">Discover top courses, study communities, and trending subject areas.</p>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-[12px] text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedSubject === sub
                    ? 'bg-[#4F7DF6] text-white shadow-xs'
                    : 'bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F5F7FB] border border-[#E2E8F0]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Featured Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E293B]">Popular Masterclasses</h2>
              <button className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_COURSES.map((course) => (
                <Card key={course.id} hover className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-[14px] border border-[#E2E8F0]" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4F7DF6]">{course.tags[0]}</span>
                      <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" strokeWidth={0} /> {course.rating}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1E293B] line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-[#64748B]">{course.instructor} · {course.students} students</p>
                  </div>
                  <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">{course.duration}</span>
                    <Button variant="primary" size="sm" onClick={() => setActiveTab('feed')}>Enroll Free</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Communities */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1E293B]">Active Study Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MOCK_COMMUNITIES.map((comm) => (
                <Card key={comm.id} hover className="flex items-start justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{comm.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B]">{comm.name}</h3>
                      <p className="text-xs text-[#64748B]">{comm.members} members · {comm.subject}</p>
                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{comm.description}</p>
                    </div>
                  </div>
                  <Button
                    variant={comm.joined ? 'secondary' : 'primary'}
                    size="sm"
                    className="shrink-0"
                    onClick={() => setActiveTab('community')}
                  >
                    {comm.joined ? 'Joined' : 'Join'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};
