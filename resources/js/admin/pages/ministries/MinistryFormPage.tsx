import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Sparkles, Calendar, Mail, Phone, MapPin, Users } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { ministryService } from '../../services/ministry.service';
import type { MinistryCategory, CreateMinistryPayload } from '../../types';
import ImageUpload from '../../components/ui/ImageUpload';

const MinistryFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<MinistryCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState<CreateMinistryPayload>({
    name: '',
    description: '',
    leader: '',
    email: '',
    phone: '',
    featured_image: '',
    category_id: null,
    meeting_day: '',
    meeting_time: '',
    location: '',
    featured: false,
    status: 'published',
    display_order: 0,
    published_at: new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initData = async () => {
      try {
        const catData = await ministryService.getAdminMinistryCategories();
        setCategories(catData);

        if (isEdit && id) {
          const m = await ministryService.getAdminMinistry(id);
          setFormData({
            name: m.name,
            description: m.description || '',
            leader: m.leader || '',
            email: m.email || '',
            phone: m.phone || '',
            featured_image: m.featured_image || '',
            category_id: m.category_id,
            meeting_day: m.meeting_day || '',
            meeting_time: m.meeting_time || '',
            location: m.location || '',
            featured: m.featured,
            status: m.status,
            display_order: m.display_order,
            published_at: m.published_at ? new Date(m.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
          });
        }
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Failed to load ministry details');
        navigate('/admin/ministries');
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id, isEdit, navigate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: newName,
    }));
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Ministry name is required';
    if (!formData.description || !formData.description.trim()) newErrors.description = 'Ministry description is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await ministryService.updateMinistry(Number(id), formData);
      } else {
        await ministryService.createMinistry(formData);
      }
      navigate('/admin/ministries');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save ministry');
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
            onClick={() => navigate('/admin/ministries')}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-h3 text-neutral-900 font-bold">
              {isEdit ? 'Edit Ministry' : 'Create New Ministry'}
            </h1>
            <p className="text-body-xs text-neutral-500">
              {isEdit ? 'Update ministry leadership, details, and schedules' : 'Introduce a new church department, outreach group, or ministry program'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Ministry Overview
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Youth Ministry"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-red'
                }`}
              />
              {errors.name && <p className="text-body-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              About & Description
            </h2>
            {errors.description && <p className="text-body-xs text-red-500">{errors.description}</p>}
            <div data-color-mode="light">
              <MDEditor
                value={formData.description || ''}
                onChange={(val) => setFormData({ ...formData, description: val || '' })}
                height={400}
              />
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

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={formData.display_order ?? 0}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
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
                  <span className="text-body-sm font-semibold text-neutral-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Ministry
                  </span>
                  <span className="text-body-xs text-neutral-500 block">
                    Highlight on the ministries landing page
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
              <ImageUpload
                value={formData.featured_image}
                onChange={(url) => setFormData({ ...formData, featured_image: url })}
                folder="ministries"
                label="Featured Image"
                helperText="Upload a banner or cover image for this ministry."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-red" /> Leadership & Contact
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Leader / Director
              </label>
              <input
                type="text"
                value={formData.leader || ''}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                placeholder="Pastor John Smith"
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-500" /> Contact Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="youth@church.com"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm ${
                  errors.email ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.email && <p className="text-body-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-500" /> Contact Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-red" /> Meeting Schedule
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Meeting Day
              </label>
              <select
                value={formData.meeting_day || ''}
                onChange={(e) => setFormData({ ...formData, meeting_day: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              >
                <option value="">Select day...</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Various">Various</option>
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Meeting Time
              </label>
              <input
                type="time"
                value={formData.meeting_time || ''}
                onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" /> Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Fellowship Hall, Sanctuary, Zoom..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/ministries')}
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
              {loading ? 'Saving...' : isEdit ? 'Update Ministry' : 'Create Ministry'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MinistryFormPage;
