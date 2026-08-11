import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const AuthPages = () => {
  const { activeTab, setActiveTab, login } = useAuth();

  const view = activeTab; // 'login', 'signup', 'forgot-password', 'otp', 'reset-password'

  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0..4
  };

  const strength = getPasswordStrength(password);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (view === 'login' || view === 'signup') {
      login({ name: name || 'Alex Johnson', email: email || 'alex@stanford.edu' });
      setActiveTab('dashboard');
    } else if (view === 'forgot-password') {
      setActiveTab('otp');
    } else if (view === 'otp') {
      setActiveTab('reset-password');
    } else if (view === 'reset-password') {
      setActiveTab('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Pastel Highlight Section */}
        <div className="p-8 sm:p-12 bg-[#EEF4FF] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] flex flex-col justify-between relative overflow-hidden">
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-[14px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">
              StudyVerse
            </span>
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
              <p className="text-xs text-[#64748B]">
                — Dr. Marcus Vance, Stanford School of Medicine
              </p>
            </Card>
          </div>

          <p className="text-xs text-[#94A3B8]">
            Protected by bank-grade SSL & Privacy protocols.
          </p>
        </div>

        {/* Right Form Container */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* LOGIN */}
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Welcome Back 👋</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Enter your student credentials to log into your account.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="alex@stanford.edu"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <div>
                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('forgot-password')}
                        className="text-xs font-semibold text-[#4F7DF6] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth icon={ArrowRight}>
                    Log In to Workspace
                  </Button>
                </form>

                <div className="pt-4 border-t border-[#EDF2F7] text-center text-xs text-[#64748B]">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="font-bold text-[#4F7DF6] hover:underline"
                  >
                    Sign Up Free
                  </button>
                </div>
              </motion.div>
            )}

            {/* SIGNUP */}
            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Create Your Account 🚀</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Start your 14-day streak and join study groups today.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Alex Johnson"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    label="Student Email"
                    type="email"
                    placeholder="alex@university.edu"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <div>
                    <Input
                      label="Create Password"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1.5 w-full">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 rounded-full transition-all ${
                                strength >= step
                                  ? strength === 1
                                    ? 'bg-[#EF4444]'
                                    : strength === 2
                                    ? 'bg-[#F59E0B]'
                                    : 'bg-[#22C55E]'
                                  : 'bg-[#E2E8F0]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#64748B] block">
                          Strength: {strength <= 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="rounded border-[#E2E8F0] text-[#4F7DF6] focus:ring-[#4F7DF6]"
                    />
                    <label htmlFor="terms" className="text-xs text-[#64748B]">
                      I agree to the <span className="font-semibold text-[#1E293B]">Terms of Service</span> & <span className="font-semibold text-[#1E293B]">Privacy Policy</span>.
                    </label>
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth icon={ArrowRight}>
                    Create Free Account
                  </Button>
                </form>

                <div className="pt-4 border-t border-[#EDF2F7] text-center text-xs text-[#64748B]">
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="font-bold text-[#4F7DF6] hover:underline"
                  >
                    Log In
                  </button>
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {view === 'forgot-password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] mb-4"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back to login
                  </button>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Reset Your Password 🔑</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Enter your email to receive a 6-digit verification code.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="alex@stanford.edu"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Button type="submit" variant="primary" size="lg" fullWidth icon={ArrowRight}>
                    Send 6-Digit Code
                  </Button>
                </form>
              </motion.div>
            )}

            {/* OTP VERIFICATION */}
            {view === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Verify 6-Digit Code 📩</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Enter the OTP code sent to <span className="font-bold text-[#1E293B]">{email || 'alex@stanford.edu'}</span>
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        className="w-12 h-14 rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white text-center font-extrabold text-lg text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all"
                      />
                    ))}
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth icon={ShieldCheck}>
                    Verify & Continue
                  </Button>
                </form>
              </motion.div>
            )}

            {/* RESET PASSWORD */}
            {view === 'reset-password' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E293B]">Set New Password 🔒</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Your password must be at least 8 characters long.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Button type="submit" variant="primary" size="lg" fullWidth icon={CheckCircle2}>
                    Update Password & Login
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
