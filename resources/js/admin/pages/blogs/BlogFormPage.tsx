import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { blogService } from '../../services/blog.service';
import type { BlogCategory, CreateBlogPayload } from '../../types';

const BlogFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const [formData, setFormData] = useState<CreateBlogPayload>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: null,
    featured: false,
    status: 'published',
    published_at: new Date().toISOString().slice(0, 16),
    seo_title: '',
    seo_description: '',
    seo_image: '',
    canonical_url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initData = async () => {
      try {
        const catData = await blogService.getPublicBlogCategories();
        setCategories(catData);

        if (isEdit && id) {
          const blog = await blogService.getBlog(id);
          setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            featured_image: blog.featured_image || '',
            category_id: blog.category_id,
            featured: blog.featured,
            status: blog.status,
            published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
            seo_title: blog.seo_title || '',
            seo_description: blog.seo_description || '',
            seo_image: blog.seo_image || '',
            canonical_url: blog.canonical_url || '',
          });
        }
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Failed to load blog details');
        navigate('/admin/blog');
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id, isEdit, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: autoSlug ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug,
    }));
    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Blog title is required';
    if (!formData.content || !formData.content.trim()) newErrors.content = 'Blog content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await blogService.updateBlog(Number(id), formData);
      } else {
        await blogService.createBlog(formData);
      }
      navigate('/admin/blog');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto py-8 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded" />
        <div className="bg-white rounded-xl p-6 border border-neutral-200 space-y-4">
          <div className="h-10 bg-neutral-100 rounded" />
          <div className="h-10 bg-neutral-100 rounded" />
          <div className="h-40 bg-neutral-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-h3 text-neutral-900 font-bold">
              {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-body-xs text-neutral-500">
              {isEdit ? 'Update article content, metadata, or publishing status' : 'Publish a new article or announcement to the church website'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Article Overview
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Annual Church Retreat Recap"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-red'
                }`}
              />
              {errors.title && <p className="text-body-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-body-xs font-semibold text-neutral-700">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSlug(true);
                    setFormData(p => ({
                      ...p,
                      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                    }));
                  }}
                  className="text-body-xs text-primary-red hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3 h-3" /> Auto Generate
                </button>
              </div>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                placeholder="annual-church-retreat-recap"
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-xs font-mono bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Excerpt (Short Summary)
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary displayed on blog cards and social shares..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <span className="text-body-xs text-neutral-400 block text-right">
                {(formData.excerpt || '').length}/500
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Article Content
            </h2>
            {errors.content && <p className="text-body-xs text-red-500">{errors.content}</p>}
            <div data-color-mode="light">
              <MDEditor
                value={formData.content || ''}
                onChange={(val) => setFormData({ ...formData, content: val || '' })}
                height={400}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              SEO Meta Tags
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo_title || ''}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Custom title for search engines (defaults to post title)"
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                SEO Description
              </label>
              <textarea
                rows={3}
                maxLength={300}
                value={formData.seo_description || ''}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Custom description for search engines and social sharing..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <span className="text-body-xs text-neutral-400 block text-right">
                {(formData.seo_description || '').length}/300
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  SEO Social Image URL
                </label>
                <input
                  type="url"
                  value={formData.seo_image || ''}
                  onChange={(e) => setFormData({ ...formData, seo_image: e.target.value })}
                  placeholder="https://example.com/og-image.jpg"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
                />
              </div>
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={formData.canonical_url || ''}
                  onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                  placeholder="https://church.com/news/original-post"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Publishing Options
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white font-medium"
              >
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Published Date
              </label>
              <input
                type="datetime-local"
                value={formData.published_at || ''}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-primary-red rounded border-neutral-300 focus:ring-primary-red"
                />
                <div>
                  <span className="text-body-sm font-semibold text-neutral-900 block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Post
                  </span>
                  <span className="text-body-xs text-neutral-500 block">
                    Display prominently on homepage and news section
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Classification & Media
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              >
                <option value="">No Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featured_image || ''}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://example.com/blog-cover.jpg"
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
              />
              {formData.featured_image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200 h-32 bg-neutral-900 flex items-center justify-center">
                  <img src={formData.featured_image} alt="Featured preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-5 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogFormPage;
