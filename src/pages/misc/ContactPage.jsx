import React, { useState } from 'react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';

const CONTACT_INFO = [
  { icon: <Mail className="w-5 h-5 text-[#4F7DF6]" />, label: 'General Support', value: 'support@studyverse.edu' },
  { icon: <MessageSquare className="w-5 h-5 text-emerald-500" />, label: 'Business Inquiries', value: 'hello@studyverse.edu' },
  { icon: <MapPin className="w-5 h-5 text-rose-500" />, label: 'Headquarters', value: 'San Francisco, CA, USA' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#EEF4FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16 text-center px-4 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]">
          <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">Contact Us</h1>
        <p className="text-base text-[#64748B] max-w-xl mx-auto">
          Have a question, feedback, or partnership idea? Our team typically responds within 24 hours on weekdays.
        </p>
      </section>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Info Column */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-[#1E293B]">Contact Information</h2>
          {CONTACT_INFO.map((info, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                {info.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{info.label}</p>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{info.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1E293B]">Message Sent!</h3>
              <p className="text-sm text-[#64748B] max-w-sm">Thank you for reaching out, {form.name || 'there'}. We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
              <button onClick={() => setSent(false)} className="text-sm text-[#4F7DF6] font-semibold hover:underline mt-2">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-2xl p-8 space-y-5">
              <h2 className="text-lg font-bold text-[#1E293B]">Send us a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Your Name</label>
                  <input
                    required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Alex Johnson"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1E293B] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/30 focus:border-[#4F7DF6] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Email Address</label>
                  <input
                    required type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="alex@stanford.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1E293B] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/30 focus:border-[#4F7DF6] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Subject</label>
                <input
                  required value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Question about AI Tutor credits..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1E293B] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/30 focus:border-[#4F7DF6] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Message</label>
                <textarea
                  required rows={5} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1E293B] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/30 focus:border-[#4F7DF6] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#4F7DF6] hover:bg-[#3b68e0] text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
