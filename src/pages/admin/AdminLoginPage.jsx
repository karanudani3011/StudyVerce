import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Loader2, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function AdminLoginPage() {
  const { loginAdmin, setActiveTab } = useAuth();
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill remembered Admin ID on load
  React.useEffect(() => {
    const savedAdminId = localStorage.getItem('sv_remember_admin_id');
    if (savedAdminId) {
      setAdminId(savedAdminId);
      setRememberMe(true);
    }
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!adminId || !password) {
      setError('Please provide both Admin ID and Password.');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin({ adminId: adminId.trim(), password });

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem('sv_remember_admin_id', adminId.trim());
      } else {
        localStorage.removeItem('sv_remember_admin_id');
      }

      if (setActiveTab) setActiveTab('admin-dashboard');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid Admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060D17] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#0B1522]/90 backdrop-blur-2xl rounded-[32px] border border-[#1E293B] shadow-2xl p-8 sm:p-10 relative z-10 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 mx-auto shadow-xl shadow-emerald-500/25">
            <div className="w-full h-full bg-[#0B1522] rounded-[14px] flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-8 h-8" strokeWidth={2} />
            </div>
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wider uppercase inline-block mb-2">
              🛡️ Admin Access Only
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">StudyVerse Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized administrative personnel only</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase text-slate-300 tracking-wider mb-1.5">Admin ID</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#060D17] border border-[#1E293B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-300 tracking-wider mb-1.5">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#060D17] border border-[#1E293B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-[#060D17] text-emerald-500 focus:ring-emerald-500/30 transition cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
                Remember Admin ID
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" /> Authenticating...
              </>
            ) : (
              <>
                Log In to Admin Center <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Back Link */}
        <div className="pt-4 border-t border-[#1E293B]/80 text-center">
          <Link
            to="/login"
            className="text-xs text-slate-400 hover:text-emerald-400 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            ← Back to Student &amp; Faculty Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
