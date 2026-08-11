import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
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
  const { login, loginWithProvider } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    await new Promise((r) => setTimeout(r, 800));
    login({ name: form.fullName, email: form.email });
    addToast('Account created successfully! Welcome to StudyVerse 🎉', 'success');
    navigate('/dashboard');
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
        <div className="text-center space-y-1 mb-5">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight">
            Create Free Account ✨
          </h2>
          <p className="text-xs sm:text-sm font-normal text-[#64748B]">
            Start your AI-powered learning experience
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Alex Johnson"
            icon={User}
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="alex@stanford.edu"
            icon={Mail}
            value={form.email}
            onChange={handleChange}
            required
          />

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

          {error && !form.confirmPassword && (
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
