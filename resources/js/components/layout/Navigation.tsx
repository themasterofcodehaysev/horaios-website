import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  Calendar, 
  Newspaper, 
  Heart, 
  MapPin, 
  Gift, 
  Mail,
  LucideIcon 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MobileMenu, type NavItem } from './MobileMenu';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface NavigationProps {
  onLinkClick?: (href: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when location changes
  useEffect(() => {
    setDropdownOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const primaryNavItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Songs', href: '/songs' },
  ];

  const moreNavItems: NavItem[] = [
    { label: 'Events', href: '/events', icon: Calendar, description: 'Upcoming gatherings & services' },
    { label: 'News', href: '/news', icon: Newspaper, description: 'Church articles & announcements' },
    { label: 'Prayer Request', href: '/prayer', icon: Heart, description: 'Submit prayer needs to pastoral team' },
    { label: 'Visit', href: '/visit', icon: MapPin, description: 'Service times & directions' },
    { label: 'Give', href: '/give', icon: Gift, description: 'Tithe & offering stewardship' },
    { label: 'Contact', href: '/contact', icon: Mail, description: 'Reach our church office' },
  ];

  const isMoreActive = moreNavItems.some(item => location.pathname === item.href);

  const handleNavClick = (href: string) => {
    onLinkClick?.(href);
    setIsOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled || location.pathname !== '/'
            ? 'bg-white/95 backdrop-blur-md shadow-elevation-sm border-b border-neutral-100'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <img
                src={settings.logo || '/images/logo.png'}
                alt={`${settings.church_name} Logo`}
                className="w-11 h-11 rounded-full object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <p className={clsx(
                  'text-body-base font-bold tracking-wide transition-colors',
                  isScrolled || location.pathname !== '/' ? 'text-neutral-900' : 'text-white'
                )}>
                  {settings.church_name.toUpperCase()}
                </p>
                <p className={clsx(
                  'text-[10px] transition-colors tracking-widest uppercase font-bold',
                  isScrolled || location.pathname !== '/' ? 'text-primary-red' : 'text-white/90'
                )}>
                  CAMBODIA
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 bg-neutral-100/60 p-1.5 rounded-full border border-neutral-200/50">
              {primaryNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200',
                      isActive
                        ? 'bg-primary-red text-white shadow-elevation-sm'
                        : 'text-neutral-700 hover:text-primary-red hover:bg-white/80'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* More Links Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={clsx(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1',
                    isMoreActive
                      ? 'bg-primary-red text-white shadow-elevation-sm'
                      : dropdownOpen
                        ? 'bg-white text-primary-red shadow-xs'
                        : 'text-neutral-700 hover:text-primary-red hover:bg-white/80'
                  )}
                  aria-expanded={dropdownOpen}
                >
                  <span>More Links</span>
                  <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-elevation-lg border border-neutral-200/80 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400 border-b border-neutral-100 mb-1">
                      Explore Church Pages
                    </div>
                    <div className="space-y-1">
                      {moreNavItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={clsx(
                              'flex items-start gap-3 p-2.5 rounded-xl transition-colors group',
                              isActive
                                ? 'bg-primary-red/10 text-primary-red font-semibold'
                                : 'text-neutral-800 hover:bg-neutral-50 hover:text-primary-red'
                            )}
                          >
                            {Icon && (
                              <div className={clsx(
                                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors mt-0.5',
                                isActive 
                                  ? 'bg-primary-red text-white' 
                                  : 'bg-neutral-100 text-neutral-600 group-hover:bg-primary-red/10 group-hover:text-primary-red'
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold leading-tight">
                                {item.label}
                              </span>
                              {item.description && (
                                <span className="block text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link to="/give" className="hidden sm:inline-flex">
                <Button variant="primary" size="sm" className="shadow-elevation-sm">
                  Give
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
                className={clsx(
                  'lg:hidden p-2 rounded-xl transition-colors',
                  isScrolled || location.pathname !== '/'
                    ? 'text-neutral-700 hover:bg-neutral-100'
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
        primaryNavItems={primaryNavItems}
        moreNavItems={moreNavItems}
        currentPath={location.pathname}
        onNavClick={handleNavClick}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Navigation;
