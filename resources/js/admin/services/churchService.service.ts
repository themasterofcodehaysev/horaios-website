import api from './api';
import type { ApiResponse, ChurchServiceItem, CreateChurchServicePayload } from '../types';

export const churchServiceService = {
  // Public
  async getPublicServices(): Promise<ChurchServiceItem[]> {
    const { data } = await api.get<ApiResponse<ChurchServiceItem[]>>('/services');
    return data.data;
  },

  // Admin CRUD
  async getAdminServices(): Promise<ChurchServiceItem[]> {
    const { data } = await api.get<ApiResponse<ChurchServiceItem[]>>('/admin/services');
    return data.data;
  },

  async getService(id: number): Promise<ChurchServiceItem> {
    const { data } = await api.get<ApiResponse<ChurchServiceItem>>(`/admin/services/${id}`);
    return data.data;
  },

  async createService(payload: CreateChurchServicePayload): Promise<ChurchServiceItem> {
    const { data } = await api.post<ApiResponse<ChurchServiceItem>>('/admin/services', payload);
    return data.data;
  },

  async updateService(id: number, payload: Partial<CreateChurchServicePayload>): Promise<ChurchServiceItem> {
    const { data } = await api.put<ApiResponse<ChurchServiceItem>>(`/admin/services/${id}`, payload);
    return data.data;
  },

  async deleteService(id: number): Promise<void> {
    await api.delete(`/admin/services/${id}`);
  },

  async toggleServiceStatus(id: number): Promise<ChurchServiceItem> {
    const { data } = await api.patch<ApiResponse<ChurchServiceItem>>(`/admin/services/${id}/status`);
    return data.data;
  },

  async reorderServices(orders: { id: number; display_order: number }[]): Promise<void> {
    await api.post('/admin/services/reorder', { orders });
  },
};

export default churchServiceService;
