import api from './api';
import { PaginatedResponse, AuditLog } from '../types';

export interface AuditLogFilters {
  user_id?: number;
  action?: string;
  entity?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export const AuditLogService = {
  getAuditLogs: async (filters: AuditLogFilters = {}): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get('/audit-logs', { params: filters });
    return response.data;
  },
  list: async (filters: AuditLogFilters = {}): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get('/audit-logs', { params: filters });
    return response.data;
  },
};

export const auditlogService = AuditLogService;
