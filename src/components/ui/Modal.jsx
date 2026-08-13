import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1E293B]/20 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className={`relative w-full ${maxWidth} max-h-[85vh] bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#E2E8F0] z-10 flex flex-col`}
          >
            {title && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EDF2F7] shrink-0">
                <h3 className="text-lg font-bold text-[#1E293B]">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] rounded-full hover:bg-[#F5F7FB] transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            )}

            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-[#94A3B8] hover:text-[#1E293B] rounded-full hover:bg-[#F5F7FB] transition-colors z-20"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            )}

            <div className="flex-1 overflow-y-auto pr-1 min-h-0 scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
