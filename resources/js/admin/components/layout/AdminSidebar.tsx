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
  ChevronsLeft,
  ChevronsRight,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
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
      { name: 'Blog', path: '/admin/blog', icon: FileText },
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
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
      { name: 'Church Settings', path: '/admin/settings', icon: Settings },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
    ],
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
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
        className={`fixed top-0 left-0 z-50 flex h-full flex-col bg-white border-r border-neutral-200 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
            {!collapsed && (
              <span className="font-semibold text-neutral-900 truncate">Horaios Admin</span>
            )}
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1 text-neutral-500 hover:bg-neutral-100 rounded-md lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-neutral-200">
          {navGroups.map((group, index) => (
            <div key={index} className="mb-6">
              {!collapsed && (
                <h3 className="px-6 mb-2 text-xs font-semibold text-neutral-400 tracking-wider">
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

        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center p-2 text-neutral-500 hover:bg-neutral-100 rounded-md transition-colors hidden lg:flex"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};
