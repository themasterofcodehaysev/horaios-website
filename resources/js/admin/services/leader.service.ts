import api from './api';
import type { ApiResponse, Leader, CreateLeaderPayload } from '../types';

export const leaderService = {
  // Public
  async getPublicLeaders(): Promise<Leader[]> {
    const { data } = await api.get<ApiResponse<Leader[]>>('/leaders');
    return data.data;
  },

  // Admin CRUD
  async getAdminLeaders(): Promise<Leader[]> {
    const { data } = await api.get<ApiResponse<Leader[]>>('/admin/leaders');
    return data.data;
  },

  async getLeader(id: number): Promise<Leader> {
    const { data } = await api.get<ApiResponse<Leader>>(`/admin/leaders/${id}`);
    return data.data;
  },

  async createLeader(payload: CreateLeaderPayload): Promise<Leader> {
    const { data } = await api.post<ApiResponse<Leader>>('/admin/leaders', payload);
    return data.data;
  },

  async updateLeader(id: number, payload: Partial<CreateLeaderPayload>): Promise<Leader> {
    const { data } = await api.put<ApiResponse<Leader>>(`/admin/leaders/${id}`, payload);
    return data.data;
  },

  async deleteLeader(id: number): Promise<void> {
    await api.delete(`/admin/leaders/${id}`);
  },

  async toggleLeaderStatus(id: number): Promise<Leader> {
    const { data } = await api.patch<ApiResponse<Leader>>(`/admin/leaders/${id}/status`);
    return data.data;
  },

  async reorderLeaders(orders: { id: number; display_order: number }[]): Promise<void> {
    await api.post('/admin/leaders/reorder', { orders });
  },
};

export default leaderService;
