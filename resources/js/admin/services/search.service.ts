import api from './api';
import type { ApiResponse, SearchResult } from '../types';

export const searchService = {
  async globalSearch(query: string, type?: string): Promise<SearchResult> {
    const params = new URLSearchParams();
    params.set('query', query);
    if (type) params.set('type', type);

    const { data } = await api.get<ApiResponse<SearchResult>>(`/search?${params.toString()}`);
    return data.data;
  },

  async searchByType(type: string, query: string, limit = 20): Promise<unknown> {
    const params = new URLSearchParams();
    params.set('query', query);
    params.set('limit', String(limit));

    const { data } = await api.get<ApiResponse<unknown>>(`/search/${type}?${params.toString()}`);
    return data.data;
  },
};
