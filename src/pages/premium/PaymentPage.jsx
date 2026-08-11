import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { Card, Input } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';

export default function PaymentPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-4">
        <h2 className="text-xl font-extrabold text-[#1E293B]">StudyVerse Pro Payment</h2>
        <Input label="Cardholder Name" placeholder="Alex Johnson" />
        <Input label="Card Number" placeholder="4532 •••• •••• 8921" icon={CreditCard} />
        <div className="grid grid-cols-2 gap-2">
          <Input label="Expiry" placeholder="08/28" />
          <Input label="CVC" placeholder="382" />
        </div>
        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/payment/success')}>Pay ₹299 Now</Button>
      </Card>
    </div>
  );
}
