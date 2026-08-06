import React from 'react';
import { Link } from 'react-router-dom';

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  color = 'text-[#C8102E] bg-red-50' 
}) => {
  return (
    <Link 
      to={href}
      className="block group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-900 group-hover:text-[#1E366D] transition-colors">{title}</h4>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{description}</p>
        </div>
      </div>
    </Link>
  );
};
