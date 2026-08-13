import React from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Shield, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';

const JOBS = [
  {
    id: 'job1',
    title: 'Senior Frontend Engineer (React/Vite)',
    department: 'Engineering',
    location: 'Remote (US/Europe/India)',
    type: 'Full-time',
    description: 'Help us scale our social workspace. You will build high-fidelity interactive elements, optimize UI performance, and integrate real-time collaborative toolings.'
  },
  {
    id: 'job2',
    title: 'AI/ML Product Researcher',
    department: 'Artificial Intelligence',
    location: 'San Francisco, CA / Hybrid',
    type: 'Full-time',
    description: 'Focus on fine-tuning LLMs, semantic analysis of educational materials, and engineering the core agentic AI Tutor to explain complex topics logically.'
  },
  {
    id: 'job3',
    title: 'Lead UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Own the visual and user experience layer of StudyVerse. Ensure everything feels smooth, aesthetic, and follows a premium glassmorphic visual system.'
  }
];

const VALUES = [
  { icon: <Heart className="w-5 h-5 text-rose-500" />, title: 'Learner-Centric', desc: 'Every feature we design must serve a real educational purpose, keeping distraction at zero.' },
  { icon: <Zap className="w-5 h-5 text-amber-500" />, title: 'Speed & Elegance', desc: 'We build interfaces that load instantaneously, feel premium, and react to student behaviors fluidly.' },
  { icon: <Shield className="w-5 h-5 text-emerald-500" />, title: 'Private & Secure', desc: 'We protect student knowledge, query data, and private collaborations as our top trust standard.' }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <div>
        <LandingNavbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
              <Sparkles className="w-3.5 h-3.5" /> Join Our Team
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-none">
              Let's Re-imagine Academic Social Environments
            </h1>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              We are a team of educators, engineers, and designers building the premium digital ecosystem for academic growth and collaborative focus.
            </p>
          </div>
        </section>

        {/* Company Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Our Core Values</h2>
            <p className="text-sm text-[#64748B] mt-2">What keeps us focused and aligned on building StudyVerse.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((val, idx) => (
              <Card key={idx} className="p-6 space-y-3 bg-white border border-[#E2E8F0] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1E293B]">{val.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{val.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Job Listings */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
          <div className="border-b border-[#E2E8F0] pb-6 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-[#1E293B]">Open Roles</h2>
              <p className="text-sm text-[#64748B] mt-1">Ready to create a global impact? Browse our open listings.</p>
            </div>
            <span className="text-xs bg-[#EEF4FF] text-[#4F7DF6] font-bold px-3 py-1 rounded-full border border-[#E2E8F0]">
              {JOBS.length} Open Positions
            </span>
          </div>

          <div className="space-y-4">
            {JOBS.map((job) => (
              <Card key={job.id} className="p-6 bg-white border border-[#E2E8F0] rounded-2xl hover:border-[#4F7DF6] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#64748B]">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#64748B]">
                      <Clock className="w-3.5 h-3.5" /> {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1E293B] group-hover:text-[#4F7DF6] transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {job.description}
                  </p>
                </div>
                <div>
                  <Button variant="secondary" className="group-hover:bg-[#4F7DF6] group-hover:text-white transition-colors" iconRight={ArrowRight}>
                    View Role
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
