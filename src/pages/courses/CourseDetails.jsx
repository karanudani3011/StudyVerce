import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, Clock, BookOpen, Star, ArrowLeft } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar, Progress } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { MOCK_COURSES } from '../../data/mockData';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = MOCK_COURSES.find(c => c.id === id) || MOCK_COURSES[0];

  const syllabus = [
    { title: 'Module 1: Foundations & Prerequisites', duration: '2 hrs', completed: true },
    { title: 'Module 2: Core Algorithmic Mechanics', duration: '4 hrs', completed: true },
    { title: 'Module 3: Advanced Applications & Projects', duration: '6 hrs', completed: false },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-4">
              <Badge variant="primary">{course.subject}</Badge>
              <h1 className="text-2xl font-extrabold text-[#1E293B]">{course.title}</h1>
              <div className="flex items-center gap-4 text-xs text-[#64748B]">
                <span className="flex items-center gap-1 font-bold text-[#F59E0B]"><Star className="w-4 h-4 fill-current" /> {course.rating}</span>
                <span>{course.students} Students</span>
                <span>{course.duration} Total Duration</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#EDF2F7]">
                <Avatar src={course.instructorAvatar} alt={course.instructor} size="md" verified />
                <div>
                  <p className="text-xs font-bold text-[#1E293B]">{course.instructor}</p>
                  <p className="text-[10px] text-[#94A3B8]">Course Creator & Verified Professor</p>
                </div>
              </div>
            </Card>

            {/* Curriculum */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-[#1E293B]">Course Syllabus</h3>
              <div className="space-y-3">
                {syllabus.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 text-[#4F7DF6]" />
                      <span className="text-sm font-semibold text-[#1E293B]">{m.title}</span>
                    </div>
                    <span className="text-xs text-[#94A3B8]">{m.duration}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4 text-center">
              <img src={course.image} alt="" className="w-full h-40 object-cover rounded-[14px] border border-[#E2E8F0]" />
              <div className="text-left space-y-2">
                <p className="text-xs font-bold text-[#64748B]">Your Course Progress</p>
                <Progress value={course.progress} showLabel size="md" />
              </div>
              <Button variant="primary" size="lg" fullWidth icon={Play}>Continue Learning</Button>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
