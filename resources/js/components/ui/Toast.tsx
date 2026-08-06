import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  variant?: ToastVariant;
  title: string;
  message?: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  return (
    <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-elevation-lg border border-neutral-200 min-w-[300px] max-w-md animate-slide-in">
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className="font-semibold text-body-sm text-neutral-900">{title}</p>
        {message && <p className="text-body-xs text-neutral-600 mt-1">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
