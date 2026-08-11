import React from 'react';
import { Check } from 'lucide-react';

export const Avatar = ({
  src,
  alt = 'User avatar',
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
  status, // 'online', 'offline', 'busy'
  verified = false,
  className = ''
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl'
  };

  const statusColors = {
    online: 'bg-[#22C55E]',
    offline: 'bg-[#CBD5E1]',
    busy: 'bg-[#F59E0B]'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`${sizes[size]} rounded-full object-cover border border-[#E2E8F0] shadow-2xs`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-[#EEF4FF] text-[#4F7DF6] font-bold flex items-center justify-center border border-[#E2E8F0]`}>
          {alt.substring(0, 2).toUpperCase()}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ${statusColors[status]} ring-2 ring-white`}
        />
      )}

      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-[#4F7DF6] text-white rounded-full p-0.5 ring-2 ring-white">
          <Check className="w-3 h-3" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
};
