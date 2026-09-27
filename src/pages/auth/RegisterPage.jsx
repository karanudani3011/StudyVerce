import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Award, Building2, RotateCcw, ArrowLeft, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import {
  AuthenticationLayout,
  AuthCard,
  Input,
  PasswordInput,
  PrimaryButton,
  SocialButton,
  Divider,
  GoogleIcon,
  GithubIcon,
  AppleIcon,
  Logo
} from '../../components/layout/AuthenticationLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// RFC 5322 compliant regex ensuring proper email syntax with domain and dot
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const RESEND_COOLDOWN_SECONDS = 30;

export default function RegisterPage() {
  const { register, registerTutor, verifyRegistrationOtp, resendRegistrationOtp, loginWithProvider } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // 'form' | 'otp'
  const [step, setStep] = useState('form');
  const [accountType, setAccountType] = useState('student'); // 'student' | 'tutor'
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: 'Stanford University',
    department: 'Computer Science & AI',
    title: 'Faculty / Lead Instructor',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  // 6-digit OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const otpInputs = useRef([]);

  // ─── Countdown Timer for OTP Resend ─────────────────────────────────────────
  useEffect(() => {
    if (step !== 'otp') return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // ─── Step 1: Submit Registration Form ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanEmail = form.email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Email is required.');
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      if (accountType === 'tutor') {
        await registerTutor({
          name: form.fullName.trim(),
          email: cleanEmail,
          password: form.password,
          institution: form.institution.trim(),
          department: form.department.trim(),
          title: form.title.trim(),
          role: 'tutor',
        });
      } else {
        await register({
          name: form.fullName.trim(),
          email: cleanEmail,
          password: form.password,
          role: 'student',
        });
      }

      // Transition to OTP verification screen
      addToast('A 6-digit verification code has been sent to your email 📩', 'info');
      setStep('otp');
      setCountdown(RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Handle OTP Input ───────────────────────────────────────────────
  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (error) setError('');
    if (val && idx < 5) {
      otpInputs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpInputs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpInputs.current[5]?.focus();
    }
  };

  // ─── Step 3: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setVerifying(true);
    try {
      await verifyRegistrationOtp({
        email: form.email.trim().toLowerCase(),
        otp: otpString,
      });

      addToast('Email verified successfully! Welcome to StudyVerse 🎉', 'success');
      navigate(accountType === 'tutor' ? '/tutor-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your OTP.');
    } finally {
      setVerifying(false);
    }
  };

  // ─── Step 4: Resend OTP ─────────────────────────────────────────────────────
  const handleResendOtp = useCallback(async () => {
    if (!canResend || resending) return;
    setError('');
    setResending(true);
    try {
      await resendRegistrationOtp({ email: form.email.trim().toLowerCase() });
      setOtpSuccess('A new 6-digit code has been sent to your email!');
      setCountdown(RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
      setTimeout(() => setOtpSuccess(''), 4000);
      addToast('Verification code resent successfully 📩', 'success');
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  }, [canResend, resending, form.email, resendRegistrationOtp, addToast]);

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      await loginWithProvider(provider);
      addToast(`Signed up with ${provider} successfully! Welcome to StudyVerse 🎉`, 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      addToast(err.message || `${provider} sign-up failed. Please try again.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticationLayout>
      <AuthCard>
        {/* Header */}
        <div className="text-center space-y-1 mb-4">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight">
            {step === 'otp' ? 'Verify Your Email' : 'Create Free Account ✨'}
          </h2>
          <p className="text-xs sm:text-sm font-normal text-[#64748B]">
            {step === 'otp'
              ? 'Enter the 6-digit verification code sent to'
              : 'Start your AI-powered learning & teaching journey'}
          </p>
          {step === 'otp' && (
            <p className="text-sm font-bold text-[#1E293B] break-all">{form.email.trim().toLowerCase()}</p>
          )}
        </div>

        {/* ─── STEP 1: REGISTRATION FORM ────────────────────────────────────── */}
        {step === 'form' && (
          <>
            {/* Account Type Selector (Student vs Tutor / Faculty) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F1F5F9] rounded-xl mb-4 border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setAccountType('student')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'student'
                    ? 'bg-white text-[#4F7DF6] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#4F7DF6]" />
                Student Account
              </button>
              <button
                type="button"
                onClick={() => setAccountType('tutor')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'tutor'
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                Tutor / Faculty
              </button>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder={accountType === 'tutor' ? 'Dr. Sarah Chen' : 'Alex Johnson'}
                icon={User}
                value={form.fullName}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder={accountType === 'tutor' ? 'dr.sarah@gmail.com' : 'alex@stanford.edu'}
                icon={Mail}
                value={form.email}
                onChange={handleChange}
                required
              />

              {accountType === 'tutor' && (
                <>
                  <Input
                    label="Institution / University"
                    name="institution"
                    type="text"
                    placeholder="MIT / Stanford / IIT Bombay"
                    icon={Building2}
                    value={form.institution}
                    onChange={handleChange}
                  />
                  <Input
                    label="Department & Title"
                    name="department"
                    type="text"
                    placeholder="Computer Science · Lead Educator"
                    icon={Award}
                    value={form.department}
                    onChange={handleChange}
                  />
                </>
              )}

              <PasswordInput
                label="Password"
                name="password"
                placeholder="••••••••"
                icon={Lock}
                value={form.password}
                onChange={handleChange}
                required
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder="••••••••"
                icon={Lock}
                value={form.confirmPassword}
                onChange={handleChange}
                error={error && form.password !== form.confirmPassword ? error : ''}
                required
              />

              {/* Accept Terms Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-[#E2E8F0] text-[#4F7DF6] focus:ring-[#4F7DF6]/20 transition cursor-pointer"
                  />
                  <span className="text-xs text-[#64748B] leading-tight">
                    I accept the{' '}
                    <Link to="/terms" className="font-semibold text-[#1E293B] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="font-semibold text-[#1E293B] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}

              {/* Register Button */}
              <PrimaryButton type="submit" loading={loading} disabled={!agreeTerms || loading}>
                {loading ? 'Sending OTP...' : 'Create Account'}
              </PrimaryButton>
            </form>

            {/* Divider */}
            <Divider text="or" />

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-2.5">
              <SocialButton
                provider="Google"
                icon={GoogleIcon}
                onClick={() => handleSocialLogin('Google')}
              />
              <SocialButton
                provider="GitHub"
                icon={GithubIcon}
                onClick={() => handleSocialLogin('GitHub')}
              />
              <SocialButton
                provider="Apple"
                icon={AppleIcon}
                onClick={() => handleSocialLogin('Apple')}
              />
            </div>

            {/* Bottom Link */}
            <div className="mt-5 text-center">
              <p className="text-xs sm:text-sm font-medium text-[#64748B]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#4F7DF6] hover:text-[#3D6CF2] hover:underline transition-colors"
                >
                  Log In
                </Link>
              </p>
            </div>
          </>
        )}

        {/* ─── STEP 2: OTP VERIFICATION UI ──────────────────────────────────── */}
        {step === 'otp' && (
          <div className="space-y-4 pt-1">
            {/* Alerts */}
            {error && (
              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs text-left">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {otpSuccess && (
              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-xs text-left">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{otpSuccess}</span>
              </div>
            )}

            {/* 6-Digit OTP Boxes */}
            <div className="flex justify-center gap-2 sm:gap-2.5 py-2" onPaste={handleOtpPaste}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (otpInputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold text-[#1E293B] bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all shadow-xs"
                />
              ))}
            </div>

            {/* Verify Email Button */}
            <PrimaryButton
              type="button"
              onClick={handleVerifyOtp}
              loading={verifying}
              disabled={verifying || otp.join('').length < 6}
            >
              {verifying ? 'Verifying...' : 'Verify Email'}
            </PrimaryButton>

            {/* Resend OTP & Cooldown */}
            <div className="text-center text-xs text-[#64748B] pt-2">
              <p className="mb-1.5">Didn't receive the code?</p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="inline-flex items-center gap-1.5 font-bold text-[#4F7DF6] hover:text-[#3D6CF2] hover:underline cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  {resending ? 'Sending...' : 'Resend OTP'}
                </button>
              ) : (
                <span className="font-semibold text-[#1E293B]">
                  Resend OTP in <span className="text-[#4F7DF6] font-bold">{countdown}s</span>
                </span>
              )}
            </div>

            {/* Change Email Button */}
            <div className="pt-2 border-t border-[#F1F5F9] text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setError('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#1E293B] hover:underline cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change Email
              </button>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthenticationLayout>
  );
}
