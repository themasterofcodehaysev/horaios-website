import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Star, Eye, Edit2, Copy, Trash2, CheckCircle,
  XCircle, ChevronLeft, ChevronRight, X, Music, AlertTriangle, Layers,
} from 'lucide-react';
import { songService } from '../../services/song.service';
import { useToast } from '../../hooks/useToast';
import type { SongItem, SongCategory, PaginatedResponse, SongFilters } from '../../types';

const SongsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [categories, setCategories] = useState<SongCategory[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<SongItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SongFilters>({ page: 1, per_page: 15 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; song: SongItem | null }>({ open: false, song: null });
  const [deleting, setDeleting] = useState(false);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await songService.getAdminSongs(filters);
      setSongs(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load songs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await songService.getCategories();
      setCategories(cats);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchSongs(); }, [fetchSongs]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTogglePublish = async (song: SongItem) => {
    try {
      const updated = await songService.togglePublish(song.id);
      setSongs(prev => prev.map(s => s.id === song.id ? updated : s));
      addToast({
        title: updated.status === 'published' ? 'Song Published' : 'Song Unpublished',
        message: `"${song.title}" is now ${updated.status}.`,
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Update Failed',
        message: err?.response?.data?.message || 'Failed to toggle status',
        type: 'error',
      });
    }
  };

  const handleToggleFeatured = async (song: SongItem) => {
    try {
      const updated = await songService.toggleFeatured(song.id);
      setSongs(prev => prev.map(s => s.id === song.id ? updated : s));
      addToast({
        title: updated.is_featured ? 'Song Featured' : 'Song Unfeatured',
        message: `"${song.title}" has been updated.`,
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Update Failed',
        message: err?.response?.data?.message || 'Failed to toggle featured state',
        type: 'error',
      });
    }
  };

  const handleDuplicate = async (song: SongItem) => {
    try {
      await songService.duplicateSong(song.id);
      addToast({
        title: 'Song Duplicated',
        message: `"${song.title}" was duplicated successfully.`,
        type: 'success',
      });
      fetchSongs(); // Refresh the list to show the duplicated song
    } catch (err: any) {
      addToast({
        title: 'Duplicate Failed',
        message: err?.response?.data?.message || 'Failed to duplicate song',
        type: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.song) return;
    try {
      setDeleting(true);
      await songService.deleteSong(deleteModal.song.id);
      addToast({
        title: 'Song Deleted',
        message: `"${deleteModal.song.title}" was deleted.`,
        type: 'success',
      });
      setDeleteModal({ open: false, song: null });
      fetchSongs();
    } catch (err: any) {
      addToast({
        title: 'Delete Failed',
        message: err?.response?.data?.message || 'Failed to delete song',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Worship Song Library</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage church worship songs, lyrics, and song categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/songs/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-sm font-medium hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <Layers className="w-4 h-4 text-neutral-500" />
            Categories
          </Link>
          <Link
            to="/admin/songs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Song
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, artist, or lyrics..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
            </button>
          )}
        </div>
        <select
          value={filters.category_id || ''}
          onChange={(e) => setFilters(f => ({ ...f, category_id: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
          className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined, page: 1 }))}
          className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={filters.featured === undefined ? '' : String(filters.featured)}
          onChange={(e) => setFilters(f => ({ ...f, featured: e.target.value, page: 1 }))}
          className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Types</option>
          <option value="true">Featured Only</option>
          <option value="false">Standard Only</option>
        </select>
      </div>

      {/* Songs Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="animate-pulse divide-y divide-neutral-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-8 h-8 rounded-lg bg-neutral-100" />
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
            <button onClick={fetchSongs} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : songs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Music className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No worship songs found</p>
            <Link
              to="/admin/songs/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              <Plus className="w-4 h-4" /> Add First Song
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[30px_1fr_120px_100px_90px_120px_110px_120px] gap-3 px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-body-xs text-neutral-500 font-medium uppercase tracking-wide">
              <span></span>
              <span>Song Title & Artist</span>
              <span>Category</span>
              <span>Status</span>
              <span className="text-center">Featured</span>
              <span>Created By</span>
              <span>Updated At</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-neutral-100">
              {songs.map((song) => (
                <div key={song.id} className="grid grid-cols-1 md:grid-cols-[30px_1fr_120px_100px_90px_120px_110px_120px] gap-3 items-center px-5 py-3.5 hover:bg-neutral-50/60 transition-colors">
                  {/* Star icon */}
                  <div>
                    <button
                      onClick={() => handleToggleFeatured(song)}
                      className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
                      title={song.featured ? 'Unfeature song' : 'Feature song'}
                    >
                      <Star className={`w-4 h-4 ${song.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="min-w-0">
                    <Link
                      to={`/admin/songs/${song.id}/edit`}
                      className="text-body-sm text-neutral-900 font-semibold hover:text-primary-red transition-colors truncate block"
                    >
                      {song.title}
                    </Link>
                    <p className="text-body-xs text-neutral-500 truncate">
                      {song.artist || 'Unknown Artist'} {song.composer && `• ${song.composer}`}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    {song.category ? (
                      <span className="inline-block text-body-xs px-2.5 py-0.5 rounded-md bg-accent-blue/10 text-accent-blue font-medium">
                        {song.category.name}
                      </span>
                    ) : (
                      <span className="text-body-xs text-neutral-400">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <button
                      onClick={() => handleTogglePublish(song)}
                      className={`inline-flex items-center gap-1.5 text-body-xs px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                        song.status === 'published' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {song.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {song.status}
                    </button>
                  </div>

                  {/* Featured Indicator */}
                  <div className="text-center">
                    {song.featured ? (
                      <span className="text-body-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                        ★ Yes
                      </span>
                    ) : (
                      <span className="text-body-xs text-neutral-400">No</span>
                    )}
                  </div>

                  {/* Created By */}
                  <div>
                    <span className="text-body-xs text-neutral-600 block truncate">
                      {song.created_by?.display_name || 'System'}
                    </span>
                  </div>

                  {/* Updated At */}
                  <div>
                    <span className="text-body-xs text-neutral-500 block">
                      {new Date(song.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`/songs/${song.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Preview Song Details"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <Link
                      to={`/admin/songs/${song.id}/edit`}
                      className="p-1.5 text-neutral-500 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Edit Song"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(song)}
                      className="p-1.5 text-neutral-500 hover:text-accent-blue hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Duplicate Song"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, song })}
                      className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Song"
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

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-body-xs text-neutral-500">
            Showing {meta.from || 0}–{meta.to || 0} of {meta.total} songs
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

      {/* Delete Modal */}
      {deleteModal.open && deleteModal.song && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, song: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">Delete Song</h3>
            <p className="text-body-sm text-neutral-500 text-center mb-6">
              Are you sure you want to delete <strong>"{deleteModal.song.title}"</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, song: null })}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Song'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongsListPage;
