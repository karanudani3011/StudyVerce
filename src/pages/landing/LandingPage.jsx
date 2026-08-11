import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Moon, Sun } from 'lucide-react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Button } from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay } }
});

const features = [
  {
    icon: (
      <div className="w-10 h-10 rounded-[14px] bg-blue-600 text-white flex items-center justify-center shadow-md">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
    ),
    title: 'Distraction-Free Feed',
    desc: 'Pinterest & Instagram hybrid feed tuned exclusively for academic excellence, quantum physics, AI, and competitive exams.'
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-[14px] bg-pink-500 text-white flex items-center justify-center shadow-md">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    ),
    title: 'ChatGPT-Style AI Tutor',
    desc: 'Personalized 24/7 AI tutor capable of solving complex LaTeX formulas, writing code, and generating instant study guides.'
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-[14px] bg-emerald-500 text-white flex items-center justify-center shadow-md">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
    ),
    title: 'Discord Study Rooms',
    desc: 'Join audio study lounges, collaborate on shared whiteboard notes, and prepare for exams with peer groups worldwide.'
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-[14px] bg-orange-500 text-white flex items-center justify-center shadow-md">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.594 15.12a2 2 0 00-1.022.547l-1.396 1.397a1 1 0 00.707 1.707h16.234a1 1 0 00.707-1.707l-1.396-1.397z" />
        </svg>
      </div>
    ),
    title: 'Gamified Streaks & XP',
    desc: 'Build unstoppable daily learning habits with streak counters, XP rewards, and real-time global college leaderboards.'
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-[14px] bg-purple-600 text-white flex items-center justify-center shadow-md">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
    ),
    title: 'Verified Certificates',
    desc: 'Earn blockchain-verified certificates of achievement as you complete courses and master academic tracks.'
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-[14px] bg-[#EF4444] text-white flex items-center justify-center shadow-md">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    ),
    title: 'AI Quality Checker',
    desc: 'Every piece of content is scored for clarity, accuracy, and depth before publishing to maintain world-class standard.'
  }
];

const steps = [
  { num: '01', title: 'Upload & Share', desc: 'Drag and drop your lecture notes, PDFs, code snippets, or diagrams.' },
  { num: '02', title: 'Interactive Learning', desc: 'Engage with step-by-step visual breakdowns and educational feed discussions.' },
  { num: '03', title: 'AI Quiz Generation', desc: 'Instantly test your knowledge with auto-generated quizzes and instant feedback.' },
  { num: '04', title: 'Earn XP & Badges', desc: 'Track your daily streak, top the global leaderboard, and unlock verified certificates.' }
];

const statsData = [
  { value: '250,000+', label: 'Active Students' },
  { value: '1.4M+', label: 'Notes & Files Shared' },
  { value: '850,000+', label: 'AI Quizzes Generated' },
  { value: '12,500+', label: 'Study Communities' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans antialiased text-[#1E293B]">
      {/* ── Fixed Pill Header ── */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] rounded-full px-6 py-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-[#1E293B] tracking-tight">StudyVerse</span>
              <span className="text-[10px] uppercase font-bold text-blue-600 block -mt-1 tracking-wider">Social Learning</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-[#F5F7FB] px-3 py-1.5 rounded-full border border-[#E2E8F0]">
            <Link to="/" className="px-4 py-1.5 text-sm font-semibold text-blue-600 bg-white rounded-full shadow-sm">Home</Link>
            <Link to="/explore" className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Explore</Link>
            <Link to="/communities" className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Communities</Link>
            <Link to="/ai-tutor" className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">AI Tutor</Link>
            <Link to="/leaderboard" className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Leaderboard</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5 transition-all">
              <ArrowRight className="w-4 h-4" /> Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-20 pb-12 px-4 max-w-5xl mx-auto text-center space-y-8">
        {/* Pill Badge */}
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Introducing StudyVerse 2.0 • Apple & Linear Inspired</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
          Learn. Share. <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">Grow Together.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The premium social platform engineered for distraction-free learning. Combine AI tutors, interactive notes, study groups, and gamified streak tracking in one elegant workspace.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.3)} className="flex items-center justify-center gap-4 pt-2">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
            <ArrowRight className="w-5 h-5" /> Start Learning Free
          </Link>
          <Link to="/explore" className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-7 py-3.5 rounded-2xl font-semibold text-base shadow-sm flex items-center gap-2 transition-all">
            <Play className="w-4 h-4 fill-slate-800" /> Explore Demo Workspace
          </Link>
        </motion.div>

        {/* App Workspace Mockup */}
        <motion.div {...fadeUp(0.4)} className="pt-6">
          <div className="bg-slate-900 rounded-[28px] p-4 border border-slate-800 shadow-2xl text-left max-w-4xl mx-auto overflow-hidden">
            {/* Topbar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80 px-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-3">app.studyverse.edu</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                <span>🔥 14 Day Streak Active</span>
              </div>
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: AI Tutor */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">AI</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">StudyVerse AI Tutor</h4>
                    <p className="text-[10px] text-slate-400">Ready to assist 24/7</p>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl text-xs text-slate-300 font-mono">
                  "|Ψ⟩ = α|0⟩ + β|1⟩ — Quantum Superposition derivation"
                </div>
              </div>

              {/* Card 2: Neural Networks */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">SC</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Dr. Sarah Chen • AI @ MIT</h4>
                      <p className="text-[10px] text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                  <span className="bg-purple-900/60 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-700/50">Neural Networks</span>
                </div>
                <p className="text-xs text-slate-300">Detailed backpropagation breakdown & visual activation functions notebook.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Grid Section ── */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
              {f.icon}
              <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-16 px-4 max-w-6xl mx-auto text-center space-y-8">
        <p className="text-sm text-slate-500 font-medium">Transform raw notes into mastery in four effortless steps.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {steps.map((step, i) => (
            <div key={i} className={`bg-white rounded-3xl p-8 border ${i === 0 ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10' : 'border-slate-200/80 shadow-sm'} space-y-4`}>
              <span className="text-3xl font-extrabold text-blue-600">{step.num}</span>
              <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-2">
              <div className="text-4xl font-extrabold text-blue-600">{s.value}</div>
              <div className="text-sm font-semibold text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Standard Footer ── */}
      <LandingFooter />
    </div>
  );
}
