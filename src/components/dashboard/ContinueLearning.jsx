import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { EmptyState } from './EmptyState';

export const ContinueLearning = ({ courses = [], loading = false }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.08 } }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4F7DF6]" />
            <span>Continue Learning</span>
          </h2>
          <p className="text-xs text-[#64748B]">Pick up where you left off in your enrolled courses</p>
        </div>
        <button
          onClick={() => navigate('/my-learning')}
          className="text-xs font-semibold text-[#4F7DF6] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4 space-y-3 animate-pulse border border-[#E2E8F0]">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-[12px] bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                  <div className="h-2 w-full bg-slate-200 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses enrolled yet"
          description="Start your learning journey by exploring courses and enrolling in one."
          actionLabel="Explore Courses"
          actionIcon={ExternalLink}
          onAction={() => navigate('/courses')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const courseId = course.id || course._id;
            const progressVal = Number(course.progress || 0);
            const lessonsCount = course.lectures?.length || course.lessons || 0;

            return (
              <Card
                key={courseId}
                hover
                className="p-4 space-y-3 cursor-pointer group border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all"
                onClick={() => navigate(`/courses/${courseId}/learn`)}
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                    alt={course.title}
                    className="w-20 h-20 rounded-[12px] object-cover shrink-0 border border-[#E2E8F0] group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <Badge variant="primary" size="xs">
                      {course.subject || 'General'}
                    </Badge>
                    <h3 className="text-xs font-bold text-[#1E293B] line-clamp-1 group-hover:text-[#4F7DF6] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[10px] text-[#94A3B8] truncate">
                      {course.instructor || 'Faculty Educator'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-[#1E293B]">{progressVal}% Complete</span>
                    <span className="text-[#64748B]">{course.duration || 'Flexible'}</span>
                  </div>
                  <Progress value={progressVal} size="xs" color="bg-[#4F7DF6]" />
                </div>

                <div className="pt-2 border-t border-[#EDF2F7] flex items-center justify-between text-[10px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-[#4F7DF6]" /> {lessonsCount} lessons
                  </span>
                  <Button variant="ghost" size="xs" icon={Play} className="h-7 px-2">
                    Continue
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
