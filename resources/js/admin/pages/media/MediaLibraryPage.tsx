import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Upload, Grid, List, Image as ImageIcon, FileText, Video, Music,
  Trash2, Download, Copy, Check, X, ChevronLeft, ChevronRight, AlertTriangle,
  MoreVertical, Filter, XCircle, Edit2, ZoomIn,
} from 'lucide-react';
import { mediaService } from '../../services/media.service';
import type { MediaItem, PaginatedResponse, MediaFilters, MediaStats } from '../../types';

const MediaLibraryPage: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [meta, setMeta] = useState<PaginatedResponse<MediaItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<MediaFilters>({ page: 1, per_page: 20 });
  const [searchInput, setSearchInput] = useState('');
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; media: MediaItem | null }>({ open: false, media: null });
  const [editModal, setEditModal] = useState<{ open: boolean; media: MediaItem | null }>({ open: false, media: null });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await mediaService.getAll(filters);
      setMedia(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await mediaService.getStats();
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const file = files[0];
      await mediaService.upload(file, 'public', (progress) => {
        setUploadProgress(progress);
      });
      setUploadModal(false);
      fetchMedia();
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.media) return;
    try {
      await mediaService.delete(deleteModal.media.uuid);
      setDeleteModal({ open: false, media: null });
      fetchMedia();
      fetchStats();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete media');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleUpdateMedia = async () => {
    if (!editModal.media) return;
    try {
      await mediaService.update(editModal.media.uuid, {
        alt_text: editModal.media.alt_text || undefined,
        caption: editModal.media.caption || undefined,
      });
      setEditModal({ open: false, media: null });
      fetchMedia();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update media');
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Media Library</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage images, documents, and other media files.
          </p>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red shadow-sm"
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Total</div>
            <div className="text-h3 text-neutral-900 font-semibold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Images</div>
            <div className="text-h3 text-blue-600 font-semibold">{stats.images}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Documents</div>
            <div className="text-h3 text-green-600 font-semibold">{stats.documents}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Videos</div>
            <div className="text-h3 text-purple-600 font-semibold">{stats.videos}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 shadow-xs">
            <div className="text-body-xs text-neutral-500 mb-1">Audio</div>
            <div className="text-h3 text-orange-600 font-semibold">{stats.audio}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by filename..."
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
        <div className="flex items-center gap-2">
          <select
            value={filters.mime_type || ''}
            onChange={(e) => setFilters(f => ({ ...f, mime_type: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="application">Documents</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
          </select>
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-body-sm text-neutral-500">Loading media...</p>
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
            <button onClick={fetchMedia} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : media.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ImageIcon className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No media files found</p>
            <button
              onClick={() => setUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              <Upload className="w-4 h-4" /> Upload File
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 hover:border-primary-300 transition-colors"
              >
                {isImage(item.mime_type) ? (
                  <img
                    src={item.url}
                    alt={item.alt_text || item.original_filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    {getFileIcon(item.mime_type)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedMedia(item)}
                    className="p-2 bg-white rounded-full text-neutral-700 hover:bg-neutral-100"
                    title="Preview"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(item.url)}
                    className="p-2 bg-white rounded-full text-neutral-700 hover:bg-neutral-100"
                    title="Copy URL"
                  >
                    {copiedUrl === item.url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditModal({ open: true, media: item })}
                    className="p-2 bg-white rounded-full text-neutral-700 hover:bg-neutral-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, media: item })}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-body-xs text-white truncate">{item.original_filename}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {media.map((item) => (
              <div key={item.id} className="px-5 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                    {isImage(item.mime_type) ? (
                      <img src={item.url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      getFileIcon(item.mime_type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-sm font-medium text-neutral-900 truncate">{item.original_filename}</h3>
                    <div className="flex items-center gap-3 text-body-xs text-neutral-500">
                      <span>{item.mime_type}</span>
                      <span>•</span>
                      <span>{formatFileSize(item.size)}</span>
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(item.url)}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                      title="Copy URL"
                    >
                      {copiedUrl === item.url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditModal({ open: true, media: item })}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, media: item })}
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
                onClick={() => setFilters(f => ({ ...f, page: f.page! - 1 }))}
                disabled={meta.current_page <= 1}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-body-sm text-neutral-700">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page! + 1 }))}
                disabled={meta.current_page >= meta.last_page}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 text-neutral-900 font-semibold">Upload File</h3>
              <button onClick={() => setUploadModal(false)} className="p-1 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-body-sm text-neutral-600 mb-4">
                Drag and drop a file here, or click to select
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleUpload(e.target.files)}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,audio/*,video/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red disabled:opacity-50"
              >
                {uploading ? `Uploading... ${uploadProgress}%` : 'Select File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && deleteModal.media && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-h3 text-neutral-900 font-semibold mb-2">Delete Media</h3>
            <p className="text-body-sm text-neutral-600 mb-6">
              Are you sure you want to delete {deleteModal.media.original_filename}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, media: null })}
                className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-body-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && editModal.media && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 text-neutral-900 font-semibold">Edit Media</h3>
              <button onClick={() => setEditModal({ open: false, media: null })} className="p-1 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={editModal.media.alt_text || ''}
                  onChange={(e) => setEditModal({ ...editModal, media: { ...editModal.media!, alt_text: e.target.value } })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Alternative text for accessibility"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Caption</label>
                <textarea
                  value={editModal.media.caption || ''}
                  onChange={(e) => setEditModal({ ...editModal, media: { ...editModal.media!, caption: e.target.value } })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                  rows={3}
                  placeholder="Image caption"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModal({ open: false, media: null })}
                className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMedia}
                className="px-4 py-2 text-body-sm font-medium text-white bg-primary-red hover:bg-primary-dark-red rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setSelectedMedia(null)}>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
            {isImage(selectedMedia.mime_type) ? (
              <img src={selectedMedia.url} alt={selectedMedia.alt_text || ''} className="max-w-full max-h-[90vh] object-contain" />
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                {getFileIcon(selectedMedia.mime_type)}
                <p className="text-body-sm text-neutral-700 mt-4">{selectedMedia.original_filename}</p>
                <a
                  href={selectedMedia.url}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red mt-4"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;
