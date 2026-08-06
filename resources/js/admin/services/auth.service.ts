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
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
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

  getStoredToken(): string | null {
    return localStorage.getItem('admin_token');
  },

  getStoredUser(): AuthUser | null {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  },

  storeAuth(token: string, user: AuthUser): void {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
  },

  clearAuth(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  isTokenValid(): boolean {
    return !!localStorage.getItem('admin_token');
  },
};
