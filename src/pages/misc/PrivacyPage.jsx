import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4 py-12">
        <h1 className="text-3xl font-extrabold text-[#1E293B]">Privacy Policy</h1>
        <p className="text-sm text-[#64748B]">StudyVerse values student data privacy. All student inputs, note uploads, and AI query logs are encrypted with 256-bit SSL and are never sold to third parties.</p>
      </div>
      <LandingFooter />
    </div>
  );
}
