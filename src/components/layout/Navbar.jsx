import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { activeTab, setActiveTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'landing' },
    { label: 'Explore', id: 'explore' },
    { label: 'Communities', id: 'community' },
    { label: 'AI Tutor', id: 'ai-tutor' },
    { label: 'Leaderboard', id: 'leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-[20px] border-b border-[#E2E8F0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6] group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">
              StudyVerse
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-[#64748B] -mt-1">
              Educational Platform
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F5F7FB] p-1.5 rounded-[16px] border border-[#E2E8F0]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-[12px] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#4F7DF6] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={() => setActiveTab('login')}>
            Login
          </Button>

          <Button variant="primary" icon={ArrowRight} onClick={() => setActiveTab('dashboard')}>
            Get Started
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[12px] text-[#1E293B] hover:bg-[#F5F7FB]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={2} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-sm font-semibold rounded-[12px] text-[#1E293B] hover:bg-[#F5F7FB]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="secondary" fullWidth onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }}>
              Login
            </Button>
            <Button variant="primary" fullWidth onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
