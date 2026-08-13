import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { FileText } from 'lucide-react';

const SECTIONS = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using StudyVerse, you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the platform. These terms apply to all students, tutors, and administrators.' },
  { title: '2. Eligibility', content: 'StudyVerse is for users at least 13 years of age. By creating an account, you confirm that information provided during registration is accurate and complete.' },
  { title: '3. User Accounts', content: 'You are responsible for maintaining the confidentiality of your credentials. Notify us immediately at security@studyverse.edu if you suspect unauthorized access.' },
  { title: '4. Content & Conduct', content: 'You retain ownership of content you create, but grant StudyVerse a license to display it on the platform. You agree not to upload content that is misleading, plagiarized, offensive, or in violation of copyright law.' },
  { title: '5. Intellectual Property', content: 'All StudyVerse product elements — brand marks, UI design, proprietary algorithms, and AI features — are exclusive intellectual property of StudyVerse Inc. Unauthorized reproduction is strictly prohibited.' },
  { title: '6. Termination', content: 'StudyVerse may suspend or terminate accounts that violate these terms or are repeatedly flagged. You may close your account at any time from the Settings page.' },
  { title: '7. Limitation of Liability', content: 'StudyVerse provides its service "as is" and makes no guarantees regarding uninterrupted availability or accuracy of AI responses. To the maximum extent permitted by law, StudyVerse is not liable for indirect damages.' },
  { title: '8. Governing Law', content: 'These Terms are governed by the laws of the State of California, USA, without regard to conflict of law provisions.' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />
      <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 text-center px-4 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
          <FileText className="w-3.5 h-3.5" /> Legal
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">Terms of Service</h1>
        <p className="text-sm text-[#94A3B8]">Last updated: August 1, 2026</p>
        <p className="text-base text-[#64748B] max-w-xl mx-auto">Please read these Terms carefully before using StudyVerse. By accessing the platform, you agree to these terms.</p>
      </section>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {SECTIONS.map((sec, i) => (
          <div key={i} className="space-y-2 border-b border-[#F1F5F9] pb-8 last:border-none last:pb-0">
            <h2 className="text-lg font-bold text-[#1E293B]">{sec.title}</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">{sec.content}</p>
          </div>
        ))}
        <div className="bg-[#EEF4FF] border border-[#DBEAFE] rounded-2xl p-6 text-center space-y-2">
          <p className="text-sm font-semibold text-[#1E293B]">Legal enquiries?</p>
          <a href="mailto:legal@studyverse.edu" className="text-sm text-[#4F7DF6] font-bold hover:underline">legal@studyverse.edu</a>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
