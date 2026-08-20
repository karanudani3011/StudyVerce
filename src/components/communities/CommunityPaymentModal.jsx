import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCommunities } from '../../context/CommunityContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

export const CommunityPaymentModal = ({ community, isOpen, onClose }) => {
  const { payAndJoinCommunity } = useCommunities();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !community) return null;

  const fee = community.joiningFee || 199;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      payAndJoinCommunity(community.id);
      setIsProcessing(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      showToast(`Payment successful! Welcome to ${community.name} 🎉`, 'success');
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-[#EDF2F7] bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl">
                {community.icon}
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1 w-max mb-1">
                  <AlertCircle className="w-3 h-3" /> 10/10 Free Slots Full
                </span>
                <h3 className="text-lg font-extrabold text-white leading-tight">{community.name}</h3>
              </div>
            </div>
          </div>

          {/* Form / Payment Flow */}
          <form onSubmit={handlePayment} className="p-6 space-y-4">
            {/* Direct Payout Creator Box */}
            <div className="p-3.5 rounded-[16px] bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 text-white space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                <span>💳 DIRECT CREATOR PAYOUT</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
                  100% Creator Direct
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Payment Receiver:</span>
                <span className="font-bold text-white">{community.creatorName || community.creatorPayoutDetails?.accountName || 'Community Creator'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Creator Payee UPI ID:</span>
                <span className="font-mono text-amber-300 font-bold">{community.creatorPayoutDetails?.upiId || `${(community.creatorName || 'creator').toLowerCase().replace(/\s+/g, '')}@upi`}</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                🔒 100% of this fee goes directly to creator <strong className="text-slate-200">{community.creatorName || 'Community Creator'}</strong>'s account. No platform commission deducted.
              </p>
            </div>

            {/* Paywall details */}
            <div className="p-4 rounded-[16px] bg-purple-50/70 border border-purple-150 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-[#1E293B]">
                <span>Member Position:</span>
                <span className="text-[#8B5CF6]">#{community.members + 1}</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Free Tier Limit:</span>
                <span>10 Members</span>
              </div>
              <div className="border-t border-purple-200/60 pt-2 flex items-center justify-between text-sm font-extrabold text-[#1E293B]">
                <span>Community Joining Fee:</span>
                <span className="text-xl text-[#4F7DF6]">₹{fee}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / GPay' },
                  { id: 'card', label: 'Card' },
                  { id: 'wallet', label: 'NetBanking' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-2.5 px-3 rounded-[12px] text-xs font-bold border transition-all ${
                      paymentMethod === m.id
                        ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6]'
                        : 'bg-[#F5F7FB] border-[#E2E8F0] text-[#64748B] hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs based on payment method */}
            {paymentMethod === 'upi' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#64748B]">UPI ID / VPA</label>
                <input
                  type="text"
                  placeholder="student@okaxis"
                  defaultValue="student@upi"
                  className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-[14px] px-3.5 py-2.5 text-xs text-[#1E293B] focus:outline-none"
                  required
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  defaultValue="4000 1234 5678 9010"
                  className="w-full bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-[14px] px-3.5 py-2.5 text-xs text-[#1E293B] focus:outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-[14px] px-3.5 py-2.5 text-xs text-[#1E293B] focus:outline-none"
                    required
                  />
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="CVV"
                    defaultValue="123"
                    className="bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-[14px] px-3.5 py-2.5 text-xs text-[#1E293B] focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-[14px] text-xs text-[#64748B]">
                Includes HDFC, ICICI, SBI, Axis, and Razorpay Wallet options.
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 256-bit Encrypted SSL
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#94A3B8]" /> Instant Membership Access
              </span>
            </div>

            {/* Buttons */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isProcessing}
              className="bg-[#4F7DF6] hover:bg-[#3D6CF2] shadow-lg shadow-blue-500/25"
            >
              {isProcessing ? 'Processing Secure Payment...' : `Pay ₹${fee} & Join Community`}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
