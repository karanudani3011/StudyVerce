import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Send, MessageCircle, Globe, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export const ShareCommunityModal = ({ community, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !community) return null;

  const shareUrl = `${window.location.origin}/communities/${community.id}`;
  const shareText = `Join "${community.name}" on StudyVerse! Connect, share study notes, and join live study lounges: ${shareUrl}`;

  const copyToClipboard = async () => {
    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        success = true;
      } else {
        // Fallback for HTTP / unsupported clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        textArea.remove();
      }
    } catch (err) {
      console.error('Copy fallback error:', err);
    }

    setCopied(true);
    showToast('Community share link copied to clipboard! 🔗', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: community.name,
          text: `Join ${community.name} on StudyVerse!`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#EDF2F7] bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-white border border-[#E2E8F0] flex items-center justify-center text-xl shadow-sm">
                {community.icon}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1E293B]">Share Community</h3>
                <p className="text-xs text-[#64748B]">{community.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Direct Copy Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-[#F5F7FB] border border-[#E2E8F0] rounded-[14px] px-3.5 py-2.5 text-xs text-[#1E293B] font-mono outline-none"
                />
                <Button
                  type="button"
                  variant={copied ? "success" : "primary"}
                  onClick={copyToClipboard}
                  icon={copied ? Check : Copy}
                  className="shrink-0 px-4 text-xs"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Quick Social Share Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Share directly to
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodedText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[14px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[14px] bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold transition-all"
                >
                  <Send className="w-4 h-4 text-sky-600" /> Telegram
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodedText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[14px] bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all"
                >
                  <Globe className="w-4 h-4 text-slate-700" /> Twitter / X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[14px] bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Mobile / System Native Share if available */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                type="button"
                variant="outline"
                fullWidth
                icon={Share2}
                onClick={handleNativeShare}
                className="text-xs"
              >
                Share via Apps (System Menu)
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
