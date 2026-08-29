import api from './api';
import type { ApiResponse, PaginatedResponse, User, CreateUserPayload, UpdateUserPayload, UserFilters } from '../types';

export const userService = {
  async list(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.role_id) params.set('role_id', String(filters.role_id));
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);
    const { data } = await api.get<PaginatedResponse<User>>(`/users?${params.toString()}`);
    return data;
  },

  async get(uuid: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${uuid}`);
    return data.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/users', payload);
    return data.data;
  },

  async update(uuid: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(`/users/${uuid}`, payload);
    return data.data;
  },

  async delete(uuid: string): Promise<void> {
    await api.delete(`/users/${uuid}`);
  },

  async restore(uuid: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(`/users/${uuid}/restore`);
    return data.data;
  },

  async toggleStatus(uuid: string): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(`/users/${uuid}/toggle-status`);
    return data.data;
  },

  async sendPasswordReset(uuid: string): Promise<void> {
    await api.post<ApiResponse<null>>(`/users/${uuid}/reset-password`);
  },
};
