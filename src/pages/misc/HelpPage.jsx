import React, { useState } from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Mail, MessageSquare, ExternalLink } from 'lucide-react';

const FAQS = [
  { q: 'How do I upload notes for AI validation?', a: 'Go to the Upload section in your sidebar. Select "Upload Notes", choose your PDF or text file, and click Publish. Our AI automatically validates facts and generates quiz questions from your content.' },
  { q: 'How does the study streak work?', a: 'Complete at least 15 minutes of active learning or answer 1 AI quiz per day to maintain your streak. Missing a day resets the streak counter.' },
  { q: 'Can I become a tutor on StudyVerse?', a: 'Yes! From your Settings page, navigate to "Role & Verification" and submit a Tutor Application. Upload your academic credentials and our admin team will review within 3–5 business days.' },
  { q: 'How do I earn XP and level up?', a: 'XP is earned by completing quizzes, maintaining study streaks, posting educational notes, and helping peers in communities. Every 500 XP advances you one level.' },
  { q: 'What happens to my data if I delete my account?', a: 'All personal data, uploaded content, and AI query history are permanently deleted within 30 days of account closure. Anonymized aggregate learning statistics may be retained.' },
  { q: 'How does the AI Tutor work?', a: 'The AI Tutor uses large language models fine-tuned on academic domains. You can ask it any study question or upload a document and ask it to summarize, quiz, or explain concepts from it.' },
];

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-6 py-4 flex justify-between items-center gap-4"
          >
            <span className="text-sm font-semibold text-[#1E293B]">{item.q}</span>
            <span className="text-[#4F7DF6] text-lg font-bold flex-shrink-0">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div className="px-6 pb-5">
              <p className="text-sm text-[#64748B] leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />

      <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 text-center px-4 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
          <MessageSquare className="w-3.5 h-3.5" /> Help Center
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">How Can We Help?</h1>
        <p className="text-base text-[#64748B] max-w-xl mx-auto">Browse our frequently asked questions or reach out directly to our support team.</p>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Frequently Asked Questions</h2>
          <Accordion items={FAQS} />
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-[#1E293B]">Still need help?</h2>
          <p className="text-sm text-[#64748B]">Our support team typically responds within 24 hours on weekdays.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a href="mailto:support@studyverse.edu" className="inline-flex items-center gap-2 bg-[#4F7DF6] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3b68e0] transition-colors">
              <Mail className="w-4 h-4" /> Email Support
            </a>
            <a href="https://twitter.com/studyverse" className="inline-flex items-center gap-2 bg-[#F1F5F9] text-[#1E293B] text-sm font-semibold px-5 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-colors">
              <ExternalLink className="w-4 h-4" /> Twitter / X
            </a>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
