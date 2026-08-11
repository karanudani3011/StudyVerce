import React from 'react';

export const Badge = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'success', 'accent', 'warning', 'danger'
  size = 'md',
  icon: Icon,
  className = ''
}) => {
  const variants = {
    primary: 'bg-[#EEF4FF] text-[#4F7DF6] border border-[#E2E8F0]',
    secondary: 'bg-[#F5F7FB] text-[#64748B] border border-[#E2E8F0]',
    success: 'bg-emerald-50 text-[#22C55E] border border-emerald-200/60',
    accent: 'bg-purple-50 text-[#8B5CF6] border border-purple-200/60',
    warning: 'bg-amber-50 text-[#F59E0B] border border-amber-200/60',
    danger: 'bg-rose-50 text-[#EF4444] border border-rose-200/60'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-md gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-[10px] gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-[12px] gap-2'
  };

  return (
    <span className={`inline-flex items-center ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2} />}
      {children}
    </span>
  );
};
