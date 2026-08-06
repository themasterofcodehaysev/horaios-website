import React from 'react';

export interface SkeletonLoaderProps {
  type: 'card' | 'table' | 'form' | 'text';
  rows?: number;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type, 
  rows = 3, 
  count = 1 
}) => {
  const renderItem = () => {
    switch (type) {
      case 'card':
        return (
          <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-1/2">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
          </div>
        );
        
      case 'table':
        return (
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-12 bg-gray-50 border-b border-gray-200 animate-pulse"></div>
            <div className="divide-y divide-gray-100">
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex p-4 space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-6">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse border border-gray-200"></div>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div 
                key={i} 
                className={`h-4 bg-gray-200 rounded animate-pulse ${
                  i === rows - 1 ? 'w-2/3' : 'w-full'
                }`}
              ></div>
            ))}
          </div>
        );
    }
  };

  if (count > 1) {
    return (
      <div className={`grid gap-4 ${type === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {Array.from({ length: count }).map((_, i) => (
          <React.Fragment key={i}>{renderItem()}</React.Fragment>
        ))}
      </div>
    );
  }

  return renderItem();
};
