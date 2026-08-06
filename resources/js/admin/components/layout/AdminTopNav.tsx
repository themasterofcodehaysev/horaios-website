import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { AuthUser } from '../../types';

interface AdminTopNavProps {
  user: AuthUser | null;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({ user, onLogout, onOpenMobileSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple breadcrumb generator
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p && p !== 'admin');
    if (paths.length === 0) return [{ name: 'Dashboard', path: '/admin' }];
    
    return [
      { name: 'Dashboard', path: '/admin' },
      ...paths.map((p, i) => ({
        name: p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' '),
        path: '/admin/' + paths.slice(0, i + 1).join('/')
      }))
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const displayName = user?.display_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Admin User';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white border-b border-neutral-200 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 text-neutral-500 hover:bg-neutral-100 rounded-md lg:hidden"
        >
          <Menu size={20} />
        </button>

        <nav className="hidden sm:flex text-sm text-neutral-500 font-medium">
          <ol className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <li>
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-neutral-900 font-semibold">{crumb.name}</span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-primary-red transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </li>
                {index < breadcrumbs.length - 1 && <li className="text-neutral-300">/</li>}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors" title="Global Search">
          <Search size={20} />
        </button>
        
        <button className="relative p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors" title="Notifications">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-red ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-neutral-200 mx-1 hidden sm:block" />

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1 pr-2 hover:bg-neutral-50 rounded-full transition-colors border border-transparent focus:border-neutral-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-blue text-white text-xs font-semibold">
              {getInitials(displayName)}
            </div>
            <span className="hidden sm:block text-sm font-medium text-neutral-700">
              {displayName}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-4 py-2 text-sm text-neutral-900 border-b border-neutral-100">
                <p className="font-medium truncate">{displayName}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                <p className="text-xs font-semibold text-primary-red mt-0.5">{user?.role?.display_name || user?.role?.name}</p>
              </div>
              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <User size={16} /> Profile
              </Link>
              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <Settings size={16} /> Account Settings
              </Link>
              <div className="my-1 border-t border-neutral-100" />
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
