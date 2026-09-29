import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Play, Clock, Star, ArrowRight, Trophy, TrendingUp,
  Award, Lock, CheckCircle2, AlertCircle, HelpCircle
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Progress, Button } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet } from '../../config/api';
import CertificateModal from '../../components/courses/CertificateModal';

// ─── Status Badge Helper ─────────────────────────────────────────────────────
function CourseBadge({ progress, hasQuiz, quizPassed, certificateUnlocked }) {
  if (certificateUnlocked) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 border border-amber-200">
        <Award className="w-3 h-3" /> Certificate Ready
      </span>
    );
  }
  if (progress >= 100 && hasQuiz && !quizPassed) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 border border-purple-200">
        <HelpCircle className="w-3 h-3" /> Quiz Required
      </span>
    );
  }
  if (progress >= 100) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </span>
    );
  }
  if (progress > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 border border-blue-200">
        <TrendingUp className="w-3 h-3" /> In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
      <BookOpen className="w-3 h-3" /> Not Started
    </span>
  );
}

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
    averageProgress: 0,
    certificatesEarned: 0,
  });
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);
  const [certLoading, setCertLoading] = useState(null);
  const [certData, setCertData] = useState({});

  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const res = await apiGet('/courses/enrolled/my');
      if (res.success && res.data) {
        setEnrolledCourses(res.data);

        const total = res.data.length;
        const completed = res.data.filter(c => c.progress >= 100).length;
        const inProgress = res.data.filter(c => c.progress > 0 && c.progress < 100).length;
        const certs = res.data.filter(c => c.certificateUnlocked).length;
        const avgProgress = total > 0
          ? Math.round(res.data.reduce((sum, c) => sum + (c.progress || 0), 0) / total)
          : 0;
        const totalHours = res.data.reduce((sum, c) => {
          const hours = parseFloat(c.duration?.match(/(\d+(?:\.\d+)?)/)?.[0] || '0');
          return sum + hours;
        }, 0);

        setStats({
          totalCourses: total,
          completedCourses: completed,
          inProgressCourses: inProgress,
          totalHours: Math.round(totalHours * 10) / 10,
          averageProgress: avgProgress,
          certificatesEarned: certs,
        });
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
      addToast('Failed to load your courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (user) fetchEnrolledCourses();
  }, [user, fetchEnrolledCourses]);

  const handleViewCertificate = async (course) => {
    const courseId = course.id || course._id;
    if (certData[courseId]) {
      setSelectedCertCourse({ ...course, cert: certData[courseId] });
      return;
    }
    setCertLoading(courseId);
    try {
      const res = await apiGet(`/courses/${courseId}/certificate`);
      if (res.success) {
        setCertData(prev => ({ ...prev, [courseId]: res.certificate }));
        setSelectedCertCourse({ ...course, cert: res.certificate });
      }
    } catch (err) {
      addToast(err.message || 'Failed to load certificate', 'error');
    } finally {
      setCertLoading(null);
    }
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
          <p className="text-sm text-[#64748B]">Track your enrolled courses, quiz results, and certificates</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'blue' },
            { label: 'In Progress', value: stats.inProgressCourses, icon: TrendingUp, color: 'emerald' },
            { label: 'Completed', value: stats.completedCourses, icon: Trophy, color: 'amber' },
            { label: 'Study Hours', value: `${stats.totalHours}h`, icon: Clock, color: 'purple' },
            { label: 'Avg Progress', value: `${stats.averageProgress}%`, icon: Star, color: 'rose' },
            { label: 'Certificates', value: stats.certificatesEarned, icon: Award, color: 'teal' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className={`p-4 space-y-2 border border-[#E2E8F0] hover:border-${color}-400/40 transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">{label}</span>
                <div className={`p-1.5 rounded-[8px] bg-${color}-50 text-${color}-600 border border-${color}-100`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#1E293B]">{value}</div>
            </Card>
          ))}
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

        {/* Course Grid */}
        {enrolledCourses.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1E293B]">Your Courses ({enrolledCourses.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => {
                const cid = course.id || course._id;
                const progress = course.progress || 0;
                const isLoading = certLoading === cid;

                return (
                  <Card key={cid} className="p-5 space-y-4 flex flex-col border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all" hover>
                    {/* Thumbnail + Status */}
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-36 rounded-[14px] object-cover border border-[#E2E8F0]"
                      />
                      <div className="absolute top-2 left-2">
                        <CourseBadge
                          progress={progress}
                          hasQuiz={course.hasQuiz}
                          quizPassed={course.quizPassed}
                          certificateUnlocked={course.certificateUnlocked}
                        />
                      </div>
                      {course.hasQuiz && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-purple-900/80 text-purple-200 backdrop-blur-xs">
                            <HelpCircle className="w-3 h-3" /> Quiz
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1 flex-1">
                      <Badge variant="primary" size="sm">{course.subject}</Badge>
                      <h3 className="text-sm font-bold text-[#1E293B] line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-[#94A3B8] truncate">{course.instructor}</p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#64748B]">
                        <span>Progress</span>
                        <span className="font-bold text-[#1E293B]">{progress}%</span>
                      </div>
                      <Progress value={progress} size="sm" />
                    </div>

                    {/* Quiz Status */}
                    {course.hasQuiz && (
                      <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${
                        course.quizPassed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : progress >= 100
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                        {course.quizPassed
                          ? <><CheckCircle2 className="w-3.5 h-3.5" /> Quiz Passed {course.quizScore ? `— ${course.quizScore}%` : ''}</>
                          : progress >= 100
                          ? <><AlertCircle className="w-3.5 h-3.5" /> Final Quiz Required</>
                          : <><HelpCircle className="w-3.5 h-3.5" /> Final Quiz Available on Completion</>}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 border-t border-[#EDF2F7]">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lectures?.length || course.lessons} lessons</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant={progress > 0 ? 'primary' : 'outline'}
                        size="sm"
                        className="flex-1"
                        icon={progress > 0 ? Play : BookOpen}
                        onClick={() => navigate(`/courses/${cid}/learn`)}
                      >
                        {progress >= 100 && (!course.hasQuiz || course.quizPassed)
                          ? 'Review'
                          : progress > 0
                          ? `Resume ${progress}%`
                          : 'Start Course'}
                      </Button>

                      {course.certificateUnlocked ? (
                        <Button
                          variant="accent"
                          size="sm"
                          icon={isLoading ? undefined : Award}
                          onClick={() => handleViewCertificate(course)}
                          disabled={isLoading}
                        >
                          {isLoading ? '...' : '🎓 Certificate'}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={ArrowRight}
                          onClick={() => navigate(`/courses/${cid}`)}
                        >
                          Details
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Certificate Modal */}
        {selectedCertCourse?.cert && (
          <CertificateModal
            certificate={selectedCertCourse.cert}
            onClose={() => setSelectedCertCourse(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}