import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { CommunityProvider } from '../context/CommunityContext';
import { Spinner } from '../components/ui/index.jsx';
import { MobileBottomNav } from '../components/layout/AppLayout.jsx';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LandingPage       = lazy(() => import('../pages/landing/LandingPage'));
const LoginPage         = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPassword    = lazy(() => import('../pages/auth/ForgotPassword'));
const OTPVerify         = lazy(() => import('../pages/auth/OTPVerify'));
const ResetPassword     = lazy(() => import('../pages/auth/ResetPassword'));
const DashboardPage     = lazy(() => import('../pages/dashboard/DashboardPage'));
const FeedPage          = lazy(() => import('../pages/feed/FeedPage'));
const PostDetails       = lazy(() => import('../pages/feed/PostDetails'));
const ReelsPage         = lazy(() => import('../pages/feed/ReelsPage'));
const ExplorePage       = lazy(() => import('../pages/explore/ExplorePage'));
const SearchPage        = lazy(() => import('../pages/explore/SearchPage'));
const CategoriesPage    = lazy(() => import('../pages/explore/CategoriesPage'));
const SubjectsPage      = lazy(() => import('../pages/explore/SubjectsPage'));
const CommunitiesPage   = lazy(() => import('../pages/communities/CommunitiesPage'));
const CommunityDetails  = lazy(() => import('../pages/communities/CommunityDetails'));
const AITutorPage       = lazy(() => import('../pages/ai-tutor/AITutorPage'));
const CoursesPage       = lazy(() => import('../pages/courses/CoursesPage'));
const CourseDetails     = lazy(() => import('../pages/courses/CourseDetails'));
const MyLearningPage    = lazy(() => import('../pages/courses/MyLearningPage'));
const UploadImage       = lazy(() => import('../pages/upload/UploadImage'));
const UploadReel        = lazy(() => import('../pages/upload/UploadReel'));
const UploadPDF         = lazy(() => import('../pages/upload/UploadPDF'));
const UploadNotes       = lazy(() => import('../pages/upload/UploadNotes'));
const AIValidation      = lazy(() => import('../pages/upload/AIValidation'));
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage'));
const MessagesPage      = lazy(() => import('../pages/messages/MessagesPage'));
const ChatPage          = lazy(() => import('../pages/messages/ChatPage'));
const ProfilePage       = lazy(() => import('../pages/profile/ProfilePage'));
const EditProfile       = lazy(() => import('../pages/profile/EditProfile'));
const SavedPage         = lazy(() => import('../pages/profile/SavedPage'));
const BookmarksPage     = lazy(() => import('../pages/profile/BookmarksPage'));
const CertificatesPage  = lazy(() => import('../pages/profile/CertificatesPage'));
const LeaderboardPage   = lazy(() => import('../pages/leaderboard/LeaderboardPage'));
const AchievementsPage  = lazy(() => import('../pages/leaderboard/AchievementsPage'));
const SettingsPage      = lazy(() => import('../pages/settings/SettingsPage'));
const ContactPage       = lazy(() => import('../pages/misc/ContactPage'));
const FeedbackPage      = lazy(() => import('../pages/misc/FeedbackPage'));
const AboutPage         = lazy(() => import('../pages/misc/AboutPage'));
const BlogPage          = lazy(() => import('../pages/misc/BlogPage'));
// const CareersPage       = lazy(() => import('../pages/misc/CareersPage'));
// const PressPage         = lazy(() => import('../pages/misc/PressPage'));
const HelpPage          = lazy(() => import('../pages/misc/HelpPage'));
const FAQPage           = lazy(() => import('../pages/misc/FAQPage'));
const PrivacyPage       = lazy(() => import('../pages/misc/PrivacyPage'));
const TermsPage         = lazy(() => import('../pages/misc/TermsPage'));
const SecurityPage      = lazy(() => import('../pages/misc/SecurityPage'));
const CookiesPage       = lazy(() => import('../pages/misc/CookiesPage'));
const PremiumPage       = lazy(() => import('../pages/premium/PremiumPage'));
const SubscriptionPage  = lazy(() => import('../pages/premium/SubscriptionPage'));
const PaymentPage       = lazy(() => import('../pages/premium/PaymentPage'));
const PaymentSuccess    = lazy(() => import('../pages/premium/PaymentSuccess'));
const NotFound          = lazy(() => import('../pages/misc/NotFound'));
const Maintenance       = lazy(() => import('../pages/misc/Maintenance'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-[#64748B] font-medium">Loading...</p>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-[#64748B] font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <CommunityProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/"                  element={<LandingPage />} />
              <Route path="/login"             element={<LoginPage />} />
              <Route path="/register"          element={<RegisterPage />} />
              <Route path="/forgot-password"   element={<ForgotPassword />} />
              <Route path="/otp"               element={<OTPVerify />} />
              <Route path="/reset-password"    element={<ResetPassword />} />
              <Route path="/about"             element={<AboutPage />} />
              <Route path="/blog"              element={<BlogPage />} />
              {/* <Route path="/careers"           element={<CareersPage />} /> */}
              {/* <Route path="/press"             element={<PressPage />} /> */}
              <Route path="/contact"           element={<ContactPage />} />
              <Route path="/feedback"          element={<FeedbackPage />} />
              <Route path="/help"              element={<HelpPage />} />
              <Route path="/faq"               element={<FAQPage />} />
              <Route path="/privacy"           element={<PrivacyPage />} />
              <Route path="/terms"             element={<TermsPage />} />
              <Route path="/security"          element={<SecurityPage />} />
              <Route path="/cookies"           element={<CookiesPage />} />
              <Route path="/premium"           element={<PremiumPage />} />
              <Route path="/maintenance"       element={<Maintenance />} />

              {/* Protected Application Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard"         element={<DashboardPage />} />
                <Route path="/feed"              element={<FeedPage />} />
                <Route path="/feed/:postId"      element={<PostDetails />} />
                <Route path="/reels"             element={<ReelsPage />} />
                <Route path="/explore"           element={<ExplorePage />} />
                <Route path="/search"            element={<SearchPage />} />
                <Route path="/categories"        element={<CategoriesPage />} />
                <Route path="/subjects"          element={<SubjectsPage />} />
                <Route path="/communities"       element={<CommunitiesPage />} />
                <Route path="/communities/:id"   element={<CommunityDetails />} />
                <Route path="/ai-tutor"          element={<AITutorPage />} />
                <Route path="/courses"           element={<CoursesPage />} />
                <Route path="/courses/:id"       element={<CourseDetails />} />
                <Route path="/my-learning"       element={<MyLearningPage />} />
                <Route path="/upload/image"      element={<UploadImage />} />
                <Route path="/upload/reel"       element={<UploadReel />} />
                <Route path="/upload/pdf"        element={<UploadPDF />} />
                <Route path="/upload/notes"      element={<UploadNotes />} />
                <Route path="/upload/validate"   element={<AIValidation />} />
                <Route path="/notifications"     element={<NotificationsPage />} />
                <Route path="/messages"          element={<MessagesPage />} />
                <Route path="/messages/:id"      element={<ChatPage />} />
                <Route path="/profile"           element={<ProfilePage />} />
                <Route path="/profile/edit"      element={<EditProfile />} />
                <Route path="/saved"             element={<SavedPage />} />
                <Route path="/bookmarks"         element={<BookmarksPage />} />
                <Route path="/certificates"      element={<CertificatesPage />} />
                <Route path="/leaderboard"       element={<LeaderboardPage />} />
                <Route path="/achievements"      element={<AchievementsPage />} />
                <Route path="/settings"          element={<SettingsPage />} />
                <Route path="/subscription"      element={<SubscriptionPage />} />
                <Route path="/payment"           element={<PaymentPage />} />
                <Route path="/payment/success"   element={<PaymentSuccess />} />
              </Route>

              <Route path="*"                  element={<NotFound />} />
            </Routes>
            <MobileBottomNav />
          </Suspense>
        </CommunityProvider>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);
