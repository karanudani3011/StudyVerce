import React from 'react';
import { Card } from '../ui/Card';

export const DashboardSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-pulse pb-24 md:pb-8">
      {/* Hero Banner Skeleton */}
      <div className="bg-slate-800/80 rounded-[24px] p-6 sm:p-8 space-y-4 border border-slate-700/50">
        <div className="flex gap-2">
          <div className="h-6 w-32 bg-slate-700 rounded-full" />
          <div className="h-6 w-36 bg-slate-700 rounded-full" />
        </div>
        <div className="h-8 w-2/3 bg-slate-700 rounded-lg" />
        <div className="h-4 w-1/2 bg-slate-700 rounded" />
        <div className="h-3 w-80 bg-slate-700 rounded-full" />
      </div>

      {/* 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 space-y-3 border border-[#E2E8F0]">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="w-8 h-8 rounded-[12px] bg-slate-200" />
            </div>
            <div className="h-7 w-28 bg-slate-200 rounded-lg" />
            <div className="h-3 w-36 bg-slate-200 rounded" />
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6 space-y-4 border border-[#E2E8F0]">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((j) => (
                <div key={j} className="flex gap-4 p-4 border border-slate-100 rounded-[14px]">
                  <div className="w-20 h-20 rounded-[12px] bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded" />
                    <div className="h-2 w-full bg-slate-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4 border border-[#E2E8F0]">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((k) => (
                <div key={k} className="h-12 bg-slate-100 rounded-[14px]" />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6 space-y-4 border border-[#E2E8F0]">
            <div className="h-5 w-32 bg-slate-200 rounded" />
            <div className="h-16 bg-slate-100 rounded-[12px]" />
            <div className="h-9 bg-slate-200 rounded-[10px]" />
          </Card>
          <Card className="p-6 space-y-4 border border-[#E2E8F0]">
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((m) => (
                <div key={m} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="flex-1 h-3 bg-slate-200 rounded" />
                  <div className="w-12 h-3 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
