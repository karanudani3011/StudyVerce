import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { MOCK_FEED_POSTS, MOCK_COURSES, MOCK_COMMUNITIES } from '../data/mockData';

export const SearchPage = () => {
  const { searchQuery } = useAuth();
  const [searchCategory, setSearchCategory] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Results' },
    { id: 'posts', label: 'Notes & Feed' },
    { id: 'courses', label: 'Courses' },
    { id: 'communities', label: 'Communities' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Search Results</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Results for: <span className="font-bold text-[#4F7DF6]">"{searchQuery || 'Neural Networks'}"</span>
            </p>
          </div>

          <Tabs tabs={tabs} activeTab={searchCategory} onChange={setSearchCategory} variant="pills" />

          <div className="space-y-4">
            {(searchCategory === 'all' || searchCategory === 'posts') && MOCK_FEED_POSTS.map((post) => (
              <Card key={post.id} hover className="p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#4F7DF6]">{post.subject}</span>
                  <span className="text-xs text-[#94A3B8]">· {post.teacher.name}</span>
                </div>
                <h3 className="text-base font-bold text-[#1E293B]">{post.caption}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{post.explanation}</p>
              </Card>
            ))}

            {(searchCategory === 'all' || searchCategory === 'courses') && MOCK_COURSES.map((course) => (
              <Card key={course.id} hover className="p-4 flex items-center gap-4">
                <img src={course.image} alt={course.title} className="w-16 h-16 object-cover rounded-[12px] border border-[#E2E8F0] shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#8B5CF6]">{course.tags[0]}</span>
                  <h3 className="text-sm font-bold text-[#1E293B] mt-0.5 truncate">{course.title}</h3>
                  <p className="text-xs text-[#64748B]">{course.instructor} · {course.students} students</p>
                </div>
              </Card>
            ))}

            {(searchCategory === 'all' || searchCategory === 'communities') && MOCK_COMMUNITIES.map((comm) => (
              <Card key={comm.id} hover className="p-4 flex items-center gap-4">
                <span className="text-3xl">{comm.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#1E293B]">{comm.name}</h3>
                  <p className="text-xs text-[#64748B]">{comm.members} members · {comm.subject}</p>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};
