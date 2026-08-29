import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  ContactMessage,
  CreateContactMessagePayload,
  UpdateContactMessagePayload,
  ContactMessageFilters,
  ContactMessageStats,
} from '../types';

export const contactService = {
  async submitContactMessage(payload: CreateContactMessagePayload): Promise<ContactMessage> {
    const { data } = await api.post<ApiResponse<ContactMessage>>('/contact', payload);
    return data.data;
  },

  async getAdminContactMessages(filters: ContactMessageFilters = {}): Promise<PaginatedResponse<ContactMessage>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<ContactMessage>>(`/admin/contact-messages?${params.toString()}`);
    return data;
  },

  async getAdminContactMessage(id: number): Promise<ContactMessage> {
    const { data } = await api.get<ApiResponse<ContactMessage>>(`/admin/contact-messages/${id}`);
    return data.data;
  },

  async updateContactMessage(id: number, payload: UpdateContactMessagePayload): Promise<ContactMessage> {
    const { data } = await api.put<ApiResponse<ContactMessage>>(`/admin/contact-messages/${id}`, payload);
    return data.data;
  },

  async deleteContactMessage(id: number): Promise<void> {
    await api.delete(`/admin/contact-messages/${id}`);
  },

  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage> {
    const { data } = await api.patch<ApiResponse<ContactMessage>>(`/admin/contact-messages/${id}/status`, { status });
    return data.data;
  },

  async getContactMessageStats(): Promise<ContactMessageStats> {
    const { data } = await api.get<ApiResponse<ContactMessageStats>>('/admin/contact-messages/stats');
    return data.data;
  },
};
