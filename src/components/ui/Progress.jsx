import React from 'react';

export const Progress = ({
  value = 0,
  max = 100,
  color = 'bg-[#4F7DF6]',
  size = 'md',
  showPercent = false,
  className = ''
}) => {
  const percent = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercent && (
        <div className="flex justify-between items-center text-xs font-semibold text-[#64748B] mb-1.5">
          <span>Progress</span>
          <span className="text-[#1E293B]">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${color} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
