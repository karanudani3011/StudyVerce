import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge } from '../../components/ui/index.jsx';

const subjects = [
  { name: 'Neural Networks & Deep Learning', code: 'CS-401', notes: '4.2K notes', icon: '🧠' },
  { name: 'Quantum Superposition & Entanglement', code: 'PHY-502', notes: '1.8K notes', icon: '⚛️' },
  { name: 'Data Structures & Algorithms', code: 'CS-201', notes: '8.9K notes', icon: '💻' },
  { name: 'USMLE Step 1 Pharmacology', code: 'MED-101', notes: '6.4K notes', icon: '💊' },
  { name: 'UPSC Indian Polity & Constitution', code: 'GOV-301', notes: '12.1K notes', icon: '🏛️' },
  { name: 'Linear Algebra & Vector Spaces', code: 'MATH-202', notes: '3.5K notes', icon: '📐' },
];

export default function SubjectsPage() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Academic Subjects</h1>
          <p className="text-sm text-[#64748B]">Deep dive into individual subject curricula and study materials.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(s => (
            <Card key={s.code} hover onClick={() => navigate('/feed')} className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{s.icon}</span>
                <Badge variant="primary" size="sm">{s.code}</Badge>
              </div>
              <h3 className="text-base font-bold text-[#1E293B]">{s.name}</h3>
              <p className="text-xs text-[#94A3B8]">{s.notes} available</p>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
