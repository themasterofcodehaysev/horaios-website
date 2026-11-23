import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Sparkles, Calendar, Mail, Phone, MapPin, Users } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { ministryService } from '../../services/ministry.service';
import type { MinistryCategory, CreateMinistryPayload } from '../../types';
import ImageUpload from '../../components/ui/ImageUpload';

import { useLanguage, translate } from '../../../context/LanguageContext';
const MinistryFormPage: React.FC = () => {
  const { t } = useLanguage();
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
        alert(err?.response?.data?.message || translate('admin_msg.failed_to_load_ministry_details', 'Failed to load ministry details'));
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
    if (!formData.name.trim()) newErrors.name = translate('admin_msg.ministry_name_is_required', 'Ministry name is required');
    if (!formData.description || !formData.description.trim()) newErrors.description = translate('admin_msg.ministry_description_is_required', 'Ministry description is required');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = translate('admin_msg.invalid_email_address', 'Invalid email address');
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
      alert(err?.response?.data?.message || translate('admin_msg.failed_to_save_ministry', 'Failed to save ministry'));
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
              {isEdit ? t('admin_ui.edit_ministry', 'Edit Ministry') : t('admin_ui.create_new_ministry', 'Create New Ministry')}
            </h1>
            <p className="text-body-xs text-neutral-500">
              {isEdit ? t('admin_ui.update_ministry_leadership_details_and_sched', 'Update ministry leadership, details, and schedules') : t('admin_ui.introduce_a_new_church_department_outreach_g', 'Introduce a new church department, outreach group, or ministry program')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              {t('admin_ui.ministry_overview', 'Ministry Overview')}
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('contact.form.name', 'Name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder={t('admin_ui.e_g_youth_ministry', 'e.g. Youth Ministry')}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-red'
                }`}
              />
              {errors.name && <p className="text-body-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              {t('admin_ui.about_description', 'About & Description')}
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
              {t('admin_ui.publishing_options', 'Publishing Options')}
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('admin_ui.status', 'Status')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white font-medium"
              >
                <option value="published">{t('admin_ui.published_public', 'Published (Public)')}</option>
                <option value="draft">{t('admin_ui.draft_private', 'Draft (Private)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('admin_ui.published_date', 'Published Date')}
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
                {t('admin_ui.display_order', 'Display Order')}
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
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t('admin_ui.featured_ministry', 'Featured Ministry')}
                  </span>
                  <span className="text-body-xs text-neutral-500 block">
                    {t('admin_ui.highlight_on_the_ministries_landing_page', 'Highlight on the ministries landing page')}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              {t('admin_ui.classification_media', 'Classification & Media')}
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('prayer.form.category', 'Category')}
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              >
                <option value="">{t('admin_ui.no_category', 'No Category')}</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <ImageUpload
                value={formData.featured_image}
                onChange={(url) => setFormData({ ...formData, featured_image: url })}
                folder="ministries"
                label={t('admin_ui.featured_image', 'Featured Image')}
                helperText={t('admin_ui.upload_a_banner_or_cover_image_for_this_mini', 'Upload a banner or cover image for this ministry.')}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-red" /> {t('admin_ui.leadership_contact', 'Leadership & Contact')}
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('admin_ui.leader_director', 'Leader / Director')}
              </label>
              <input
                type="text"
                value={formData.leader || ''}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                placeholder={t('admin_ui.pastor_john_smith', 'Pastor John Smith')}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-500" /> {t('admin_ui.contact_email', 'Contact Email')}
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
                <Phone className="w-3.5 h-3.5 text-neutral-500" /> {t('admin_ui.contact_phone', 'Contact Phone')}
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
              <Calendar className="w-4 h-4 text-primary-red" /> {t('admin_ui.meeting_schedule', 'Meeting Schedule')}
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('admin_ui.meeting_day', 'Meeting Day')}
              </label>
              <select
                value={formData.meeting_day || ''}
                onChange={(e) => setFormData({ ...formData, meeting_day: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
              >
                <option value="">{t('admin_ui.select_day', 'Select day...')}</option>
                <option value="Sunday">{t('admin_ui.sunday', 'Sunday')}</option>
                <option value="Monday">{t('admin_ui.monday', 'Monday')}</option>
                <option value="Tuesday">{t('admin_ui.tuesday', 'Tuesday')}</option>
                <option value="Wednesday">{t('admin_ui.wednesday', 'Wednesday')}</option>
                <option value="Thursday">{t('admin_ui.thursday', 'Thursday')}</option>
                <option value="Friday">{t('admin_ui.friday', 'Friday')}</option>
                <option value="Saturday">{t('admin_ui.saturday', 'Saturday')}</option>
                <option value="Various">{t('admin_ui.various', 'Various')}</option>
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('ministry_detail.meeting_time', 'Meeting Time')}
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
                <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {t('ministry_detail.location', 'Location')}
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t('admin_ui.fellowship_hall_sanctuary_zoom', 'Fellowship Hall, Sanctuary, Zoom...')}
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
              {t('form.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? t('admin_ui.saving', 'Saving...') : isEdit ? t('admin_ui.update_ministry', 'Update Ministry') : t('admin_ui.create_ministry', 'Create Ministry')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MinistryFormPage;
