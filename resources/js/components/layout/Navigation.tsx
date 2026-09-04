import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Menu, X, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MobileMenu } from './MobileMenu';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface NavigationProps {
  onLinkClick?: (href: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Songs', href: '/songs' },
    { label: 'Events', href: '/events' },
    { label: 'News', href: '/news' },
    { label: 'Visit', href: '/visit' },
  ];

  const handleNavClick = (href: string) => {
    onLinkClick?.(href);
    setIsOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-base',
          isScrolled || location.pathname !== '/'
            ? 'bg-white shadow-elevation-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img
                src={settings.logo || '/images/logo.png'}
                alt={`${settings.church_name} Logo`}
                className="w-12 h-12 rounded-full object-contain drop-shadow-md"
              />
              <div className="hidden sm:block">
                <p className={clsx(
                  'text-body-base font-bold tracking-wide transition-colors',
                  isScrolled || location.pathname !== '/' ? 'text-neutral-900' : 'text-white'
                )}>
                  {settings.church_name.toUpperCase()}
                </p>
                <p className={clsx(
                  'text-label-sm transition-colors tracking-widest uppercase font-semibold',
                  isScrolled || location.pathname !== '/' ? 'text-primary-red' : 'text-white/90'
                )}>
                  CAMBODIA
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={clsx(
                      'px-4 py-2 rounded-md text-body-sm font-medium transition-colors',
                      isScrolled || location.pathname !== '/'
                        ? isActive
                          ? 'bg-neutral-100 text-primary-red font-bold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                        : isActive
                          ? 'bg-white/20 text-white font-bold'
                          : 'text-white hover:bg-white/10'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button className={clsx(
                'p-2 rounded-md transition-colors',
                isScrolled || location.pathname !== '/'
                  ? 'text-neutral-600 hover:bg-neutral-100'
                  : 'text-white hover:bg-white/10'
              )}>
                <Search className="w-5 h-5" />
              </button>

              <Link to="/give" className="hidden sm:inline-flex">
                <Button variant="primary" size="sm">
                  Give
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                  'lg:hidden p-2 rounded-md transition-colors',
                  isScrolled || location.pathname !== '/'
                    ? 'text-neutral-600 hover:bg-neutral-100'
                    : 'text-white hover:bg-white/10'
                )}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isOpen}
        navItems={navItems}
        currentPath={location.pathname}
        onNavClick={handleNavClick}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Navigation;
