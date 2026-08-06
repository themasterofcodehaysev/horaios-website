import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  href?: string;
  color?: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'gray';
}

const colorStyles = {
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  gray: 'bg-gray-100 text-gray-600',
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, href, color = 'blue' }) => {
  const CardContent = (
    <div className={`p-6 rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 ${href ? 'hover:shadow-md hover:-translate-y-0.5' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {trend.value}%
          </span>
          <span className="ml-2 text-gray-500">{trend.label}</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link to={href} className="block">{CardContent}</Link>;
  }

  return CardContent;
};
