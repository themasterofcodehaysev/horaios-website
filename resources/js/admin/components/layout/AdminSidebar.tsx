import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Music,
  BookOpen,
  FileText,
  Calendar,
  Heart,
  MessageCircleHeart,
  Mail,
  Users,
  Shield,
  Settings,
  ScrollText,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  X,
  LifeBuoy,
  Clock,
  HandHeart,
  Ticket,
} from 'lucide-react';

import { useLanguage } from '../../../context/LanguageContext';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  darkMode?: boolean;
}

interface NavItemDef {
  key: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

interface NavGroupDef {
  key: string;
  label: string;
  items: NavItemDef[];
}

const navGroups: NavGroupDef[] = [
  {
    key: 'admin.main',
    label: 'MAIN',
    items: [
      { key: 'admin.dashboard', name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    key: 'admin.content',
    label: 'CONTENT',
    items: [
      { key: 'admin.songs', name: 'Songs', path: '/admin/songs', icon: Music },
      { key: 'admin.sermons', name: 'Sermons', path: '/admin/sermons', icon: BookOpen },
      { key: 'admin.news', name: 'News', path: '/admin/news', icon: FileText },
      { key: 'admin.events', name: 'Events', path: '/admin/events', icon: Calendar },
      { key: 'admin.ministries', name: 'Ministries', path: '/admin/ministries', icon: Heart },
      { key: 'admin.leadership', name: 'Leadership Team', path: '/admin/leadership', icon: Users },
      { key: 'admin.services', name: 'Church Services', path: '/admin/services', icon: Clock },
    ],
  },
  {
    key: 'admin.communication',
    label: 'COMMUNICATION',
    items: [
      { key: 'admin.prayer_requests', name: 'Prayer Requests', path: '/admin/prayer-requests', icon: MessageCircleHeart },
      { key: 'admin.contact_messages', name: 'Contact Messages', path: '/admin/contact-messages', icon: Mail },
      { key: 'admin.ministry_requests', name: 'Ministry Requests', path: '/admin/ministries/join-requests', icon: HandHeart },
      { key: 'admin.event_registrations', name: 'Event Registrations', path: '/admin/events/registrations', icon: Ticket },
    ],
  },
  {
    key: 'admin.management',
    label: 'MANAGEMENT',
    items: [
      { key: 'admin.users', name: 'Users', path: '/admin/users', icon: Users },
      { key: 'admin.roles', name: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
      { key: 'admin.settings', name: 'Church Settings', path: '/admin/settings', icon: Settings },
      { key: 'admin.audit_logs', name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
    ],
  },
  {
    key: 'admin.account',
    label: 'ACCOUNT',
    items: [
      { key: 'admin.notifications', name: 'Notifications', path: '/admin/notifications', icon: Bell },
      { key: 'admin.support', name: 'Support', path: '/admin/support', icon: LifeBuoy },
    ],
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  darkMode = false
}) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r transition-all duration-300 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-neutral-200'
        } ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className={`flex items-center justify-between h-16 px-4 border-b ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/images/logo.png" alt={t('admin_ui.logo', 'Logo')} className="w-8 h-8 object-contain flex-shrink-0" />
            {!collapsed && (
              <span className={`font-semibold truncate ${darkMode ? 'text-slate-200' : 'text-neutral-900'}`}>Horaios Admin</span>
            )}
          </div>
          <button
            onClick={onCloseMobile}
            className={`p-1 rounded-md lg:hidden ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-neutral-500 hover:bg-neutral-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-neutral-200">
          {navGroups.map((group, index) => (
            <div key={index} className="mb-6">
              {!collapsed && (
                <h3 className={`px-6 mb-2 text-xs font-semibold tracking-wider ${darkMode ? 'text-slate-500' : 'text-neutral-400'}`}>
                  {t(group.key, group.label)}
                </h3>
              )}
              <ul className="space-y-1 px-3">
                {group.items.map((item) => {
                  const itemName = t(item.key, item.name);
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.exact}
                        onClick={() => { if (window.innerWidth < 1024) onCloseMobile(); }}
                        className={({ isActive }) =>
                          `group flex items-center px-3 py-2.5 rounded-md transition-colors relative ${
                            isActive
                              ? 'bg-primary-red/10 text-primary-red font-medium'
                              : darkMode
                                ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                          }`
                        }
                        title={collapsed ? itemName : undefined}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-red rounded-r-md" />
                            )}
                            <item.icon size={20} className={`flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                            {!collapsed && <span className="truncate">{itemName}</span>}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
          <button
            onClick={onToggleCollapse}
            className={`flex w-full items-center justify-center p-2 rounded-md transition-colors hidden lg:flex ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-neutral-500 hover:bg-neutral-100'}`}
            title={collapsed ? t('admin_ui.expand_sidebar', 'Expand sidebar') : t('admin_ui.collapse_sidebar', 'Collapse sidebar')}
          >
            {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};
