import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Progress } from '../../components/ui/index.jsx';

export default function AIValidation() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto space-y-6 text-center pb-24 md:pb-8">
        <Card className="p-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#8B5CF6] mx-auto flex items-center justify-center border border-purple-100">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-xl font-extrabold text-[#1E293B]">AI Content Quality Check</h1>
          <p className="text-xs text-[#64748B]">Verifying academic accuracy, equation clarity, and generating auto-quizzes.</p>
          <Progress value={85} showLabel size="lg" />
        </Card>
      </div>
    </AppLayout>
  );
}
