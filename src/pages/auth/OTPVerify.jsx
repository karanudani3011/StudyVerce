import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, Loader2, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { apiPost } from '../../config/api';

const RESEND_SECONDS = 60;

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from ForgotPassword page via router state
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  // ─── Countdown Timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (s) => `0:${s.toString().padStart(2, '0')}`;

  // ─── OTP Input ────────────────────────────────────────────────────────────
  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  // ─── Resend Code ──────────────────────────────────────────────────────────
  const handleResend = useCallback(async () => {
    if (!canResend || !email) return;
    setError('');
    setResending(true);
    try {
      await apiPost('/auth/forgot-password', { email });
      setSuccess('A new code has been sent to your email!');
      setCountdown(RESEND_SECONDS);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  }, [canResend, email]);

  // ─── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerify = async () => {
    setError('');
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    if (!email) {
      setError('Session expired. Please go back and enter your email again.');
      return;
    }
    setLoading(true);
    try {
      // Navigate to reset page, passing email + otp
      navigate('/reset-password', { state: { email, otp: otpString } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.06)] p-8 sm:p-10 space-y-6 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 rounded-[18px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
            <Sparkles className="w-7 h-7" strokeWidth={2} />
          </div>
        </div>

        {/* Header */}
        <div>
          <h3 className="text-2xl font-extrabold text-[#1E293B]">Check your email 📩</h3>
          <p className="text-sm text-[#64748B] mt-2">
            Enter the 6-digit code sent to{' '}
            <span className="font-bold text-[#1E293B]">{email || 'your email'}</span>
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm text-left">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-sm text-left">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span>{success}</span>
          </div>
        )}

        {/* OTP Boxes */}
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-12 h-14 text-center text-xl font-extrabold text-[#1E293B] bg-[#F5F7FB] border-2 border-transparent focus:border-[#4F7DF6] focus:bg-white rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all"
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button variant="primary" size="lg" fullWidth onClick={handleVerify} disabled={loading}>
          <span className="flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Verify Code'}
          </span>
        </Button>

        {/* Resend + Countdown */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-[#64748B]">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-1.5 font-bold text-[#4F7DF6] hover:underline disabled:opacity-50"
            >
              {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              Resend Code
            </button>
          ) : (
            <>
              <span>Didn't receive a code?</span>
              <span className="font-bold text-[#1E293B]">
                Resend in{' '}
                <span className="text-[#4F7DF6]">{formatTime(countdown)}</span>
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
