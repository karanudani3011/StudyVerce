import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 py-16">
        <h1 className="text-4xl font-extrabold text-[#1E293B]">About StudyVerse</h1>
        <p className="text-base text-[#64748B] leading-relaxed">
          StudyVerse is designed for serious students who spend hours learning. We blend the elegance of Apple, Linear, and Notion to create a distraction-free academic workspace.
        </p>
      </div>
      <LandingFooter />
    </div>
  );
}
