import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AuthUser } from '../../types';

interface AdminLayoutProps {
  user: AuthUser | null;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-neutral-50 font-sans overflow-hidden">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div 
        className={`flex-1 flex flex-col transition-all duration-300 w-full overflow-hidden ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        <AdminTopNav 
          user={user} 
          onLogout={handleLogout} 
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
