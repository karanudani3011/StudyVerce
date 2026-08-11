import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  floating = false,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-[#94A3B8] pointer-events-none">
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full rounded-[14px] bg-[#F5F7FB] border ${
            error ? 'border-[#EF4444]' : 'border-transparent focus:border-[#4F7DF6]'
          } ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-11' : 'pr-4'} py-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-[#94A3B8] hover:text-[#1E293B] focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{error}</p>}
    </div>
  );
};
