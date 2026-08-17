import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle2, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { apiPost } from '../../config/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  // email + otp passed from OTPVerify via router state
  const email = location.state?.email || '';
  const otp   = location.state?.otp   || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirm) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!email || !otp) {
      setError('Session expired. Please start over from Forgot Password.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost('/auth/reset-password', {
        email,
        otp,
        newPassword: password,
      });

      if (data.success) {
        addToast('Password updated! Please log in with your new password.', 'success');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
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
          <h3 className="text-2xl font-extrabold text-[#1E293B]">Set a new password 🔑</h3>
          <p className="text-sm text-[#64748B] mt-2">
            Your new password must be at least 6 characters long.
          </p>
          {email && (
            <p className="text-xs text-[#94A3B8] mt-1">
              Resetting for: <span className="font-semibold text-[#1E293B]">{email}</span>
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            <span className="flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {loading ? 'Updating Password...' : 'Update Password & Sign In'}
            </span>
          </Button>
        </form>

      </div>
    </div>
  );
}
