import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { ShieldCheck } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you voluntarily provide during registration (name, email, institution) and information generated through platform use, such as notes you upload, AI tutor queries, quiz results, and course progress. We do not collect any payment instrument data directly — all transactions are handled by certified third-party processors.'
  },
  {
    title: '2. How We Use Your Information',
    content: 'Your data is used exclusively to operate and improve the StudyVerse platform. This includes personalizing your study feed, powering AI-based learning recommendations, displaying performance analytics, and enabling peer collaboration features like communities and study groups.'
  },
  {
    title: '3. Data Storage & Security',
    content: 'All data is stored in ISO 27001 certified cloud infrastructure and encrypted at rest using AES-256 and in transit using TLS 1.3. AI query histories are stored ephemerally and are not linked to your permanent profile without your explicit opt-in.'
  },
  {
    title: '4. Data Sharing',
    content: 'StudyVerse does not sell, rent, or trade your personal data to any third party. We may share anonymized, aggregated statistics (e.g. platform-wide quiz accuracy rates) publicly for research purposes. Any third-party integrations (e.g. Firebase, OAuth providers) are governed by their respective privacy policies.'
  },
  {
    title: '5. Your Rights',
    content: 'You have the right to access, correct, export, or delete your personal data at any time from your Settings page. For deletion requests or data portability exports, contact privacy@studyverse.edu and we will respond within 72 hours.'
  },
  {
    title: '6. Changes to This Policy',
    content: 'We reserve the right to update this Privacy Policy as our platform evolves. All changes will be communicated via in-app notifications and email at least 14 days before taking effect. Continued use of StudyVerse after changes are applied constitutes acceptance.'
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 text-center px-4 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
          <ShieldCheck className="w-3.5 h-3.5" /> Legal
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-[#94A3B8]">Last updated: August 1, 2026</p>
        <p className="text-base text-[#64748B] max-w-xl mx-auto">
          StudyVerse is committed to safeguarding your personal data and your academic privacy. Read below to understand what we collect, why we collect it, and how it is protected.
        </p>
      </section>

      {/* Sections */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {SECTIONS.map((sec, i) => (
          <div key={i} className="space-y-2 border-b border-[#F1F5F9] pb-8 last:border-none last:pb-0">
            <h2 className="text-lg font-bold text-[#1E293B]">{sec.title}</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">{sec.content}</p>
          </div>
        ))}
        <div className="bg-[#EEF4FF] border border-[#DBEAFE] rounded-2xl p-6 text-center space-y-2">
          <p className="text-sm font-semibold text-[#1E293B]">Questions about your privacy?</p>
          <a href="mailto:privacy@studyverse.edu" className="text-sm text-[#4F7DF6] font-bold hover:underline">
            privacy@studyverse.edu
          </a>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
