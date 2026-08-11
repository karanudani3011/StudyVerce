// ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/index.jsx';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    navigate('/otp', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[24px] border border-[#E2E8F0] card-shadow p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-[#1E293B]">StudyVerse</span>
        </div>
        <div>
          <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] mb-4">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back to login
          </Link>
          <h3 className="text-2xl font-extrabold text-[#1E293B]">Forgot your password?</h3>
          <p className="text-sm text-[#64748B] mt-2">Enter your registered email and we'll send you a 6-digit verification code.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email Address" type="email" placeholder="alex@stanford.edu" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} required />
          <Button type="submit" variant="primary" size="lg" fullWidth iconRight={ArrowRight} disabled={loading}>
            {loading ? 'Sending code...' : 'Send Verification Code'}
          </Button>
        </form>
      </div>
    </div>
  );
}
