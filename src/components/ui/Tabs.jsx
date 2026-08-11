import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth ${variant === 'underline' ? 'border-b border-[#EDF2F7]' : 'bg-[#F5F7FB] p-1.5 rounded-[14px]'} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive ? 'text-[#4F7DF6]' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-[#EEF4FF] text-[#4F7DF6]' : 'bg-[#F5F7FB] text-[#64748B]'}`}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F7DF6]"
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-[12px] transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap z-10 ${
              isActive ? 'text-[#4F7DF6]' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="pill"
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-white rounded-[12px] shadow-xs border border-[#E2E8F0] -z-10"
              />
            )}
            {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-[#EEF4FF] text-[#4F7DF6]' : 'bg-[#E2E8F0] text-[#64748B]'}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
