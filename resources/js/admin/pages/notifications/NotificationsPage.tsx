import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Check, CheckCircle, Trash2, ChevronLeft, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { notificationService } from '../../services/notification.service';
import type { Notification, PaginatedResponse } from '../../types';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Notification>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await notificationService.getNotifications(20);
      setNotifications(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unread_count || data.count || 0);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);
  useEffect(() => { fetchUnreadCount(); }, [fetchUnreadCount]);

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
      fetchUnreadCount();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      fetchUnreadCount();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      new_prayer_request: '🙏',
      new_contact_message: '✉️',
      new_user: '👤',
      system_alert: '⚠️',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Notifications</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Stay updated with important alerts and updates.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-sm font-medium hover:bg-neutral-50 shadow-xs"
          >
            <CheckCircle className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-body-sm text-neutral-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
            <button onClick={() => fetchNotifications()} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-5 py-4 hover:bg-neutral-50 transition-colors ${!notification.is_read ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body-sm font-medium text-neutral-900">{notification.title}</h3>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-body-sm text-neutral-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-3 text-body-xs text-neutral-500">
                      <span>{new Date(notification.created_at).toLocaleString()}</span>
                      {notification.link && (
                        <>
                          <span>•</span>
                          <a
                            href={notification.link}
                            className="text-primary-red hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200">
            <div className="text-body-xs text-neutral-500">
              Showing {meta.from} to {meta.to} of {meta.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchNotifications(meta.current_page - 1)}
                disabled={meta.current_page <= 1}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-body-sm text-neutral-700">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                onClick={() => fetchNotifications(meta.current_page + 1)}
                disabled={meta.current_page >= meta.last_page}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
