import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { ShieldAlert, ShieldCheck, Key, Eye, HelpCircle, Lock } from 'lucide-react';
import { Card } from '../../components/ui/index.jsx';

const PRACTICES = [
  {
    icon: <Lock className="w-5 h-5 text-[#4F7DF6]" />,
    title: 'Data Encryption',
    desc: 'All communications with our servers are encrypted using industry-standard TLS 1.3. Student notes, uploaded material, and transcripts are stored securely using AES-256 encryption at rest.'
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    title: 'Account Isolation & Auth',
    desc: 'We support secure OAuth sign-ins via Google, GitHub, and Apple. Session tokens are signed cryptographically, protecting your account from unauthorized session hijacking.'
  },
  {
    icon: <Key className="w-5 h-5 text-amber-500" />,
    title: 'Infrastructure Security',
    desc: 'StudyVerse runs on ISO 27001 certified cloud environments with automatic DDoS mitigation, web application firewalls (WAF), and continuous container threat detection.'
  }
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <div>
        <LandingNavbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
            <ShieldAlert className="w-3.5 h-3.5" /> Trust & Safety
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">
            Security at StudyVerse
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            How we protect student data, secure platform infrastructures, and enforce a safe digital learning environment.
          </p>
        </section>

        {/* Security Practices Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRACTICES.map((practice, index) => (
              <Card key={index} className="p-6 bg-white border border-[#E2E8F0] rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                  {practice.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1E293B]">{practice.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {practice.desc}
                </p>
              </Card>
            ))}
          </div>

          {/* Vulnerability Disclosure */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#4F7DF6]" /> Vulnerability Disclosure Program
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              We take security issues seriously. If you believe you have discovered a vulnerability or security flaw within the StudyVerse platform, we encourage you to notify us responsibly.
            </p>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Please email details of the potential issue to <a href="mailto:security@studyverse.edu" className="font-semibold text-[#4F7DF6] hover:underline">security@studyverse.edu</a>. We aim to review all reports within 48 hours and coordinate prompt resolution actions.
            </p>
          </div>

        </main>
      </div>
      <LandingFooter />
    </div>
  );
}
