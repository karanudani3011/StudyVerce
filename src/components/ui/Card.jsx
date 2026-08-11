import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-[20px] p-6 border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.04)]';

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 35px rgba(15,23,42,0.07)' } : {}}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`${baseClasses} ${hover ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
