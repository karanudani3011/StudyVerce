import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Newspaper, Download, Mail, Sparkles, ExternalLink } from 'lucide-react';
import { Card } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';

const RELEASES = [
  {
    id: 1,
    title: 'StudyVerse Launches Agentic AI Tutor to Support Personalized Study Streams',
    date: 'July 15, 2026',
    publisher: 'EdTech Today',
    summary: 'StudyVerse announces the launch of its customized AI tutor designed to digest user-uploaded lecture notes and validate accuracy, helping students review study material efficiently.'
  },
  {
    id: 2,
    title: 'Collaborative Workspace Platform StudyVerse Reaches 100,000 Active Scholars',
    date: 'May 28, 2026',
    publisher: 'TechCrunch',
    summary: 'By combining the engaging visual elements of social feeds with structured study groups, StudyVerse sees explosive growth among university students worldwide.'
  }
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <div>
        <LandingNavbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
            <Newspaper className="w-3.5 h-3.5" /> Newsroom
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">
            Press & Media Assets
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Discover recent news releases, download official brand resources, or get in touch with our media relations team.
          </p>
        </section>

        {/* Main Content Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Press Releases List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-[#1E293B] border-b border-[#E2E8F0] pb-3 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4F7DF6]" /> Recent Announcements
            </h2>
            
            {RELEASES.map((rel) => (
              <Card key={rel.id} className="p-6 bg-white border border-[#E2E8F0] rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs text-[#94A3B8] font-semibold">
                  <span>{rel.publisher}</span>
                  <span>{rel.date}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] hover:text-[#4F7DF6] transition-colors leading-tight cursor-pointer flex items-center gap-1.5 group">
                  {rel.title} <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {rel.summary}
                </p>
              </Card>
            ))}
          </div>

          {/* Media Kit Sidebar */}
          <div className="space-y-6">
            
            {/* Brand Assets */}
            <Card className="p-6 bg-white border border-[#E2E8F0] rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-[#1E293B]">Media Assets</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Need high-resolution StudyVerse assets? Download our brand kit containing official logos, custom icons, and dashboard screenshots.
              </p>
              <div className="space-y-2 pt-2">
                <Button variant="secondary" fullWidth iconLeft={Download}>
                  Download Logo Pack
                </Button>
                <Button variant="ghost" fullWidth iconLeft={Download}>
                  Product Screenshots (.ZIP)
                </Button>
              </div>
            </Card>

            {/* Media Contact */}
            <Card className="p-6 bg-white border border-[#E2E8F0] rounded-2xl space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6] mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1E293B]">Media Inquiries</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                For press inquiries, founder interview requests, or review copy setups, reach out directly at:
              </p>
              <a href="mailto:press@studyverse.edu" className="block text-sm font-semibold text-[#4F7DF6] hover:underline">
                press@studyverse.edu
              </a>
            </Card>

          </div>

        </main>
      </div>
      <LandingFooter />
    </div>
  );
}
