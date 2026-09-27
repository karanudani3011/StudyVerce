import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  className = '',
}) => {
  return (
    <Card className={`p-8 text-center space-y-4 border-2 border-dashed border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all ${className}`}>
      {Icon && (
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Icon className="w-8 h-8 strokeWidth={1.5}" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#1E293B]">{title}</h3>
        {description && <p className="text-xs text-[#64748B] max-w-sm mx-auto">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" icon={ActionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
