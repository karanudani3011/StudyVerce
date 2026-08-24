import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  GraduationCap, Building2, BookOpen, FileText,
  CheckCircle2, Sparkles, ChevronRight, ArrowRight,
  User, Clock, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiPost, apiGet } from '../../config/api';
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

// ─── Application Status Tracker ───────────────────────────────────────────────
function ApplicationStatusBanner({ email, onReapply }) {
  const [application, setApplication] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!email) { setChecking(false); return; }
    (async () => {
      try {
        const data = await apiGet(`/tutors/my-application?email=${encodeURIComponent(email)}`);
        setApplication(data.application);
      } catch { /* no application yet */ }
      setChecking(false);
    })();
  }, [email]);

  if (checking) return (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="w-5 h-5 text-[#4F7DF6] animate-spin mr-2" />
      <span className="text-sm text-[#64748B]">Checking application status...</span>
    </div>
  );

  if (!application) return null;

  const statusMap = {
    pending: {
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      title: 'Application Under Review',
      desc: 'Your tutor application has been submitted and is currently being reviewed by our admin team. We\'ll update you within 2–3 business days.',
      cls: 'bg-amber-50 border-amber-200',
      badge: 'text-amber-600 bg-amber-100 border-amber-300',
      badgeLabel: '⏳ Pending Review',
    },
    approved: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      title: 'Application Approved! 🎉',
      desc: 'Congratulations! You have been verified as a tutor on StudyVerse. Log out and log back in using your Faculty credentials to access the Tutor Dashboard.',
      cls: 'bg-emerald-50 border-emerald-200',
      badge: 'text-emerald-600 bg-emerald-100 border-emerald-300',
      badgeLabel: '✅ Approved & Verified',
    },
    rejected: {
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
      title: 'Application Not Approved',
      desc: application.rejectionReason
        ? `Your application was not approved. Reason: ${application.rejectionReason}`
        : 'Unfortunately your application was not approved this time. You may update your credentials and reapply.',
      cls: 'bg-rose-50 border-rose-200',
      badge: 'text-rose-600 bg-rose-100 border-rose-300',
      badgeLabel: '❌ Not Approved',
    },
  };

  const cfg = statusMap[application.status] || statusMap.pending;

  return (
    <div className={`rounded-[24px] border p-6 ${cfg.cls}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-[14px] bg-white/70 border border-white shadow-sm">{cfg.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h2 className="text-base font-extrabold text-[#1E293B]">{cfg.title}</h2>
            <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${cfg.badge}`}>
              {cfg.badgeLabel}
            </span>
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed">{cfg.desc}</p>

          {/* Application Summary */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              ['Name', application.fullName],
              ['Subject', application.subject],
              ['Institution', application.institution],
              ['Applied On', new Date(application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
            ].map(([k, v]) => (
              <div key={k} className="p-2 rounded-[10px] bg-white/60 border border-white/80">
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">{k}</p>
                <p className="font-extrabold text-[#1E293B] mt-0.5">{v}</p>
              </div>
            ))}
          </div>

          {application.status === 'rejected' && (
            <button
              onClick={onReapply}
              className="mt-4 px-5 py-2.5 rounded-[14px] bg-[#1E293B] text-white text-xs font-extrabold hover:bg-slate-700 transition-all cursor-pointer"
            >
              Reapply with Updated Credentials →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Apply Tutor Page ─────────────────────────────────────────────────────
export default function ApplyTutorPage() {
  const { user, setActiveTab } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showForm, setShowForm] = useState(false);

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
    setSubmitError('');
    try {
      await apiPost('/tutors/apply', {
        ...form,
        userId: user?.id,
      });
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
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
              📬 A confirmation will appear in your Application Status once reviewed.
            </div>
            <Button variant="primary" icon={ArrowRight} onClick={() => setActiveTab('dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show status check first (if user is logged in)
  const userEmail = user?.email;

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

        {/* Application Status Banner (for existing applicants) */}
        {userEmail && !showForm && (
          <ApplicationStatusBanner email={userEmail} onReapply={() => setShowForm(true)} />
        )}

        {/* Apply Button (if no existing application) */}
        {!showForm && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3.5 rounded-[14px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-sm font-extrabold shadow-lg shadow-amber-200 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start New Application
            </button>
            <p className="text-xs text-[#94A3B8] mt-3">If you have a pending or approved application above, a new submission will override it.</p>
          </div>
        )}

        {/* Application Form */}
        {showForm && (
          <>
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

            {/* Error Banner */}
            {submitError && (
              <div className="flex items-center gap-2 p-3.5 rounded-[14px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {submitError}
              </div>
            )}

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
          </>
        )}
      </div>
    </AppLayout>
  );
}
