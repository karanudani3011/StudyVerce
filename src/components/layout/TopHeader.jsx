import React, { useState } from 'react';
import { Search, Bell, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export const TopHeader = () => {
  const { user, searchQuery, setSearchQuery, setActiveTab, notificationsCount, setNotificationsCount } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-[20px] border-b border-[#E2E8F0] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" strokeWidth={2} />
        <input
          type="text"
          placeholder="Search subjects, courses, teachers, notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white pl-11 pr-10 py-2.5 rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all"
        />
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B]"
        >
          <Filter className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Circular Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setNotificationsCount(0);
            }}
            className="relative p-2.5 rounded-full bg-[#F5F7FB] hover:bg-[#EEF4FF] text-[#64748B] hover:text-[#4F7DF6] border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" strokeWidth={2} />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#E2E8F0] z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EDF2F7]">
                <h4 className="text-sm font-bold text-[#1E293B]">Notifications</h4>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="text-xs font-semibold text-[#4F7DF6] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('notifications');
                    }}
                    className="flex gap-3 p-2.5 rounded-[12px] hover:bg-[#F5F7FB] cursor-pointer transition-colors"
                  >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">
                        {item.desc}
                      </p>
                      <span className="text-[10px] text-[#94A3B8] mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Tutor Quick Shortcut */}
        <button
          onClick={() => setActiveTab('ai-tutor')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-[14px] bg-purple-50 text-[#8B5CF6] border border-purple-200/60 text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Ask AI</span>
        </button>

        {/* Profile Avatar */}
        <div
          onClick={() => setActiveTab('profile')}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Avatar src={user.avatar} alt={user.name} size="sm" verified />
        </div>
      </div>
    </header>
  );
};
