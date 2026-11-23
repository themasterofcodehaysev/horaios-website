import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Star, Eye, Edit2, Copy, Trash2, CheckCircle,
  XCircle, ChevronLeft, ChevronRight, X, AlertTriangle, Layers, Heart, ArrowUpDown, Users,
} from 'lucide-react';
import { ministryService } from '../../services/ministry.service';
import type { MinistryItem, MinistryCategory, PaginatedResponse, MinistryFilters } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';
import { useToast } from '../../hooks/useToast';
import { useLanguage, translate } from '../../../context/LanguageContext';

const MinistriesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [ministries, setMinistries] = useState<MinistryItem[]>([]);
  const [categories, setCategories] = useState<MinistryCategory[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<MinistryItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MinistryFilters>({ page: 1, per_page: 15 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; ministry: MinistryItem | null }>({ open: false, ministry: null });
  const [deleting, setDeleting] = useState(false);
  const [reorderId, setReorderId] = useState<number | null>(null);
  const [reorderValue, setReorderValue] = useState<number>(0);

  const fetchMinistries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ministryService.getAdminMinistries(filters);
      setMinistries(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || translate('admin_msg.failed_to_load_ministries', 'Failed to load ministries'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await ministryService.getPublicMinistryCategories();
      setCategories(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchMinistries(); }, [fetchMinistries]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTogglePublish = async (m: MinistryItem) => {
    try {
      const updated = await ministryService.togglePublishMinistry(m.id);
      setMinistries(prev => prev.map(x => x.id === m.id ? updated : x));
      addToast({
        type: 'success',
        title: updated.status === 'published' ? translate('admin_msg.ministry_published', 'Ministry Published') : translate('admin_msg.ministry_set_to_draft', 'Ministry Set to Draft'),
        message: translate('admin_msg.tpl_q_v0_is_now_v1', '"{0}" is now {1}.', { 0: m.name, 1: translate(`status.${updated.status}`, updated.status) }),
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: t('admin_ui.failed_to_update_status', 'Failed to update status'),
        message: err?.response?.data?.message || translate('admin_msg.please_try_again', 'Please try again.'),
      });
    }
  };

  const handleToggleFeatured = async (m: MinistryItem) => {
    try {
      const updated = await ministryService.toggleFeaturedMinistry(m.id);
      setMinistries(prev => prev.map(x => x.id === m.id ? updated : x));
      addToast({
        type: 'success',
        title: updated.featured ? translate('admin_msg.ministry_featured', 'Ministry Featured') : translate('admin_msg.ministry_unfeatured', 'Ministry Unfeatured'),
        message: translate('admin_msg.tpl_q_v0_is_now_v1', '"{0}" is now {1}.', { 0: m.name, 1: updated.featured ? translate('status.featured', 'featured') : translate('status.unfeatured', 'unfeatured') }),
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: t('admin_ui.failed_to_update_ministry', 'Failed to update ministry'),
        message: err?.response?.data?.message || translate('admin_msg.failed_to_toggle_featured_state', 'Failed to toggle featured state'),
      });
    }
  };

  const handleDuplicate = async (m: MinistryItem) => {
    try {
      await ministryService.duplicateMinistry(m.id);
      fetchMinistries();
      addToast({
        type: 'success',
        title: t('admin_ui.ministry_duplicated', 'Ministry Duplicated'),
        message: translate('admin_msg.tpl_q_a_draft_copy_of_v0_has_been_created', 'A draft copy of "{0}" has been created.', { 0: m.name }),
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: t('admin_ui.failed_to_duplicate_ministry', 'Failed to duplicate ministry'),
        message: err?.response?.data?.message || translate('admin_msg.please_try_again', 'Please try again.'),
      });
    }
  };

  const handleReorder = async (m: MinistryItem) => {
    try {
      const updated = await ministryService.reorderMinistry(m.id, reorderValue);
      setMinistries(prev => prev.map(x => x.id === m.id ? updated : x));
      setReorderId(null);
      addToast({
        type: 'success',
        title: t('admin_ui.order_updated', 'Order Updated'),
        message: translate('admin_msg.tpl_q_display_order_for_v0_set_to_v1', 'Display order for "{0}" set to {1}.', { 0: m.name, 1: reorderValue }),
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: t('admin_ui.failed_to_reorder_ministry', 'Failed to reorder ministry'),
        message: err?.response?.data?.message || translate('admin_msg.please_try_again', 'Please try again.'),
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.ministry) return;
    const name = deleteModal.ministry.name;
    try {
      setDeleting(true);
      await ministryService.deleteMinistry(deleteModal.ministry.id);
      setDeleteModal({ open: false, ministry: null });
      fetchMinistries();
      addToast({
        type: 'success',
        title: t('admin_ui.ministry_deleted', 'Ministry Deleted'),
        message: translate('admin_msg.tpl_q_v0_has_been_deleted', '"{0}" has been deleted.', { 0: name }),
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: t('admin_ui.failed_to_delete_ministry', 'Failed to delete ministry'),
        message: err?.response?.data?.message || translate('admin_msg.please_try_again', 'Please try again.'),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">{t('admin.ministries.page_title', 'Ministries Management')}</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            {t('admin.ministries.page_desc', 'Manage church ministry teams, schedules, leaders, and sign-ups.')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/ministries/categories"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-50 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" /> {t('admin.breadcrumb.categories', 'Categories')}
          </Link>
          <Link
            to="/admin/ministries/join-requests"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-50 shadow-xs"
          >
            <Users className="w-3.5 h-3.5 text-neutral-500" /> {t('admin_ui.join_requests', 'Join Requests')}
          </Link>
          <Link
            to="/admin/ministries/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red shadow-sm"
          >
            <Plus className="w-4 h-4" /> {t('admin.ministries.add', 'Add Ministry')}
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('admin_ui.search_by_name_leader_meeting_day_or_locatio', 'Search by name, leader, meeting day, or location...')}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <select
            value={filters.category_id || ''}
            onChange={(e) => setFilters(f => ({ ...f, category_id: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">{t('sermons.all_categories', 'All Categories')}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">{t('admin_ui.all_status', 'All Status')}</option>
            <option value="published">{t('ui.published', 'Published')}</option>
            <option value="draft">{t('admin_ui.draft', 'Draft')}</option>
          </select>
          <select
            value={filters.featured === undefined || filters.featured === '' ? '' : String(filters.featured)}
            onChange={(e) => {
              const val = e.target.value;
              setFilters(f => ({ ...f, featured: val === '' ? undefined : (val === 'true' ? true : false), page: 1 }));
            }}
            className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-xs bg-white"
          >
            <option value="">{t('admin_ui.all_featured', 'All Featured')}</option>
            <option value="true">{t('admin_ui.featured_only', 'Featured Only')}</option>
            <option value="false">{t('admin_ui.not_featured', 'Not Featured')}</option>
          </select>
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
            <button onClick={fetchMinistries} className="text-body-sm text-primary-red font-medium hover:underline">{t('form.retry', 'Retry')}</button>
          </div>
        ) : ministries.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">{t('admin_ui.no_ministries_found_matching_your_criteria', 'No ministries found matching your criteria')}</p>
            <Link
              to="/admin/ministries/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              <Plus className="w-4 h-4" /> {t('admin_ui.add_first_ministry', 'Add First Ministry')}
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[30px_60px_1fr_90px_70px_90px_130px] gap-3 px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-body-xs text-neutral-500 font-medium uppercase tracking-wide">
              <span></span>
              <span>{t('admin_ui.image', 'Image')}</span>
              <span>{t('admin_ui.ministry_leader', 'Ministry & Leader')}</span>
              <span>{t('admin_ui.status', 'Status')}</span>
              <span className="text-center">{t('cards.featured', 'Featured')}</span>
              <span className="text-center">{t('admin_ui.order', 'Order')}</span>
              <span className="text-center">{t('admin_ui.actions', 'Actions')}</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {ministries.map((m) => (
                <div key={m.id} className="grid grid-cols-1 md:grid-cols-[30px_60px_1fr_90px_70px_90px_130px] gap-3 items-center px-5 py-3.5 hover:bg-neutral-50/60 transition-colors">
                  <div>
                    <button
                      onClick={() => handleToggleFeatured(m)}
                      className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
                      title={m.featured ? t('admin_ui.unfeature_ministry', 'Unfeature ministry') : t('admin_ui.feature_ministry', 'Feature ministry')}
                    >
                      <Star className={`w-4 h-4 ${m.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="w-12 h-9 rounded bg-neutral-100 flex items-center justify-center relative overflow-hidden shrink-0">
                    {m.featured_image ? (
                      <img src={getImageUrl(m.featured_image)} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <Heart className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <Link
                      to={`/admin/ministries/${m.id}/edit`}
                      className="text-body-sm text-neutral-900 font-semibold hover:text-primary-red transition-colors truncate block"
                    >
                      {m.name}
                    </Link>
                    <p className="text-body-xs text-neutral-500 truncate">
                      {m.category ? m.category.name : t('admin_ui.uncategorized', 'Uncategorized')}
                      {m.leader && ` • ${m.leader}`}
                      {m.meeting_day && ` • ${m.meeting_day}`}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => handleTogglePublish(m)}
                      className={`inline-flex items-center gap-1 text-body-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                        m.status === 'published' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {m.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {m.status}
                    </button>
                  </div>

                  <div className="text-center">
                    {m.featured ? (
                      <span className="text-body-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                        {t('admin_ui.yes', '★ Yes')}
                      </span>
                    ) : (
                      <span className="text-body-xs text-neutral-400">{t('admin_ui.no', 'No')}</span>
                    )}
                  </div>

                  <div className="text-center">
                    {reorderId === m.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min={0}
                          value={reorderValue}
                          onChange={(e) => setReorderValue(Number(e.target.value))}
                          className="w-14 px-2 py-1 border border-neutral-200 rounded text-body-xs"
                        />
                        <button
                          onClick={() => handleReorder(m)}
                          className="p-1 text-primary-red hover:bg-neutral-100 rounded"
                          title={t('form.save', 'Save')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setReorderId(null)}
                          className="p-1 text-neutral-500 hover:bg-neutral-100 rounded"
                          title={t('form.cancel', 'Cancel')}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setReorderId(m.id); setReorderValue(m.display_order); }}
                        className="p-1.5 text-neutral-500 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors mx-auto inline-flex"
                        title={t('admin_ui.reorder', 'Reorder')}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`/ministries/${m.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                      title={t('admin_ui.preview_ministry', 'Preview Ministry')}
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <Link
                      to={`/admin/ministries/${m.id}/edit`}
                      className="p-1.5 text-neutral-500 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors"
                      title={t('admin.breadcrumb.edit', 'Edit')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(m)}
                      className="p-1.5 text-neutral-500 hover:text-accent-blue hover:bg-neutral-100 rounded-lg transition-colors"
                      title={t('admin_ui.duplicate', 'Duplicate')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, ministry: m })}
                      className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('form.delete', 'Delete')}
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
            {t('ui.showing', 'Showing')} {meta.from || 0}–{meta.to || 0} {t('ui.of', 'of')} {meta.total} {t('ui.ministries', 'ministries')}
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
              {t('ui.page', 'Page')} {meta.current_page} {t('ui.of', 'of')} {meta.last_page}
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

      {deleteModal.open && deleteModal.ministry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, ministry: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">{t('admin_ui.delete_ministry', 'Delete Ministry')}</h3>
            <p className="text-body-sm text-neutral-500 text-center mb-6">
              {t('admin_ui.are_you_sure_you_want_to_delete', 'Are you sure you want to delete')} <strong>&quot;{deleteModal.ministry.name}&quot;</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, ministry: null })}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                {t('form.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? t('admin_ui.deleting', 'Deleting...') : t('admin_ui.delete_ministry', 'Delete Ministry')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinistriesListPage;
