import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { AuthUser } from '../types';

const isSuperAdminRole = (roleName?: string | null): boolean => {
  return !!roleName && String(roleName).toUpperCase() === 'SUPER_ADMIN';
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.me();
        setUser(currentUser);
        authService.storeAuth(token, currentUser);
      } catch (error) {
        console.error('Failed to validate token', error);
        setToken(null);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setToken(response.token);
    setUser(response.user);
    authService.storeAuth(response.token, response.user);
    navigate('/admin');
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setToken(null);
      setUser(null);
      authService.clearAuth();
      navigate('/login');
    }
  }, [navigate]);

  const hasPermission = useCallback((permissionName: string): boolean => {
    if (!user || !user.role) return false;
    if (isSuperAdminRole(user.role.name)) return true;
    if (!user.role.permissions) return false;
    return user.role.permissions.some((p: any) =>
      typeof p === 'string' ? p === permissionName : p?.name === permissionName
    );
  }, [user]);

  const isSuperAdmin = useCallback((): boolean => {
    return isSuperAdminRole(user?.role?.name);
  }, [user]);

  const isAdmin = useCallback((): boolean => {
    const n = user?.role?.name ? String(user.role.name).toUpperCase() : '';
    return n === 'SUPER_ADMIN' || n === 'ADMIN';
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      hasPermission,
      isSuperAdmin,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
