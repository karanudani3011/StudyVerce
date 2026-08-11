import React, { useState } from 'react';
import { Star, Sparkles, CheckCircle2, User, Lock, Bell, Moon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (setUser) setUser(prev => ({ ...prev, name, bio }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const settingsNav = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'security', label: 'Password & Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'pro', label: 'StudyVerse Pro', icon: Star },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Account Settings</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">Manage your personal info, security, and subscription preferences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Nav */}
            <div className="space-y-1 md:col-span-1">
              {settingsNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-semibold cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#EEF4FF] text-[#4F7DF6]'
                        : 'text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#1E293B]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F7DF6]' : 'text-[#94A3B8]'}`} strokeWidth={2} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Content */}
            <div className="md:col-span-3 space-y-6">
              {activeTab === 'profile' && (
                <Card className="space-y-5">
                  <h3 className="text-base font-bold text-[#1E293B]">Personal Information</h3>
                  <form onSubmit={handleSave} className="space-y-4">
                    <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">Academic Bio</label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white p-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#EDF2F7]">
                      {saved && (
                        <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" strokeWidth={2} /> Saved
                        </span>
                      )}
                      <Button type="submit" variant="primary" className="ml-auto">Save Changes</Button>
                    </div>
                  </form>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="space-y-5">
                  <h3 className="text-base font-bold text-[#1E293B]">Password & Security</h3>
                  <div className="space-y-4">
                    <Input label="Current Password" type="password" placeholder="••••••••" />
                    <Input label="New Password" type="password" placeholder="••••••••" />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    <Button variant="primary">Update Password</Button>
                  </div>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="space-y-4">
                  <h3 className="text-base font-bold text-[#1E293B]">Notification Preferences</h3>
                  {[
                    { label: 'Quiz challenges & new posts', desc: 'Get notified when your followed teachers publish.' },
                    { label: 'Community announcements', desc: 'Pinned posts and event reminders.' },
                    { label: 'Streak & XP reminders', desc: 'Daily habit reminder before midnight.' },
                    { label: 'AI Tutor responses', desc: 'When the AI answers your saved questions.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#EDF2F7] last:border-0">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1E293B]">{item.label}</h4>
                        <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                      </div>
                      <div className="w-11 h-6 bg-[#4F7DF6] rounded-full flex items-end p-0.5 cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm ml-auto" />
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {activeTab === 'pro' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-[20px] bg-[#EEF4FF] border border-[#E2E8F0] space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4F7DF6]">
                      <Sparkles className="w-4 h-4" strokeWidth={2} /> StudyVerse Pro — Active
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#1E293B]">Unlimited AI Tutor & Verified Certificates</h3>
                    <p className="text-xs text-[#64748B]">
                      Your Pro plan renews on <span className="font-bold text-[#1E293B]">September 1, 2026</span>. Includes 24/7 GPT-4o access and 50GB cloud note storage.
                    </p>
                    <Button variant="secondary">Manage Subscription</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};
