import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Notification,
  NotificationStats,
} from '../types';

export const notificationService = {
  async getNotifications(perPage = 20): Promise<PaginatedResponse<Notification>> {
    const { data } = await api.get<PaginatedResponse<Notification>>(`/notifications?per_page=${perPage}`);
    return data;
  },

  async getUnreadCount(): Promise<NotificationStats> {
    try {
      const { data } = await api.get<ApiResponse<NotificationStats>>('/notifications/unread-count');
      return data.data;
    } catch (error) {
      // If the endpoint doesn't exist, return default values
      return { count: 0, unread_count: 0 };
    }
  },


  async markAsRead(id: number): Promise<Notification> {
    const { data } = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return data.data;
  },

  async markAllAsRead(): Promise<NotificationStats> {
    const { data } = await api.post<ApiResponse<NotificationStats>>('/notifications/mark-all-read');
    return data.data;
  },

  async deleteNotification(id: number): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};
