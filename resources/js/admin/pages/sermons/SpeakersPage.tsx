import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, UserCheck, Edit2, Trash2, CheckCircle,
  XCircle, Loader2, AlertTriangle, X, Mail, Globe, User,
} from 'lucide-react';
import { sermonService } from '../../services/sermon.service';
import type { Speaker } from '../../types';

const SpeakersPage: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    speaker: Partial<Speaker> | null;
  }>({ open: false, mode: 'create', speaker: null });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    position: '',
    biography: '',
    email: '',
    facebook: '',
    photo: '',
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; speaker: Speaker | null }>({ open: false, speaker: null });
  const [deleting, setDeleting] = useState(false);

  const fetchSpeakers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sermonService.getAdminSpeakers();
      setSpeakers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load speakers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpeakers(); }, [fetchSpeakers]);

  const openCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      position: '',
      biography: '',
      email: '',
      facebook: '',
      photo: '',
      display_order: speakers.length + 1,
      status: 'active',
    });
    setModal({ open: true, mode: 'create', speaker: null });
  };

  const openEditModal = (sp: Speaker) => {
    setFormData({
      name: sp.name,
      slug: sp.slug,
      position: sp.position || '',
      biography: sp.biography || '',
      email: sp.email || '',
      facebook: sp.facebook || '',
      photo: sp.photo || '',
      display_order: sp.display_order,
      status: sp.status,
    });
    setModal({ open: true, mode: 'edit', speaker: sp });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      if (modal.mode === 'edit' && modal.speaker?.id) {
        await sermonService.updateSpeaker(modal.speaker.id, formData);
      } else {
        await sermonService.createSpeaker(formData);
      }
      setModal({ open: false, mode: 'create', speaker: null });
      fetchSpeakers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save speaker');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (sp: Speaker) => {
    try {
      const updated = await sermonService.toggleSpeakerStatus(sp.id);
      setSpeakers(prev => prev.map(s => s.id === sp.id ? updated : s));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.speaker) return;
    setDeleting(true);
    try {
      await sermonService.deleteSpeaker(deleteModal.speaker.id);
      setDeleteModal({ open: false, speaker: null });
      fetchSpeakers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete speaker');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/sermons"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-h3 text-neutral-900 font-bold">Speakers & Preachers</h1>
            <p className="text-body-xs text-neutral-500">
              Manage pastors, visiting speakers, and ministers.
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Speaker
        </button>
      </div>

      {/* Speaker Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200 h-48 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-5 py-12 text-center bg-white rounded-xl border border-neutral-200">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
          <button onClick={fetchSpeakers} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
        </div>
      ) : speakers.length === 0 ? (
        <div className="px-5 py-12 text-center bg-white rounded-xl border border-neutral-200">
          <UserCheck className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-body-sm text-neutral-500 mb-4">No speakers added yet</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
          >
            <Plus className="w-4 h-4" /> Add First Speaker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {speakers.map((sp) => (
            <div key={sp.id} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                      {sp.photo ? (
                        <img src={sp.photo} alt={sp.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-body-base font-bold text-neutral-900 leading-snug">{sp.name}</h3>
                      <p className="text-body-xs text-neutral-500">{sp.position || 'Guest Speaker'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(sp)}
                    className={`inline-flex items-center gap-1 text-body-xs px-2 py-0.5 rounded-full font-medium ${
                      sp.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {sp.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {sp.status}
                  </button>
                </div>

                {sp.biography && (
                  <p className="text-body-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {sp.biography}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-body-xs text-neutral-500 pt-1">
                  {sp.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-400" /> {sp.email}
                    </span>
                  )}
                  {sp.facebook && (
                    <a href={sp.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-accent-blue">
                      <Globe className="w-3 h-3" /> Facebook
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-body-xs text-neutral-400 font-medium">
                  {sp.sermons_count ?? 0} Sermons
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(sp)}
                    className="p-1.5 text-neutral-500 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, speaker: sp })}
                    className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal({ ...modal, open: false })} />
          <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-h5 text-neutral-900 font-bold">
                {modal.mode === 'create' ? 'Add Speaker' : 'Edit Speaker'}
              </h3>
              <button type="button" onClick={() => setModal({ ...modal, open: false })} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Pastor John Smith"
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Position / Title</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. Senior Pastor, Guest Evangelist"
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Biography</label>
              <textarea
                rows={3}
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                placeholder="Brief background or ministry story..."
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm"
                />
              </div>
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Photo Image URL</label>
              <input
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm"
                />
              </div>
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setModal({ ...modal, open: false })}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {modal.mode === 'create' ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && deleteModal.speaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, speaker: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">Delete Speaker</h3>
            <p className="text-body-sm text-neutral-500 text-center mb-6">
              Are you sure you want to delete <strong>"{deleteModal.speaker.name}"</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, speaker: null })}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 disabled:opacity-50"
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

export default SpeakersPage;
