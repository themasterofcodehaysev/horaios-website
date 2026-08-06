import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { songService } from '../../services/song.service';
import type { SongCategory, CreateSongPayload } from '../../types';

const SongFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<SongCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const [formData, setFormData] = useState<CreateSongPayload>({
    title: '',
    slug: '',
    artist: '',
    composer: '',
    category_id: null,
    lyrics: '',
    featured: false,
    status: 'published',
    display_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initData = async () => {
      try {
        const cats = await songService.getCategories();
        setCategories(cats);

        if (isEdit && id) {
          const song = await songService.getSong(id);
          setFormData({
            title: song.title,
            slug: song.slug,
            artist: song.artist || '',
            composer: song.composer || '',
            category_id: song.category_id,
            lyrics: song.lyrics,
            featured: song.featured,
            status: song.status,
            display_order: song.display_order,
          });
        }
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Failed to load song');
        navigate('/admin/songs');
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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false);
    setFormData(prev => ({ ...prev, slug: e.target.value }));
    if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Song title is required';
    if (!formData.lyrics.trim()) newErrors.lyrics = 'Song lyrics are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await songService.updateSong(Number(id), formData);
      } else {
        await songService.createSong(formData);
      }
      navigate('/admin/songs');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save song');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-pulse space-y-6">
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/songs')}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-h3 text-neutral-900 font-bold">
              {isEdit ? 'Edit Worship Song' : 'Create Worship Song'}
            </h1>
            <p className="text-body-xs text-neutral-500">
              {isEdit ? 'Update lyrics, details, or publishing status' : 'Add a new song to the worship library'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-body-sm font-medium border transition-colors ${
            showPreview ? 'bg-accent-blue text-white border-accent-blue' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Hide Lyrics Preview' : 'Preview Lyrics'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Area */}
        <form onSubmit={handleSubmit} className={`space-y-6 ${showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {/* General Details Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Song Information
            </h2>

            {/* Title */}
            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Song Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Amazing Grace (How Sweet the Sound)"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-red'
                }`}
              />
              {errors.title && <p className="text-body-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Slug */}
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
                onChange={handleSlugChange}
                placeholder="amazing-grace"
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-xs font-mono bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Artist & Composer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Artist / Performer
                </label>
                <input
                  type="text"
                  value={formData.artist || ''}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="e.g. Chris Tomlin, Hillsong"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Composer / Writer
                </label>
                <input
                  type="text"
                  value={formData.composer || ''}
                  onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
                  placeholder="e.g. John Newton"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Category & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">No Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                >
                  <option value="published">Published (Public)</option>
                  <option value="draft">Draft (Private)</option>
                </select>
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order || 0}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Featured toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-primary-red rounded border-neutral-300 focus:ring-primary-red"
                />
                <div>
                  <span className="text-body-sm font-semibold text-neutral-900 block">Featured Song</span>
                  <span className="text-body-xs text-neutral-500 block">
                    Display prominently on the public songs homepage banner
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Plain Text Lyrics Editor Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h2 className="text-h6 text-neutral-900 font-semibold">
                  Lyrics Editor <span className="text-red-500">*</span>
                </h2>
                <p className="text-body-xs text-neutral-500">
                  Plain text editor. Line breaks and verse headers (e.g., VERSE 1, CHORUS) will be preserved exactly.
                </p>
              </div>
            </div>

            <textarea
              rows={16}
              value={formData.lyrics}
              onChange={(e) => {
                setFormData({ ...formData, lyrics: e.target.value });
                if (errors.lyrics) setErrors(prev => ({ ...prev, lyrics: '' }));
              }}
              placeholder={`VERSE 1\nAmazing grace! How sweet the sound\nThat saved a wretch like me!\n\nCHORUS\nMy chains are gone, I've been set free...`}
              className={`w-full p-4 border rounded-xl text-body-sm font-sans whitespace-pre focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                errors.lyrics ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-red bg-neutral-50/50'
              }`}
            />
            {errors.lyrics && <p className="text-body-xs text-red-500">{errors.lyrics}</p>}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/songs')}
              className="px-5 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : isEdit ? 'Update Song' : 'Create Song'}
            </button>
          </div>
        </form>

        {/* Live Lyrics Preview Side Drawer */}
        {showPreview && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm h-fit sticky top-20 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-body-xs font-bold text-accent-blue uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Public View Preview
              </span>
              <span className="text-body-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-mono">
                Worship Mode Preview
              </span>
            </div>

            <div>
              <h3 className="text-h4 font-bold text-neutral-900 leading-tight">
                {formData.title || 'Untitled Song'}
              </h3>
              {(formData.artist || formData.composer) && (
                <p className="text-body-xs text-neutral-500 mt-1">
                  {formData.artist && `By ${formData.artist}`}
                  {formData.composer && ` • Composed by ${formData.composer}`}
                </p>
              )}
            </div>

            {/* Rendered Lyrics */}
            <div className="bg-neutral-900 text-neutral-100 p-6 rounded-xl overflow-y-auto max-h-[500px]">
              <pre className="font-sans text-body-base leading-relaxed whitespace-pre-wrap font-medium">
                {formData.lyrics || '(No lyrics entered yet)'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongFormPage;
