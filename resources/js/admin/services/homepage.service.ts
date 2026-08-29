import api from './api';
import type {
  ApiResponse,
  HomepageSection,
  CreateHomepageSectionPayload,
  UpdateHomepageSectionPayload,
} from '../types';

export const homepageService = {
  async getAllSections(): Promise<HomepageSection[]> {
    const { data } = await api.get<ApiResponse<HomepageSection[]>>('/admin/homepage');
    return data.data;
  },

  async getPublicSections(): Promise<HomepageSection[]> {
    const { data } = await api.get<ApiResponse<HomepageSection[]>>('/homepage');
    return data.data;
  },

  async getSectionByKey(key: string): Promise<HomepageSection> {
    const { data } = await api.get<ApiResponse<HomepageSection>>(`/homepage/${key}`);
    return data.data;
  },

  async createSection(payload: CreateHomepageSectionPayload): Promise<HomepageSection> {
    const { data } = await api.post<ApiResponse<HomepageSection>>('/admin/homepage', payload);
    return data.data;
  },

  async updateSection(id: number, payload: UpdateHomepageSectionPayload): Promise<HomepageSection> {
    const { data } = await api.put<ApiResponse<HomepageSection>>(`/admin/homepage/${id}`, payload);
    return data.data;
  },

  async deleteSection(id: number): Promise<void> {
    await api.delete(`/admin/homepage/${id}`);
  },

  async reorderSections(sections: Array<{ id: number; display_order: number }>): Promise<void> {
    await api.post('/admin/homepage/reorder', { sections });
  },

  async initializeDefaultSections(): Promise<void> {
    await api.post('/admin/homepage/initialize');
  },
};
