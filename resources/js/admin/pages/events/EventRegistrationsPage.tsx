import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, Mail, Phone, CheckCircle, Eye, Archive, Trash2, AlertTriangle,
  ChevronLeft, ChevronRight, X, Clock, Calendar, Ticket, Users, Layers, ExternalLink,
  MessageSquare, Check, Sparkles
} from 'lucide-react';
import { contactService } from '../../services/contact.service';
import type { ContactMessage, PaginatedResponse, ContactMessageFilters, ContactMessageStats } from '../../types';

export const EventRegistrationsPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactMessageStats | null>(null);
  const [meta, setMeta] = useState<PaginatedResponse<ContactMessage>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContactMessageFilters>({ page: 1, per_page: 15, type: 'event' });
  const [searchInput, setSearchInput] = useState('');
  const [viewModal, setViewModal] = useState<{ open: boolean; message: ContactMessage | null }>({ open: false, message: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; message: ContactMessage | null }>({ open: false, message: null });
  const [deleting, setDeleting] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await contactService.getAdminContactMessages({ ...filters, type: 'event' });
      setMessages(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load event registrations');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await contactService.getContactMessageStats('event');
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

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
      fetchRegistrations();
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete registration');
    } finally {
      setDeleting(false);
    }
  };

  const extractEventName = (subject: string) => {
    if (subject.startsWith('Event Registration:')) {
      return subject.replace('Event Registration:', '').trim();
    }
    return subject;
  };

  const parseRegistrationDetails = (messageText: string) => {
    const attendeesMatch = messageText.match(/Attendees Count:\s*(\d+)/i);
    const dateMatch = messageText.match(/Date:\s*([^\n]+)/i);
    const locationMatch = messageText.match(/Location:\s*([^\n]+)/i);
    const notesMatch = messageText.match(/Notes:\s*([\s\S]+)$/i);

    return {
      attendees: attendeesMatch ? parseInt(attendeesMatch[1], 10) : 1,
      date: dateMatch ? dateMatch[1].trim() : null,
      location: locationMatch ? locationMatch[1].trim() : null,
      notes: notesMatch ? notesMatch[1].trim() : null,
    };
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
            to="/admin/events"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Back to Events"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-h3 text-neutral-900 font-bold">Event Registrations</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-red/10 text-primary-red">
                Attendees
              </span>
            </div>
            <p className="text-body-xs text-neutral-500 mt-0.5">
              Review, track, and manage all member and visitor registrations for church events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-50 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-500" /> Events
          </Link>
          <Link
            to="/admin/events/categories"
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
            <p className="text-body-xs font-medium text-neutral-500">Total Registrations</p>
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
            <p className="text-body-xs font-medium text-emerald-600">Confirmed</p>
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
              placeholder="Search by attendee name, email, event title, or notes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-body-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
              aria-label="Filter registrations by status"
              className="px-3 py-2 text-body-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 focus:outline-none focus:border-primary-red"
            >
              <option value="">All Statuses</option>
              <option value="unread">New / Unread</option>
              <option value="read">Reviewed</option>
              <option value="replied">Confirmed</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={filters.sort_dir || 'desc'}
              onChange={(e) => setFilters((f) => ({ ...f, sort_dir: e.target.value as 'asc' | 'desc', page: 1 }))}
              aria-label="Sort registrations by date"
              className="px-3 py-2 text-body-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 focus:outline-none focus:border-primary-red"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-body-sm text-neutral-500">Loading event registrations...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchRegistrations}
              className="mt-3 text-body-sm text-primary-red hover:underline font-medium"
            >
              Try again
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <Ticket className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-body-lg font-semibold text-neutral-800">No event registrations found</h3>
            <p className="text-body-sm text-neutral-500 mt-1 max-w-sm mx-auto">
              {searchInput || filters.status
                ? 'Try adjusting your search terms or filters.'
                : 'When visitors or members register for an upcoming event, their submissions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70 text-body-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Attendee</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Party Size</th>
                  <th className="py-3 px-4">Date Registered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-body-sm">
                {messages.map((msg) => {
                  const eventName = extractEventName(msg.subject);
                  const parsed = parseRegistrationDetails(msg.message);

                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-neutral-50/60 transition-colors ${
                        msg.status === 'unread' ? 'bg-blue-50/20 font-medium' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-red/10 text-primary-red flex items-center justify-center font-semibold text-body-sm shrink-0">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900">{msg.name}</div>
                            <div className="flex items-center gap-2 text-body-xs text-neutral-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-neutral-400" />
                                <a href={`mailto:${msg.email}`} className="hover:text-primary-red hover:underline">
                                  {msg.email}
                                </a>
                              </span>
                              {msg.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-neutral-400" />
                                  <a href={`tel:${msg.phone}`} className="hover:text-primary-red hover:underline">
                                    {msg.phone}
                                  </a>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-body-xs font-semibold">
                          <Ticket className="w-3.5 h-3.5 text-primary-red" />
                          <span>{eventName}</span>
                        </div>
                        {parsed.date && (
                          <div className="text-body-xs text-neutral-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {parsed.date}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1 text-body-xs font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded">
                          <Users className="w-3 h-3 text-neutral-400" />
                          <span>{parsed.attendees} {parsed.attendees === 1 ? 'person' : 'people'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-500 text-body-xs">
                        <div>{new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-neutral-400 mt-0.5">
                          {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                            msg.status
                          )}`}
                        >
                          {msg.status === 'replied' ? 'Confirmed' : msg.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openView(msg)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="View Registration Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {msg.status !== 'replied' && (
                            <button
                              onClick={() => handleUpdateStatus(msg, 'replied')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Mark as Confirmed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {msg.status !== 'archived' && (
                            <button
                              onClick={() => handleUpdateStatus(msg, 'archived')}
                              className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteModal({ open: true, message: msg })}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
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

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between text-body-xs text-neutral-600">
            <div>
              Showing {meta.from} to {meta.to} of {meta.total} registrations
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
                className="p-1.5 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-medium">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                className="p-1.5 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewModal.open && viewModal.message && (() => {
        const msg = viewModal.message;
        const eventName = extractEventName(msg.subject);
        const parsed = parseRegistrationDetails(msg.message);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-neutral-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-red/10 text-primary-red flex items-center justify-center font-bold text-h4">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-h4 font-bold text-neutral-900">{msg.name}</h3>
                    <p className="text-body-xs text-neutral-500 mt-0.5">
                      Submitted on {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewModal({ open: false, message: null })}
                  className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-body-sm">
                {/* Event Card */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
                  <div className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Event Registered
                  </div>
                  <div className="text-body-md font-bold text-neutral-900 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-primary-red" />
                    <span>{eventName}</span>
                  </div>
                  {(parsed.date || parsed.location) && (
                    <div className="mt-2 pt-2 border-t border-neutral-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-xs text-neutral-600">
                      {parsed.date && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{parsed.date}</span>
                        </div>
                      )}
                      {parsed.location && (
                        <div className="flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{parsed.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Attendee Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-body-xs text-neutral-500 mb-0.5">Email Address</div>
                    <div className="font-medium text-neutral-800 break-all flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <a href={`mailto:${msg.email}`} className="hover:text-primary-red hover:underline">
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-body-xs text-neutral-500 mb-0.5">Phone Number</div>
                    <div className="font-medium text-neutral-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      {msg.phone ? (
                        <a href={`tel:${msg.phone}`} className="hover:text-primary-red hover:underline">
                          {msg.phone}
                        </a>
                      ) : (
                        <span className="text-neutral-400">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Party Size & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-body-xs text-neutral-500 mb-0.5">Total Attendees</div>
                    <div className="font-bold text-neutral-900 text-body-md flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-primary-red" />
                      <span>{parsed.attendees} {parsed.attendees === 1 ? 'attendee' : 'attendees'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-body-xs text-neutral-500 mb-1">Registration Status</div>
                    <div className="flex flex-wrap gap-1">
                      {(['unread', 'read', 'replied', 'archived'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleUpdateStatus(msg, s)}
                          className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                            msg.status === s
                              ? 'bg-primary-red text-white'
                              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {s === 'replied' ? 'Confirmed' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Notes or Raw Message */}
                <div>
                  <div className="text-body-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Attendee Notes & Details</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 whitespace-pre-line leading-relaxed text-body-sm">
                    {parsed.notes && parsed.notes !== 'None' ? parsed.notes : (
                      <span className="text-neutral-400 italic">No additional notes provided by attendee.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Confirmation: Registration for ${eventName}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-red text-white text-body-xs font-medium rounded-lg hover:bg-primary-dark-red transition-colors shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email Attendee
                  </a>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-body-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-500" /> Call
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  {msg.status !== 'replied' && (
                    <button
                      onClick={() => handleUpdateStatus(msg, 'replied')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-body-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Confirm Registration
                    </button>
                  )}
                  <button
                    onClick={() => setViewModal({ open: false, message: null })}
                    className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-body-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-h4 font-bold text-neutral-900">Delete Registration</h3>
              <p className="text-body-sm text-neutral-500">
                Are you sure you want to remove the event registration from{' '}
                <span className="font-semibold text-neutral-800">{deleteModal.message.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                disabled={deleting}
                onClick={() => setDeleteModal({ open: false, message: null })}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
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

export default EventRegistrationsPage;
