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
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#4F7DF6] selection:text-white">
      {renderView()}
      <MobileBottomNav />
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
