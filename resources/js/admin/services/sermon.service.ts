import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  SermonItem,
  Speaker,
  SermonSeries,
  SermonCategory,
  CreateSermonPayload,
  UpdateSermonPayload,
  SermonFilters,
} from '../types';

export const sermonService = {
  // Public Catalog
  async getPublicSermons(filters: SermonFilters = {}): Promise<PaginatedResponse<SermonItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.speaker_id) params.set('speaker_id', String(filters.speaker_id));
    if (filters.series_id) params.set('series_id', String(filters.series_id));
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));

    const { data } = await api.get<PaginatedResponse<SermonItem>>(`/sermons?${params.toString()}`);
    return data;
  },

  async getPublicSermonDetail(identifier: string): Promise<SermonItem> {
    const { data } = await api.get<ApiResponse<SermonItem>>(`/sermons/${identifier}`);
    return data.data;
  },

  async getRelatedSermons(identifier: string): Promise<SermonItem[]> {
    const { data } = await api.get<ApiResponse<SermonItem[]>>(`/sermons/${identifier}/related`);
    return data.data;
  },

  async getPublicSpeakers(): Promise<Speaker[]> {
    const { data } = await api.get<ApiResponse<Speaker[]>>('/speakers');
    return data.data;
  },

  async getPublicSeries(): Promise<SermonSeries[]> {
    const { data } = await api.get<ApiResponse<SermonSeries[]>>('/sermon-series');
    return data.data;
  },

  async getPublicCategories(): Promise<SermonCategory[]> {
    const { data } = await api.get<ApiResponse<SermonCategory[]>>('/sermon-categories');
    return data.data;
  },

  // Admin Management — Sermons
  async getAdminSermons(filters: SermonFilters = {}): Promise<PaginatedResponse<SermonItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.speaker_id) params.set('speaker_id', String(filters.speaker_id));
    if (filters.series_id) params.set('series_id', String(filters.series_id));
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.status) params.set('status', filters.status);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<SermonItem>>(`/admin/sermons?${params.toString()}`);
    return data;
  },

  async getAdminSermon(idOrSlug: string | number): Promise<SermonItem> {
    const { data } = await api.get<ApiResponse<SermonItem>>(`/admin/sermons/${idOrSlug}`);
    return data.data;
  },

  async getSermon(idOrSlug: string | number): Promise<SermonItem> {
    const { data } = await api.get<ApiResponse<SermonItem>>(`/sermons/${idOrSlug}`);
    return data.data;
  },

  async createSermon(payload: CreateSermonPayload): Promise<SermonItem> {
    const { data } = await api.post<ApiResponse<SermonItem>>('/admin/sermons', payload);
    return data.data;
  },

  async updateSermon(id: number, payload: UpdateSermonPayload): Promise<SermonItem> {
    const { data } = await api.put<ApiResponse<SermonItem>>(`/admin/sermons/${id}`, payload);
    return data.data;
  },

  async deleteSermon(id: number): Promise<void> {
    await api.delete(`/admin/sermons/${id}`);
  },

  async togglePublish(id: number): Promise<SermonItem> {
    const { data } = await api.patch<ApiResponse<SermonItem>>(`/admin/sermons/${id}/toggle-publish`);
    return data.data;
  },

  async toggleFeatured(id: number): Promise<SermonItem> {
    const { data } = await api.patch<ApiResponse<SermonItem>>(`/admin/sermons/${id}/toggle-featured`);
    return data.data;
  },

  async duplicateSermon(id: number): Promise<SermonItem> {
    const { data } = await api.post<ApiResponse<SermonItem>>(`/admin/sermons/${id}/duplicate`);
    return data.data;
  },

  // Admin Management — Speakers
  async getAdminSpeakers(): Promise<Speaker[]> {
    const { data } = await api.get<ApiResponse<Speaker[]>>('/admin/speakers');
    return data.data;
  },

  async createSpeaker(payload: Partial<Speaker>): Promise<Speaker> {
    const { data } = await api.post<ApiResponse<Speaker>>('/admin/speakers', payload);
    return data.data;
  },

  async updateSpeaker(id: number, payload: Partial<Speaker>): Promise<Speaker> {
    const { data } = await api.put<ApiResponse<Speaker>>(`/admin/speakers/${id}`, payload);
    return data.data;
  },

  async deleteSpeaker(id: number): Promise<void> {
    await api.delete(`/admin/speakers/${id}`);
  },

  async toggleSpeakerStatus(id: number): Promise<Speaker> {
    const { data } = await api.patch<ApiResponse<Speaker>>(`/admin/speakers/${id}/toggle-status`);
    return data.data;
  },

  // Admin Management — Sermon Series
  async getAdminSeries(): Promise<SermonSeries[]> {
    const { data } = await api.get<ApiResponse<SermonSeries[]>>('/admin/sermon-series');
    return data.data;
  },

  async createSeries(payload: Partial<SermonSeries>): Promise<SermonSeries> {
    const { data } = await api.post<ApiResponse<SermonSeries>>('/admin/sermon-series', payload);
    return data.data;
  },

  async updateSeries(id: number, payload: Partial<SermonSeries>): Promise<SermonSeries> {
    const { data } = await api.put<ApiResponse<SermonSeries>>(`/admin/sermon-series/${id}`, payload);
    return data.data;
  },

  async deleteSeries(id: number): Promise<void> {
    await api.delete(`/admin/sermon-series/${id}`);
  },

  // Admin Management — Sermon Categories
  async getAdminCategories(): Promise<SermonCategory[]> {
    const { data } = await api.get<ApiResponse<SermonCategory[]>>('/admin/sermon-categories');
    return data.data;
  },

  async createCategory(payload: Partial<SermonCategory>): Promise<SermonCategory> {
    const { data } = await api.post<ApiResponse<SermonCategory>>('/admin/sermon-categories', payload);
    return data.data;
  },

  async updateCategory(id: number, payload: Partial<SermonCategory>): Promise<SermonCategory> {
    const { data } = await api.put<ApiResponse<SermonCategory>>(`/admin/sermon-categories/${id}`, payload);
    return data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/admin/sermon-categories/${id}`);
  },
};
