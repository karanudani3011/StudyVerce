import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children, variant = 'primary', size = 'md',
  icon: Icon, iconRight: IconRight,
  fullWidth = false, disabled = false,
  className = '', type = 'button', onClick, ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-[14px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7DF6] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer whitespace-nowrap';

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1',
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-base gap-2.5',
  };

  const variants = {
    primary: 'bg-[#4F7DF6] text-white hover:bg-[#3D6CF2] shadow-sm',
    secondary: 'bg-white text-[#1E293B] border border-[#E2E8F0] hover:bg-[#F8FAFC]',
    ghost: 'bg-transparent text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#1E293B]',
    danger: 'bg-[#EF4444] text-white hover:bg-red-600 shadow-sm',
    accent: 'bg-[#8B5CF6] text-white hover:bg-violet-600 shadow-sm',
    success: 'bg-[#22C55E] text-white hover:bg-green-600 shadow-sm',
    outline: 'bg-transparent text-[#4F7DF6] border border-[#4F7DF6] hover:bg-[#EEF4FF]',
  };

  const iconSizes = { xs: 'w-3 h-3', sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5', xl: 'w-5 h-5' };

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className={iconSizes[size]} strokeWidth={2} />}
      {children}
      {IconRight && <IconRight className={iconSizes[size]} strokeWidth={2} />}
    </motion.button>
  );
};
