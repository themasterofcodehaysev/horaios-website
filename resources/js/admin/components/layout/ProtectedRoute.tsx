import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  permission?: string;
}

const isSuperAdminRole = (roleName?: string | null): boolean => {
  return !!roleName && String(roleName).toUpperCase() === 'SUPER_ADMIN';
};

const userHasPermission = (perms: any[] | undefined, permission: string): boolean => {
  if (!perms || perms.length === 0) return false;
  return perms.some((p: any) =>
    typeof p === 'string' ? p === permission : p?.name === permission
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ permission }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading, hasPermission } = useAuth();
  const [localAuthorized, setLocalAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      setLocalAuthorized(false);
      return;
    }

    if (!permission) {
      setLocalAuthorized(true);
      return;
    }

    if (isSuperAdminRole(user.role?.name)) {
      setLocalAuthorized(true);
      return;
    }

    const ok = hasPermission(permission) || userHasPermission(user.role?.permissions, permission);
    setLocalAuthorized(!!ok);
  }, [authLoading, isAuthenticated, user, permission, hasPermission, location.pathname]);

  if (authLoading || localAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-neutral-200 border-t-primary-red rounded-full animate-spin" />
          <p className="mt-4 text-body-sm text-neutral-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!localAuthorized && permission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-h4 text-neutral-900 font-bold mb-2">Access Denied</h2>
          <p className="text-body-sm text-neutral-500 mb-6">You don't have the required permissions to view this page.</p>
          <button
            onClick={() => window.history.back()}
            className="w-full py-2.5 px-4 bg-neutral-900 text-white rounded-lg text-body-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
