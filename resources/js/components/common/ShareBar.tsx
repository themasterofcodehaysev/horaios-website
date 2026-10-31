import React, { useState, useEffect, useCallback } from 'react';
import {
  Share2,
  Copy,
  Check,
  MoreHorizontal,
  X,
  Mail,
  Smartphone,
} from 'lucide-react';
import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsAppIcon,
  LinkedinIcon,
} from './SocialIcons';

export interface ShareBarProps {
  title: string;
  description?: string;
  url?: string;
  label?: string;
  className?: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({
  title,
  description,
  url,
  label = 'Share This Page',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTargetUrl = useCallback(() => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, [url]);

  const copyToClipboard = useCallback(async (onSuccess: () => void) => {
    const targetUrl = getTargetUrl();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = targetUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      onSuccess();
    } catch {
      prompt('Copy link to clipboard:', targetUrl);
    }
  }, [getTargetUrl]);

  const handleCopyLink = useCallback(() => {
    copyToClipboard(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, [copyToClipboard]);

  const handleModalCopyLink = useCallback(() => {
    copyToClipboard(() => {
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 2200);
    });
  }, [copyToClipboard]);

  const handleNativeShare = useCallback(async () => {
    const targetUrl = getTargetUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: targetUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleModalCopyLink();
        }
      }
    } else {
      handleModalCopyLink();
    }
  }, [title, description, getTargetUrl, handleModalCopyLink]);

  // Handle ESC key and scroll-lock for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const targetUrl = getTargetUrl();
  const encodedUrl = encodeURIComponent(targetUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedMessage = encodeURIComponent(description ? `${title} - ${description}` : title);
  const emailHref = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
    `${title}\n\n${description ? `${description}\n\n` : ''}${targetUrl}`
  )}`;

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // Primary channels displayed inline
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsAppHref = `https://api.whatsapp.com/send?text=${encodedMessage}%20${encodedUrl}`;

  // All modal channels
  const allShareDestinations = [
    {
      name: 'Facebook',
      href: facebookHref,
      icon: FacebookIcon,
      bg: 'bg-[#1877F2]',
      color: 'text-[#1877F2]',
    },
    {
      name: 'WhatsApp',
      href: whatsAppHref,
      icon: WhatsAppIcon,
      bg: 'bg-[#25D366]',
      color: 'text-[#25D366]',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      icon: TelegramIcon,
      bg: 'bg-[#24A1DE]',
      color: 'text-[#24A1DE]',
    },
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: TwitterIcon,
      bg: 'bg-neutral-900',
      color: 'text-neutral-900',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedinIcon,
      bg: 'bg-[#0A66C2]',
      color: 'text-[#0A66C2]',
    },
    {
      name: 'Email',
      href: emailHref,
      icon: Mail,
      bg: 'bg-neutral-700',
      color: 'text-neutral-700',
    },
  ];

  return (
    <>
      {/* Inline Share Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-neutral-200/90 shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-2 text-body-xs font-bold text-neutral-700 uppercase tracking-wider">
          <Share2 className="w-4 h-4 text-primary-red" />
          <span>{label}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Facebook */}
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-xs font-semibold shadow-xs transition-all bg-[#1877F2] hover:bg-[#166fe5] text-white"
            title="Share on Facebook"
          >
            <FacebookIcon className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </a>

          {/* 2. WhatsApp */}
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-xs font-semibold shadow-xs transition-all bg-[#25D366] hover:bg-[#20ba5a] text-white"
            title="Share on WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* 3. Copy Link */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-100 transition-colors shadow-xs"
            title="Copy link to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 animate-scale-in" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-neutral-500" />
            )}
            <span className={copied ? 'text-emerald-700 font-bold' : ''}>
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>

          {/* 4. More Options Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-200/80 hover:bg-neutral-300 text-neutral-800 rounded-lg text-body-xs font-semibold transition-colors shadow-xs"
            title="More sharing options"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-red/10 flex items-center justify-center text-primary-red">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="share-modal-title" className="text-h5 font-bold text-neutral-900">
                    Share
                  </h3>
                  <p className="text-[11px] text-neutral-500">Choose how you'd like to share this</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close share dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Preview Box */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <h4 className="text-body-sm font-bold text-neutral-900 line-clamp-1">
                  {title}
                </h4>
                {description && (
                  <p className="text-body-xs text-neutral-500 line-clamp-2 mt-0.5">
                    {description}
                  </p>
                )}
                <p className="text-[11px] font-mono text-neutral-400 truncate mt-1.5">
                  {targetUrl}
                </p>
              </div>

              {/* Copy Link Input Field */}
              <div className="space-y-1.5">
                <label className="text-body-xs font-semibold text-neutral-600 block">
                  Page Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={targetUrl}
                    className="flex-1 px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-body-xs font-mono text-neutral-700 select-all focus:outline-none"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={handleModalCopyLink}
                    className="px-4 py-2 bg-primary-navy hover:bg-primary-dark-navy text-white text-body-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                  >
                    {modalCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{modalCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Share Channels Grid */}
              <div className="space-y-2">
                <label className="text-body-xs font-semibold text-neutral-600 block">
                  Share To
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {allShareDestinations.map((dest) => {
                    const Icon = dest.icon;
                    return (
                      <a
                        key={dest.name}
                        href={dest.href}
                        target={dest.name === 'Email' ? undefined : '_blank'}
                        rel={dest.name === 'Email' ? undefined : 'noopener noreferrer'}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/80 transition-all group"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${dest.bg} text-white flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-105 transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium text-neutral-700 text-center truncate max-w-full">
                          {dest.name}
                        </span>
                      </a>
                    );
                  })}

                  {/* Device Native Share option in modal if available */}
                  {hasNativeShare && (
                    <button
                      onClick={handleNativeShare}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/80 transition-all group text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary-navy text-white flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-105 transition-transform">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-neutral-700 text-center truncate max-w-full">
                        Device Apps
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 text-body-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareBar;
