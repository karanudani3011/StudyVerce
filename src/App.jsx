import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { FeedPage } from './pages/FeedPage';
import { UploadPage } from './pages/UploadPage';
import { ExplorePage } from './pages/ExplorePage';
import { AITutorPage } from './pages/AITutorPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationPage } from './pages/NotificationPage';
import { SearchPage } from './pages/SearchPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';

// Tutor, Admin, and Tutor Application Pages
import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorAnalytics from './pages/tutor/TutorAnalytics';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminFacultyPage from './pages/admin/AdminFacultyPage';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminReports from './pages/admin/AdminReports';
import ApplyTutorPage from './pages/apply-tutor/ApplyTutorPage';

const MainAppRouter = () => {
  const { activeTab } = useAuth();

  const renderView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'login':
      case 'signup':
      case 'forgot-password':
      case 'otp':
      case 'reset-password':
        return <AuthPages />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'feed':
        return <FeedPage />;
      case 'upload':
        return <UploadPage />;
      case 'explore':
        return <ExplorePage />;
      case 'ai-tutor':
        return <AITutorPage />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return <NotificationPage />;
      case 'search':
        return <SearchPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'settings':
        return <SettingsPage />;

      // Tutor Protected Routes
      case 'tutor-dashboard':
        return (
          <RoleProtectedRoute allowedRoles={['tutor', 'faculty', 'admin']} fallback={<DashboardPage />}>
            <TutorDashboard />
          </RoleProtectedRoute>
        );
      case 'tutor-analytics':
        return (
          <RoleProtectedRoute allowedRoles={['tutor', 'faculty', 'admin']} fallback={<DashboardPage />}>
            <TutorAnalytics />
          </RoleProtectedRoute>
        );

      // Admin Protected Routes
      case 'admin-dashboard':
        return (
          <RoleProtectedRoute allowedRoles={['admin']} fallback={<AdminLoginPage />}>
            <AdminDashboard />
          </RoleProtectedRoute>
        );
      case 'admin-users':
        return (
          <RoleProtectedRoute allowedRoles={['admin']} fallback={<AdminLoginPage />}>
            <AdminUsersPage />
          </RoleProtectedRoute>
        );
      case 'admin-faculty':
        return (
          <RoleProtectedRoute allowedRoles={['admin']} fallback={<AdminLoginPage />}>
            <AdminFacultyPage />
          </RoleProtectedRoute>
        );
      case 'admin-verifications':
        return (
          <RoleProtectedRoute allowedRoles={['admin']} fallback={<AdminLoginPage />}>
            <AdminVerifications />
          </RoleProtectedRoute>
        );
      case 'admin-reports':
        return (
          <RoleProtectedRoute allowedRoles={['admin']} fallback={<AdminLoginPage />}>
            <AdminReports />
          </RoleProtectedRoute>
        );

      // Tutor Application Form for Students
      case 'apply-tutor':
        return <ApplyTutorPage />;

      default:
        return <LandingPage />;
    }
  };

  const isAdminTab = activeTab.startsWith('admin-');

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#4F7DF6] selection:text-white">
      {renderView()}
      {!isAdminTab && <MobileBottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
