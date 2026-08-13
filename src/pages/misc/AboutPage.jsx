import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Sparkles, Users, BookOpen, Brain, Target, Globe } from 'lucide-react';

const STATS = [
  { label: 'Active Scholars', value: '100K+', icon: <Users className="w-5 h-5 text-[#4F7DF6]" /> },
  { label: 'Courses Available', value: '500+', icon: <BookOpen className="w-5 h-5 text-emerald-500" /> },
  { label: 'AI Queries Answered', value: '2M+', icon: <Brain className="w-5 h-5 text-purple-500" /> },
  { label: 'Countries Reached', value: '60+', icon: <Globe className="w-5 h-5 text-amber-500" /> },
];

const VALUES = [
  { icon: '🎯', title: 'Purpose-Driven Learning', desc: 'Every feature is designed to serve a real academic need — nothing exists purely for entertainment.' },
  { icon: '🤝', title: 'Community First', desc: 'Peer collaboration, expert tutors, and community study rooms form the backbone of StudyVerse.' },
  { icon: '🔒', title: 'Privacy & Trust', desc: 'Your data is your own. We do not sell, share, or monetize student query data.' },
  { icon: '⚡', title: 'Speed & Elegance', desc: 'We obsess over fast load times, pixel-perfect UI, and buttery smooth interactions.' },
];

const TEAM = [
  { name: 'Dr. Sarah Chen', role: 'Head of AI Research', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&q=80&w=200' },
  { name: 'Prof. Marcus Vance', role: 'Academic Partnerships', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  { name: 'Dr. Priya Sharma', role: 'Chief Learning Officer', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-20 text-center px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0] mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Our Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight mb-4">
          Built for Serious Learners,<br />by Passionate Educators
        </h1>
        <p className="text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          StudyVerse was born from a simple frustration — no platform combined the social engagement of Instagram, the structure of Notion, and the intelligence of AI tutors into one distraction-free academic workspace. So we built it.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto">
                {stat.icon}
              </div>
              <p className="text-3xl font-extrabold text-[#1E293B]">{stat.value}</p>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white border-y border-[#E2E8F0] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Target className="w-10 h-10 text-[#4F7DF6] mx-auto" />
          <h2 className="text-3xl font-extrabold text-[#1E293B]">Our Mission</h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            To democratize high-quality, structured, and peer-collaborative education by fusing the best elements of social media, artificial intelligence, and academic discipline into a single platform that any student in the world can use — for free.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#1E293B]">What We Stand For</h2>
          <p className="text-sm text-[#64748B] mt-2">The principles that guide every product decision we make.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((v, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex gap-4">
              <span className="text-2xl">{v.icon}</span>
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">{v.title}</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-white border-t border-[#E2E8F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#1E293B]">The Team Behind StudyVerse</h2>
            <p className="text-sm text-[#64748B] mt-2">Educators, engineers, and researchers united by one goal.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <div key={i} className="text-center space-y-3">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full border-2 border-[#E2E8F0] mx-auto object-cover" />
                <div>
                  <p className="font-bold text-[#1E293B]">{member.name}</p>
                  <p className="text-xs text-[#64748B]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
