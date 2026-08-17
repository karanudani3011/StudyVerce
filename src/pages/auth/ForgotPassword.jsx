import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/index.jsx';
import { apiPost } from '../../config/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost('/auth/forgot-password', { email });
      if (data.success) {
        setSuccess('✅ Code sent! Check your inbox (and spam folder).');
        // Navigate to OTP page after short delay, passing email
        setTimeout(() => navigate('/otp', { state: { email } }), 1800);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.06)] p-8 sm:p-10 space-y-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-[#1E293B]">StudyVerse</span>
        </div>

        {/* Header */}
        <div>
          <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] mb-4">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back to login
          </Link>
          <h3 className="text-2xl font-extrabold text-[#1E293B]">Forgot your password?</h3>
          <p className="text-sm text-[#64748B] mt-2">
            Enter your registered email and we'll send you a 6-digit verification code.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-sm">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@stanford.edu"
            icon={Mail}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            <span className="flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
}
