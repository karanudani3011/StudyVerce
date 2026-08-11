import React from 'react';
import { Card, Textarea } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />
      <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-6 py-12">
        <h1 className="text-2xl font-extrabold text-[#1E293B]">Share Feedback</h1>
        <Card className="space-y-4 p-6">
          <Textarea label="What features would improve your study sessions?" rows={4} />
          <Button variant="primary" fullWidth>Submit Feedback</Button>
        </Card>
      </div>
      <LandingFooter />
    </div>
  );
}
