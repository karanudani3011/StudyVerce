import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Accordion } from '../../components/ui/index.jsx';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 py-12">
        <h1 className="text-3xl font-extrabold text-[#1E293B]">Help Center & FAQs</h1>
        <Accordion items={[
          { q: 'How do I upload notes for AI validation?', a: 'Click the + Upload Note button in your sidebar, select your file, and click Publish. Our AI will automatically validate facts and generate quizzes.' },
          { q: 'How does the study streak work?', a: 'Complete at least 15 minutes of study or answer 1 AI quiz daily to maintain your streak.' }
        ]} />
      </div>
      <LandingFooter />
    </div>
  );
}
