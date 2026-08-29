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
  Image as ImageIcon,
  Users,
  Shield,
  Settings,
  ScrollText,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  X,
  LifeBuoy
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  darkMode?: boolean;
}

interface NavItemDef {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

interface NavGroupDef {
  label: string;
  items: NavItemDef[];
}

const navGroups: NavGroupDef[] = [
  {
    label: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { name: 'Songs', path: '/admin/songs', icon: Music },
      { name: 'Sermons', path: '/admin/sermons', icon: BookOpen },
      { name: 'Blog', path: '/admin/blogs', icon: FileText },
      { name: 'Events', path: '/admin/events', icon: Calendar },
      { name: 'Ministries', path: '/admin/ministries', icon: Heart },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { name: 'Prayer Requests', path: '/admin/prayer-requests', icon: MessageCircleHeart },
      { name: 'Contact Messages', path: '/admin/contact-messages', icon: Mail },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
      { name: 'Navigation', path: '/admin/navigation', icon: LayoutDashboard },
      { name: 'Homepage', path: '/admin/homepage', icon: LayoutDashboard },
      { name: 'Footer', path: '/admin/footer', icon: LayoutDashboard },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
      { name: 'Church Settings', path: '/admin/settings', icon: Settings },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
      { name: 'Support', path: '/admin/support', icon: LifeBuoy },
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
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
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
                  {group.label}
                </h3>
              )}
              <ul className="space-y-1 px-3">
                {group.items.map((item) => (
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
                      title={collapsed ? item.name : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-red rounded-r-md" />
                          )}
                          <item.icon size={20} className={`flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                          {!collapsed && <span className="truncate">{item.name}</span>}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
          <button
            onClick={onToggleCollapse}
            className={`flex w-full items-center justify-center p-2 rounded-md transition-colors hidden lg:flex ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-neutral-500 hover:bg-neutral-100'}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};
