import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-sky-500" />
};

const backgrounds = {
  success: 'bg-white border-l-4 border-emerald-500',
  error: 'bg-white border-l-4 border-red-500',
  warning: 'bg-white border-l-4 border-amber-500',
  info: 'bg-white border-l-4 border-sky-500'
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-0 right-0 p-6 space-y-4 z-50 pointer-events-none flex flex-col items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all duration-300 ease-in-out ${backgrounds[toast.type]} animate-in slide-in-from-bottom-5`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {icons[toast.type]}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{toast.title}</p>
                {toast.message && (
                  <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                )}
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E366D] focus:ring-offset-2"
                  onClick={() => onRemove(toast.id)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
