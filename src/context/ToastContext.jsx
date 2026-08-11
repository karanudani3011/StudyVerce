import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;
  const colors = {
    success: 'bg-white border-l-4 border-[#22C55E] text-[#1E293B]',
    error: 'bg-white border-l-4 border-[#EF4444] text-[#1E293B]',
    info: 'bg-white border-l-4 border-[#4F7DF6] text-[#1E293B]',
    warning: 'bg-white border-l-4 border-[#F59E0B] text-[#1E293B]',
  };
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`${colors[toast.type]} flex items-center gap-3 px-4 py-3 rounded-[14px] shadow-lg min-w-[280px] max-w-sm animate-fade-in`}>
          <span className="text-sm font-bold">{icons[toast.type]}</span>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-[#94A3B8] hover:text-[#1E293B] text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
