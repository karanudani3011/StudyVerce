import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function OTPVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };
  const handleKeyDown = (e, idx) => { if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus(); };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[24px] border border-[#E2E8F0] card-shadow p-8 sm:p-10 space-y-6 text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-[14px] bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F7DF6]">
            <Sparkles className="w-6 h-6" strokeWidth={2} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-[#1E293B]">Check your email 📩</h3>
          <p className="text-sm text-[#64748B] mt-2">Enter the 6-digit code sent to your registered email address.</p>
        </div>
        <div className="flex justify-center gap-2">
          {otp.map((d, i) => (
            <input key={i} ref={el => inputs.current[i] = el} type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleChange(e.target.value, i)} onKeyDown={e => handleKeyDown(e, i)}
              className="w-12 h-14 text-center text-xl font-extrabold text-[#1E293B] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all"
            />
          ))}
        </div>
        <Button variant="primary" size="lg" fullWidth icon={ShieldCheck} onClick={() => navigate('/reset-password')}>
          Verify Code
        </Button>
        <p className="text-xs text-[#64748B]">Didn't receive a code? <button className="font-bold text-[#4F7DF6] hover:underline">Resend in 0:59</button></p>
      </div>
    </div>
  );
}
