import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <ShieldAlert className="w-12 h-12 text-[#F59E0B]" />
      <h1 className="text-3xl font-extrabold text-[#1E293B]">Scheduled Maintenance</h1>
      <p className="text-sm text-[#64748B] max-w-sm">We are upgrading our GPT-4o AI infrastructure. StudyVerse will be back online shortly.</p>
    </div>
  );
}
