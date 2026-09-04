import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  MinistryItem,
  MinistryCategory,
  CreateMinistryPayload,
  UpdateMinistryPayload,
  MinistryFilters,
} from '../types';

export const ministryService = {
  async getPublicMinistries(filters: MinistryFilters = {}): Promise<PaginatedResponse<MinistryItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));

    const { data } = await api.get<PaginatedResponse<MinistryItem>>(`/ministries?${params.toString()}`);
    return data;
  },

  async getPublicMinistryDetail(identifier: string): Promise<MinistryItem> {
    const { data } = await api.get<ApiResponse<MinistryItem>>(`/ministries/${identifier}`);
    return data.data;
  },

  async getPublicMinistryCategories(): Promise<MinistryCategory[]> {
    const { data } = await api.get<ApiResponse<MinistryCategory[]>>('/ministry-categories');
    return data.data;
  },

  async getAdminMinistries(filters: MinistryFilters = {}): Promise<PaginatedResponse<MinistryItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.status) params.set('status', filters.status);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<MinistryItem>>(`/admin/ministries?${params.toString()}`);
    return data;
  },

  async getAdminMinistry(idOrSlug: string | number): Promise<MinistryItem> {
    const { data } = await api.get<ApiResponse<MinistryItem>>(`/admin/ministries/${idOrSlug}`);
    return data.data;
  },

  async getMinistry(idOrSlug: string | number): Promise<MinistryItem> {
    const { data } = await api.get<ApiResponse<MinistryItem>>(`/ministries/${idOrSlug}`);
    return data.data;
  },

  async createMinistry(payload: CreateMinistryPayload): Promise<MinistryItem> {
    const { data } = await api.post<ApiResponse<MinistryItem>>('/admin/ministries', payload);
    return data.data;
  },

  async updateMinistry(id: number, payload: UpdateMinistryPayload): Promise<MinistryItem> {
    const { data } = await api.put<ApiResponse<MinistryItem>>(`/admin/ministries/${id}`, payload);
    return data.data;
  },

  async deleteMinistry(id: number): Promise<void> {
    await api.delete(`/admin/ministries/${id}`);
  },

  async togglePublishMinistry(id: number): Promise<MinistryItem> {
    const { data } = await api.patch<ApiResponse<MinistryItem>>(`/admin/ministries/${id}/toggle-publish`);
    return data.data;
  },

  async toggleFeaturedMinistry(id: number): Promise<MinistryItem> {
    const { data } = await api.patch<ApiResponse<MinistryItem>>(`/admin/ministries/${id}/toggle-featured`);
    return data.data;
  },

  async duplicateMinistry(id: number): Promise<MinistryItem> {
    const { data } = await api.post<ApiResponse<MinistryItem>>(`/admin/ministries/${id}/duplicate`);
    return data.data;
  },

  async reorderMinistry(id: number, display_order: number): Promise<MinistryItem> {
    const { data } = await api.patch<ApiResponse<MinistryItem>>(`/admin/ministries/${id}/reorder`, { display_order });
    return data.data;
  },

  async getAdminMinistryCategories(): Promise<MinistryCategory[]> {
    const { data } = await api.get<ApiResponse<MinistryCategory[]>>('/admin/ministry-categories');
    return data.data;
  },

  async createMinistryCategory(payload: Partial<MinistryCategory>): Promise<MinistryCategory> {
    const { data } = await api.post<ApiResponse<MinistryCategory>>('/admin/ministry-categories', payload);
    return data.data;
  },

  async updateMinistryCategory(id: number, payload: Partial<MinistryCategory>): Promise<MinistryCategory> {
    const { data } = await api.put<ApiResponse<MinistryCategory>>(`/admin/ministry-categories/${id}`, payload);
    return data.data;
  },

  async deleteMinistryCategory(id: number): Promise<void> {
    await api.delete(`/admin/ministry-categories/${id}`);
  },
};
