import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  BlogItem,
  BlogCategory,
  CreateBlogPayload,
  UpdateBlogPayload,
  BlogFilters,
} from '../types';

export const blogService = {
  async getPublicBlogs(filters: BlogFilters = {}): Promise<PaginatedResponse<BlogItem>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', String(filters.category_id));
    if (filters.category_slug) params.set('category_slug', filters.category_slug);
    if (filters.featured !== undefined && filters.featured !== '') params.set('featured', String(filters.featured));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));

    const { data } = await api.get<PaginatedResponse<BlogItem>>(`/blogs?${params.toString()}`);
    return data;
  },

  async getPublicBlogDetail(identifier: string): Promise<BlogItem> {
    const { data } = await api.get<ApiResponse<BlogItem>>(`/blogs/${identifier}`);
    return data.data;
  },

  async getRelatedBlogPosts(identifier: string): Promise<BlogItem[]> {
    const { data } = await api.get<ApiResponse<BlogItem[]>>(`/blogs/${identifier}/related`);
    return data.data;
  },

  async getPublicBlogCategories(): Promise<BlogCategory[]> {
    const { data } = await api.get<ApiResponse<BlogCategory[]>>('/blog-categories');
    return data.data;
  },

  async getAdminBlogs(filters: BlogFilters = {}): Promise<PaginatedResponse<BlogItem>> {
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

    const { data } = await api.get<PaginatedResponse<BlogItem>>(`/admin/blogs?${params.toString()}`);
    return data;
  },

  async getBlog(idOrSlug: string | number): Promise<BlogItem> {
    const { data } = await api.get<ApiResponse<BlogItem>>(`/blogs/${idOrSlug}`);
    return data.data;
  },

  async createBlog(payload: CreateBlogPayload): Promise<BlogItem> {
    const { data } = await api.post<ApiResponse<BlogItem>>('/admin/blogs', payload);
    return data.data;
  },

  async updateBlog(id: number, payload: UpdateBlogPayload): Promise<BlogItem> {
    const { data } = await api.put<ApiResponse<BlogItem>>(`/admin/blogs/${id}`, payload);
    return data.data;
  },

  async deleteBlog(id: number): Promise<void> {
    await api.delete(`/admin/blogs/${id}`);
  },

  async togglePublishBlog(id: number): Promise<BlogItem> {
    const { data } = await api.patch<ApiResponse<BlogItem>>(`/admin/blogs/${id}/toggle-publish`);
    return data.data;
  },

  async toggleFeaturedBlog(id: number): Promise<BlogItem> {
    const { data } = await api.patch<ApiResponse<BlogItem>>(`/admin/blogs/${id}/toggle-featured`);
    return data.data;
  },

  async duplicateBlog(id: number): Promise<BlogItem> {
    const { data } = await api.post<ApiResponse<BlogItem>>(`/admin/blogs/${id}/duplicate`);
    return data.data;
  },

  async getAdminBlogCategories(): Promise<BlogCategory[]> {
    const { data } = await api.get<ApiResponse<BlogCategory[]>>('/admin/blog-categories');
    return data.data;
  },

  async createBlogCategory(payload: Partial<BlogCategory>): Promise<BlogCategory> {
    const { data } = await api.post<ApiResponse<BlogCategory>>('/admin/blog-categories', payload);
    return data.data;
  },

  async updateBlogCategory(id: number, payload: Partial<BlogCategory>): Promise<BlogCategory> {
    const { data } = await api.put<ApiResponse<BlogCategory>>(`/admin/blog-categories/${id}`, payload);
    return data.data;
  },

  async deleteBlogCategory(id: number): Promise<void> {
    await api.delete(`/admin/blog-categories/${id}`);
  },
};
