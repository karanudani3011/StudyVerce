import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, Clock, BookOpen, Star, ArrowLeft, Heart, RotateCcw, AlertCircle } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar, Progress, Button } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet, apiPost } from '../../config/api';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleCourseWishlist } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const syllabus = [
    { title: 'Module 1: Foundations & Prerequisites', duration: '2 hrs', completed: true },
    { title: 'Module 2: Core Algorithmic Mechanics', duration: '4 hrs', completed: true },
    { title: 'Module 3: Advanced Applications & Projects', duration: '6 hrs', completed: false },
  ];

  const fetchCourse = useCallback(async () => {
    try {
      const res = await apiGet(`/courses/${id}`);
      if (res.success && res.data) {
        setCourse(res.data);
        setProgress(res.data.progress || 0);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
      addToast('Failed to load course details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  const checkEnrollmentStatus = useCallback(async () => {
    try {
      const res = await apiGet(`/courses/${id}/enrollment-status`);
      if (res.success) {
        setEnrolled(res.enrolled);
      }
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    }
  }, [id]);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await apiGet(`/courses/${id}/progress`);
      if (res.success) {
        setProgress(res.progress);
        setEnrolled(res.enrolled);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkEnrollmentStatus();
      fetchProgress();
    }
  }, [id, user, fetchCourse, checkEnrollmentStatus, fetchProgress]);

  const isWishlisted = (courseId) => {
    return user?.wishlistedCourses?.includes(courseId);
  };

  const handleWishlistToggle = async (courseId) => {
    try {
      const updatedWishlist = await toggleCourseWishlist(courseId);
      const isNowWishlisted = updatedWishlist.includes(courseId);
      addToast(
        isNowWishlisted ? 'Added to wishlist! ❤️' : 'Removed from wishlist!',
        'success'
      );
    } catch (err) {
      addToast('Failed to update wishlist', 'error');
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      addToast('Please log in to enroll', 'error');
      navigate('/login');
      return;
    }

    if (enrolled) {
      navigate(`/courses/${id}/learn`);
      return;
    }

    setEnrolling(true);
    try {
      const res = await apiPost(`/courses/${id}/enroll`);
      if (res.success) {
        setEnrolled(true);
        addToast('Successfully enrolled! 🎉', 'success');
        // Refresh progress after enrollment
        fetchProgress();
      } else if (res.alreadyEnrolled) {
        setEnrolled(true);
        addToast('You are already enrolled in this course', 'info');
        fetchProgress();
      } else {
        addToast(res.message || 'Enrollment failed', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Failed to enroll', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinueLearning = () => {
    navigate(`/courses/${id}/learn`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
          <div className="min-h-[400px] flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#4F7DF6] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#64748B] font-medium">Loading course details...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!course) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-xl font-bold text-[#1E293B]">Course Not Found</h2>
            <p className="text-sm text-[#64748B] mt-2">The course you're looking for doesn't exist or has been removed.</p>
            <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/courses')} className="mt-4">
              Back to Courses
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

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
              <div className="flex items-center gap-4 text-xs text-[#64748B] flex-wrap">
                <span className="flex items-center gap-1 font-bold text-[#F59E0B]"><Star className="w-4 h-4 fill-current" /> {course.rating}</span>
                <span>{course.students} Students</span>
                <span>{course.duration} Total Duration</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} Lessons</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.level}</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#EDF2F7]">
                <Avatar src={course.instructorAvatar} alt={course.instructor} size="md" verified />
                <div>
                  <p className="text-xs font-bold text-[#1E293B]">{course.instructor}</p>
                  <p className="text-[10px] text-[#94A3B8]">Course Creator & Verified Professor</p>
                </div>
              </div>
              {course.description && (
                <div className="pt-4 border-t border-[#EDF2F7]">
                  <h3 className="text-sm font-bold text-[#1E293B] mb-2">About This Course</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{course.description}</p>
                </div>
              )}
            </Card>

            {/* Curriculum */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-[#1E293B]">Course Syllabus</h3>
              <div className="space-y-3">
                {course.lectures && course.lectures.length > 0 ? (
                  course.lectures.map((lecture, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                      <div className="flex items-center gap-3">
                        <Play className="w-4 h-4 text-[#4F7DF6]" />
                        <span className="text-sm font-semibold text-[#1E293B]">{lecture.title}</span>
                      </div>
                      <span className="text-xs text-[#94A3B8]">{lecture.duration || '15 mins'}</span>
                    </div>
                  ))
                ) : (
                  syllabus.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                      <div className="flex items-center gap-3">
                        <Play className="w-4 h-4 text-[#4F7DF6]" />
                        <span className="text-sm font-semibold text-[#1E293B]">{m.title}</span>
                      </div>
                      <span className="text-xs text-[#94A3B8]">{m.duration}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4 text-center">
              <img src={course.image} alt="" className="w-full h-40 object-cover rounded-[14px] border border-[#E2E8F0]" />
              <div className="text-left space-y-2">
                <p className="text-xs font-bold text-[#64748B]">Your Course Progress</p>
                <Progress value={progress} showLabel size="md" />
              </div>
              <div className="flex gap-2.5">
                <Button
                  variant={enrolled ? "primary" : "primary"}
                  size="lg"
                  className="flex-1"
                  icon={enrolled ? Play : CheckCircle2}
                  onClick={enrolled ? handleContinueLearning : handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : enrolled ? 'Continue Learning' : 'Enroll for Free'}
                </Button>
                <button
                  onClick={() => handleWishlistToggle(course._id || course.id)}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isWishlisted(course._id || course.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100/70'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:bg-[#F5F7FB]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted(course._id || course.id) ? 'fill-rose-500 text-rose-500' : ''}`} strokeWidth={2} />
                </button>
              </div>
              {enrolled && (
                <div className="pt-2 border-t border-[#EDF2F7]">
                  <Button variant="outline" size="sm" fullWidth icon={RotateCcw} onClick={fetchProgress}>
                    Refresh Progress
                  </Button>
                </div>
              )}
            </Card>

            {/* Course Meta Info */}
            <Card className="p-6 space-y-3 border border-[#E2E8F0]">
              <h4 className="text-sm font-bold text-[#1E293B]">Course Details</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Subject</span>
                  <span className="font-semibold text-[#1E293B]">{course.subject}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Category</span>
                  <span className="font-semibold text-[#1E293B]">{course.category}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Subcategory</span>
                  <span className="font-semibold text-[#1E293B]">{course.subcategory}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Level</span>
                  <span className="font-semibold text-[#1E293B]">{course.level}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Price</span>
                  <span className="font-bold text-[#22C55E]">{course.price}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Total Lessons</span>
                  <span className="font-semibold text-[#1E293B]">{course.lectures?.length || course.lessons}</span>
                </div>
              </div>
            </Card>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <Card className="p-4 space-y-3 border border-[#E2E8F0]">
                <h4 className="text-sm font-bold text-[#1E293B]">Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" size="sm">{tag}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}