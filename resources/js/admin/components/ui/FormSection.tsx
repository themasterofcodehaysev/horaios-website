import React from 'react';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};
