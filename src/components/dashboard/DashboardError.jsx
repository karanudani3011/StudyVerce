import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const DashboardError = ({ error, onRetry }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6 text-center pt-16">
      <Card className="p-8 space-y-5 border-rose-100 bg-rose-50/30">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#1E293B]">Unable to load dashboard data</h2>
          <p className="text-sm text-[#64748B]">
            {error || 'An unexpected error occurred while fetching your learning progress. Please check your connection and try again.'}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <Button variant="primary" icon={RefreshCw} onClick={onRetry}>
              Retry Connection
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
