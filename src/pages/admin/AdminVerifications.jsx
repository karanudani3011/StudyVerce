import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  CheckCircle2, XCircle, Clock, GraduationCap,
  Building2, BookOpen, Link2, User, Search, ShieldCheck
} from 'lucide-react';

const MOCK_APPLICATIONS = [
  {
    id: 'app_1',
    name: 'Dr. Rahul Mehta',
    email: 'rahul.mehta@iit.ac.in',
    avatar: 'https://i.pravatar.cc/80?img=11',
    subject: 'Quantum Physics & Thermodynamics',
    institution: 'IIT Bombay',
    department: 'Physics Department',
    credentialsUrl: 'https://drive.google.com/credential_rahul.pdf',
    bio: 'PhD in Quantum Physics with 8 years of teaching experience at IIT Bombay.',
    appliedAt: '2 hours ago',
    status: 'pending',
  },
  {
    id: 'app_2',
    name: 'Prof. Ananya Singh',
    email: 'ananya.s@nit.edu',
    avatar: 'https://i.pravatar.cc/80?img=5',
    subject: 'Machine Learning & Deep Learning',
    institution: 'NIT Trichy',
    department: 'Computer Science & Engineering',
    credentialsUrl: 'https://drive.google.com/credential_ananya.pdf',
    bio: 'Associate Professor specializing in AI/ML with 5+ research publications in IEEE.',
    appliedAt: '1 day ago',
    status: 'pending',
  },
  {
    id: 'app_3',
    name: 'Mr. Vikram Nair',
    email: 'vikram.nair@bits.edu',
    avatar: 'https://i.pravatar.cc/80?img=12',
    subject: 'Organic Chemistry & Biochemistry',
    institution: 'BITS Pilani',
    department: 'Chemistry Department',
    credentialsUrl: 'https://drive.google.com/credential_vikram.pdf',
    bio: 'Masters in Organic Chemistry, mentored 200+ JEE aspirants, 95% success rate.',
    appliedAt: '2 days ago',
    status: 'pending',
  },
  {
    id: 'app_4',
    name: 'Dr. Pooja Verma',
    email: 'pooja.v@aiims.edu',
    avatar: 'https://i.pravatar.cc/80?img=9',
    subject: 'Medicine & USMLE Prep',
    institution: 'AIIMS New Delhi',
    department: 'Internal Medicine',
    credentialsUrl: 'https://drive.google.com/credential_pooja.pdf',
    bio: 'MBBS, MD. Senior Resident at AIIMS with expertise in clinical case studies.',
    appliedAt: '3 days ago',
    status: 'approved',
  },
];

const statusConfig = {
  pending: { label: 'Pending Review', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
  approved: { label: 'Approved ✓', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-400' },
  rejected: { label: 'Rejected', color: 'text-rose-600 bg-rose-50 border-rose-200', dot: 'bg-rose-400' },
};

export default function AdminVerifications() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAction = (id, action) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: action } : a)
    );
  };

  const filtered = applications.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.institution.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 pb-24 md:pb-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-200 text-[11px] font-extrabold mb-2 inline-block">
              ✅ Admin Verification Portal
            </span>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">Tutor / Faculty Applications</h1>
            <p className="text-sm text-[#64748B]">Review, verify and grant tutor status to applicants</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200">
              {applications.filter(a => a.status === 'pending').length} Pending
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
              {applications.filter(a => a.status === 'approved').length} Approved
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name, subject, institution..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-white border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 focus:border-[#4F7DF6]"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-[12px] text-xs font-bold capitalize cursor-pointer border transition-all ${
                  filter === f
                    ? 'bg-[#1E293B] text-white border-transparent'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="p-10 bg-white rounded-[20px] border border-dashed border-[#CBD5E1] text-center">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-[#64748B]">No applications found</p>
            </div>
          )}

          {filtered.map(app => {
            const cfg = statusConfig[app.status] || statusConfig.pending;
            return (
              <div key={app.id} className="bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden hover:shadow-md hover:border-[#CBD5E1] transition-all">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Avatar & Name */}
                    <div className="flex items-start gap-3 flex-1">
                      <img src={app.avatar} alt={app.name} className="w-12 h-12 rounded-[14px] object-cover border border-[#E2E8F0]" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-extrabold text-[#1E293B]">{app.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">{app.email}</p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">Applied {app.appliedAt}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {app.status === 'pending' && (
                      <div className="flex items-center gap-2 sm:flex-col sm:justify-center">
                        <button
                          onClick={() => handleAction(app.id, 'approved')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'rejected')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                    {app.status === 'approved' && (
                      <div className="flex items-center">
                        <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                          <ShieldCheck className="w-5 h-5" /> Verified Tutor
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]">
                      <BookOpen className="w-3.5 h-3.5 text-[#4F7DF6] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#94A3B8] font-semibold">SUBJECT</p>
                        <p className="text-xs font-bold text-[#1E293B]">{app.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]">
                      <Building2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#94A3B8] font-semibold">INSTITUTION</p>
                        <p className="text-xs font-bold text-[#1E293B]">{app.institution}</p>
                      </div>
                    </div>
                    <a
                      href={app.credentialsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#4F7DF6] transition-all"
                    >
                      <Link2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#94A3B8] font-semibold">CREDENTIAL</p>
                        <p className="text-xs font-bold text-[#4F7DF6] hover:underline">View Document ↗</p>
                      </div>
                    </a>
                  </div>

                  {/* Bio */}
                  <p className="mt-3 text-xs text-[#64748B] bg-[#F8FAFC] rounded-[12px] p-3 border border-[#E2E8F0]">
                    💬 <span className="font-semibold text-[#1E293B]">Bio:</span> {app.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
