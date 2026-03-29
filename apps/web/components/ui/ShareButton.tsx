'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  title: string;
  url?: string;
  description?: string;
}

export default function ShareButton({ title, url, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = description ? `${title} - ${description}` : title;

  useEffect(() => {
    setSupportsNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setIsOpen(false);
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: description || title,
        url: shareUrl,
      });
    } catch {
      // User cancelled or error
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4A5D3A]/10 hover:bg-[#4A5D3A]/20 text-[#4A5D3A] transition-colors duration-200"
        aria-label="مشاركة"
      >
        <Share2 className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 rtl:left-auto rtl:right-0 top-full mt-2 z-50 min-w-[200px] rounded-xl bg-[#2D2D2D]/95 backdrop-blur-md border border-[#4A5D3A]/30 shadow-xl overflow-hidden"
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white hover:bg-[#4A5D3A]/40 transition-colors duration-150 text-sm"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span>واتساب</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={handleTwitter}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white hover:bg-[#4A5D3A]/40 transition-colors duration-150 text-sm"
              >
                <X className="w-4 h-4 text-sky-400" />
                <span>تويتر / X</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white hover:bg-[#4A5D3A]/40 transition-colors duration-150 text-sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-[#D4A574]" />
                )}
                <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>

              {/* Native Share */}
              {supportsNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white hover:bg-[#4A5D3A]/40 transition-colors duration-150 text-sm"
                >
                  <Share2 className="w-4 h-4 text-[#E8CDB0]" />
                  <span>مشاركة أخرى</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
