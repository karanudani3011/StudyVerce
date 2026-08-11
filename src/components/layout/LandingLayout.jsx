import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Menu, X, Play, BookOpen, Bot, Users, Trophy, Award, Zap, Star, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { PRICING_PLANS } from '../../data/mockData';

// ─── LANDING NAVBAR ───────────────────────────────────────────────────────────
export const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Explore', to: '/explore' },
    { label: 'Communities', to: '/communities' },
    { label: 'AI Tutor', to: '/ai-tutor' },
    { label: 'Pricing', to: '/premium' },
    { label: 'About', to: '/about' },
  ];
  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6] group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-[#1E293B] tracking-tight">StudyVerse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-[#F5F7FB] p-1.5 rounded-[16px] border border-[#E2E8F0]">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#1E293B] rounded-[12px] hover:bg-white transition-all">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
          <Link to="/register"><Button variant="primary" size="sm" iconRight={ArrowRight}>Get Started Free</Button></Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-[12px] text-[#1E293B] hover:bg-[#F5F7FB]">
          {open ? <X className="w-6 h-6" strokeWidth={2} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pb-5 space-y-1">
          {links.map(l => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#1E293B] hover:bg-[#F5F7FB] rounded-[12px]">{l.label}</Link>)}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1"><Button variant="secondary" fullWidth>Log In</Button></Link>
            <Link to="/register" className="flex-1"><Button variant="primary" fullWidth>Get Started</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
};

// ─── LANDING FOOTER ───────────────────────────────────────────────────────────
export const LandingFooter = () => (
  <footer className="bg-white border-t border-[#E2E8F0] py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#EEF4FF] flex items-center justify-center text-[#4F7DF6] border border-[#E2E8F0]">
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </div>
            <span className="text-base font-bold text-[#1E293B]">StudyVerse</span>
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed max-w-xs">The premium social workspace for calm, distraction-free educational learning.</p>
        </div>
        {[
          { title: 'Platform', links: ['Explore', 'Feed', 'Communities', 'AI Tutor', 'Courses'] },
          { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms', 'Security', 'Cookies'] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(l => <li key={l}><a href="#" className="text-sm text-[#64748B] hover:text-[#4F7DF6] transition-colors">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#EDF2F7] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#94A3B8]">© 2026 StudyVerse Inc. All rights reserved.</p>
        <p className="text-xs text-[#94A3B8]">Designed for serious learners worldwide 🌍</p>
      </div>
    </div>
  </footer>
);
