import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

// ─── Inline Alert Components ──────────────────────────────────────────────────
const ErrorAlert = ({ message }) =>
  message ? (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
      <span>{message}</span>
    </div>
  ) : null;

const SuccessAlert = ({ message }) =>
  message ? (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-sm">
      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
      <span>{message}</span>
    </div>
  ) : null;

// ─── Password Strength ────────────────────────────────────────────────────────
const getPasswordStrength = (pass) => {
  let score = 0;
  if (pass.length > 6) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AuthPages = () => {
  const { activeTab, setActiveTab, login, register, loginWithProvider, forgotPassword, resetPassword } = useAuth();

  const view = activeTab; // 'login' | 'signup' | 'forgot-password' | 'otp' | 'reset-password'

  // Shared state
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [name, setName]             = useState('');
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword]           = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI state
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const strength = getPasswordStrength(password);

  const clearMessages = () => { setError(''); setSuccess(''); };

  const handleTabChange = (tab) => {
    clearMessages();
    setActiveTab(tab);
  };

  // ─── OTP Input Handler ──────────────────────────────────────────────────────
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // ─── Login Submit ───────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login({ email, password });
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Register Submit ────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!name || !email || !password || !confirmPass) { setError('Please fill in all fields.'); return; }
    if (password !== confirmPass) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!termsAccepted) { setError('Please accept the Terms of Service to continue.'); return; }
    setLoading(true);
    try {
      await register({ name, email, password });
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Social Login ────────────────────────────────────────────────────────────
  const handleSocialLogin = async (provider) => {
    clearMessages();
    setLoading(true);
    try {
      await loginWithProvider(provider);
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || `${provider} login failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot Password Submit ─────────────────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('A 6-digit code has been sent to your email. Check your inbox!');
      setTimeout(() => handleTabChange('otp'), 1800);
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset Password Submit ──────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    const otpString = otp.join('');
    if (otpString.length < 6) { setError('Please enter the complete 6-digit code.'); return; }
    if (!newPassword || !confirmNewPassword) { setError('Please fill in both password fields.'); return; }
    if (newPassword !== confirmNewPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await resetPassword(email, otpString, newPassword);
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => { handleTabChange('login'); setOtp(['','','','','','']); }, 2000);
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Social Buttons ───────────────────────────────────────────────────────
  const SocialButtons = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span className="text-xs text-[#94A3B8] font-medium">OR</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { name: 'Google', icon: '🔵', label: 'Google' },
          { name: 'GitHub', icon: '⚫', label: 'GitHub' },
          { name: 'Apple',  icon: '⬛', label: 'Apple'  },
        ].map(({ name: pName, label }) => (
          <button
            key={pName}
            type="button"
            disabled={loading}
            onClick={() => handleSocialLogin(pName)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[12px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#1E293B] transition-all disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left Panel ─────────────────────────────────────────────────── */}
        <div className="p-8 sm:p-12 bg-[#EEF4FF] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] flex flex-col justify-between relative overflow-hidden">
          <div onClick={() => setActiveTab('landing')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-[14px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">StudyVerse</span>
          </div>

          <div className="my-10 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#4F7DF6] text-xs font-bold border border-[#E2E8F0]">
              <BookOpen className="w-3.5 h-3.5" strokeWidth={2} /> Academic Social Workspace
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] leading-tight">
              Master subjects with calm focus and AI tutors.
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Join over 250,000 students taking notes, generating AI flashcards, and keeping daily streaks.
            </p>
            <Card className="bg-white border-[#E2E8F0] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                <span>"StudyVerse helped me pass USMLE Step 1!"</span>
                <span className="text-[#4F7DF6]">5.0 ★</span>
              </div>
              <p className="text-xs text-[#64748B]">— Dr. Marcus Vance, Stanford School of Medicine</p>
            </Card>
          </div>

          <p className="text-xs text-[#94A3B8]">Protected by bank-grade SSL &amp; Privacy protocols.</p>
        </div>

        {/* ── Right Form ─────────────────────────────────────────────────── */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">

            {/* ── LOGIN ── */}
            {view === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Welcome Back 👋</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">Enter your credentials to log into your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <ErrorAlert message={error} />
                  <Input label="Email Address" type="email" placeholder="alex@stanford.edu" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div>
                    <Input label="Password" type="password" placeholder="••••••••" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="flex justify-end mt-1.5">
                      <button type="button" onClick={() => handleTabChange('forgot-password')} className="text-xs font-semibold text-[#4F7DF6] hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth icon={loading ? Loader2 : ArrowRight} disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In to Workspace'}
                  </Button>
                </form>

                <SocialButtons />

                <div className="pt-4 border-t border-[#EDF2F7] text-center text-xs text-[#64748B]">
                  Don't have an account?{' '}
                  <button onClick={() => handleTabChange('signup')} className="font-bold text-[#4F7DF6] hover:underline">Sign Up Free</button>
                </div>
              </motion.div>
            )}

            {/* ── SIGNUP ── */}
            {view === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Create Free Account ✨</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">Start your AI-powered learning experience.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <ErrorAlert message={error} />
                  <Input label="Full Name" placeholder="Alex Johnson" icon={User} value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input label="Student Email" type="email" placeholder="alex@university.edu" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />

                  <div>
                    <Input label="Create Password" type="password" placeholder="••••••••" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1.5 w-full">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className={`flex-1 rounded-full transition-all ${strength >= step ? strength === 1 ? 'bg-[#EF4444]' : strength === 2 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#64748B] block">Strength: {strength <= 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}</span>
                      </div>
                    )}
                  </div>

                  <Input label="Confirm Password" type="password" placeholder="••••••••" icon={Lock} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="rounded border-[#E2E8F0] text-[#4F7DF6] focus:ring-[#4F7DF6]" />
                    <label htmlFor="terms" className="text-xs text-[#64748B]">
                      I accept the <span className="font-semibold text-[#1E293B]">Terms of Service</span> &amp; <span className="font-semibold text-[#1E293B]">Privacy Policy</span>.
                    </label>
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth icon={loading ? Loader2 : ArrowRight} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <SocialButtons />

                <div className="pt-4 border-t border-[#EDF2F7] text-center text-xs text-[#64748B]">
                  Already have an account?{' '}
                  <button onClick={() => handleTabChange('login')} className="font-bold text-[#4F7DF6] hover:underline">Log In</button>
                </div>
              </motion.div>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {view === 'forgot-password' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                <div>
                  <button type="button" onClick={() => handleTabChange('login')} className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] mb-4">
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back to login
                  </button>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Reset Your Password 🔑</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">Enter your email to receive a 6-digit verification code.</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <ErrorAlert message={error} />
                  <SuccessAlert message={success} />
                  <Input label="Email Address" type="email" placeholder="alex@stanford.edu" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Button type="submit" variant="primary" size="lg" fullWidth icon={loading ? Loader2 : ArrowRight} disabled={loading}>
                    {loading ? 'Sending Code...' : 'Send 6-Digit Code'}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── OTP VERIFICATION ── */}
            {view === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                <div>
                  <button type="button" onClick={() => handleTabChange('forgot-password')} className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] mb-4">
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back
                  </button>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Enter Reset Code 📩</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    A 6-digit code was sent to <span className="font-bold text-[#1E293B]">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <ErrorAlert message={error} />
                  <SuccessAlert message={success} />

                  {/* OTP Boxes */}
                  <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-14 rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white text-center font-extrabold text-lg text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all"
                      />
                    ))}
                  </div>

                  {/* New Passwords */}
                  <div className="space-y-3">
                    <Input label="New Password" type="password" placeholder="••••••••" icon={Lock} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" icon={Lock} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth icon={loading ? Loader2 : ShieldCheck} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Reset Password'}
                  </Button>
                </form>

                <p className="text-center text-xs text-[#64748B]">
                  Didn't receive the code?{' '}
                  <button type="button" onClick={handleForgotPassword} className="font-semibold text-[#4F7DF6] hover:underline">Resend</button>
                </p>
              </motion.div>
            )}

            {/* ── RESET SUCCESS (legacy view kept for compat) ── */}
            {view === 'reset-password' && (
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#16A34A]" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Password Reset! 🎉</h3>
                  <p className="text-sm text-[#64748B]">Your password has been updated successfully. You can now log in.</p>
                </div>
                <Button variant="primary" size="lg" fullWidth icon={ArrowRight} onClick={() => handleTabChange('login')}>
                  Back to Login
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
