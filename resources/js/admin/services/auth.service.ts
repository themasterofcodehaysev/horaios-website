import api from './api';
import type { ApiResponse, AuthUser } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const { data } = await api.post<ApiResponse<{ token: string; token_type: string; user: AuthUser }>>(
      '/auth/login',
      { email, password }
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    authService.clearAuth();
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
    return data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, email: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation: password,
    });
  },

  getStoredToken(): string | null {
    return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
  },

  getStoredUser(): AuthUser | null {
    const user = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Persists to localStorage when `remember` is true (survives browser restarts),
   * otherwise to sessionStorage (cleared when the tab/browser closes).
   */
  storeAuth(token: string, user: AuthUser, remember: boolean = true): void {
    const storage = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;

    storage.setItem('admin_token', token);
    storage.setItem('admin_user', JSON.stringify(user));
    other.removeItem('admin_token');
    other.removeItem('admin_user');
  },

  clearAuth(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
  },

  isTokenValid(): boolean {
    return !!authService.getStoredToken();
  },
};
