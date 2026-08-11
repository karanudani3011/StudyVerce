import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, hover = false, padding = 'p-6', className = '', onClick, ...props }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 30px rgba(15,23,42,0.09)' } : {}}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className={`bg-white rounded-[20px] border border-[#E2E8F0] card-shadow ${hover ? 'cursor-pointer' : ''} ${padding} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// ─── Avatar ─────────────────────────────────────────────────────────────────
export const Avatar = ({ src, alt = '', size = 'md', status, verified = false, className = '' }) => {
  const sizes = { xs: 'w-6 h-6', sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12', xl: 'w-16 h-16', '2xl': 'w-24 h-24' };
  const statusC = { online: 'bg-[#22C55E]', offline: 'bg-[#CBD5E1]', busy: 'bg-[#F59E0B]' };
  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={alt} className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-sm`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-[#EEF4FF] text-[#4F7DF6] font-bold flex items-center justify-center text-xs border border-[#E2E8F0]`}>
          {alt.slice(0, 2).toUpperCase()}
        </div>
      )}
      {status && <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusC[status]} ring-2 ring-white`} />}
      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#4F7DF6] rounded-full flex items-center justify-center ring-2 ring-white">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
      )}
    </div>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = 'primary', size = 'md', icon: Icon, className = '' }) => {
  const variants = {
    primary: 'bg-[#EEF4FF] text-[#4F7DF6]',
    secondary: 'bg-[#F5F7FB] text-[#64748B]',
    success: 'bg-emerald-50 text-[#22C55E]',
    accent: 'bg-purple-50 text-[#8B5CF6]',
    warning: 'bg-amber-50 text-[#F59E0B]',
    danger: 'bg-rose-50 text-[#EF4444]',
    dark: 'bg-[#1E293B] text-white',
  };
  const sizes = { sm: 'px-2 py-0.5 text-[10px] gap-1', md: 'px-2.5 py-1 text-xs gap-1.5' };
  return (
    <span className={`inline-flex items-center font-semibold rounded-[10px] ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" strokeWidth={2} />}
      {children}
    </span>
  );
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', color = 'text-[#4F7DF6]' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <svg className={`animate-spin ${s[size]} ${color}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

// ─── Progress ────────────────────────────────────────────────────────────────
export const Progress = ({ value = 0, max = 100, color = 'bg-[#4F7DF6]', size = 'md', showLabel = false }) => {
  const pct = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' };
  return (
    <div className="w-full">
      {showLabel && <div className="flex justify-between text-xs font-semibold text-[#64748B] mb-1"><span>Progress</span><span>{pct}%</span></div>}
      <div className={`w-full bg-[#F5F7FB] rounded-full overflow-hidden ${heights[size]}`}>
        <div className={`${heights[size]} ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─── Tabs ────────────────────────────────────────────────────────────────────
export const Tabs = ({ tabs, active, onChange, variant = 'pills' }) => {
  return (
    <div className={`flex items-center gap-1 ${variant === 'underline' ? 'border-b border-[#EDF2F7]' : 'bg-[#F5F7FB] p-1.5 rounded-[14px]'}`}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        if (variant === 'underline') {
          return (
            <button key={tab.id} onClick={() => onChange(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${isActive ? 'text-[#4F7DF6]' : 'text-[#64748B] hover:text-[#1E293B]'}`}>
              {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
              {tab.label}
              {tab.count !== undefined && <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-[#EEF4FF] text-[#4F7DF6]' : 'bg-[#F5F7FB] text-[#64748B]'}`}>{tab.count}</span>}
              {isActive && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F7DF6]" transition={{ duration: 0.2 }} />}
            </button>
          );
        }
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-[12px] transition-colors cursor-pointer whitespace-nowrap z-10 ${isActive ? 'text-[#4F7DF6]' : 'text-[#64748B] hover:text-[#1E293B]'}`}>
            {isActive && <motion.div layoutId="tab-pill" transition={{ duration: 0.2 }} className="absolute inset-0 bg-white shadow-sm border border-[#E2E8F0] rounded-[12px] -z-10" />}
            {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
            {tab.label}
            {tab.count !== undefined && <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-[#EEF4FF] text-[#4F7DF6]' : 'bg-[#E2E8F0] text-[#64748B]'}`}>{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
};

// Motion imported at top of file

// ─── Input ───────────────────────────────────────────────────────────────────
export const Input = ({ label, type = 'text', placeholder, value, onChange, error, icon: Icon, required, className = '', ...props }) => {
  const [show, setShow] = React.useState(false);
  const isPass = type === 'password';
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">{label}{required && <span className="text-[#EF4444] ml-0.5">*</span>}</label>}
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-4 w-4 h-4 text-[#94A3B8] pointer-events-none" strokeWidth={2} />}
        <input
          type={isPass ? (show ? 'text' : 'password') : type}
          placeholder={placeholder} value={value} onChange={onChange} required={required}
          className={`w-full rounded-[14px] bg-[#F5F7FB] border ${error ? 'border-[#EF4444]' : 'border-transparent focus:border-[#4F7DF6]'} ${Icon ? 'pl-11' : 'pl-4'} ${isPass ? 'pr-12' : 'pr-4'} py-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all ${className}`}
          {...props}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-4 text-[#94A3B8] hover:text-[#1E293B]">
            {show ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
    </div>
  );
};

import { Eye, EyeOff } from 'lucide-react';

// ─── Toggle ──────────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#4F7DF6]' : 'bg-[#E2E8F0]'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
    {label && <span className="text-sm font-medium text-[#1E293B]">{label}</span>}
  </label>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <div className="w-16 h-16 rounded-full bg-[#F5F7FB] text-[#94A3B8] flex items-center justify-center mb-4 border border-[#E2E8F0]"><Icon className="w-7 h-7" strokeWidth={1.5} /></div>}
    <h4 className="text-base font-bold text-[#1E293B] mb-1">{title}</h4>
    {desc && <p className="text-sm text-[#64748B] max-w-xs">{desc}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ─── Skeleton ────────────────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`bg-[#F5F7FB] rounded-[14px] animate-pulse ${className}`} />
);

// ─── Modal ───────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', h); }
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h); };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-[#1E293B]/25 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.2 }}
            className={`relative w-full ${maxWidth} bg-white rounded-[20px] p-6 card-shadow border border-[#E2E8F0] z-10`}>
            {title && (
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#EDF2F7]">
                <h3 className="text-lg font-bold text-[#1E293B]">{title}</h3>
                <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] rounded-full hover:bg-[#F5F7FB]"><X className="w-5 h-5" strokeWidth={2} /></button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = ({ label, placeholder, value, onChange, rows = 4, error, className = '' }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">{label}</label>}
    <textarea
      rows={rows} placeholder={placeholder} value={value} onChange={onChange}
      className={`w-full rounded-[14px] bg-[#F5F7FB] border ${error ? 'border-[#EF4444]' : 'border-transparent focus:border-[#4F7DF6]'} px-4 py-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all resize-none ${className}`}
    />
    {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
  </div>
);

// ─── Accordion ────────────────────────────────────────────────────────────────
export const Accordion = ({ items }) => {
  const [open, setOpen] = React.useState(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-[#E2E8F0] rounded-[16px] overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
            {item.q}
            <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${open === i ? 'rotate-180' : ''}`} strokeWidth={2} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <p className="px-4 pb-4 text-sm text-[#64748B] leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

import { ChevronDown } from 'lucide-react';
