import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Star, Clock, Users, Heart, Search,
  ChevronDown, Check, SlidersHorizontal, X, RotateCcw, Award, Trash2,
  CheckCircle2, Play, BookCheck
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge } from '../../components/ui/index.jsx';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CourseUploadModal } from '../../components/courses/CourseUploadModal';
import { apiGet, apiPost, apiDelete } from '../../config/api';

// Custom Dropdown select component
function CustomDropdown({ label, options, selectedValue, onChange, disabled, icon: Icon, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayLabel = () => {
    if (selectedValue === 'All') {
      if (label === 'Category') return 'All Categories';
      if (label === 'Subcategory') return 'All Subcategories';
      return `All ${label}s`;
    }
    const option = options.find(opt => (typeof opt === 'string' ? opt === selectedValue : opt.id === selectedValue));
    if (!option) return placeholder || `Select ${label}`;
    return typeof option === 'string' ? option : option.title || option.name;
  };

  return (
    <div className="relative flex-1 min-w-[200px]" ref={dropdownRef}>
      <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white/80 backdrop-blur-xs border rounded-xl px-4 py-2.5 text-xs font-bold transition-all select-none text-left cursor-pointer ${
          disabled
            ? 'opacity-40 cursor-not-allowed border-[#E2E8F0] bg-[#F1F5F9]'
            : isOpen
            ? 'border-[#4F7DF6] ring-2 ring-[#4F7DF6]/15 shadow-xs text-[#1E293B]'
            : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B]'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className={`w-3.5 h-3.5 ${disabled ? 'text-[#94A3B8]' : 'text-[#4F7DF6]'}`} />}
          <span className="truncate">{getDisplayLabel()}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 ml-2 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#4F7DF6]' : 'text-[#94A3B8]'}`} />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-40 bg-white/95 backdrop-blur-md rounded-xl border border-[#E2E8F0] shadow-lg max-h-60 overflow-y-auto overflow-x-hidden p-1.5 divide-y divide-[#F1F5F9] no-scrollbar scrollbar-thin"
          >
            {options.map((opt, i) => {
              const val = typeof opt === 'string' ? opt : opt.id;
              const display = typeof opt === 'string' ? opt : opt.title || opt.name;
              const isSelected = selectedValue === val;
              const displayLabel = display === 'All'
                ? (label === 'Category' ? 'All Categories' : label === 'Subcategory' ? 'All Subcategories' : `All ${label}s`)
                : display;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EEF4FF] text-[#4F7DF6]'
                      : 'hover:bg-[#F5F7FB] text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <span className="truncate">{displayLabel}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#4F7DF6] shrink-0" strokeWidth={2.5} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { user, toggleCourseWishlist } = useAuth();
  const { addToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [coursesList, setCoursesList] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [checkingEnrollment, setCheckingEnrollment] = useState({});

  // Search & Filter State
  const [searchVal, setSearchVal] = useState('');
  const [categoryVal, setCategoryVal] = useState('All');
  const [subcategoryVal, setSubcategoryVal] = useState('All');
  const [courseVal, setCourseVal] = useState('All');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isAnimatedOpen, setIsAnimatedOpen] = useState(false);

  // Fetch persisted courses from MongoDB backend
  useEffect(() => {
    const fetchBackendCourses = async () => {
      try {
        const res = await apiGet('/courses');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map(c => ({
            id: c._id || c.id,
            title: c.title,
            instructor: c.instructor,
            instructorAvatar: c.instructorAvatar,
            image: c.image,
            tags: c.tags || [],
            duration: c.duration,
            lessons: c.lessons,
            students: c.students || '1',
            rating: c.rating || 4.9,
            progress: c.progress || 0,
            level: c.level,
            price: c.price,
            subject: c.subject,
            category: c.category,
            subcategory: c.subcategory,
            description: c.description,
            lectures: c.lectures,
            tutorId: c.tutorId || c.instructorId,
          }));
          setCoursesList(formatted);
        }
      } catch (err) {
        console.warn('Backend courses fetch skipped/offline:', err.message);
      }
    };
    fetchBackendCourses();
  }, []);

  // Check enrollment status for all courses when user is logged in
  useEffect(() => {
    if (!user) return;
    
    const checkAllEnrollments = async () => {
      try {
        const res = await apiGet('/courses/enrolled/my');
        if (res.success && res.data) {
          const ids = new Set(res.data.map(c => c.id || c._id));
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        console.warn('Enrollment check skipped:', err.message);
      }
    };
    checkAllEnrollments();
  }, [user]);

  const isEnrolled = useCallback((courseId) => {
    return enrolledCourseIds.has(courseId);
  }, [enrolledCourseIds]);

  const checkEnrollmentStatus = useCallback(async (courseId) => {
    if (!user) return false;
    setCheckingEnrollment(prev => ({ ...prev, [courseId]: true }));
    try {
      const res = await apiGet(`/courses/${courseId}/enrollment-status`);
      if (res.success) {
        setEnrolledCourseIds(prev => {
          const next = new Set(prev);
          if (res.enrolled) next.add(courseId);
          else next.delete(courseId);
          return next;
        });
        return res.enrolled;
      }
    } catch (err) {
      console.warn('Enrollment check failed:', err.message);
    } finally {
      setCheckingEnrollment(prev => ({ ...prev, [courseId]: false }));
    }
    return false;
  }, [user]);

  const handleEnroll = useCallback(async (courseId, e) => {
    if (e) e.stopPropagation();
    if (!user) {
      addToast('Please log in to enroll', 'error');
      navigate('/login');
      return;
    }
    
    if (isEnrolled(courseId)) {
      navigate(`/courses/${courseId}/learn`);
      return;
    }

    try {
      const res = await apiPost(`/courses/${courseId}/enroll`);
      if (res.success) {
        setEnrolledCourseIds(prev => new Set([...prev, courseId]));
        addToast('Successfully enrolled! 🎉', 'success');
      } else if (res.alreadyEnrolled) {
        setEnrolledCourseIds(prev => new Set([...prev, courseId]));
        addToast('Already enrolled in this course', 'info');
      } else {
        addToast(res.message || 'Enrollment failed', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Failed to enroll', 'error');
    }
  }, [user, addToast, navigate, isEnrolled]);

  const handleCourseCreated = (newCourse) => {
    const formattedNewCourse = {
      id: newCourse._id || `c_new_${Date.now()}`,
      title: newCourse.title,
      instructor: newCourse.instructor,
      instructorAvatar: newCourse.instructorAvatar,
      image: newCourse.image,
      tags: newCourse.tags || [],
      duration: newCourse.duration,
      lessons: newCourse.lessons,
      students: newCourse.students || '1',
      rating: newCourse.rating || 4.9,
      progress: 0,
      level: newCourse.level,
      price: newCourse.price,
      subject: newCourse.subject,
      category: newCourse.category,
      subcategory: newCourse.subcategory,
      description: newCourse.description,
      lectures: newCourse.lectures || [],
      tutorId: user?._id || user?.id,
    };

    setCoursesList(prev => [formattedNewCourse, ...prev]);
    addToast('Course uploaded & published to course catalog! 🎉', 'success');
  };

  const handleDeleteCourse = async (courseId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this course permanently?')) return;
    try {
      await apiDelete(`/courses/${courseId}`);
    } catch (err) {
      console.warn('API delete course warning:', err.message);
    }
    setCoursesList(prev => prev.filter(c => c.id !== courseId));
    addToast('Course deleted 🗑️', 'success');
  };

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

  // Handle clearing all filters
  const handleClearAll = () => {
    setSearchVal('');
    setCategoryVal('All');
    setSubcategoryVal('All');
    setCourseVal('All');
  };

  // Extract Dropdown Options
  const categoryOptions = ['All', 'Science', 'Technology & CS'];

  const subcategoryOptions = categoryVal === 'All'
    ? []
    : ['All', ...new Set(coursesList.filter(c => c.category === categoryVal).map(c => c.subcategory).filter(Boolean))];

  const courseOptions = subcategoryVal === 'All' || categoryVal === 'All'
    ? []
    : ['All', ...coursesList.filter(c => c.category === categoryVal && c.subcategory === subcategoryVal)];

  const enrolledCount = enrolledCourseIds.size;

  // Apply filters
  let filteredCourses = activeSubTab === 'all'
    ? coursesList
    : activeSubTab === 'wishlist'
    ? coursesList.filter(c => isWishlisted(c.id))
    : coursesList.filter(c => isEnrolled(c.id));

  // 1. Search Query filter
  if (searchVal.trim() !== '') {
    const query = searchVal.toLowerCase();
    filteredCourses = filteredCourses.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query) ||
      c.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (c.subject && c.subject.toLowerCase().includes(query))
    );
  }

  // 2. Category filter
  if (categoryVal !== 'All') {
    filteredCourses = filteredCourses.filter(c => c.category === categoryVal);
  }

  // 3. Subcategory filter
  if (subcategoryVal !== 'All') {
    filteredCourses = filteredCourses.filter(c => c.subcategory === subcategoryVal);
  }

  // 4. Specific Course filter
  if (courseVal !== 'All') {
    filteredCourses = filteredCourses.filter(c => c.id === courseVal);
  }

  const wishlistCount = user?.wishlistedCourses?.length || 0;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">All Courses</h1>
            <p className="text-sm text-[#64748B]">Structured learning paths curated by top professors and verified faculty.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Upload Course Button for Tutor / Faculty or any User */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white hover:from-slate-800 hover:to-slate-900 text-xs font-bold transition-all shadow-md shadow-slate-950/20 flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Upload Course 🎓
            </button>

            {/* Sub Tabs */}
            <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-xl self-start sm:self-auto border border-[#E2E8F0]">
              <button
                onClick={() => setActiveSubTab('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'all'
                    ? 'bg-white text-[#4F7DF6] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                All Courses ({coursesList.length})
              </button>
              <button
                onClick={() => setActiveSubTab('wishlist')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'wishlist'
                    ? 'bg-white text-rose-500 shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                My Wishlist
                {wishlistCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    activeSubTab === 'wishlist' ? 'bg-rose-50 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                  }`}>
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSubTab('enrolled')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'enrolled'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                My Courses
                {enrolledCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    activeSubTab === 'enrolled' ? 'bg-emerald-50 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                  }`}>
                    {enrolledCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Component */}
        <CourseUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onCourseCreated={handleCourseCreated}
          currentUser={user}
        />

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search courses, instructors, tags..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-xs border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white pl-10 pr-10 py-2.5 rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/15 transition-all shadow-xs"
              />
              {searchVal && (
                <button
                  onClick={() => setSearchVal('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#1E293B] rounded-full hover:bg-[#F5F7FB] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (isFilterPanelOpen) {
                  setIsAnimatedOpen(false);
                }
                setIsFilterPanelOpen(!isFilterPanelOpen);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none ${
                isFilterPanelOpen || categoryVal !== 'All' || subcategoryVal !== 'All' || courseVal !== 'All'
                  ? 'bg-[#EEF4FF] border-[#4F7DF6]/30 text-[#4F7DF6]'
                  : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:border-[#CBD5E1]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(categoryVal !== 'All' || subcategoryVal !== 'All' || courseVal !== 'All') && (
                <span className="w-2 h-2 rounded-full bg-[#4F7DF6]" />
              )}
            </button>
          </div>

          {/* Collapsible Dropdown Filter Panel */}
          <AnimatePresence>
            {isFilterPanelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                onAnimationComplete={() => {
                  if (isFilterPanelOpen) {
                    setIsAnimatedOpen(true);
                  }
                }}
                className={isAnimatedOpen ? "overflow-visible" : "overflow-hidden"}
              >
                <div className="bg-[#F8FAFC]/50 border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 mt-1 items-end">
                  <CustomDropdown
                    label="Category"
                    options={categoryOptions}
                    selectedValue={categoryVal}
                    onChange={(val) => {
                      setCategoryVal(val);
                      setSubcategoryVal('All');
                      setCourseVal('All');
                    }}
                    icon={BookOpen}
                  />

                  <CustomDropdown
                    label="Subcategory"
                    options={subcategoryOptions}
                    selectedValue={subcategoryVal}
                    onChange={(val) => {
                      setSubcategoryVal(val);
                      setCourseVal('All');
                    }}
                    disabled={categoryVal === 'All'}
                    icon={SlidersHorizontal}
                  />

                  <CustomDropdown
                    label="Course"
                    options={courseOptions}
                    selectedValue={courseVal}
                    onChange={setCourseVal}
                    disabled={subcategoryVal === 'All' || categoryVal === 'All'}
                    icon={Award}
                  />

                  {(categoryVal !== 'All' || subcategoryVal !== 'All' || courseVal !== 'All' || searchVal !== '') && (
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer shrink-0 border border-transparent hover:border-rose-100 flex items-center justify-center gap-1.5 h-[38px] mb-[1px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Badges */}
          {(categoryVal !== 'All' || subcategoryVal !== 'All' || courseVal !== 'All' || searchVal !== '') && (
            <div className="flex flex-wrap gap-2 items-center pt-2">
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Active Filters:</span>
              {searchVal !== '' && (
                <span className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#4F7DF6] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#EEF4FF]">
                  Search: "{searchVal}"
                  <button onClick={() => setSearchVal('')} className="p-0.5 hover:bg-[#4F7DF6]/10 rounded-full transition-colors cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryVal !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#4F7DF6] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#EEF4FF]">
                  Category: {categoryVal}
                  <button onClick={() => {
                    setCategoryVal('All');
                    setSubcategoryVal('All');
                    setCourseVal('All');
                  }} className="p-0.5 hover:bg-[#4F7DF6]/10 rounded-full transition-colors cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {subcategoryVal !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#4F7DF6] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#EEF4FF]">
                  Subcategory: {subcategoryVal}
                  <button onClick={() => {
                    setSubcategoryVal('All');
                    setCourseVal('All');
                  }} className="p-0.5 hover:bg-[#4F7DF6]/10 rounded-full transition-colors cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {courseVal !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#4F7DF6] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#EEF4FF] max-w-[250px]">
                  <span className="truncate">Course: {coursesList.find(c => c.id === courseVal)?.title}</span>
                  <button onClick={() => setCourseVal('All')} className="p-0.5 hover:bg-[#4F7DF6]/10 rounded-full transition-colors cursor-pointer shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#64748B] hover:text-rose-500 transition-colors cursor-pointer underline decoration-dotted"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <Heart className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E293B]">No courses found</h3>
              <p className="text-xs text-[#64748B] mt-1">Try adjusting your filters or search terms to find what you are looking for.</p>
            </div>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-[#EEF4FF] hover:bg-[#E0EBFF] text-[#4F7DF6] text-xs font-bold rounded-xl border border-[#EEF4FF] hover:border-[#4F7DF6]/20 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{filteredCourses.map(course => {
                const isAdmin = user?.role === 'admin';
                const isFaculty = user?.role === 'faculty' || user?.role === 'tutor';
                const isOwnCourse = isFaculty && (
                  (course.tutorId && (course.tutorId === user?._id || course.tutorId === user?.id)) ||
                  (course.instructor && user?.name && course.instructor.toLowerCase().includes(user.name.toLowerCase()))
                );
                const canDeleteCourse = isAdmin || isOwnCourse;
                const courseEnrolled = isEnrolled(course.id);
                const enrollmentChecking = checkingEnrollment[course.id];

                return (
                <Card key={course.id} hover onClick={() => navigate(`/courses/${course.id}`)} className="space-y-4 relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-[14px]">
                    <img src={course.image} alt="" className="w-full h-44 object-cover border border-[#E2E8F0] transition-transform duration-300 group-hover:scale-105" />
                    
                    {/* Delete Button for Admin (All courses) & Faculty (Own courses only) */}
                    {canDeleteCourse && (
                      <button
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                        className="absolute top-3 left-3 p-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer flex items-center justify-center"
                        title={isAdmin ? "Admin Delete Course" : "Delete Your Uploaded Course"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Enrollment Status Badge */}
                    {courseEnrolled && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <BookCheck className="w-3 h-3" /> Enrolled
                        </span>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(course.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-[0_4px_12px_rgba(15,23,42,0.15)] border border-[#E2E8F0]/50 hover:bg-white active:scale-95 transition-all z-10 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted(course.id)
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-[#64748B] hover:text-rose-500'
                        }`}
                        strokeWidth={2.5}
                      />
                    </button>

                    {/* Quick Enroll Button on Card */}
                    {user && !courseEnrolled && !canDeleteCourse && (
                      <button
                        onClick={(e) => handleEnroll(course.id, e)}
                        className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-[#4F7DF6] text-white text-xs font-bold rounded-xl shadow-lg hover:bg-[#3B82F6] active:scale-95 transition-all z-10 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enroll Free
                      </button>
                    )}

                    {courseEnrolled && !canDeleteCourse && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}/learn`);
                        }}
                        className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all z-10 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Continue Learning
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" size="sm">{course.subject}</Badge>
                      <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" /> {course.rating}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#1E293B] line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-[#94A3B8]">{course.instructor}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#EDF2F7]">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                    <span className="font-bold text-[#22C55E]">{course.price}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
