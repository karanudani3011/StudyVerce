import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#22C55E] mx-auto flex items-center justify-center border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1E293B]">Payment Successful! 🎉</h2>
        <p className="text-sm text-[#64748B]">Welcome to StudyVerse Pro. All AI tutor tools and certificates are now active.</p>
        <Button variant="primary" fullWidth onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </Card>
    </div>
  );
}
