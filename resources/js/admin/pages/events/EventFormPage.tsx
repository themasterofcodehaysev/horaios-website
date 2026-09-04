import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Sparkles, MapPin, Calendar } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { eventService } from '../../services/event.service';
import type { EventCategory, CreateEventPayload } from '../../types';
import ImageUpload from '../../components/ui/ImageUpload';
import { useToast } from '../../hooks/useToast';

const EventFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState<CreateEventPayload>({
    title: '',
    description: '',
    featured_image: '',
    category_id: null,
    location: '',
    google_map_url: '',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: null,
    start_time: null,
    end_time: null,
    registration_required: false,
    registration_limit: null,
    featured: false,
    status: 'published',
    published_at: new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initData = async () => {
      try {
        const catData = await eventService.getAdminEventCategories();
        setCategories(catData);

        if (isEdit && id) {
          const ev = await eventService.getAdminEvent(id);
          setFormData({
            title: ev.title,
            description: ev.description || '',
            featured_image: ev.featured_image || '',
            category_id: ev.category_id,
            location: ev.location || '',
            google_map_url: ev.google_map_url || '',
            start_date: ev.start_date,
            end_date: ev.end_date,
            start_time: ev.start_time,
            end_time: ev.end_time,
            registration_required: ev.registration_required,
            registration_limit: ev.registration_limit,
            featured: ev.featured,
            status: ev.status,
            published_at: ev.published_at ? new Date(ev.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
          });
        }
      } catch (err: any) {
        addToast({
          title: 'Error',
          message: err?.response?.data?.message || 'Failed to load event details',
          type: 'error',
        });
        navigate('/admin/events');
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id, isEdit, navigate, addToast]);

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
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (formData.end_date && formData.start_date) {
      if (formData.end_date < formData.start_date) {
        newErrors.end_date = 'End date cannot be before start date';
      } else if (formData.end_date === formData.start_date && formData.start_time && formData.end_time) {
        if (formData.end_time <= formData.start_time) {
          newErrors.end_time = 'End time must be after start time for same-day events';
        }
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      addToast({
        title: 'Validation Error',
        message: Object.values(newErrors)[0],
        type: 'error',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await eventService.updateEvent(Number(id), formData);
      } else {
        await eventService.createEvent(formData);
      }
      addToast({
        title: 'Success',
        message: isEdit ? 'Event updated successfully' : 'Event created successfully',
        type: 'success',
      });
      navigate('/admin/events');
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors;
      const message = err?.response?.data?.message || 'Failed to save event';

      if (serverErrors && typeof serverErrors === 'object') {
        const fieldErrors: Record<string, string> = {};
        const errorList: string[] = [];
        Object.entries(serverErrors).forEach(([field, msgs]: [string, any]) => {
          const firstMsg = Array.isArray(msgs) ? msgs[0] : String(msgs);
          fieldErrors[field] = firstMsg;
          errorList.push(firstMsg);
        });
        setErrors(prev => ({ ...prev, ...fieldErrors }));
        addToast({
          title: 'Validation Error',
          message: errorList[0] || message,
          type: 'error',
        });
      } else {
        addToast({
          title: 'Error',
          message,
          type: 'error',
        });
      }
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
            onClick={() => navigate('/admin/events')}
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-h3 text-neutral-900 font-bold">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-body-xs text-neutral-500">
              {isEdit ? 'Update event schedule, location, and registration settings' : 'Schedule a new event, service, or gathering for the community'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Event Overview
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Annual Church Conference 2026"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-red'
                }`}
              />
              {errors.title && <p className="text-body-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-red" /> Schedule
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm bg-white ${
                    errors.start_date ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.start_date && <p className="text-body-xs text-red-500 mt-1">{errors.start_date}</p>}
              </div>
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  min={formData.start_date || undefined}
                  onChange={(e) => {
                    setFormData({ ...formData, end_date: e.target.value || null });
                    if (errors.end_date) setErrors(prev => ({ ...prev, end_date: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm bg-white ${
                    errors.end_date ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.end_date && <p className="text-body-xs text-red-500 mt-1">{errors.end_date}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.start_time || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, start_time: e.target.value || null });
                    if (errors.end_time) setErrors(prev => ({ ...prev, end_time: '' }));
                  }}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.end_time || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, end_time: e.target.value || null });
                    if (errors.end_time) setErrors(prev => ({ ...prev, end_time: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-body-sm bg-white ${
                    errors.end_time ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.end_time && <p className="text-body-xs text-red-500 mt-1">{errors.end_time}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-red" /> Location
            </h2>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Venue / Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Main Sanctuary, 123 Faith Avenue"
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                value={formData.google_map_url || ''}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  // Auto-extract the src URL if the user pastes the full <iframe> embed code
                  const srcMatch = val.match(/src="([^"]+)"/);
                  if (srcMatch) {
                    val = srcMatch[1];
                  }
                  setFormData({ ...formData, google_map_url: val });
                }}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
              />
              <p className="text-body-xs text-neutral-400 mt-1">
                Go to Google Maps → Share → Embed a map → copy only the{' '}
                <code className="text-neutral-600 bg-neutral-100 px-1 rounded">src="..."</code>{' '}
                URL inside the iframe code. You can also paste the full iframe code and it will be extracted automatically.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Event Description
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'cancelled' })}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white font-medium"
              >
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Private)</option>
                <option value="cancelled">Cancelled</option>
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
                  <span className="text-body-sm font-semibold text-neutral-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Event
                  </span>
                  <span className="text-body-xs text-neutral-500 block">
                    Display prominently on homepage and events calendar
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-h6 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
              Registration
            </h2>

            <div>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.registration_required}
                  onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked })}
                  className="w-4 h-4 text-primary-red rounded border-neutral-300 focus:ring-primary-red"
                />
                <div>
                  <span className="text-body-sm font-semibold text-neutral-900 block">
                    Registration Required
                  </span>
                  <span className="text-body-xs text-neutral-500 block">
                    Require attendees to register for this event
                  </span>
                </div>
              </label>
            </div>

            {formData.registration_required && (
              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Registration Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.registration_limit ?? ''}
                  onChange={(e) => setFormData({ ...formData, registration_limit: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Leave blank for unlimited"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-body-sm"
                />
              </div>
            )}
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
                folder="events"
                label="Featured Image"
                helperText="Upload a banner or promotional image for this event."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
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
              {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventFormPage;
