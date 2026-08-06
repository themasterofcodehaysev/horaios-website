import React from 'react';

export interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, description }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
};
