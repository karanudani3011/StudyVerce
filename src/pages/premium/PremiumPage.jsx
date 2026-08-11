import React from 'react';
import { PRICING_PLANS } from '../../data/mockData';
import { Card, Badge } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 py-16">
        <div className="text-center space-y-3">
          <Badge variant="accent">StudyVerse Pro</Badge>
          <h1 className="text-4xl font-extrabold text-[#1E293B]">Unlock Unlimited AI & Verified Certificates</h1>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto">Accelerate your academic potential with 24/7 GPT-4o tutoring, automatic quiz generation, and verified certificates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map(plan => (
            <Card key={plan.id} className={`p-6 space-y-4 border-2 ${plan.popular ? 'border-[#4F7DF6]' : 'border-[#E2E8F0]'}`}>
              <h3 className="text-lg font-bold text-[#1E293B]">{plan.name}</h3>
              <div className="text-3xl font-extrabold text-[#1E293B]">{plan.price === 0 ? 'Free' : `₹${plan.price}`}</div>
              <ul className="space-y-2 text-xs text-[#64748B]">
                {plan.features.map((f, i) => <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> {f}</li>)}
              </ul>
              <Button variant={plan.popular ? 'primary' : 'secondary'} fullWidth>{plan.cta}</Button>
            </Card>
          ))}
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
