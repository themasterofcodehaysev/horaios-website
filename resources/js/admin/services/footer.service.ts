import api from './api';
import type {
  ApiResponse,
  FooterSetting,
  CreateFooterSettingPayload,
  UpdateFooterSettingPayload,
} from '../types';

export const footerService = {
  async getAllSettings(): Promise<FooterSetting[]> {
    const { data } = await api.get<ApiResponse<FooterSetting[]>>('/admin/footer');
    return data.data;
  },

  async getPublicFooterSettings(): Promise<Record<string, Record<string, unknown>>> {
    const { data } = await api.get<ApiResponse<Record<string, Record<string, unknown>>>>('/footer');
    return data.data;
  },

  async getSettingByKey(key: string): Promise<FooterSetting> {
    const { data } = await api.get<ApiResponse<FooterSetting>>(`/admin/footer/${key}`);
    return data.data;
  },

  async createSetting(payload: CreateFooterSettingPayload): Promise<FooterSetting> {
    const { data } = await api.post<ApiResponse<FooterSetting>>('/admin/footer', payload);
    return data.data;
  },

  async updateSetting(id: number, payload: UpdateFooterSettingPayload): Promise<FooterSetting> {
    const { data } = await api.put<ApiResponse<FooterSetting>>(`/admin/footer/${id}`, payload);
    return data.data;
  },

  async updateBatchSettings(settings: Record<string, string>): Promise<void> {
    await api.post('/admin/footer/batch', { settings });
  },

  async deleteSetting(id: number): Promise<void> {
    await api.delete(`/admin/footer/${id}`);
  },

  async initializeDefaultSettings(): Promise<void> {
    await api.post('/admin/footer/initialize');
  },
};
