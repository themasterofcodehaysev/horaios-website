import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, Mail, Phone, CheckCircle, Eye, Archive, Trash2, AlertTriangle,
  ChevronLeft, ChevronRight, X, Reply, Clock, Heart, Users, Layers, ExternalLink,
  MessageSquare, ShieldCheck,
} from 'lucide-react';
import { contactService } from '../../services/contact.service';
import type { ContactMessage, PaginatedResponse, ContactMessageFilters, ContactMessageStats } from '../../types';

export const MinistryJoinRequestsPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactMessageStats | null>(null);
  const [meta, setMeta] = useState<PaginatedResponse<ContactMessage>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContactMessageFilters>({ page: 1, per_page: 15, type: 'ministry' });
  const [searchInput, setSearchInput] = useState('');
  const [viewModal, setViewModal] = useState<{ open: boolean; message: ContactMessage | null }>({ open: false, message: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; message: ContactMessage | null }>({ open: false, message: null });
  const [deleting, setDeleting] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await contactService.getAdminContactMessages({ ...filters, type: 'ministry' });
      setMessages(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load ministry join requests');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await contactService.getContactMessageStats('ministry');
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleUpdateStatus = async (message: ContactMessage, status: string) => {
    try {
      const updated = await contactService.updateContactMessageStatus(message.id, status);
      setMessages((prev) => prev.map((m) => (m.id === message.id ? updated : m)));
      if (viewModal.open && viewModal.message?.id === message.id) {
        setViewModal({ open: true, message: updated });
      }
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
      if (viewModal.open && viewModal.message?.id === deleteModal.message.id) {
        setViewModal({ open: false, message: null });
      }
      fetchRequests();
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete join request');
    } finally {
      setDeleting(false);
    }
  };

  const extractMinistryName = (subject: string) => {
    if (subject.startsWith('Join Ministry:')) {
      return subject.replace('Join Ministry:', '').trim();
    }
    return subject;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'read':
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      case 'replied':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'archived':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const openView = (msg: ContactMessage) => {
    setViewModal({ open: true, message: msg });
    if (msg.status === 'unread') {
      handleUpdateStatus(msg, 'read');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/ministries"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Back to Ministries"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-h3 text-neutral-900 font-bold">Ministry Join Requests</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-navy/10 text-primary-navy">
                Inquiries
              </span>
            </div>
            <p className="text-body-xs text-neutral-500 mt-0.5">
              Review and manage member and visitor applications to join church ministries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/ministries"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-50 shadow-xs"
          >
            <Heart className="w-3.5 h-3.5 text-neutral-500" /> Ministries
          </Link>
          <Link
            to="/admin/ministries/categories"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-50 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" /> Categories
          </Link>
        </div>
      </div>

      {/* Stats Counter Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
            <p className="text-body-xs font-medium text-neutral-500">Total Requests</p>
            <p className="text-h3 font-bold text-neutral-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
            <p className="text-body-xs font-medium text-blue-600">Unread / New</p>
            <p className="text-h3 font-bold text-blue-600 mt-1">{stats.unread}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
            <p className="text-body-xs font-medium text-neutral-600">Reviewed</p>
            <p className="text-h3 font-bold text-neutral-700 mt-1">{stats.read}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
            <p className="text-body-xs font-medium text-emerald-600">Connected</p>
            <p className="text-h3 font-bold text-emerald-600 mt-1">{stats.replied}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
            <p className="text-body-xs font-medium text-amber-600">Archived</p>
            <p className="text-h3 font-bold text-amber-600 mt-1">{stats.archived}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by applicant name, email, ministry, or message..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-body-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
              className="px-3 py-2 text-body-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-primary-red"
            >
              <option value="">All Statuses</option>
              <option value="unread">Unread / New</option>
              <option value="read">Reviewed</option>
              <option value="replied">Connected / Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Join Requests Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
            <button
              onClick={fetchRequests}
              className="text-body-sm text-primary-red font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-navy/5 text-primary-navy flex items-center justify-center mx-auto mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-h5 font-bold text-neutral-900 mb-1">No Ministry Join Requests Found</h3>
            <p className="text-body-sm text-neutral-500 max-w-md mx-auto mb-4">
              When church members or visitors click "Join Ministry" on any ministry page and submit their information, their inquiries will appear here.
            </p>
            <Link
              to="/admin/ministries"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-navy text-white rounded-lg text-body-sm font-medium hover:bg-primary-navy/90"
            >
              <Heart className="w-4 h-4" /> View Church Ministries
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-body-xs text-neutral-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Ministry Requested</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {messages.map((msg) => {
                  const targetMinistry = extractMinistryName(msg.subject);
                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        msg.status === 'unread' ? 'bg-blue-50/20 font-medium' : ''
                      }`}
                    >
                      {/* Applicant info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-navy/10 text-primary-navy flex items-center justify-center font-bold text-xs shrink-0">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-body-sm font-bold text-neutral-900 leading-tight">
                              {msg.name}
                            </p>
                            <div className="flex flex-col text-body-xs text-neutral-500 mt-0.5">
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-primary-navy hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Mail className="w-3 h-3 text-neutral-400" />
                                {msg.email}
                              </a>
                              {msg.phone && (
                                <a
                                  href={`tel:${msg.phone}`}
                                  className="text-neutral-500 hover:underline flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Phone className="w-3 h-3 text-neutral-400" />
                                  {msg.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ministry */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-navy text-white shadow-xs">
                          <Heart className="w-3 h-3 text-amber-300" />
                          {targetMinistry}
                        </span>
                      </td>

                      {/* Message excerpt */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-body-xs text-neutral-600 line-clamp-2">
                          {msg.message}
                        </p>
                      </td>

                      {/* Status badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                            msg.status
                          )}`}
                        >
                          {msg.status === 'replied' && <CheckCircle className="w-3 h-3" />}
                          {msg.status === 'archived' && <Archive className="w-3 h-3" />}
                          {msg.status === 'unread' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                          <span className="capitalize">{msg.status}</span>
                        </span>
                      </td>

                      {/* Submitted date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-body-xs text-neutral-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          {new Date(msg.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openView(msg)}
                            className="p-1.5 text-neutral-500 hover:text-primary-navy hover:bg-neutral-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                            onClick={() => {
                              if (msg.status !== 'replied') {
                                handleUpdateStatus(msg, 'replied');
                              }
                            }}
                            className="p-1.5 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Reply via Email"
                          >
                            <Reply className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setDeleteModal({ open: true, message: msg })}
                            className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 bg-neutral-50 text-body-xs text-neutral-500">
            <div>
              Showing page <strong className="text-neutral-900">{meta.current_page}</strong> of{' '}
              <strong className="text-neutral-900">{meta.last_page}</strong> ({meta.total} requests)
            </div>
            <div className="flex gap-1">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {viewModal.open && viewModal.message && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-scale-in space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-navy text-white">
                    <Heart className="w-3 h-3 text-amber-300" />
                    {extractMinistryName(viewModal.message.subject)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                      viewModal.message.status
                    )}`}
                  >
                    {viewModal.message.status}
                  </span>
                </div>
                <h3 className="text-h4 font-bold text-neutral-900 mt-2">
                  {viewModal.message.name}
                </h3>
                <p className="text-body-xs text-neutral-500">
                  Received on {new Date(viewModal.message.created_at).toLocaleString('en-US')}
                </p>
              </div>
              <button
                onClick={() => setViewModal({ open: false, message: null })}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-body-sm">
              <div>
                <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${viewModal.message.email}`}
                  className="text-primary-navy font-semibold hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-neutral-400" />
                  {viewModal.message.email}
                </a>
              </div>
              <div>
                <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Phone
                </p>
                {viewModal.message.phone ? (
                  <a
                    href={`tel:${viewModal.message.phone}`}
                    className="text-neutral-800 font-semibold hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-neutral-400" />
                    {viewModal.message.phone}
                  </a>
                ) : (
                  <span className="text-neutral-400 italic">Not provided</span>
                )}
              </div>
            </div>

            {/* Inquirer's Message */}
            <div>
              <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Inquiry Message
              </p>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-body-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
                {viewModal.message.message}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-1.5">
                <span className="text-body-xs font-medium text-neutral-500 mr-1">Status:</span>
                <button
                  onClick={() => handleUpdateStatus(viewModal.message!, 'read')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    viewModal.message.status === 'read'
                      ? 'bg-neutral-800 text-white border-neutral-800'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewModal.message!, 'replied')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    viewModal.message.status === 'replied'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Mark Connected
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewModal.message!, 'archived')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    viewModal.message.status === 'archived'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Archive
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${viewModal.message.email}?subject=RE: ${encodeURIComponent(
                    viewModal.message.subject
                  )}`}
                  onClick={() => handleUpdateStatus(viewModal.message!, 'replied')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-red text-white rounded-lg text-body-xs font-semibold hover:bg-primary-dark-red shadow-sm transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" /> Reply by Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.message && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-h5 font-bold text-neutral-900">Delete Join Request?</h3>
                <p className="text-body-xs text-neutral-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-body-sm text-neutral-600">
              Are you sure you want to delete the join request from{' '}
              <strong className="text-neutral-900">{deleteModal.message.name}</strong> for{' '}
              <strong className="text-neutral-900">
                {extractMinistryName(deleteModal.message.subject)}
              </strong>
              ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, message: null })}
                className="px-4 py-2 rounded-lg text-body-xs font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-body-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
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

export default MinistryJoinRequestsPage;
