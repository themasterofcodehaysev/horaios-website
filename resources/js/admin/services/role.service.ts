import api from './api';
import { Role, Permission, ApiResponse } from '../types';

export const RoleService = {
  getRoles: async (): Promise<Role[]> => {
    const { data } = await api.get<ApiResponse<Role[]>>('/roles');
    return data.data;
  },

  list: async (): Promise<Role[]> => {
    const { data } = await api.get<ApiResponse<Role[]>>('/roles');
    return data.data;
  },

  getRole: async (id: number | string): Promise<Role> => {
    const { data } = await api.get<ApiResponse<Role>>(`/roles/${id}`);
    return data.data;
  },

  show: async (id: number | string): Promise<Role> => {
    const { data } = await api.get<ApiResponse<Role>>(`/roles/${id}`);
    return data.data;
  },

  updateRolePermissions: async (id: number | string, permission_ids: number[]): Promise<Permission[]> => {
    const { data } = await api.put<ApiResponse<Permission[]>>(`/roles/${id}/permissions`, { permission_ids });
    return data.data;
  },

  updatePermissions: async (id: number | string, permission_ids: number[]): Promise<Permission[]> => {
    const { data } = await api.put<ApiResponse<Permission[]>>(`/roles/${id}/permissions`, { permission_ids });
    return data.data;
  },

  getPermissions: async (): Promise<Record<string, Permission[]>> => {
    const { data } = await api.get<ApiResponse<Record<string, Permission[]>>>('/permissions');
    return data.data;
  },

  permissions: async (): Promise<Record<string, Permission[]>> => {
    const { data } = await api.get<ApiResponse<Record<string, Permission[]>>>('/permissions');
    return data.data;
  },
};

export const roleService = RoleService;
