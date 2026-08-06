import React from 'react';

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'locked' | 'draft' | 'published' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normalizedStatus = status.toLowerCase();
  
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let dotColor = 'bg-gray-400';

  switch (normalizedStatus) {
    case 'active':
    case 'published':
      bgColor = 'bg-emerald-50';
      textColor = 'text-emerald-700';
      dotColor = 'bg-emerald-500';
      break;
    case 'inactive':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-600';
      dotColor = 'bg-gray-400';
      break;
    case 'locked':
      bgColor = 'bg-red-50';
      textColor = 'text-red-700';
      dotColor = 'bg-red-500';
      break;
    case 'draft':
      bgColor = 'bg-amber-50';
      textColor = 'text-amber-700';
      dotColor = 'bg-amber-500';
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${bgColor} ${textColor} ${padding}`}>
      <span className={`rounded-full mr-1.5 ${dotColor} ${dotSize}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};
