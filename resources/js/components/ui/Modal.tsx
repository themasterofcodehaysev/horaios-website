import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return 'max-w-sm';
    case 'lg':
      return 'max-w-2xl';
    case 'xl':
      return 'max-w-4xl';
    default:
      return 'max-w-lg';
  }
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeButton = true,
  size = 'md',
  className,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-base"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={clsx(
            'bg-white rounded-lg shadow-xl w-full',
            getSizeStyles(size),
            'animate-scale-in',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              {title && <h2 className="text-h4 font-semibold text-neutral-900">{title}</h2>}
              {closeButton && (
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex gap-3 p-6 border-t border-neutral-200 justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
