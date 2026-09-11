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
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Track the active item (primary nav item or more dropdown)
  const isMoreActive = moreNavItems.some(item => location.pathname === item.href);
  const activeHref = isMoreActive 
    ? 'more' 
    : (primaryNavItems.find(item => location.pathname === item.href)?.href ?? null);

  // Target item for the sliding pill is either hovered item or active item
  const targetKey = hoveredHref !== null ? hoveredHref : activeHref;

  const updatePillPosition = (targetKeyToUse: string | null) => {
    if (!navContainerRef.current || !targetKeyToUse) {
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    const container = navContainerRef.current;
    const targetElement = container.querySelector<HTMLElement>(`[data-nav-key="${targetKeyToUse}"]`);
    if (targetElement) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      setPillStyle({
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
        opacity: 1,
      });
    } else {
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
    }
  };

  // Update pill position when active page, hover state, or resize occurs
  useEffect(() => {
    updatePillPosition(targetKey);
  }, [targetKey, location.pathname]);

  useEffect(() => {
    const handleResize = () => updatePillPosition(targetKey);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetKey]);

  const handleNavClick = (href: string) => {
    onLinkClick?.(href);
    setHoveredHref(null);
    setIsOpen(false);
    setDropdownOpen(false);

    // If already on this page or navigating via navbar, scroll to top
    if (location.pathname === href) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-elevation-sm border-b border-neutral-100'
            : 'bg-brand-burgundy text-white shadow-elevation-sm border-b border-brand-burgundy-dark/30'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo & Church Name */}
            <div className="flex items-center flex-1 min-w-0">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                <img
                  src={settings.logo || '/images/logo.png'}
                  alt={`${settings.church_name} Logo`}
                  className="w-11 h-11 rounded-full object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="hidden sm:block">
                  <p className={clsx(
                    'text-body-base font-bold tracking-wide transition-colors',
                    isScrolled ? 'text-neutral-900' : 'text-white'
                  )}>
                    {settings.church_name.toUpperCase()}
                  </p>
                  <p className={clsx(
                    'text-[10px] transition-colors tracking-widest uppercase font-bold',
                    isScrolled ? 'text-primary-red' : 'text-white/80'
                  )}>
                    CAMBODIA
                  </p>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Menu with Perfectly Symmetrical Sliding Pill Indicator */}
            <div className="hidden lg:flex justify-center flex-shrink-0">
              <div
                ref={navContainerRef}
                onMouseLeave={() => setHoveredHref(null)}
                className={clsx(
                  'relative flex items-center gap-1 p-1.5 rounded-full transition-colors',
                  isScrolled 
                    ? 'bg-neutral-100/70 border border-neutral-200/60' 
                    : 'bg-black/15 border border-white/15 backdrop-blur-sm'
                )}
              >
                {/* Animated Floating Pill Background */}
                <div
                  className={clsx(
                    'absolute top-1.5 bottom-1.5 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
                    isScrolled
                      ? 'bg-primary-red shadow-elevation-sm'
                      : 'bg-white shadow-sm'
                  )}
                  style={{
                    transform: `translateX(${pillStyle.left}px)`,
                    width: `${pillStyle.width}px`,
                    opacity: pillStyle.opacity,
                  }}
                />

                {primaryNavItems.map((item) => {
                  const isCurrentActive = location.pathname === item.href;
                  const isCurrentTarget = targetKey === item.href;
                  return (
                    <Link
                      key={item.href}
                      data-nav-key={item.href}
                      to={item.href}
                      onMouseEnter={() => setHoveredHref(item.href)}
                      onClick={() => handleNavClick(item.href)}
                      className={clsx(
                        'relative z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 select-none text-center',
                        isCurrentTarget
                          ? isScrolled
                            ? 'text-white font-bold'
                            : 'text-brand-burgundy font-bold'
                          : isScrolled
                            ? 'text-neutral-700 hover:text-primary-red'
                            : 'text-white/90 hover:text-white'
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
                    data-nav-key="more"
                    onMouseEnter={() => setHoveredHref('more')}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={clsx(
                      'relative z-10 pl-3.5 pr-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 flex items-center justify-center gap-1 select-none',
                      targetKey === 'more'
                        ? isScrolled
                          ? 'text-white font-bold'
                          : 'text-brand-burgundy font-bold'
                        : isScrolled
                          ? 'text-neutral-700 hover:text-primary-red'
                          : 'text-white/90 hover:text-white'
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
            </div>

            {/* Right: Actions & Mobile Menu (matches left flex-1 for true center alignment) */}
            <div className="flex items-center justify-end flex-1 gap-3">
              <Link to="/give" className="hidden sm:inline-flex">
                <Button 
                  variant={isScrolled ? "primary" : "default"} 
                  size="sm" 
                  className={clsx(
                    'shadow-elevation-sm font-bold',
                    !isScrolled && 'bg-white text-brand-burgundy border-0 hover:bg-neutral-100'
                  )}
                >
                  Give
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
                className={clsx(
                  'lg:hidden p-2 rounded-xl transition-colors',
                  isScrolled
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
