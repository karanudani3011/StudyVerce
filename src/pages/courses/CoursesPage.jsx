import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Clock, Users, Heart } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { MOCK_COURSES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CoursesPage() {
  const navigate = useNavigate();
  const { user, toggleCourseWishlist } = useAuth();
  const { addToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('all');

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

  const filteredCourses = activeSubTab === 'all' 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(c => isWishlisted(c.id));

  const wishlistCount = user?.wishlistedCourses?.length || 0;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">All Courses</h1>
            <p className="text-sm text-[#64748B]">Structured learning paths curated by top professors.</p>
          </div>

          {/* Sub Tabs */}
          <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-xl self-start sm:self-auto border border-[#E2E8F0]">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'all'
                  ? 'bg-white text-[#4F7DF6] shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveSubTab('wishlist')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'wishlist'
                  ? 'bg-white text-rose-500 shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              My Wishlist
              {wishlistCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeSubTab === 'wishlist' ? 'bg-rose-500 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                }`}>
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <Heart className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E293B]">Your wishlist is empty</h3>
              <p className="text-xs text-[#64748B] mt-1">Explore our courses and tap the heart icon on any course to save it for later.</p>
            </div>
            <button
              onClick={() => setActiveSubTab('all')}
              className="px-4 py-2 bg-[#EEF4FF] hover:bg-[#E0EBFF] text-[#4F7DF6] text-xs font-bold rounded-xl border border-[#EEF4FF] hover:border-[#4F7DF6]/20 transition-all cursor-pointer"
            >
              Browse All Courses
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id} hover onClick={() => navigate(`/courses/${course.id}`)} className="space-y-4 relative group cursor-pointer">
                <div className="relative overflow-hidden rounded-[14px]">
                  <img src={course.image} alt="" className="w-full h-44 object-cover border border-[#E2E8F0] transition-transform duration-300 group-hover:scale-105" />
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
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" size="sm">{course.subject}</Badge>
                    <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" /> {course.rating}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1E293B]">{course.title}</h3>
                  <p className="text-xs text-[#94A3B8]">{course.instructor}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#EDF2F7]">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                  <span className="font-bold text-[#22C55E]">{course.price}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
