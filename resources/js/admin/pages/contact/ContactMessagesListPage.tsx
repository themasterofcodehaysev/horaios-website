import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Mail, CheckCircle, Eye, Archive, Trash2, AlertTriangle,
  ChevronLeft, ChevronRight, X, MessageSquare, Reply, Send,
} from 'lucide-react';
import { contactService } from '../../services/contact.service';
import type { ContactMessage, PaginatedResponse, ContactMessageFilters, ContactMessageStats } from '../../types';

const ContactMessagesListPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactMessageStats | null>(null);
  const [meta, setMeta] = useState<PaginatedResponse<ContactMessage>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContactMessageFilters>({ page: 1, per_page: 15 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; message: ContactMessage | null }>({ open: false, message: null });
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await contactService.getAdminContactMessages(filters);
      setMessages(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await contactService.getContactMessageStats();
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleUpdateStatus = async (message: ContactMessage, status: string) => {
    try {
      const updated = await contactService.updateContactMessageStatus(message.id, status);
      setMessages(prev => prev.map(m => m.id === message.id ? updated : m));
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.message) return;
    try {
      setDeleting(true);
      await contactService.deleteContactMessage(deleteModal.message.id);
      setDeleteModal({ open: false, message: null });
      fetchMessages();
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete contact message');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      unread: 'bg-blue-100 text-blue-700',
      read: 'bg-gray-100 text-gray-700',
      replied: 'bg-green-100 text-green-700',
      archived: 'bg-yellow-100 text-yellow-700',
    };
    return styles[status as keyof typeof styles] || styles.unread;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Contact Messages</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage and respond to messages from the contact form.
          </p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Total</div>
            <div className="text-h3 text-neutral-900 font-semibold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Unread</div>
            <div className="text-h3 text-blue-600 font-semibold">{stats.unread}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Read</div>
            <div className="text-h3 text-gray-600 font-semibold">{stats.read}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Replied</div>
            <div className="text-h3 text-green-600 font-semibold">{stats.replied}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Archived</div>
            <div className="text-h3 text-yellow-600 font-semibold">{stats.archived}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="animate-pulse divide-y divide-neutral-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-neutral-100 rounded" />
                  <div className="h-3 w-32 bg-neutral-50 rounded" />
                </div>
                <div className="h-6 w-20 bg-neutral-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
            <button onClick={fetchMessages} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : messages.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Mail className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No contact messages found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {messages.map((message) => (
              <div key={message.id} className="px-5 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body-sm font-medium text-neutral-900 truncate">{message.subject}</h3>
                      {message.status === 'unread' && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-body-xs text-neutral-600 line-clamp-2 mb-2">{message.message}</p>
                    <div className="flex items-center gap-3 text-body-xs text-neutral-500">
                      <span>{message.name}</span>
                      <span>•</span>
                      <span>{message.email}</span>
                      <span>•</span>
                      <span>{new Date(message.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-body-xs font-medium ${getStatusBadge(message.status)}`}>
                      {message.status}
                    </span>
                    <div className="flex items-center gap-1">
                      {message.status === 'unread' && (
                        <button
                          onClick={() => handleUpdateStatus(message, 'read')}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg"
                          title="Mark as Read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {message.status !== 'replied' && (
                        <button
                          onClick={() => handleUpdateStatus(message, 'replied')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark as Replied"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                      )}
                      {message.status !== 'archived' && (
                        <button
                          onClick={() => handleUpdateStatus(message, 'archived')}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteModal({ open: true, message })}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                onClick={() => setFilters(f => ({ ...f, page: f.page! - 1 }))}
                disabled={!meta.prev}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-body-sm text-neutral-700">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page! + 1 }))}
                disabled={!meta.next}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteModal.open && deleteModal.message && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-h3 text-neutral-900 font-semibold mb-2">Delete Contact Message</h3>
            <p className="text-body-sm text-neutral-600 mb-6">
              Are you sure you want to delete this message from {deleteModal.message.name}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, message: null })}
                className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-body-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesListPage;
