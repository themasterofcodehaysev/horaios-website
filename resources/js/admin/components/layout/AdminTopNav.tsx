import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, User, KeyRound, LogOut, X, Moon, Sun, Globe, Check, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { searchService } from '../../services/search.service';
import { notificationService } from '../../services/notification.service';
import type { AuthUser, SearchResult } from '../../types';
import type { Notification } from '../types';

type Language = 'en' | 'km';

const LANGUAGES: Record<Language, string> = {
  en: 'English',
  km: 'ភាសាខ្មែរ',
};

interface AdminTopNavProps {
  user: AuthUser | null;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({ user, onLogout, onOpenMobileSidebar, darkMode = false, onToggleDarkMode }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('admin_language') as Language) || 'en');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleDarkMode = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      const next = !darkMode;
      localStorage.setItem('admin_theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
    }
  };

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await notificationService.getNotifications(5);
      setNotifications(data.data || []);
      const stats = await notificationService.getUnreadCount();
      setUnreadCount(stats.unread_count || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      const stats = await notificationService.getUnreadCount();
      setUnreadCount(stats.unread_count || 0);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('admin_language', lang);
    setLangOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (notificationOpen) {
      loadNotifications();
    }
  }, [notificationOpen]);

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    setSearching(true);
    try {
      const results = await searchService.globalSearch(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    <header className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 border-b ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-neutral-200'}`}>
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
        <div className="relative" ref={searchRef}>
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
            title="Global Search"
          >
            <Search size={20} />
          </button>
          
          {searchOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl p-3 shadow-lg ring-1 ring-black ring-opacity-5 z-50 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-neutral-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search everything..."
                  className={`w-full pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-neutral-300'}`}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className={`w-4 h-4 ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-neutral-400 hover:text-neutral-600'}`} />
                  </button>
                )}
              </div>
              {searching && (
                <div className="mt-2 text-center text-xs text-neutral-500">Searching...</div>
              )}
              {searchResults && !searching && (
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {Object.entries(searchResults).map(([type, items]) => {
                    const typedItems = items as Array<{ id: number; title?: string; subject?: string; name?: string }>;
                    if (typedItems.length === 0) return null;
                    
                    return (
                      <div key={type} className="mb-2">
                        <div className="text-xs font-semibold text-neutral-500 uppercase mb-1">{type}</div>
                        {typedItems.map((item) => (
                          <div key={item.id} className="px-2 py-1 hover:bg-neutral-50 rounded text-sm text-neutral-700">
                            {item.title || item.subject || item.name}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {Object.values(searchResults).every(arr => (arr as unknown[]).length === 0) && (
                    <div className="text-center text-sm text-neutral-500 py-4">No results found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
            title="Language"
          >
            <Globe size={20} />
          </button>
          {langOpen && (
            <div className={`absolute right-0 mt-2 w-40 rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => selectLanguage(lang)}
                  className={`flex w-full items-center px-4 py-2 text-sm text-left hover:bg-neutral-50 ${
                    language === lang ? 'text-primary-red font-medium' : 'text-neutral-700'
                  } ${darkMode ? 'hover:bg-slate-700 text-slate-200' : ''}`}
                >
                  {LANGUAGES[lang]}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-neutral-500 hover:bg-neutral-100'}`}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className={`relative p-2 rounded-full transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-neutral-500 hover:bg-neutral-100'}`}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-red ring-2 ring-white" />
            )}
          </button>

          {notificationOpen && (
            <div className={`absolute right-0 mt-2 w-96 rounded-xl p-4 shadow-lg ring-1 ring-black ring-opacity-5 z-50 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-neutral-900'}`}>Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary-red hover:text-primary-light-red transition-colors font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {loadingNotifications ? (
                <div className="text-center py-4 text-sm text-neutral-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-4 text-sm text-neutral-500">No notifications</div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.read_at || notification.is_read
                          ? darkMode
                            ? 'bg-slate-700/50 border-slate-600'
                            : 'bg-neutral-50 border-neutral-200'
                          : darkMode
                            ? 'bg-slate-700 border-slate-600'
                            : 'bg-white border-neutral-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-neutral-900'}`}>
                            {notification.title}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-neutral-400'}`}>
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!(notification.read_at || notification.is_read) && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-neutral-400 hover:text-primary-red transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotificationOpen(false)}
                  className="block text-center text-sm text-primary-red hover:text-primary-light-red font-medium transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

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
            <div className={`absolute right-0 mt-2 w-52 rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className={`px-4 py-2 text-sm border-b ${darkMode ? 'text-slate-200 border-slate-700' : 'text-neutral-900 border-neutral-100'}`}>
                <p className="font-medium truncate">{displayName}</p>
                <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>{user?.email}</p>
                <p className="text-xs font-semibold text-primary-red mt-0.5">{user?.role?.display_name || user?.role?.name}</p>
              </div>
              <Link
                to="/admin/account"
                onClick={() => setProfileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50 ${darkMode ? 'text-slate-200 hover:bg-slate-700' : 'text-neutral-700 hover:bg-neutral-50'}`}
              >
                <User size={16} /> Account Settings
              </Link>
              <Link
                to="/admin/account"
                onClick={() => setProfileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50 ${darkMode ? 'text-slate-200 hover:bg-slate-700' : 'text-neutral-700 hover:bg-neutral-50'}`}
              >
                <KeyRound size={16} /> Change Password
              </Link>
              <div className={`my-1 border-t ${darkMode ? 'border-slate-700' : 'border-neutral-100'}`} />
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
