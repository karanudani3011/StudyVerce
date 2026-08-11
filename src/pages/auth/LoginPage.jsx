import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
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

export default function LoginPage() {
  const { login, loginWithProvider } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    login({ email });
    addToast('Welcome back to StudyVerse! 👋', 'success');
    navigate('/dashboard');
  };

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      await loginWithProvider(provider);
      addToast(`Signed in with ${provider} successfully! 👋`, 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      addToast(error.message || `${provider} sign-in failed. Please try again.`, 'error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <AuthenticationLayout>
      <AuthCard>
        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="flex justify-center mb-2.5">
            <Logo size="md" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight">
            Welcome Back 👋
          </h2>
          <p className="text-xs sm:text-sm font-normal text-[#64748B]">
            Continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Email"
            type="email"
            placeholder="alex@stanford.edu"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-0.5 pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#E2E8F0] text-[#4F7DF6] focus:ring-[#4F7DF6]/20 transition cursor-pointer"
              />
              <span className="text-xs font-medium text-[#64748B]">
                Remember Me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#4F7DF6] hover:text-[#3D6CF2] hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <PrimaryButton type="submit" loading={loading}>
            Log In
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
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm font-medium text-[#64748B]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#4F7DF6] hover:text-[#3D6CF2] hover:underline transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthenticationLayout>
  );
}
