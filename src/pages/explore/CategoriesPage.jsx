import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/index.jsx';
import { MOCK_CATEGORIES } from '../../data/mockData';

export default function CategoriesPage() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">All Categories</h1>
          <p className="text-sm text-[#64748B]">Explore StudyVerse by academic field.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_CATEGORIES.map(cat => (
            <Card key={cat.id} hover onClick={() => navigate('/explore')} className="space-y-4 p-6">
              <div className={`w-14 h-14 rounded-[16px] ${cat.color} flex items-center justify-center text-2xl`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">{cat.name}</h3>
                <p className="text-xs text-[#94A3B8] mt-1">{cat.count}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
