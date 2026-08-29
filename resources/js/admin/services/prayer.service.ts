import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PrayerRequest,
  CreatePrayerRequestPayload,
  UpdatePrayerRequestPayload,
  PrayerRequestFilters,
  PrayerRequestStats,
} from '../types';

export const prayerService = {
  async getPublicPrayerRequests(filters: PrayerRequestFilters = {}): Promise<PaginatedResponse<PrayerRequest>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.request_type) params.set('request_type', filters.request_type);
    if (filters.urgency) params.set('urgency', filters.urgency);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));

    const { data } = await api.get<PaginatedResponse<PrayerRequest>>(`/prayer-requests?${params.toString()}`);
    return data;
  },

  async getPublicPrayerRequest(uuid: string): Promise<PrayerRequest> {
    const { data } = await api.get<ApiResponse<PrayerRequest>>(`/prayer-requests/${uuid}`);
    return data.data;
  },

  async submitPrayerRequest(payload: CreatePrayerRequestPayload): Promise<PrayerRequest> {
    const { data } = await api.post<ApiResponse<PrayerRequest>>('/prayer-requests', payload);
    return data.data;
  },

  async getAdminPrayerRequests(filters: PrayerRequestFilters = {}): Promise<PaginatedResponse<PrayerRequest>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.request_type) params.set('request_type', filters.request_type);
    if (filters.urgency) params.set('urgency', filters.urgency);
    if (filters.allow_public_prayer !== undefined && filters.allow_public_prayer !== '') {
      params.set('allow_public_prayer', String(filters.allow_public_prayer));
    }
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<PrayerRequest>>(`/admin/prayer-requests?${params.toString()}`);
    return data;
  },

  async getAdminPrayerRequest(id: number): Promise<PrayerRequest> {
    const { data } = await api.get<ApiResponse<PrayerRequest>>(`/admin/prayer-requests/${id}`);
    return data.data;
  },

  async updatePrayerRequest(id: number, payload: UpdatePrayerRequestPayload): Promise<PrayerRequest> {
    const { data } = await api.put<ApiResponse<PrayerRequest>>(`/admin/prayer-requests/${id}`, payload);
    return data.data;
  },

  async deletePrayerRequest(id: number): Promise<void> {
    await api.delete(`/admin/prayer-requests/${id}`);
  },

  async updatePrayerRequestStatus(id: number, status: string): Promise<PrayerRequest> {
    const { data } = await api.patch<ApiResponse<PrayerRequest>>(`/admin/prayer-requests/${id}/status`, { status });
    return data.data;
  },

  async getPrayerRequestStats(): Promise<PrayerRequestStats> {
    const { data } = await api.get<ApiResponse<PrayerRequestStats>>('/admin/prayer-requests/stats');
    return data.data;
  },
};
