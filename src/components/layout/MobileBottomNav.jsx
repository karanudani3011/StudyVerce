import React from 'react';
import { LayoutDashboard, Newspaper, Bot, Compass, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav = () => {
  const { activeTab, setActiveTab } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'feed', label: 'Feed', icon: Newspaper },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, special: true },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const isAppPage = !['landing', 'login', 'signup', 'forgot-password', 'otp', 'reset-password'].includes(activeTab);

  if (!isAppPage) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.special) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center -mt-6 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#4F7DF6] flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                <Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-[10px] font-bold text-[#4F7DF6] mt-1">AI Tutor</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-[10px] transition-all cursor-pointer ${
              isActive
                ? 'text-[#4F7DF6] font-bold'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
