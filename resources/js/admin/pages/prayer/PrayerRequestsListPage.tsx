import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Plus, Heart, CheckCircle, Clock, Archive, Trash2, AlertTriangle,
  ChevronLeft, ChevronRight, X, Eye, MessageSquare, Filter, MoreVertical,
} from 'lucide-react';
import { prayerService } from '../../services/prayer.service';
import type { PrayerRequest, PaginatedResponse, PrayerRequestFilters, PrayerRequestStats } from '../../types';

const PrayerRequestsListPage: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [stats, setStats] = useState<PrayerRequestStats | null>(null);
  const [meta, setMeta] = useState<PaginatedResponse<PrayerRequest>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PrayerRequestFilters>({ page: 1, per_page: 15 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; prayer: PrayerRequest | null }>({ open: false, prayer: null });
  const [deleting, setDeleting] = useState(false);

  const fetchPrayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await prayerService.getAdminPrayerRequests(filters);
      setPrayers(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load prayer requests');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await prayerService.getPrayerRequestStats();
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchPrayers(); }, [fetchPrayers]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleUpdateStatus = async (prayer: PrayerRequest, status: string) => {
    try {
      const updated = await prayerService.updatePrayerRequestStatus(prayer.id, status);
      setPrayers(prev => prev.map(p => p.id === prayer.id ? updated : p));
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.prayer) return;
    try {
      setDeleting(true);
      await prayerService.deletePrayerRequest(deleteModal.prayer.id);
      setDeleteModal({ open: false, prayer: null });
      fetchPrayers();
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete prayer request');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewed: 'bg-blue-100 text-blue-700',
      praying: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      archived: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getUrgencyBadge = (urgency: string) => {
    const styles = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return styles[urgency as keyof typeof styles] || styles.medium;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Prayer Requests</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage and respond to prayer requests from the community.
          </p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Total</div>
            <div className="text-h3 text-neutral-900 font-semibold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Pending</div>
            <div className="text-h3 text-yellow-600 font-semibold">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Reviewed</div>
            <div className="text-h3 text-blue-600 font-semibold">{stats.reviewed}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Praying</div>
            <div className="text-h3 text-purple-600 font-semibold">{stats.praying}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Completed</div>
            <div className="text-h3 text-green-600 font-semibold">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Archived</div>
            <div className="text-h3 text-gray-600 font-semibold">{stats.archived}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Urgent</div>
            <div className="text-h3 text-red-600 font-semibold">{stats.urgent}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Public</div>
            <div className="text-h3 text-primary-red font-semibold">{stats.public}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, title, or request..."
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
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="praying">Praying</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filters.urgency || ''}
            onChange={(e) => setFilters(f => ({ ...f, urgency: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">All Urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            value={filters.request_type || ''}
            onChange={(e) => setFilters(f => ({ ...f, request_type: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="healing">Healing</option>
            <option value="guidance">Guidance</option>
            <option value="thanksgiving">Thanksgiving</option>
            <option value="emergency">Emergency</option>
          </select>
          <select
            value={filters.allow_public_prayer === undefined || filters.allow_public_prayer === '' ? '' : String(filters.allow_public_prayer)}
            onChange={(e) => {
              const val = e.target.value;
              setFilters(f => ({ ...f, allow_public_prayer: val === '' ? undefined : (val === 'true' ? true : false), page: 1 }));
            }}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">Public Prayer</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
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
            <button onClick={fetchPrayers} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : prayers.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No prayer requests found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {prayers.map((prayer) => (
              <div key={prayer.id} className="px-5 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body-sm font-medium text-neutral-900 truncate">{prayer.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-body-xs font-medium ${getUrgencyBadge(prayer.urgency)}`}>
                        {prayer.urgency}
                      </span>
                    </div>
                    <p className="text-body-xs text-neutral-600 line-clamp-2 mb-2">{prayer.request}</p>
                    <div className="flex items-center gap-3 text-body-xs text-neutral-500">
                      <span>{prayer.is_anonymous ? 'Anonymous' : prayer.name}</span>
                      <span>•</span>
                      <span>{new Date(prayer.created_at).toLocaleDateString()}</span>
                      {prayer.allow_public_prayer && (
                        <>
                          <span>•</span>
                          <span className="text-primary-red">Public</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-body-xs font-medium ${getStatusBadge(prayer.status)}`}>
                      {prayer.status}
                    </span>
                    <div className="flex items-center gap-1">
                      {prayer.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(prayer, 'reviewed')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Mark as Reviewed"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {prayer.status !== 'praying' && prayer.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(prayer, 'praying')}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="Mark as Praying"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      )}
                      {prayer.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(prayer, 'completed')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark as Completed"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteModal({ open: true, prayer })}
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

      {deleteModal.open && deleteModal.prayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-h3 text-neutral-900 font-semibold mb-2">Delete Prayer Request</h3>
            <p className="text-body-sm text-neutral-600 mb-6">
              Are you sure you want to delete this prayer request from {deleteModal.prayer.name}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, prayer: null })}
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

export default PrayerRequestsListPage;
