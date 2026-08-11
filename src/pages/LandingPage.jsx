import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Bot,
  Trophy,
  Award,
  Play,
  Flame,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const LandingPage = () => {
  const { setActiveTab } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { number: '01', title: 'Upload & Share', desc: 'Drag and drop your lecture notes, PDFs, code snippets, or diagrams.' },
    { number: '02', title: 'Interactive Learning', desc: 'Engage with step-by-step visual breakdowns and educational feed discussions.' },
    { number: '03', title: 'AI Quiz Generation', desc: 'Instantly test your knowledge with auto-generated quizzes and instant feedback.' },
    { number: '04', title: 'Earn XP & Badges', desc: 'Track your daily streak, top the global leaderboard, and unlock verified certificates.' }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Distraction-Free Feed',
      desc: 'Pinterest & Instagram hybrid feed tuned exclusively for academic excellence, quantum physics, AI, and competitive exams.'
    },
    {
      icon: Bot,
      title: 'ChatGPT-Style AI Tutor',
      desc: 'Personalized 24/7 AI tutor capable of solving complex LaTeX formulas, writing code, and generating instant study guides.'
    },
    {
      icon: Users,
      title: 'Discord Study Rooms',
      desc: 'Join audio study lounges, collaborate on shared whiteboard notes, and prepare for exams with peer groups worldwide.'
    },
    {
      icon: Trophy,
      title: 'Gamified Streaks & XP',
      desc: 'Build unstoppable daily learning habits with streak counters, XP rewards, and real-time global college leaderboards.'
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      desc: 'Earn blockchain-verified certificates of achievement as you complete courses and master academic tracks.'
    },
    {
      icon: Zap,
      title: 'AI Quality Checker',
      desc: 'Every piece of content is scored for clarity, accuracy, and depth before publishing to maintain world-class standard.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] selection:bg-[#4F7DF6] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Badge Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#E2E8F0] text-[#4F7DF6] text-xs sm:text-sm font-semibold shadow-2xs mb-8"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            <span>StudyVerse Platform • Distraction-Free Social Learning</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1E293B] max-w-5xl mx-auto leading-tight"
          >
            Learn. Share.{' '}
            <span className="text-[#4F7DF6]">
              Grow Together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="mt-6 text-base sm:text-xl text-[#64748B] max-w-2xl mx-auto font-normal leading-relaxed"
          >
            The premium social workspace engineered for calm, distraction-free learning. Combine AI tutors, interactive notes, study groups, and streak tracking in one elegant platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-8"
            >
              Start Learning Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={Play}
              onClick={() => setActiveTab('explore')}
              className="w-full sm:w-auto px-8"
            >
              Explore Workspace Demo
            </Button>
          </motion.div>

          {/* Clean Graphic Mockup Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.25 }}
            className="mt-16 max-w-5xl mx-auto rounded-[24px] p-3 bg-white border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="rounded-[18px] overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0]">
              {/* Window Header Bar */}
              <div className="px-4 py-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E2E8F0]" />
                  <div className="w-3 h-3 rounded-full bg-[#E2E8F0]" />
                  <div className="w-3 h-3 rounded-full bg-[#E2E8F0]" />
                  <span className="ml-2 text-xs font-mono text-[#94A3B8]">app.studyverse.edu</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#22C55E] font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                  <Flame className="w-3.5 h-3.5" strokeWidth={2} /> 14 Day Streak Active
                </div>
              </div>

              {/* Graphic Mockup Inner Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-3 bg-white p-4 rounded-[16px] border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EEF4FF] text-[#4F7DF6] flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">StudyVerse AI Tutor</h4>
                      <p className="text-[10px] text-[#64748B]">Ready to assist 24/7</p>
                    </div>
                  </div>
                  <div className="bg-[#F5F7FB] p-3 rounded-[12px] text-xs font-mono text-[#4F7DF6] border border-[#E2E8F0]">
                    "Schrödinger\'s Wave Equation: iℏ(∂Ψ/∂t) = ĤΨ"
                  </div>
                </div>

                <div className="space-y-3 bg-white p-4 rounded-[16px] border border-[#E2E8F0] md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#EEF4FF] text-[#4F7DF6] flex items-center justify-center font-bold text-xs">
                        SC
                      </div>
                      <span className="text-xs font-bold text-[#1E293B]">Dr. Sarah Chen • AI @ MIT</span>
                    </div>
                    <span className="text-[10px] bg-purple-50 text-[#8B5CF6] px-2.5 py-0.5 rounded-full font-semibold border border-purple-200/60">
                      Neural Networks
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
                    alt="Neural Network preview"
                    className="w-full h-36 object-cover rounded-[12px] border border-[#E2E8F0]"
                  />
                  <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                    <span>❤️ 1,420 Likes</span>
                    <span>✨ AI Summary Available</span>
                    <button onClick={() => setActiveTab('feed')} className="text-[#4F7DF6] font-bold hover:underline">
                      Take Quiz ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Universities */}
      <section className="py-12 border-y border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-8">
            TRUSTED BY 250,000+ STUDENTS AT WORLD-CLASS UNIVERSITIES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 font-semibold text-[#64748B] text-sm md:text-base">
            <span>Stanford University</span>
            <span>MIT</span>
            <span>Oxford</span>
            <span>Harvard</span>
            <span>IIT Bombay</span>
            <span>UC Berkeley</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1E293B]">
            Engineered for Modern Learners
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Every feature is designed with Apple precision, high contrast readability, and zero algorithms designed to waste your time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} hover className="space-y-4">
                <div className="w-12 h-12 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
              How StudyVerse Works
            </h2>
            <p className="mt-3 text-[#64748B]">
              Transform raw notes into mastery in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-[20px] cursor-pointer transition-all border ${
                  activeStep === idx
                    ? 'bg-white border-[#4F7DF6] shadow-[0_8px_30px_rgba(15,23,42,0.06)]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white'
                }`}
              >
                <div className="text-3xl font-extrabold text-[#4F7DF6] mb-3">{s.number}</div>
                <h4 className="text-base font-bold text-[#1E293B] mb-2">{s.title}</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </div>
            <span className="font-bold text-[#1E293B] text-base">StudyVerse</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            © 2026 StudyVerse Inc. Minimal Apple & Linear inspired design system.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-[#64748B]">
            <button onClick={() => setActiveTab('landing')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => setActiveTab('landing')} className="hover:underline">Terms of Service</button>
            <button onClick={() => setActiveTab('landing')} className="hover:underline">Contact Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
