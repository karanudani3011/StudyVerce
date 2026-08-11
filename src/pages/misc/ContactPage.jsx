import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, Input, Textarea } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { LandingNavbar, LandingFooter } from '../../components/layout/LandingLayout';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar />
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 py-12">
        <h1 className="text-3xl font-extrabold text-[#1E293B]">Contact StudyVerse Support</h1>
        <Card className="p-6">
          <form className="space-y-4">
            <Input label="Your Name" placeholder="Alex Johnson" />
            <Input label="Email" placeholder="alex@stanford.edu" />
            <Textarea label="Message" rows={4} placeholder="How can we help you?" />
            <Button variant="primary" fullWidth>Send Message</Button>
          </form>
        </Card>
      </div>
      <LandingFooter />
    </div>
  );
}
