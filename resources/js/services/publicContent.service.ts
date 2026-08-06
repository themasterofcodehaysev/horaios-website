import api from '../admin/services/api';
import type {
  ApiResponse,
  PaginatedResponse,
  BlogPostPublic,
  BlogCategoryPublic,
  BlogFilters,
  EventPublic,
  EventCategoryPublic,
  EventFilters,
  MinistryPublic,
  MinistryCategoryPublic,
  MinistryFilters,
} from '../types';

export const blogService = {
  async getPublicPosts(filters: BlogFilters = {}): Promise<PaginatedResponse<BlogPostPublic>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<BlogPostPublic>>(`/blog-posts?${params.toString()}`);
    return data;
  },

  async getPublicPostDetail(slug: string): Promise<BlogPostPublic> {
    const { data } = await api.get<ApiResponse<BlogPostPublic>>(`/blog-posts/${slug}`);
    return data.data;
  },

  async getRelatedPosts(slug: string): Promise<BlogPostPublic[]> {
    const { data } = await api.get<ApiResponse<BlogPostPublic[]>>(`/blog-posts/${slug}/related`);
    return data.data;
  },

  async getPublicCategories(): Promise<BlogCategoryPublic[]> {
    const { data } = await api.get<ApiResponse<BlogCategoryPublic[]>>('/blog-categories');
    return data.data;
  },
};

export const eventService = {
  async getPublicEvents(filters: EventFilters = {}): Promise<PaginatedResponse<EventPublic>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.start_date_from) params.set('start_date_from', filters.start_date_from);
    if (filters.start_date_to) params.set('start_date_to', filters.start_date_to);
    if (filters.scope) params.set('scope', filters.scope);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<EventPublic>>(`/events?${params.toString()}`);
    return data;
  },

  async getPublicEventDetail(slug: string): Promise<EventPublic> {
    const { data } = await api.get<ApiResponse<EventPublic>>(`/events/${slug}`);
    return data.data;
  },

  async getRelatedEvents(slug: string): Promise<EventPublic[]> {
    const { data } = await api.get<ApiResponse<EventPublic[]>>(`/events/${slug}/related`);
    return data.data;
  },

  async getPublicCategories(): Promise<EventCategoryPublic[]> {
    const { data } = await api.get<ApiResponse<EventCategoryPublic[]>>('/event-categories');
    return data.data;
  },
};

export const ministryService = {
  async getPublicMinistries(filters: MinistryFilters = {}): Promise<PaginatedResponse<MinistryPublic>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

    const { data } = await api.get<PaginatedResponse<MinistryPublic>>(`/ministries?${params.toString()}`);
    return data;
  },

  async getPublicMinistryDetail(slug: string): Promise<MinistryPublic> {
    const { data } = await api.get<ApiResponse<MinistryPublic>>(`/ministries/${slug}`);
    return data.data;
  },

  async getRelatedMinistries(slug: string): Promise<MinistryPublic[]> {
    const { data } = await api.get<ApiResponse<MinistryPublic[]>>(`/ministries/${slug}/related`);
    return data.data;
  },

  async getPublicCategories(): Promise<MinistryCategoryPublic[]> {
    const { data } = await api.get<ApiResponse<MinistryCategoryPublic[]>>('/ministry-categories');
    return data.data;
  },
};
