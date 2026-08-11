import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

// Brand Logo
export const Logo = ({ size = 'md', className = '' }) => {
  const isLarge = size === 'lg';
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${isLarge ? 'w-10 h-10 rounded-[14px]' : 'w-8 h-8 rounded-[12px]'} bg-gradient-to-tr from-[#4F7DF6] to-[#8B5CF6] flex items-center justify-center text-white shadow-md shadow-[#4F7DF6]/20`}>
        <svg className={isLarge ? 'w-5.5 h-5.5' : 'w-4.5 h-4.5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <span className={`font-extrabold text-[#1E293B] tracking-tight ${isLarge ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
        Study<span className="text-[#4F7DF6]">Verse</span>
      </span>
    </div>
  );
};

// Reusable Auth Card container (Optimized size & padding)
export const AuthCard = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-[480px] bg-white/95 backdrop-blur-xl border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_12px_36px_rgba(15,23,42,0.05)] ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Custom Input field
export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-[#1E293B]">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#64748B] pointer-events-none transition-colors">
            <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full h-[48px] rounded-[14px] bg-[#F5F7FB] border border-[#E2E8F0] ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 text-sm text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#4F7DF6] focus:ring-4 focus:ring-[#4F7DF6]/10 ${
            error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#EF4444] font-medium pt-0.5">{error}</p>}
    </div>
  );
};

// Dedicated Password Input with Toggle
export const PasswordInput = ({
  label = 'Password',
  placeholder = '••••••••',
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-[#1E293B]">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#64748B] pointer-events-none">
            <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
          </div>
        )}
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full h-[48px] rounded-[14px] bg-[#F5F7FB] border border-[#E2E8F0] ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-11 text-sm text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#4F7DF6] focus:ring-4 focus:ring-[#4F7DF6]/10 ${
            error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 text-[#64748B] hover:text-[#1E293B] focus:outline-none transition-colors p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
        </button>
      </div>
      {error && <p className="text-xs text-[#EF4444] font-medium pt-0.5">{error}</p>}
    </div>
  );
};

// Primary Action Button
export const PrimaryButton = ({ children, loading, disabled, type = 'submit', className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      type={type}
      disabled={disabled || loading}
      className={`w-full h-[48px] rounded-[14px] bg-[#4F7DF6] hover:bg-[#3D6CF2] active:bg-[#325CD7] text-white font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 shadow-md shadow-[#4F7DF6]/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};

// Social Buttons
export const SocialButton = ({ provider, icon: Icon, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -1.5, backgroundColor: '#FFFFFF' }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className="w-full h-[44px] rounded-[14px] bg-[#F5F7FB] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#1E293B] font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
    >
      <Icon className="w-4 h-4" />
      <span>{provider}</span>
    </motion.button>
  );
};

// Divider with text
export const Divider = ({ text = 'or' }) => {
  return (
    <div className="relative my-5 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#E2E8F0]" />
      </div>
      <span className="relative bg-white px-3 text-[11px] font-semibold tracking-wider uppercase text-[#94A3B8]">
        {text}
      </span>
    </div>
  );
};

// Custom SVG Icons for Social Login
export const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

export const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export const AppleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.82c.67-.82 1.13-1.96.99-3.12-1 .04-2.19.67-2.88 1.48-.61.72-1.15 1.88-.99 3.01 1.11.09 2.22-.56 2.88-1.37z"/>
  </svg>
);

// Main Master Layout Component
export const AuthenticationLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-[#4F7DF6] selection:text-white">
      {/* Subtle Background Glowing Spheres */}
      <div className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#4F7DF6]/6 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/6 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 z-10 py-4 sm:py-6">
        
        {/* LEFT SECTION (52%) */}
        <div className="w-full lg:w-[52%] flex flex-col justify-between items-start gap-6 relative">
          
          {/* Top Brand Header */}
          <div className="w-full flex items-center justify-between">
            <Logo size="lg" />
          </div>

          {/* Center 3D Educational Illustration & Floating Elements */}
          <div className="w-full flex flex-col items-center justify-center relative py-2 my-2">
            
            {/* Soft Ambient Radial Backdrop */}
            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#4F7DF6]/12 via-[#8B5CF6]/12 to-transparent blur-2xl" />

            {/* Floating Educational Micro-Badge 1: Code */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden sm:flex absolute top-2 left-2 lg:left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-[14px] border border-[#E2E8F0] shadow-sm items-center gap-2 z-20"
            >
              <div className="w-6 h-6 rounded-[8px] bg-[#EEF4FF] text-[#4F7DF6] flex items-center justify-center font-bold text-[11px]">
                &lt;/&gt;
              </div>
              <span className="text-xs font-semibold text-[#1E293B]">Python & React</span>
            </motion.div>

            {/* Floating Educational Micro-Badge 2: AI */}
            <motion.div
              animate={{ y: [5, -5, 5], rotate: [1.5, -1.5, 1.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="hidden sm:flex absolute top-6 right-2 lg:right-8 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-[14px] border border-[#E2E8F0] shadow-sm items-center gap-2 z-20"
            >
              <div className="w-6 h-6 rounded-[8px] bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center text-xs">
                ✨
              </div>
              <span className="text-xs font-semibold text-[#1E293B]">AI Tutor 24/7</span>
            </motion.div>

            {/* Floating Educational Micro-Badge 3: Certificate */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="hidden sm:flex absolute bottom-4 left-8 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-[14px] border border-[#E2E8F0] shadow-sm items-center gap-2 z-20"
            >
              <div className="w-6 h-6 rounded-[8px] bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center text-xs">
                🎓
              </div>
              <span className="text-xs font-semibold text-[#1E293B]">Verified Certs</span>
            </motion.div>

            {/* 3D Student Laptop Illustration Image */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-[420px] aspect-square flex items-center justify-center z-10"
            >
              <img
                src="/src/assets/auth-3d-illustration.png"
                alt="StudyVerse Educational 3D Illustration"
                className="w-full h-full object-contain drop-shadow-lg hover:scale-[1.015] transition-transform duration-300"
              />
            </motion.div>
          </div>

          {/* Bottom Branding Tagline */}
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Learn. Share. Grow.
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#64748B]">
              AI Powered Educational Social Platform
            </p>
          </div>

        </div>

        {/* RIGHT SECTION (48%) */}
        <div className="w-full lg:w-[48%] flex items-center justify-center">
          {children}
        </div>

      </div>
    </div>
  );
};
