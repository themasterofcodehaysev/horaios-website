import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = 'Something went wrong', 
  message = 'An error occurred while loading this content. Please try again.', 
  onRetry 
}) => {
  return (
    <div className="rounded-lg bg-red-50 p-6 border border-red-100 flex flex-col items-center justify-center text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
      <h3 className="text-lg font-medium text-red-800 mb-2">{title}</h3>
      <div className="text-sm text-red-600 mb-6 max-w-md">
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
};
