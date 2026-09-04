import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Star, Eye, Edit2, Copy, Trash2, CheckCircle,
  XCircle, ChevronLeft, ChevronRight, X, AlertTriangle, Layers, Calendar, MapPin, Ban,
} from 'lucide-react';
import { eventService } from '../../services/event.service';
import type { EventItem, EventCategory, PaginatedResponse, EventFilters } from '../../types';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../hooks/useToast';

const EventsListPage: React.FC = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { addToast } = useToast();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<EventItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({ page: 1, per_page: 15 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; event: EventItem | null }>({ open: false, event: null });
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await eventService.getAdminEvents(filters);
      setEvents(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await eventService.getPublicEventCategories();
      setCategories(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleToggleFeatured = async (ev: EventItem) => {
    try {
      const updated = await eventService.toggleFeaturedEvent(ev.id);
      setEvents(prev => prev.map(e => e.id === ev.id ? updated : e));
      addToast({
        type: 'success',
        title: updated.featured ? 'Event Featured' : 'Event Unfeatured',
        message: `"${ev.title}" has been ${updated.featured ? 'featured' : 'unfeatured'}.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to update event',
        message: err?.response?.data?.message || 'Failed to toggle featured state',
      });
    }
  };

  const handleDuplicate = async (ev: EventItem) => {
    try {
      await eventService.duplicateEvent(ev.id);
      fetchEvents();
      addToast({
        type: 'success',
        title: 'Event Duplicated',
        message: `A draft copy of "${ev.title}" has been created.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to duplicate event',
        message: err?.response?.data?.message || 'Please try again.',
      });
    }
  };

  const handleCancel = async (ev: EventItem) => {
    const ok = await confirm({
      title: 'Cancel Event',
      message: (
        <span>
          Are you sure you want to cancel <strong>"{ev.title}"</strong>?
          <br />
          This will update the event status to cancelled.
        </span>
      ),
      confirmLabel: 'Cancel Event',
      variant: 'warning',
      icon: 'ban',
    });
    if (!ok) return;

    try {
      const updated = await eventService.cancelEvent(ev.id);
      setEvents(prev => prev.map(e => e.id === ev.id ? updated : e));
      addToast({
        type: 'success',
        title: 'Event Cancelled',
        message: `"${ev.title}" has been marked as cancelled.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to cancel event',
        message: err?.response?.data?.message || 'Please try again.',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.event) return;
    const title = deleteModal.event.title;
    try {
      setDeleting(true);
      await eventService.deleteEvent(deleteModal.event.id);
      setDeleteModal({ open: false, event: null });
      fetchEvents();
      addToast({
        type: 'success',
        title: 'Event Deleted',
        message: `"${title}" has been deleted.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to delete event',
        message: err?.response?.data?.message || 'Please try again.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDateTime = (ev: EventItem) => {
    const start = new Date(ev.start_date);
    const dateStr = start.toLocaleDateString();
    const timeStr = ev.start_time ? ` at ${ev.start_time.slice(0, 5)}` : '';
    if (ev.end_date) {
      const end = new Date(ev.end_date);
      if (end.toDateString() !== start.toDateString()) {
        return `${dateStr}${timeStr} – ${end.toLocaleDateString()}`;
      }
    }
    if (ev.end_time) {
      return `${dateStr}${timeStr}–${ev.end_time.slice(0, 5)}`;
    }
    return `${dateStr}${timeStr}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100';
      case 'draft': return 'bg-amber-50 text-amber-700 hover:bg-amber-100';
      case 'cancelled': return 'bg-red-50 text-red-700 hover:bg-red-100';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Events Management</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage church events, conferences, retreats, and registration settings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/events/categories"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-50 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" /> Categories
          </Link>
          <Link
            to="/admin/events/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Event
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, location, or description..."
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
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <select
            value={filters.category_id || ''}
            onChange={(e) => setFilters(f => ({ ...f, category_id: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filters.featured === undefined || filters.featured === '' ? '' : String(filters.featured)}
            onChange={(e) => {
              const val = e.target.value;
              setFilters(f => ({ ...f, featured: val === '' ? undefined : (val === 'true' ? true : false), page: 1 }));
            }}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">All Featured</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>
          <input
            type="date"
            value={filters.start_date_from || ''}
            onChange={(e) => setFilters(f => ({ ...f, start_date_from: e.target.value || undefined, page: 1 }))}
            placeholder="From"
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          />
          <input
            type="date"
            value={filters.start_date_to || ''}
            onChange={(e) => setFilters(f => ({ ...f, start_date_to: e.target.value || undefined, page: 1 }))}
            placeholder="To"
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="animate-pulse divide-y divide-neutral-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-12 h-10 rounded-lg bg-neutral-100" />
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
            <button onClick={fetchEvents} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : events.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No events found matching your criteria</p>
            <Link
              to="/admin/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              <Plus className="w-4 h-4" /> Add First Event
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[30px_60px_1fr_150px_130px_100px_140px] gap-3 px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-body-xs text-neutral-500 font-medium uppercase tracking-wide">
              <span></span>
              <span>Image</span>
              <span>Title & Category</span>
              <span>Date & Time</span>
              <span>Location</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {events.map((ev) => (
                <div key={ev.id} className="grid grid-cols-1 md:grid-cols-[30px_60px_1fr_150px_130px_100px_140px] gap-3 items-center px-5 py-3.5 hover:bg-neutral-50/60 transition-colors">
                  <div>
                    <button
                      onClick={() => handleToggleFeatured(ev)}
                      className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
                      title={ev.featured ? 'Unfeature event' : 'Feature event'}
                    >
                      <Star className={`w-4 h-4 ${ev.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="w-12 h-9 rounded bg-neutral-100 flex items-center justify-center relative overflow-hidden shrink-0">
                    {ev.featured_image ? (
                      <img src={ev.featured_image} alt={ev.title} className="w-full h-full object-cover" />
                    ) : (
                      <Calendar className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <Link
                      to={`/admin/events/${ev.id}/edit`}
                      className="text-body-sm text-neutral-900 font-semibold hover:text-primary-red transition-colors truncate block"
                    >
                      {ev.title}
                    </Link>
                    <p className="text-body-xs text-neutral-500 truncate">
                      {ev.category ? ev.category.name : 'Uncategorized'}
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-body-xs text-neutral-700 font-medium">{formatDateTime(ev)}</p>
                      {ev.registration_required && (
                        <p className="text-[10px] text-accent-blue font-semibold mt-0.5">
                          Registration Required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                    <p className="text-body-xs text-neutral-600 truncate">{ev.location || '—'}</p>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1 text-body-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadgeClass(ev.status)}`}>
                      {ev.status === 'published' && <CheckCircle className="w-3 h-3" />}
                      {ev.status === 'draft' && <XCircle className="w-3 h-3" />}
                      {ev.status === 'cancelled' && <Ban className="w-3 h-3" />}
                      {ev.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`/events/${ev.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Preview Event"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <Link
                      to={`/admin/events/${ev.id}/edit`}
                      className="p-1.5 text-neutral-500 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(ev)}
                      className="p-1.5 text-neutral-500 hover:text-accent-blue hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Duplicate Event"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {ev.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(ev)}
                        className="p-1.5 text-neutral-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Cancel Event"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteModal({ open: true, event: ev })}
                      className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-body-xs text-neutral-500">
            Showing {meta.from || 0}–{meta.to || 0} of {meta.total} events
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={meta.current_page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
              className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-body-sm font-medium text-neutral-700 px-3">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
              className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {deleteModal.open && deleteModal.event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, event: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">Delete Event</h3>
            <p className="text-body-sm text-neutral-500 text-center mb-6">
              Are you sure you want to delete <strong>"{deleteModal.event.title}"</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, event: null })}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsListPage;
