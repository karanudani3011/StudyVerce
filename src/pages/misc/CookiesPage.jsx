import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { CheckCircle2, ShieldAlert, Sparkles, Cookie } from 'lucide-react';
import { Card } from '../../components/ui/index.jsx';

const COOKIE_TYPES = [
  {
    title: 'Essential Cookies',
    purpose: 'Required for core platform functionality (e.g. keeping your active learning session authenticated, saving temporary inputs in quizzes). They cannot be disabled.',
    duration: 'Session / 30 Days'
  },
  {
    title: 'Analytics & Performance',
    purpose: 'Helps us analyze user behavior, study duration statistics, and detect performance bottlenecks or page lag. We use this anonymous data to optimize platform speed.',
    duration: '1 Year'
  },
  {
    title: 'User Preferences',
    purpose: 'Saves your personal workspace settings (e.g. light/dark mode choices, chosen category filters, audio preferences in study rooms).',
    duration: '6 Months'
  }
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <div>
        <LandingNavbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
            <Cookie className="w-3.5 h-3.5" /> Cookie Policy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">
            How We Use Cookies
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            This Cookie Policy explains what cookies are, why we use them, and how you can manage your cookie preferences.
          </p>
        </section>

        {/* Policy Details */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1E293B]">1. What are Cookies?</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Cookies are small text files stored on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, run more efficiently, and provide reporting information.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4F7DF6]" /> 2. Cookies We Use
            </h2>
            <p className="text-sm text-[#64748B]">
              We classify cookies into three categories based on their function and purpose:
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              {COOKIE_TYPES.map((type, index) => (
                <Card key={index} className="p-6 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#4F7DF6]" /> {type.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {type.purpose}
                    </p>
                  </div>
                  <span className="text-[10px] self-start sm:self-center font-bold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {type.duration}
                  </span>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1E293B]">3. Managing Cookie Settings</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              You can control and manage your cookie settings at any time in your web browser parameters. Blocking essential cookies may affect features like account persistent login sessions.
            </p>
          </div>

        </main>
      </div>
      <LandingFooter />
    </div>
  );
}
