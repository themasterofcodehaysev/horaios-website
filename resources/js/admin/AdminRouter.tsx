import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './hooks/useToast';
import { ConfirmProvider } from './context/ConfirmContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { SkeletonLoader } from './components/ui/SkeletonLoader';
import { ToastContainer } from './components/ui/ToastContainer';

// Lazy load all pages for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UsersListPage = lazy(() => import('./pages/users/UsersListPage'));
const UserCreatePage = lazy(() => import('./pages/users/UserCreatePage'));
const UserEditPage = lazy(() => import('./pages/users/UserEditPage'));
const RolesListPage = lazy(() => import('./pages/roles/RolesListPage'));
const RoleEditPage = lazy(() => import('./pages/roles/RoleEditPage'));
const ChurchSettingsPage = lazy(() => import('./pages/settings/ChurchSettingsPage'));
const AuditLogPage = lazy(() => import('./pages/audit/AuditLogPage'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const AccountSettingsPage = lazy(() => import('./pages/AccountSettingsPage'));

// Songs Module Admin Pages
const SongsListPage = lazy(() => import('./pages/songs/SongsListPage'));
const SongFormPage = lazy(() => import('./pages/songs/SongFormPage'));
const SongCategoriesPage = lazy(() => import('./pages/songs/SongCategoriesPage'));

// Sermons Module Admin Pages
const SermonsListPage = lazy(() => import('./pages/sermons/SermonsListPage'));
const SermonFormPage = lazy(() => import('./pages/sermons/SermonFormPage'));
const SpeakersPage = lazy(() => import('./pages/sermons/SpeakersPage'));
const SermonSeriesPage = lazy(() => import('./pages/sermons/SermonSeriesPage'));
const SermonCategoriesPage = lazy(() => import('./pages/sermons/SermonCategoriesPage'));

// Blog Module Admin Pages
const BlogsListPage = lazy(() => import('./pages/blogs/BlogsListPage'));
const BlogFormPage = lazy(() => import('./pages/blogs/BlogFormPage'));
const BlogCategoriesPage = lazy(() => import('./pages/blogs/BlogCategoriesPage'));

// Events Module Admin Pages
const EventsListPage = lazy(() => import('./pages/events/EventsListPage'));
const EventFormPage = lazy(() => import('./pages/events/EventFormPage'));
const EventCategoriesPage = lazy(() => import('./pages/events/EventCategoriesPage'));

// Ministries Module Admin Pages
const MinistriesListPage = lazy(() => import('./pages/ministries/MinistriesListPage'));
const MinistryFormPage = lazy(() => import('./pages/ministries/MinistryFormPage'));
const MinistryCategoriesPage = lazy(() => import('./pages/ministries/MinistryCategoriesPage'));

// Prayer Requests Module Admin Pages
const PrayerRequestsListPage = lazy(() => import('./pages/prayer/PrayerRequestsListPage'));

// Contact Messages Module Admin Pages
const ContactMessagesListPage = lazy(() => import('./pages/contact/ContactMessagesListPage'));

// Notification Center Admin Pages
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'));

// Navigation Management Admin Pages
const NavigationManagementPage = lazy(() => import('./pages/navigation/NavigationManagementPage'));

// Homepage CMS Admin Pages
const HomepageCmsPage = lazy(() => import('./pages/homepage/HomepageCmsPage'));

// Footer Management Admin Pages
const FooterManagementPage = lazy(() => import('./pages/footer/FooterManagementPage'));

// Error Pages
const Error404Page = lazy(() => import('./pages/error/Error404Page'));
const Error403Page = lazy(() => import('./pages/error/Error403Page'));
const Error500Page = lazy(() => import('./pages/error/Error500Page'));

// Loading fallback component
const PageLoader = () => (
  <div className="p-6">
    <SkeletonLoader type="text" rows={4} />
  </div>
);

const AdminLayoutWrapper: React.FC = () => {
  const { user, logout } = useAuth();
  const { toasts, removeToast } = useToast();
  return (
    <>
      <AdminLayout user={user} onLogout={logout} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export const AdminRouter: React.FC = () => {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayoutWrapper />}>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            } />
            
            {/* User Management */}
            <Route path="users" element={<ProtectedRoute permission="users.view" />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <UsersListPage />
                </Suspense>
              } />
            </Route>
            <Route path="users/create" element={<ProtectedRoute permission="users.create" />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <UserCreatePage />
                </Suspense>
              } />
            </Route>
            <Route path="users/:uuid/edit" element={<ProtectedRoute permission="users.edit" />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <UserEditPage />
                </Suspense>
              } />
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

            {/* Blog & News Module */}
            <Route path="blogs" element={<ProtectedRoute permission="blog.manage" />}>
              <Route index element={<BlogsListPage />} />
            </Route>
            <Route path="blogs/create" element={<ProtectedRoute permission="blog.manage" />}>
              <Route index element={<BlogFormPage />} />
            </Route>
            <Route path="blogs/:id/edit" element={<ProtectedRoute permission="blog.manage" />}>
              <Route index element={<BlogFormPage />} />
            </Route>
            <Route path="blogs/categories" element={<ProtectedRoute permission="blog.manage" />}>
              <Route index element={<BlogCategoriesPage />} />
            </Route>

            {/* Events Calendar Module */}
            <Route path="events" element={<ProtectedRoute permission="events.manage" />}>
              <Route index element={<EventsListPage />} />
            </Route>
            <Route path="events/create" element={<ProtectedRoute permission="events.manage" />}>
              <Route index element={<EventFormPage />} />
            </Route>
            <Route path="events/:id/edit" element={<ProtectedRoute permission="events.manage" />}>
              <Route index element={<EventFormPage />} />
            </Route>
            <Route path="events/categories" element={<ProtectedRoute permission="events.manage" />}>
              <Route index element={<EventCategoriesPage />} />
            </Route>

            {/* Ministries Management Module */}
            <Route path="ministries" element={<ProtectedRoute permission="ministries.manage" />}>
              <Route index element={<MinistriesListPage />} />
            </Route>
            <Route path="ministries/create" element={<ProtectedRoute permission="ministries.manage" />}>
              <Route index element={<MinistryFormPage />} />
            </Route>
            <Route path="ministries/:id/edit" element={<ProtectedRoute permission="ministries.manage" />}>
              <Route index element={<MinistryFormPage />} />
            </Route>
            <Route path="ministries/categories" element={<ProtectedRoute permission="ministries.manage" />}>
              <Route index element={<MinistryCategoriesPage />} />
            </Route>

            {/* Prayer Requests Module */}
            <Route path="prayer-requests" element={<ProtectedRoute permission="prayer_requests.view" />}>
              <Route index element={<PrayerRequestsListPage />} />
            </Route>

            {/* Contact Messages Module */}
            <Route path="contact-messages" element={<ProtectedRoute permission="contact_messages.view" />}>
              <Route index element={<ContactMessagesListPage />} />
            </Route>


            {/* Notification Center */}
            <Route path="notifications" element={<ProtectedRoute />}>
              <Route index element={<NotificationsPage />} />
            </Route>

            {/* Support */}
            <Route path="support" element={<ProtectedRoute />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <SupportPage />
                </Suspense>
              } />
            </Route>

            {/* Account Settings */}
            <Route path="account" element={<ProtectedRoute />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <AccountSettingsPage />
                </Suspense>
              } />
            </Route>

            {/* Navigation Management */}
            <Route path="navigation" element={<ProtectedRoute permission="navigation.manage" />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <NavigationManagementPage />
                </Suspense>
              } />
            </Route>

            {/* Homepage CMS */}
            <Route path="homepage" element={<ProtectedRoute permission="homepage.manage" />}>
              <Route index element={<HomepageCmsPage />} />
            </Route>

            {/* Footer Management */}
            <Route path="footer" element={<ProtectedRoute permission="footer.manage" />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <FooterManagementPage />
                </Suspense>
              } />
            </Route>

            {/* Error Pages */}
            <Route path="404" element={
              <Suspense fallback={<PageLoader />}>
                <Error404Page />
              </Suspense>
            } />
            <Route path="403" element={
              <Suspense fallback={<PageLoader />}>
                <Error403Page />
              </Suspense>
            } />
            <Route path="500" element={
              <Suspense fallback={<PageLoader />}>
                <Error500Page />
              </Suspense>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/admin/404" replace />} />
          </Route>
        </Route>
      </Routes>
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
};

export default AdminRouter;
