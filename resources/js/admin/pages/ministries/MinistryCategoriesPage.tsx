import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Layers, Edit2, Trash2, CheckCircle,
  XCircle, Loader2, AlertTriangle, X, Hash,
} from 'lucide-react';
import { ministryService } from '../../services/ministry.service';
import type { MinistryCategory } from '../../types';

const MinistryCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<MinistryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    category: Partial<MinistryCategory> | null;
  }>({ open: false, mode: 'create', category: null });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; category: MinistryCategory | null }>({ open: false, category: null });
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ministryService.getAdminMinistryCategories();
      setCategories(data.sort((a, b) => a.display_order - b.display_order));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load ministry categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreateModal = () => {
    setFormData({ name: '', slug: '', description: '', display_order: categories.length + 1, status: 'active' });
    setModal({ open: true, mode: 'create', category: null });
  };

  const openEditModal = (cat: MinistryCategory) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      display_order: cat.display_order,
      status: cat.status,
    });
    setModal({ open: true, mode: 'edit', category: cat });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      if (modal.mode === 'edit' && modal.category?.id) {
        await ministryService.updateMinistryCategory(modal.category.id, formData);
      } else {
        await ministryService.createMinistryCategory(formData);
      }
      setModal({ open: false, mode: 'create', category: null });
      fetchCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save ministry category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    setDeleting(true);
    try {
      await ministryService.deleteMinistryCategory(deleteModal.category.id);
      setDeleteModal({ open: false, category: null });
      fetchCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete ministry category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/ministries"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-h3 text-neutral-900 font-bold">Ministry Categories</h1>
            <p className="text-body-xs text-neutral-500">
              Group ministries into areas (e.g. Children, Youth, Outreach, Worship).
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-neutral-100 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
            <button onClick={fetchCategories} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : categories.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Layers className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No ministry categories created yet</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              <Plus className="w-4 h-4" /> Add First Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            <div className="hidden sm:grid grid-cols-[60px_1fr_120px_100px_100px] gap-3 px-6 py-3 bg-neutral-50 border-b border-neutral-200 text-body-xs text-neutral-500 font-medium uppercase tracking-wide">
              <span>Order</span>
              <span>Category Name & Description</span>
              <span>Ministry Count</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {categories.map((cat) => (
              <div key={cat.id} className="grid grid-cols-1 sm:grid-cols-[60px_1fr_120px_100px_100px] gap-3 items-center px-6 py-4 hover:bg-neutral-50/60 transition-colors">
                <div className="flex items-center gap-1 text-body-xs text-neutral-400 font-mono">
                  <Hash className="w-3.5 h-3.5" />
                  {cat.display_order}
                </div>

                <div className="min-w-0">
                  <h3 className="text-body-sm font-bold text-neutral-900">{cat.name}</h3>
                  {cat.description && <p className="text-body-xs text-neutral-500 truncate">{cat.description}</p>}
                </div>

                <div>
                  <span className="inline-block text-body-xs px-2.5 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue font-semibold">
                    {cat.ministries_count ?? 0} Ministries
                  </span>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1 text-body-xs px-2.5 py-0.5 rounded-full font-medium ${
                    cat.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {cat.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {cat.status}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-neutral-500 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, category: cat })}
                    className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal({ ...modal, open: false })} />
          <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-h5 text-neutral-900 font-bold">
                {modal.mode === 'create' ? 'Create Category' : 'Edit Category'}
              </h3>
              <button type="button" onClick={() => setModal({ ...modal, open: false })} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Children, Youth, Outreach"
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of ministries in this category..."
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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

      {deleteModal.open && deleteModal.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, category: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">Delete Category</h3>
            <p className="text-body-sm text-neutral-500 text-center mb-6">
              Are you sure you want to delete <strong>&quot;{deleteModal.category.name}&quot;</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, category: null })}
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

export default MinistryCategoriesPage;
