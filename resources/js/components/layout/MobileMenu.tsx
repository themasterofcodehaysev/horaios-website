import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  currentPath: string;
  onNavClick: (href: string) => void;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  currentPath,
  onNavClick,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-20 z-30 bg-white lg:hidden">
      <div className="px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => onNavClick(item.href)}
            className={clsx(
              'block px-4 py-3 rounded-md font-medium transition-colors',
              currentPath === item.href
                ? 'bg-neutral-100 text-primary-red font-bold'
                : 'text-neutral-700 hover:bg-neutral-100'
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link to="/give" onClick={onClose} className="block mt-4">
          <Button variant="primary" fullWidth>
            Give
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
