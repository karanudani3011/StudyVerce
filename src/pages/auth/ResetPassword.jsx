import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { addToast('Passwords do not match', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    addToast('Password updated! Please log in.', 'success');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[24px] border border-[#E2E8F0] card-shadow p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-[#1E293B]">StudyVerse</span>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-[#1E293B]">Set a new password 🔑</h3>
          <p className="text-sm text-[#64748B] mt-2">Your new password must be at least 8 characters long.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="New Password" type="password" placeholder="••••••••" icon={Lock} value={password} onChange={e => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" placeholder="••••••••" icon={Lock} value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <Button type="submit" variant="primary" size="lg" fullWidth icon={CheckCircle2} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password & Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
