import api from './api';
import type { ApiResponse, PaginatedResponse, MediaItem, UpdateMediaPayload, MediaFilters, MediaStats } from '../types';

export const mediaService = {
  async getAll(filters: MediaFilters = {}): Promise<PaginatedResponse<MediaItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.mime_type) params.set('mime_type', filters.mime_type);
    if (filters.uploaded_by) params.set('uploaded_by', String(filters.uploaded_by));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));

    const { data } = await api.get<PaginatedResponse<MediaItem>>(`/media?${params.toString()}`);
    return data;
  },

  async upload(file: File, disk = 'public', onProgress?: (progress: number) => void): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('disk', disk);

    const { data } = await api.post<ApiResponse<MediaItem>>('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return data.data;
  },

  async getByUuid(uuid: string): Promise<MediaItem> {
    const { data } = await api.get<ApiResponse<MediaItem>>(`/media/${uuid}`);
    return data.data;
  },

  async update(uuid: string, payload: UpdateMediaPayload): Promise<MediaItem> {
    const { data } = await api.put<ApiResponse<MediaItem>>(`/media/${uuid}`, payload);
    return data.data;
  },

  async delete(uuid: string): Promise<void> {
    await api.delete(`/media/${uuid}`);
  },

  async getStats(): Promise<MediaStats> {
    const { data } = await api.get<ApiResponse<MediaStats>>('/media/stats');
    return data.data;
  },
};
