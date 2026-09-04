import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { sermonService } from '../../services/sermon.service';
import type { Speaker, SermonSeries, SermonCategory, CreateSermonPayload } from '../../types';
import ImageUpload from '../../components/ui/ImageUpload';

const SermonFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [seriesList, setSeriesList] = useState<SermonSeries[]>([]);
  const [categories, setCategories] = useState<SermonCategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState<CreateSermonPayload>({
    title: '',
    summary: '',
    description: '',
    speaker_id: null,
    series_id: null,
    category_id: null,
    scripture_reference: '',
    youtube_url: '',
    thumbnail: '',
    featured: false,
    status: 'published',
    published_at: new Date().toISOString().slice(0, 16),
    display_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initData = async () => {
      try {
        const [spData, seData, caData] = await Promise.all([
          sermonService.getAdminSpeakers(),
          sermonService.getAdminSeries(),
          sermonService.getAdminCategories(),
        ]);
        setSpeakers(spData);
        setSeriesList(seData);
        setCategories(caData);

        if (isEdit && id) {
          const sermon = await sermonService.getAdminSermon(id);
          setFormData({
            title: sermon.title,
            summary: sermon.summary || '',
            description: sermon.description || '',
            speaker_id: sermon.speaker_id,
            series_id: sermon.series_id,
            category_id: sermon.category_id,
            scripture_reference: sermon.scripture_reference || '',
            youtube_url: sermon.youtube_url || '',
            thumbnail: sermon.thumbnail || '',
            featured: sermon.featured,
            status: sermon.status,
            published_at: sermon.published_at ? new Date(sermon.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
            display_order: sermon.display_order,
          });
        }
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Failed to load sermon details');
        navigate('/admin/sermons');
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
    }));
    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Sermon title is required';
    if (formData.youtube_url && !formData.youtube_url.includes('youtube.com') && !formData.youtube_url.includes('youtu.be')) {
      newErrors.youtube_url = 'Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=...)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await sermonService.updateSermon(Number(id), formData);
      } else {
        await sermonService.createSermon(formData);
      }
      navigate('/admin/sermons');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save sermon');
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
            onClick={() => navigate('/admin/sermons')}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-h3 text-neutral-900 font-bold">
              {isEdit ? 'Edit Sermon' : 'Add New Sermon'}
            </h1>
            <p className="text-body-xs text-neutral-500">
              {isEdit ? 'Update sermon details, scripture notes, video links, or status' : 'Publish a new sermon message to the church website'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Details Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Sermon Overview
            </h2>

            {/* Title */}
            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Sermon Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Unashamed of the Gospel"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-red'
                }`}
              />
              {errors.title && <p className="text-body-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Summary */}
            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Short Summary (1-2 sentences)
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={formData.summary || ''}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief summary displayed on sermon cards and social shares..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <span className="text-body-xs text-neutral-400 block text-right">
                {(formData.summary || '').length}/500
              </span>
            </div>

            {/* Scripture Reference & YouTube URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Scripture Reference
                </label>
                <input
                  type="text"
                  value={formData.scripture_reference || ''}
                  onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                  placeholder="e.g. Romans 1:16-17"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  value={formData.youtube_url || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, youtube_url: e.target.value });
                    if (errors.youtube_url) setErrors(prev => ({ ...prev, youtube_url: '' }));
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                    errors.youtube_url ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.youtube_url && <p className="text-body-xs text-red-500 mt-1">{errors.youtube_url}</p>}
              </div>
            </div>
          </div>

          {/* Rich Text Editor Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Full Sermon Description & Message Notes
            </h2>
            <div data-color-mode="light">
              <MDEditor
                value={formData.description || ''}
                onChange={(val) => setFormData({ ...formData, description: val || '' })}
                height={350}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Meta & Publishing Controls */}
        <div className="space-y-6">
          {/* Publishing Settings */}
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

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
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
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Sermon
                  </span>
                  <span className="text-body-xs text-neutral-500 block">
                    Display prominently on homepage and sermon banner
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Classification Settings */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Relationships & Media
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Preacher / Speaker
              </label>
              <select
                value={formData.speaker_id || ''}
                onChange={(e) => setFormData({ ...formData, speaker_id: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              >
                <option value="">No Speaker Selected</option>
                {speakers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.position || 'Speaker'})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Sermon Series
              </label>
              <select
                value={formData.series_id || ''}
                onChange={(e) => setFormData({ ...formData, series_id: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              >
                <option value="">Standalone Sermon (No Series)</option>
                {seriesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

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
              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                folder="sermons"
                label="Thumbnail Image"
                helperText="Upload a sermon cover or video thumbnail."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/sermons')}
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
              {loading ? 'Saving...' : isEdit ? 'Update Sermon' : 'Publish Sermon'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SermonFormPage;
