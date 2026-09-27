import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Clock, Star, ArrowRight, Trophy, TrendingUp } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Progress, Avatar, Button } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet } from '../../config/api';

export default function MyLearningPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    averageProgress: 0
  });

  const fetchEnrolledCourses = async () => {
    try {
      const res = await apiGet('/courses/enrolled/my');
      if (res.success && res.data) {
        setEnrolledCourses(res.data);
        
        // Calculate stats
        const total = res.data.length;
        const completed = res.data.filter(c => c.progress >= 100).length;
        const inProgress = res.data.filter(c => c.progress > 0 && c.progress < 100).length;
        const avgProgress = total > 0 
          ? Math.round(res.data.reduce((sum, c) => sum + (c.progress || 0), 0) / total)
          : 0;
        
        // Calculate total hours (rough estimate from duration strings)
        const totalHours = res.data.reduce((sum, c) => {
          const hours = parseFloat(c.duration?.match(/(\d+(?:\.\d+)?)/)?.[0] || '0');
          return sum + hours;
        }, 0);

        setStats({
          totalCourses: total,
          completedCourses: completed,
          inProgressCourses: inProgress,
          totalHours: Math.round(totalHours * 10) / 10,
          averageProgress: avgProgress
        });
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
      addToast('Failed to load your courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const handleContinueCourse = (courseId) => {
    navigate(`/courses/${courseId}/learn`);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
          <div className="min-h-[400px] flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#4F7DF6] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#64748B] font-medium">Loading your learning dashboard...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">My Learning Dashboard</h1>
          <p className="text-sm text-[#64748B]">Track your enrolled courses and learning progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-5 space-y-2 border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Total Courses</span>
              <div className="p-2 rounded-[10px] bg-blue-50 text-[#4F7DF6] border border-blue-100">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1E293B]">{stats.totalCourses}</div>
            <div className="text-xs text-[#64748B]">Enrolled in your library</div>
          </Card>

          <Card className="p-5 space-y-2 border border-[#E2E8F0] hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">In Progress</span>
              <div className="p-2 rounded-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">
                <TrendingUp className="w-5 h-5" strokeWidth={2} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1E293B]">{stats.inProgressCourses}</div>
            <div className="text-xs text-[#64748B]">Actively learning</div>
          </Card>

          <Card className="p-5 space-y-2 border border-[#E2E8F0] hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Completed</span>
              <div className="p-2 rounded-[10px] bg-amber-50 text-amber-600 border border-amber-100">
                <Trophy className="w-5 h-5" strokeWidth={2} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1E293B]">{stats.completedCourses}</div>
            <div className="text-xs text-[#64748B]">Courses finished</div>
          </Card>

          <Card className="p-5 space-y-2 border border-[#E2E8F0] hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Study Hours</span>
              <div className="p-2 rounded-[10px] bg-purple-50 text-purple-600 border border-purple-100">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1E293B]">{stats.totalHours} hrs</div>
            <div className="text-xs text-[#64748B]">Total content duration</div>
          </Card>

          <Card className="p-5 space-y-2 border border-[#E2E8F0] hover:border-rose-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Avg. Progress</span>
              <div className="p-2 rounded-[10px] bg-rose-50 text-rose-600 border border-rose-100">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1E293B]">{stats.averageProgress}%</div>
            <div className="text-xs text-[#64748B]">Overall completion</div>
          </Card>
        </div>

        {/* Empty State */}
        {enrolledCourses.length === 0 && (
          <Card className="p-12 text-center space-y-6 border-2 border-dashed border-[#E2E8F0]">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E293B]">No Courses Yet</h2>
              <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Start exploring courses to begin your learning journey!
              </p>
            </div>
            <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => navigate('/courses')}>
              Browse Courses
            </Button>
          </Card>
        )}

        {/* Enrolled Courses Grid */}
        {enrolledCourses.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1E293B]">
                Your Courses ({enrolledCourses.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <Card key={course.id || course._id} className="p-5 space-y-4 flex flex-col hover:border-[#4F7DF6]/40 transition-all border border-[#E2E8F0]" hover>
                  <div className="flex gap-4 items-start">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-24 h-24 rounded-[14px] object-cover shrink-0 border border-[#E2E8F0]" 
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <Badge variant="primary" size="sm">{course.subject}</Badge>
                      <h3 className="text-sm font-bold text-[#1E293B] line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-[#94A3B8] truncate">{course.instructor}</p>
                    </div>
                  </div>
                  
                  <Progress value={course.progress || 0} showLabel size="md" />
                  
                  <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#EDF2F7]">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lectures?.length || course.lessons} lessons</span>
                    <span className="font-bold text-[#22C55E]">{course.price}</span>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <Button
                      variant={course.progress > 0 ? "primary" : "outline"}
                      size="sm"
                      className="flex-1"
                      icon={course.progress > 0 ? Play : BookOpen}
                      onClick={() => handleContinueCourse(course.id || course._id)}
                    >
                      {course.progress > 0 ? `Resume (${course.progress}%)` : 'Start Course'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ArrowRight}
                      onClick={() => handleViewCourse(course.id || course._id)}
                    >
                      Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}