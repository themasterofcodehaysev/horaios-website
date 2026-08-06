import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { AuthUser } from '../../types';

interface ProtectedRouteProps {
  permission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ permission }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('admin_token');
        const userStr = localStorage.getItem('admin_user');

        if (!token || !userStr) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const user: AuthUser = JSON.parse(userStr);
        setIsAuthenticated(true);

        if (permission) {
          // SUPER_ADMIN has all permissions
          if (user.role?.name === 'SUPER_ADMIN') {
            setIsAuthorized(true);
          } else {
            const hasPerm = user.role?.permissions?.some(p => p.name === permission);
            setIsAuthorized(!!hasPerm);
          }
        } else {
          setIsAuthorized(true);
        }
      } catch (e) {
        console.error('Auth check failed', e);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [permission, location.pathname]);

  if (isLoading) {
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

  if (!isAuthorized && permission) {
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
