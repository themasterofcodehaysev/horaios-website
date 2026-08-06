import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import DashboardPage from './pages/DashboardPage';
import UsersListPage from './pages/users/UsersListPage';
import UserCreatePage from './pages/users/UserCreatePage';
import UserEditPage from './pages/users/UserEditPage';
import RolesListPage from './pages/roles/RolesListPage';
import RoleEditPage from './pages/roles/RoleEditPage';
import ChurchSettingsPage from './pages/settings/ChurchSettingsPage';
import AuditLogPage from './pages/audit/AuditLogPage';
import ComingSoonPage from './pages/ComingSoonPage';

// Songs Module Admin Pages
import SongsListPage from './pages/songs/SongsListPage';
import SongFormPage from './pages/songs/SongFormPage';
import SongCategoriesPage from './pages/songs/SongCategoriesPage';

// Sermons Module Admin Pages
import SermonsListPage from './pages/sermons/SermonsListPage';
import SermonFormPage from './pages/sermons/SermonFormPage';
import SpeakersPage from './pages/sermons/SpeakersPage';
import SermonSeriesPage from './pages/sermons/SermonSeriesPage';
import SermonCategoriesPage from './pages/sermons/SermonCategoriesPage';

const AdminLayoutWrapper: React.FC = () => {
  const { user, logout } = useAuth();
  return <AdminLayout user={user} onLogout={logout} />;
};

export const AdminRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayoutWrapper />}>
            <Route index element={<DashboardPage />} />
            
            {/* User Management */}
            <Route path="users" element={<ProtectedRoute permission="users.view" />}>
              <Route index element={<UsersListPage />} />
            </Route>
            <Route path="users/create" element={<ProtectedRoute permission="users.create" />}>
              <Route index element={<UserCreatePage />} />
            </Route>
            <Route path="users/:uuid/edit" element={<ProtectedRoute permission="users.edit" />}>
              <Route index element={<UserEditPage />} />
            </Route>

            {/* Roles & Permissions */}
            <Route path="roles" element={<ProtectedRoute permission="users.view" />}>
              <Route index element={<RolesListPage />} />
            </Route>
            <Route path="roles/:id/edit" element={<ProtectedRoute permission="users.edit" />}>
              <Route index element={<RoleEditPage />} />
            </Route>

            {/* Worship Songs Module */}
            <Route path="songs" element={<ProtectedRoute permission="songs.manage" />}>
              <Route index element={<SongsListPage />} />
            </Route>
            <Route path="songs/create" element={<ProtectedRoute permission="songs.manage" />}>
              <Route index element={<SongFormPage />} />
            </Route>
            <Route path="songs/:id/edit" element={<ProtectedRoute permission="songs.manage" />}>
              <Route index element={<SongFormPage />} />
            </Route>
            <Route path="songs/categories" element={<ProtectedRoute permission="songs.manage" />}>
              <Route index element={<SongCategoriesPage />} />
            </Route>

            {/* Sermons Management Module */}
            <Route path="sermons" element={<ProtectedRoute permission="sermons.manage" />}>
              <Route index element={<SermonsListPage />} />
            </Route>
            <Route path="sermons/create" element={<ProtectedRoute permission="sermons.manage" />}>
              <Route index element={<SermonFormPage />} />
            </Route>
            <Route path="sermons/:id/edit" element={<ProtectedRoute permission="sermons.manage" />}>
              <Route index element={<SermonFormPage />} />
            </Route>
            <Route path="sermons/speakers" element={<ProtectedRoute permission="sermons.manage" />}>
              <Route index element={<SpeakersPage />} />
            </Route>
            <Route path="sermons/series" element={<ProtectedRoute permission="sermons.manage" />}>
              <Route index element={<SermonSeriesPage />} />
            </Route>
            <Route path="sermons/categories" element={<ProtectedRoute permission="sermons.manage" />}>
              <Route index element={<SermonCategoriesPage />} />
            </Route>

            {/* Settings */}
            <Route path="settings" element={<ProtectedRoute permission="settings.manage" />}>
              <Route index element={<ChurchSettingsPage />} />
            </Route>

            {/* Audit Logs */}
            <Route path="audit-logs" element={<ProtectedRoute permission="audit.view" />}>
              <Route index element={<AuditLogPage />} />
            </Route>

            {/* Placeholder Modules */}
            <Route path="blog" element={<ComingSoonPage moduleName="Blog & News" description="Articles, announcements, tags, and rich content publishing workflow." />} />
            <Route path="events" element={<ComingSoonPage moduleName="Events Calendar" description="Church events, registration, location mapping, and recurring schedules." />} />
            <Route path="ministries" element={<ComingSoonPage moduleName="Ministries Management" description="Ministry teams, leadership rosters, schedules, and member signups." />} />
            <Route path="prayer-requests" element={<ComingSoonPage moduleName="Prayer Requests" description="Member prayer requests, moderation queue, and intercessor notifications." />} />
            <Route path="contact-messages" element={<ComingSoonPage moduleName="Contact Messages" description="Inbound website contact form submissions and response tracking." />} />
            <Route path="media" element={<ComingSoonPage moduleName="Media Library" description="Centralized asset manager for photos, sermon graphics, documents, and video files." />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default AdminRouter;
