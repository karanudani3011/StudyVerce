import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <h1 className="text-6xl font-extrabold text-[#4F7DF6]">404</h1>
      <h2 className="text-2xl font-bold text-[#1E293B]">Page Not Found</h2>
      <p className="text-sm text-[#64748B] max-w-sm">The academic route you are looking for does not exist or has been moved.</p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
    </div>
  );
}
