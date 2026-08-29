import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-body-sm text-neutral-600 ${className}`}>
      <a href="/" className="flex items-center hover:text-primary-red transition-colors">
        <Home className="w-4 h-4" />
      </a>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          {item.href ? (
            <a href={item.href} className="hover:text-primary-red font-medium transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-neutral-900" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
