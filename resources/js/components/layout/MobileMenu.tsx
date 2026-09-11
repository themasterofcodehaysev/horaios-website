import React, { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ChevronDown, LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  primaryNavItems: NavItem[];
  moreNavItems: NavItem[];
  currentPath: string;
  onNavClick: (href: string) => void;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  primaryNavItems,
  moreNavItems,
  currentPath,
  onNavClick,
  onClose,
}) => {
  const [moreExpanded, setMoreExpanded] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-20 z-30 bg-white/98 backdrop-blur-md lg:hidden overflow-y-auto shadow-elevation-lg border-t border-neutral-100 animate-fade-in">
      <div className="px-5 py-6 space-y-3 max-w-lg mx-auto">
        {/* Primary Links */}
        <div className="space-y-1">
          {primaryNavItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => onNavClick(item.href)}
                className={clsx(
                  'block px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors',
                  isActive
                    ? 'bg-primary-red text-white shadow-elevation-sm'
                    : 'text-neutral-800 hover:bg-neutral-100 hover:text-primary-red'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* More Links Accordion / Section */}
        <div className="pt-3 border-t border-neutral-100">
          <button
            onClick={() => setMoreExpanded(!moreExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
          >
            <span>More Links</span>
            <ChevronDown className={clsx('w-4 h-4 transition-transform duration-200', moreExpanded && 'rotate-180')} />
          </button>

          {moreExpanded && (
            <div className="mt-2 space-y-1 pl-2">
              {moreNavItems.map((item) => {
                const isActive = currentPath === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => onNavClick(item.href)}
                    className={clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-red text-white shadow-elevation-sm'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-red'
                    )}
                  >
                    {Icon && (
                      <div className={clsx(
                        'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs',
                        isActive ? 'bg-white/20 text-white' : 'bg-primary-red/10 text-primary-red'
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold block text-xs sm:text-sm">{item.label}</span>
                      {item.description && (
                        <span className={clsx('text-[11px] block', isActive ? 'text-white/80' : 'text-neutral-500')}>
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Give Action */}
        <div className="pt-4">
          <Link to="/give" onClick={onClose} className="block">
            <Button variant="primary" size="lg" fullWidth className="shadow-elevation-sm">
              Give Online
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
