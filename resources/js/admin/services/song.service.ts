import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  SongItem,
  SongCategory,
  CreateSongPayload,
  UpdateSongPayload,
  SongFilters,
} from '../types';

export const songService = {
  // Public Catalog
  async getPublicSongs(filters: SongFilters = {}): Promise<PaginatedResponse<SongItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));

    const { data } = await api.get<PaginatedResponse<SongItem>>(`/songs?${params.toString()}`);
    return data;
  },

  async getPublicSongDetail(identifier: string): Promise<SongItem> {
    const { data } = await api.get<ApiResponse<SongItem>>(`/songs/${identifier}`);
    return data.data;
  },

  async getRelatedSongs(identifier: string): Promise<SongItem[]> {
    const { data } = await api.get<ApiResponse<SongItem[]>>(`/songs/${identifier}/related`);
    return data.data;
  },

  async getPublicCategories(): Promise<SongCategory[]> {
    const { data } = await api.get<ApiResponse<SongCategory[]>>('/song-categories');
    return data.data;
  },

  // Admin Management
  async getAdminSongs(filters: SongFilters = {}): Promise<PaginatedResponse<SongItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.status) params.set('status', filters.status);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<SongItem>>(`/admin/songs?${params.toString()}`);
    return data;
  },

  async getSong(idOrSlug: string | number): Promise<SongItem> {
    const { data } = await api.get<ApiResponse<SongItem>>(`/songs/${idOrSlug}`);
    return data.data;
  },

  async createSong(payload: CreateSongPayload): Promise<SongItem> {
    const { data } = await api.post<ApiResponse<SongItem>>('/admin/songs', payload);
    return data.data;
  },

  async updateSong(id: number, payload: UpdateSongPayload): Promise<SongItem> {
    const { data } = await api.put<ApiResponse<SongItem>>(`/admin/songs/${id}`, payload);
    return data.data;
  },

  async deleteSong(id: number): Promise<void> {
    await api.delete(`/admin/songs/${id}`);
  },

  async togglePublish(id: number): Promise<SongItem> {
    const { data } = await api.patch<ApiResponse<SongItem>>(`/admin/songs/${id}/toggle-publish`);
    return data.data;
  },

  async toggleFeatured(id: number): Promise<SongItem> {
    const { data } = await api.patch<ApiResponse<SongItem>>(`/admin/songs/${id}/toggle-featured`);
    return data.data;
  },

  async duplicateSong(id: number): Promise<SongItem> {
    const { data } = await api.post<ApiResponse<SongItem>>(`/admin/songs/${id}/duplicate`);
    return data.data;
  },

  // Category Management
  async getCategories(): Promise<SongCategory[]> {
    const { data } = await api.get<ApiResponse<SongCategory[]>>('/song-categories');
    return data.data;
  },

  async createCategory(payload: { name: string; slug?: string; description?: string; display_order?: number; status?: string }): Promise<SongCategory> {
    const { data } = await api.post<ApiResponse<SongCategory>>('/admin/song-categories', payload);
    return data.data;
  },

  async updateCategory(id: number, payload: { name?: string; slug?: string; description?: string; display_order?: number; status?: string }): Promise<SongCategory> {
    const { data } = await api.put<ApiResponse<SongCategory>>(`/admin/song-categories/${id}`, payload);
    return data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/admin/song-categories/${id}`);
  },
};
