import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
}) => {
  if (!isOpen) return null;

  const isDanger = confirmVariant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 overflow-hidden transform transition-all">
        <div className="flex items-start">
          {isDanger && (
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mr-4">
              <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
          )}
          <div className={`mt-3 text-center sm:mt-0 ${isDanger ? 'sm:text-left' : 'w-full'}`}>
            <h3 className={`text-lg font-medium leading-6 text-gray-900 ${!isDanger && 'text-center mb-2'}`}>
              {title}
            </h3>
            <div className="mt-2">
              <p className={`text-sm text-gray-500 ${!isDanger && 'text-center'}`}>
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E366D] focus:ring-offset-2 sm:text-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-[#1E366D] hover:bg-[#15264d] focus:ring-[#1E366D]'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
