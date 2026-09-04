import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  EventItem,
  EventCategory,
  CreateEventPayload,
  UpdateEventPayload,
  EventFilters,
} from '../types';

export const eventService = {
  async getPublicEvents(filters: EventFilters = {}): Promise<PaginatedResponse<EventItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.start_date_from) params.set('start_date_from', filters.start_date_from);
    if (filters.start_date_to) params.set('start_date_to', filters.start_date_to);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));

    const { data } = await api.get<PaginatedResponse<EventItem>>(`/events?${params.toString()}`);
    return data;
  },

  async getPublicEventDetail(identifier: string): Promise<EventItem> {
    const { data } = await api.get<ApiResponse<EventItem>>(`/events/${identifier}`);
    return data.data;
  },

  async getRelatedEvents(identifier: string): Promise<EventItem[]> {
    const { data } = await api.get<ApiResponse<EventItem[]>>(`/events/${identifier}/related`);
    return data.data;
  },

  async getPublicEventCategories(): Promise<EventCategory[]> {
    const { data } = await api.get<ApiResponse<EventCategory[]>>('/event-categories');
    return data.data;
  },

  async getAdminEvents(filters: EventFilters = {}): Promise<PaginatedResponse<EventItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.status) params.set('status', filters.status);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.start_date_from) params.set('start_date_from', filters.start_date_from);
    if (filters.start_date_to) params.set('start_date_to', filters.start_date_to);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<EventItem>>(`/admin/events?${params.toString()}`);
    return data;
  },

  async getAdminEvent(idOrSlug: string | number): Promise<EventItem> {
    const { data } = await api.get<ApiResponse<EventItem>>(`/admin/events/${idOrSlug}`);
    return data.data;
  },

  async getEvent(idOrSlug: string | number): Promise<EventItem> {
    const { data } = await api.get<ApiResponse<EventItem>>(`/events/${idOrSlug}`);
    return data.data;
  },

  async createEvent(payload: CreateEventPayload): Promise<EventItem> {
    const { data } = await api.post<ApiResponse<EventItem>>('/admin/events', payload);
    return data.data;
  },

  async updateEvent(id: number, payload: UpdateEventPayload): Promise<EventItem> {
    const { data } = await api.put<ApiResponse<EventItem>>(`/admin/events/${id}`, payload);
    return data.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/admin/events/${id}`);
  },

  async togglePublishEvent(id: number): Promise<EventItem> {
    const { data } = await api.patch<ApiResponse<EventItem>>(`/admin/events/${id}/toggle-publish`);
    return data.data;
  },

  async toggleFeaturedEvent(id: number): Promise<EventItem> {
    const { data } = await api.patch<ApiResponse<EventItem>>(`/admin/events/${id}/toggle-featured`);
    return data.data;
  },

  async duplicateEvent(id: number): Promise<EventItem> {
    const { data } = await api.post<ApiResponse<EventItem>>(`/admin/events/${id}/duplicate`);
    return data.data;
  },

  async cancelEvent(id: number): Promise<EventItem> {
    const { data } = await api.patch<ApiResponse<EventItem>>(`/admin/events/${id}/cancel`);
    return data.data;
  },

  async getAdminEventCategories(): Promise<EventCategory[]> {
    const { data } = await api.get<ApiResponse<EventCategory[]>>('/admin/event-categories');
    return data.data;
  },

  async createEventCategory(payload: Partial<EventCategory>): Promise<EventCategory> {
    const { data } = await api.post<ApiResponse<EventCategory>>('/admin/event-categories', payload);
    return data.data;
  },

  async updateEventCategory(id: number, payload: Partial<EventCategory>): Promise<EventCategory> {
    const { data } = await api.put<ApiResponse<EventCategory>>(`/admin/event-categories/${id}`, payload);
    return data.data;
  },

  async deleteEventCategory(id: number): Promise<void> {
    await api.delete(`/admin/event-categories/${id}`);
  },
};
