import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Award, Building2 } from 'lucide-react';
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

export default function RegisterPage() {
  const { register, registerTutor, loginWithProvider } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Service & Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      if (accountType === 'tutor') {
        await registerTutor({
          name: form.fullName,
          email: form.email,
          password: form.password,
          institution: form.institution,
          department: form.department,
          title: form.title,
          role: 'tutor',
        });
        addToast('Tutor / Faculty account created successfully! Welcome 🎉', 'success');
      } else {
        await register({
          name: form.fullName,
          email: form.email,
          password: form.password,
          role: 'student',
        });
        addToast('Account created successfully! Welcome to StudyVerse 🎉', 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      await loginWithProvider(provider);
      addToast(`Signed up with ${provider} successfully! Welcome to StudyVerse 🎉`, 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      addToast(error.message || `${provider} sign-up failed. Please try again.`, 'error');
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
            Create Free Account ✨
          </h2>
          <p className="text-xs sm:text-sm font-normal text-[#64748B]">
            Start your AI-powered learning & teaching journey
          </p>
        </div>

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
            placeholder={accountType === 'tutor' ? 'sarah.chen@mit.edu' : 'alex@stanford.edu'}
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

          {error && (
            <p className="text-xs text-[#EF4444] font-medium">{error}</p>
          )}

          {/* Register Button */}
          <PrimaryButton type="submit" loading={loading} disabled={!agreeTerms}>
            Create Account
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
      </AuthCard>
    </AuthenticationLayout>
  );
}
