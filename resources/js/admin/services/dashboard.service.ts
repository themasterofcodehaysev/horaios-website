import api from './api';
import type { ApiResponse, DashboardData } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardData> {
    const { data } = await api.get<ApiResponse<DashboardData>>('/admin/dashboard');
    return data.data;
  },
};
