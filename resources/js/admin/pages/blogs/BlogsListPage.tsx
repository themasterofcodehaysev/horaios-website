import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Star, Eye, Edit2, Copy, Trash2, CheckCircle,
  XCircle, ChevronLeft, ChevronRight, X, AlertTriangle, Layers, FileText,
} from 'lucide-react';
import { blogService } from '../../services/blog.service';
import type { BlogItem, BlogCategory, PaginatedResponse, BlogFilters } from '../../types';

const BlogsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<BlogItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFilters>({ page: 1, per_page: 15 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; blog: BlogItem | null }>({ open: false, blog: null });
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await blogService.getAdminBlogs(filters);
      setBlogs(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await blogService.getPublicBlogCategories();
      setCategories(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTogglePublish = async (blog: BlogItem) => {
    try {
      const updated = await blogService.togglePublishBlog(blog.id);
      setBlogs(prev => prev.map(b => b.id === blog.id ? updated : b));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleToggleFeatured = async (blog: BlogItem) => {
    try {
      const updated = await blogService.toggleFeaturedBlog(blog.id);
      setBlogs(prev => prev.map(b => b.id === blog.id ? updated : b));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to toggle featured state');
    }
  };

  const handleDuplicate = async (blog: BlogItem) => {
    try {
      const duplicate = await blogService.duplicateBlog(blog.id);
      navigate(`/admin/blog/${duplicate.id}/edit`);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to duplicate blog post');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.blog) return;
    try {
      setDeleting(true);
      await blogService.deleteBlog(deleteModal.blog.id);
      setDeleteModal({ open: false, blog: null });
      fetchBlogs();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete blog post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Blog Management</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage church news, articles, announcements, and blog categories.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/blog/categories"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-50 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" /> Categories
          </Link>
          <Link
            to="/admin/blog/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Blog
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, excerpt, or content..."
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
            <button onClick={fetchBlogs} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No blog posts found matching your criteria</p>
            <Link
              to="/admin/blog/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              <Plus className="w-4 h-4" /> Add First Blog Post
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[30px_60px_1fr_100px_100px_80px_110px] gap-3 px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-body-xs text-neutral-500 font-medium uppercase tracking-wide">
              <span></span>
              <span>Image</span>
              <span>Title & Category</span>
              <span>Status</span>
              <span className="text-center">Featured</span>
              <span className="text-center">Actions</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {blogs.map((blog) => (
                <div key={blog.id} className="grid grid-cols-1 md:grid-cols-[30px_60px_1fr_100px_100px_80px_110px] gap-3 items-center px-5 py-3.5 hover:bg-neutral-50/60 transition-colors">
                  <div>
                    <button
                      onClick={() => handleToggleFeatured(blog)}
                      className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
                      title={blog.featured ? 'Unfeature post' : 'Feature post'}
                    >
                      <Star className={`w-4 h-4 ${blog.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="w-12 h-9 rounded bg-neutral-100 text-white flex items-center justify-center relative overflow-hidden shrink-0">
                    {blog.featured_image ? (
                      <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <Link
                      to={`/admin/blog/${blog.id}/edit`}
                      className="text-body-sm text-neutral-900 font-semibold hover:text-primary-red transition-colors truncate block"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-body-xs text-neutral-500 truncate">
                      {blog.category ? blog.category.name : 'Uncategorized'}
                      {blog.published_at && ` • ${new Date(blog.published_at).toLocaleDateString()}`}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      className={`inline-flex items-center gap-1 text-body-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                        blog.status === 'published' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {blog.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {blog.status}
                    </button>
                  </div>

                  <div className="text-center">
                    {blog.featured ? (
                      <span className="text-body-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                        ★ Yes
                      </span>
                    ) : (
                      <span className="text-body-xs text-neutral-400">No</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`/news/${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Preview Post"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <Link
                      to={`/admin/blog/${blog.id}/edit`}
                      className="p-1.5 text-neutral-500 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(blog)}
                      className="p-1.5 text-neutral-500 hover:text-accent-blue hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Duplicate Post"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, blog })}
                      className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Post"
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
            Showing {meta.from || 0}–{meta.to || 0} of {meta.total} posts
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

      {deleteModal.open && deleteModal.blog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, blog: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">Delete Blog Post</h3>
            <p className="text-body-sm text-neutral-500 text-center mb-6">
              Are you sure you want to delete <strong>"{deleteModal.blog.title}"</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, blog: null })}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsListPage;
