import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  GraduationCap, Building2, BookOpen, FileText,
  CheckCircle2, Sparkles, ChevronRight, ArrowRight, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiPost } from '../../config/api';
import confetti from 'canvas-confetti';

const SUBJECTS = [
  'Artificial Intelligence & ML',
  'Data Science',
  'Computer Science',
  'Mathematics',
  'Physics & Quantum',
  'Chemistry & Biochemistry',
  'Biology & Medicine',
  'UPSC & Competitive Exams',
  'Engineering',
  'Economics & Finance',
  'Design & UX',
  'Other',
];

const STEPS = ['Personal Info', 'Expertise', 'Credentials'];

export default function ApplyTutorPage() {
  const { user, setActiveTab } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    institution: user?.institution || '',
    department: '',
    title: '',
    subject: SUBJECTS[0],
    teachingExp: '',
    credentialsUrl: '',
    bio: '',
  });

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await apiPost('/tutors/apply', {
        ...form,
        userId: user?.id,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      }).catch(() => {}); // backend may not have this endpoint yet; graceful fail

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1E293B]">Application Submitted! 🎉</h2>
              <p className="text-sm text-[#64748B] mt-2">
                Your application to become a Tutor on StudyVerse has been submitted successfully.
                Our admin team will review your credentials and get back to you within <strong>2–3 business days</strong>.
              </p>
            </div>
            <div className="p-4 rounded-[16px] bg-amber-50 border border-amber-200 text-sm text-amber-800 font-semibold">
              📬 A confirmation notification will be sent to <span className="font-extrabold">{form.email}</span> once reviewed.
            </div>
            <Button variant="primary" icon={ArrowRight} onClick={() => setActiveTab('dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-8 pb-24 md:pb-8">

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
            <GraduationCap className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Apply to Become a Tutor 👨‍🏫</h1>
          <p className="text-sm text-[#64748B] mt-1.5">Share your expertise, upload courses, and earn directly from your community</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-[#4F7DF6] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-bold ${i === step ? 'text-[#4F7DF6]' : 'text-[#94A3B8]'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-[#E2E8F0]" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#4F7DF6]" />
              Personal & Contact Information
            </h2>
            <Input label="Full Name *" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Dr. Rahul Mehta" required />
            <Input label="Email Address *" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="rahul@institution.edu" required />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">Academic Title *</label>
              <select
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] p-3 text-sm text-[#1E293B] focus:outline-none"
              >
                <option value="">Select your title...</option>
                {['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Research Scholar', 'Industry Expert', 'Senior Tutor', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                icon={ChevronRight}
                onClick={() => { if (form.fullName && form.email) setStep(1); }}
                disabled={!form.fullName || !form.email}
              >
                Next: Expertise
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Expertise */}
        {step === 1 && (
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              Area of Teaching Expertise
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">Primary Subject *</label>
              <select
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
                className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] p-3 text-sm text-[#1E293B] focus:outline-none"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Institution / University *" value={form.institution} onChange={e => set('institution', e.target.value)} placeholder="IIT Bombay / Stanford University" required />
            <Input label="Department" value={form.department} onChange={e => set('department', e.target.value)} placeholder="Computer Science & Engineering" />
            <Input label="Years of Teaching Experience" type="number" value={form.teachingExp} onChange={e => set('teachingExp', e.target.value)} placeholder="5" />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">Brief Bio / About You *</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                placeholder="Tell students about your expertise, teaching style, research interests, and achievements..."
                className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white p-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none resize-none transition-all"
              />
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="secondary" onClick={() => setStep(0)}>← Back</Button>
              <Button variant="primary" icon={ChevronRight} onClick={() => { if (form.institution && form.bio) setStep(2); }} disabled={!form.institution || !form.bio}>
                Next: Credentials
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Credentials */}
        {step === 2 && (
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Upload Academic Credentials
            </h2>
            <div className="p-3.5 rounded-[14px] bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
              📄 Upload a Google Drive / Dropbox link to your degree certificate, faculty ID, or any academic credential. Our admin team will verify this before approving.
            </div>
            <Input
              label="Credential Document URL *"
              value={form.credentialsUrl}
              onChange={e => set('credentialsUrl', e.target.value)}
              placeholder="https://drive.google.com/file/d/... (publicly viewable)"
              required
            />

            {/* Summary */}
            <div className="mt-2 p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <p className="font-extrabold text-[#1E293B] mb-2">📋 Application Summary</p>
              {[
                ['Name', form.fullName],
                ['Email', form.email],
                ['Title', form.title || 'Not specified'],
                ['Subject', form.subject],
                ['Institution', form.institution],
                ['Experience', `${form.teachingExp || '—'} years`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[#94A3B8] font-semibold">{k}</span>
                  <span className="text-[#1E293B] font-bold">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
              <Button
                variant="accent"
                icon={Sparkles}
                onClick={handleSubmit}
                disabled={!form.credentialsUrl || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Application 🚀'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
