import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Clock, Edit2, Trash2, CheckCircle,
  XCircle, Loader2, AlertTriangle, X, Search,
  ArrowUpDown, ExternalLink, Sparkles, MapPin, Tag
} from 'lucide-react';
import { churchServiceService } from '../../services/churchService.service';
import type { ChurchServiceItem } from '../../types';
import { IconRenderer } from '../../../components/ui/IconRenderer';
import { useToast } from '../../hooks/useToast';

const PRESET_ICONS = [
  { label: 'Church', html: '<i class="fa-solid fa-church"></i>' },
  { label: 'Prayer', html: '<i class="fa-solid fa-hands-praying"></i>' },
  { label: 'Bible', html: '<i class="fa-solid fa-book-bible"></i>' },
  { label: 'Worship', html: '<i class="fa-solid fa-music"></i>' },
  { label: 'Fellowship', html: '<i class="fa-solid fa-users"></i>' },
  { label: 'Dove', html: '<i class="fa-solid fa-dove"></i>' },
  { label: 'Cross', html: '<i class="fa-solid fa-cross"></i>' },
  { label: 'Clock', html: '<i class="fa-solid fa-clock"></i>' },
  { label: 'Location', html: '<i class="fa-solid fa-location-dot"></i>' },
];

const PRESET_DAYS = [
  'Sunday Morning',
  'Sunday Afternoon',
  'Sunday Evening',
  'Wednesday Evening',
  'Friday Evening',
  'Saturday Morning',
  'Saturday Afternoon',
];

export const ChurchServicesPage: React.FC = () => {
  const { addToast } = useToast();
  const [services, setServices] = useState<ChurchServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    service: Partial<ChurchServiceItem> | null;
  }>({ open: false, mode: 'create', service: null });

  const [formData, setFormData] = useState({
    title: '',
    day: 'Sunday Morning',
    time: '',
    type: '',
    location: '',
    description: '',
    icon: '<i class="fa-solid fa-church"></i>',
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; service: ChurchServiceItem | null }>({ open: false, service: null });
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await churchServiceService.getAdminServices();
      setServices(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load church services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreateModal = () => {
    setFormData({
      title: '',
      day: 'Sunday Morning',
      time: '9:00 AM & 11:00 AM',
      type: 'Main Worship Service',
      location: 'Main Sanctuary & Live Stream',
      description: '',
      icon: '<i class="fa-solid fa-church"></i>',
      display_order: services.length + 1,
      status: 'active',
    });
    setModal({ open: true, mode: 'create', service: null });
  };

  const openEditModal = (service: ChurchServiceItem) => {
    setFormData({
      title: service.title,
      day: service.day,
      time: service.time,
      type: service.type || '',
      location: service.location || '',
      description: service.description || '',
      icon: service.icon || '',
      display_order: service.display_order,
      status: service.status,
    });
    setModal({ open: true, mode: 'edit', service });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.day.trim() || !formData.time.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Service Title, Day, and Time are required.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (modal.mode === 'create') {
        const created = await churchServiceService.createService(formData);
        setServices(prev => [...prev, created].sort((a, b) => a.display_order - b.display_order));
        addToast({
          type: 'success',
          title: 'Service Created',
          message: `"${created.title}" has been added to services schedule.`,
        });
      } else if (modal.service?.id) {
        const updated = await churchServiceService.updateService(modal.service.id, formData);
        setServices(prev => prev.map(s => s.id === updated.id ? updated : s).sort((a, b) => a.display_order - b.display_order));
        addToast({
          type: 'success',
          title: 'Service Updated',
          message: `"${updated.title}" has been updated successfully.`,
        });
      }
      setModal({ open: false, mode: 'create', service: null });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err?.response?.data?.message || 'Failed to save church service.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (service: ChurchServiceItem) => {
    try {
      const updated = await churchServiceService.toggleServiceStatus(service.id);
      setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Service status set to ${updated.status}.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err?.response?.data?.message || 'Could not change service status.',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.service) return;
    setDeleting(true);
    try {
      await churchServiceService.deleteService(deleteModal.service.id);
      setServices(prev => prev.filter(s => s.id !== deleteModal.service!.id));
      addToast({
        type: 'success',
        title: 'Service Deleted',
        message: `"${deleteModal.service.title}" has been removed.`,
      });
      setDeleteModal({ open: false, service: null });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err?.response?.data?.message || 'Failed to delete church service.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const newServices = [...services];
    const temp = newServices[index];
    newServices[index] = newServices[targetIndex];
    newServices[targetIndex] = temp;

    // re-assign sequential orders
    const orders = newServices.map((s, idx) => ({ id: s.id, display_order: idx + 1 }));
    setServices(newServices.map((s, idx) => ({ ...s, display_order: idx + 1 })));

    try {
      await churchServiceService.reorderServices(orders);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Reorder Failed',
        message: 'Could not persist display order change.',
      });
      fetchServices();
    }
  };

  const filteredServices = services.filter(service => {
    const matchSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.day.toLowerCase().includes(search.toLowerCase()) ||
      service.time.toLowerCase().includes(search.toLowerCase()) ||
      (service.type && service.type.toLowerCase().includes(search.toLowerCase())) ||
      (service.location && service.location.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-primary-red" />
            Church Services & Schedules
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage weekly worship services, prayer meetings, fellowship times, locations, and custom FontAwesome icons.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-primary-red hover:bg-primary-dark-red text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* FontAwesome Info Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">FontAwesome & HTML Icons Supported</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              You can paste custom icon HTML (e.g. <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-300 text-amber-900">&lt;i class="fa-solid fa-church"&gt;&lt;/i&gt;</code>) or icon class names directly into any service.
            </p>
          </div>
        </div>
        <a
          href="https://fontawesome.com/search?o=r&m=free"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-lg transition-colors shrink-0 shadow-xs"
        >
          Browse FontAwesome Icons
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, day, time, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          {(['all', 'active', 'inactive'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab} {tab !== 'all' && `(${services.filter(s => s.status === tab).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-primary-red mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading church services...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-red-800">{error}</p>
          <button
            onClick={fetchServices}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No Services Found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            {search ? 'No services matched your search term.' : 'Get started by creating your first weekly church service.'}
          </p>
          {!search && (
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 bg-primary-red text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark-red"
            >
              <Plus className="w-4 h-4" />
              Add First Service
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-14 text-center">Icon</th>
                  <th className="py-3 px-4">Service & Timing</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-24 text-center">Order</th>
                  <th className="py-3 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredServices.map((service, index) => (
                  <tr key={service.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-4 px-4 text-center text-xs font-semibold text-gray-400">
                      {index + 1}
                    </td>

                    {/* Icon preview */}
                    <td className="py-4 px-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-primary-red/10 text-primary-red flex items-center justify-center mx-auto text-lg">
                        <IconRenderer
                          icon={service.icon}
                          fallback={<Clock className="w-5 h-5 text-primary-red" />}
                        />
                      </div>
                    </td>

                    {/* Service & Timing */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{service.title}</span>
                          {service.type && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {service.type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-primary-red font-semibold">
                          <span>{service.day}</span>
                          <span>•</span>
                          <span>{service.time}</span>
                        </div>
                        {service.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-md pt-0.5">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4">
                      {service.location ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{service.location}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sanctuary</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          service.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {service.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-gray-400" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Display Order with Up/Down buttons */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveOrder(index, 'up')}
                          className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-20 disabled:hover:bg-transparent"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <span className="text-xs font-bold text-gray-700 px-1.5">{service.display_order}</span>
                        <button
                          disabled={index === services.length - 1}
                          onClick={() => handleMoveOrder(index, 'down')}
                          className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-20 disabled:hover:bg-transparent"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 rounded-lg text-gray-500 hover:text-primary-navy hover:bg-gray-100 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, service })}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-red" />
                {modal.mode === 'create' ? 'Create Church Service' : 'Edit Church Service'}
              </h3>
              <button
                onClick={() => setModal({ open: false, mode: 'create', service: null })}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Service Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Service Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Sunday Worship, Mid-Week Prayer & Study"
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                />
              </div>

              {/* Day & Time in grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Day *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunday Morning, Wednesday"
                    value={formData.day}
                    onChange={e => setFormData(f => ({ ...f, day: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red mb-2"
                  />
                  {/* Preset day tags */}
                  <div className="flex flex-wrap gap-1">
                    {PRESET_DAYS.slice(0, 4).map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, day: d }))}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                          formData.day === d
                            ? 'bg-primary-red text-white border-primary-red'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9:00 AM & 11:00 AM, 7:00 PM"
                    value={formData.time}
                    onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Accepts multiple services (e.g. "9:00 AM & 11:00 AM")</p>
                </div>
              </div>

              {/* Type / Subtitle & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Type / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Worship Service, Prayer Meeting"
                    value={formData.type}
                    onChange={e => setFormData(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Sanctuary & Live Stream, Room 204"
                    value={formData.location}
                    onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                  />
                </div>
              </div>

              {/* Icon HTML / FontAwesome with Live Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
                    Icon HTML / FontAwesome Code
                  </label>
                  <a
                    href="https://fontawesome.com/search?o=r&m=free"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-primary-red hover:underline flex items-center gap-1"
                  >
                    Get FontAwesome Icons <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  {/* Live preview box */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-xl text-primary-red shrink-0 shadow-xs">
                    <IconRenderer
                      icon={formData.icon}
                      fallback={<Clock className="w-6 h-6 text-gray-400" />}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder='e.g. <i class="fa-solid fa-church"></i> or fa-solid fa-church'
                    value={formData.icon}
                    onChange={e => setFormData(f => ({ ...f, icon: e.target.value }))}
                    className="flex-1 font-mono text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                  />
                </div>

                {/* Preset icon buttons */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_ICONS.map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, icon: p.html }))}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          formData.icon === p.html
                            ? 'bg-primary-red text-white border-primary-red'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span dangerouslySetInnerHTML={{ __html: p.html }} className="text-xs" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Description / Service Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the service, who it's for, languages spoken, etc."
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                />
              </div>

              {/* Display Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={e => setFormData(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red bg-white"
                  >
                    <option value="active">Active (Visible on Website)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: 'create', service: null })}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary-red hover:bg-primary-dark-red text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-xs disabled:opacity-50 transition-all"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modal.mode === 'create' ? 'Create Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.service && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Delete Church Service?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to remove <strong className="text-gray-800">"{deleteModal.service.title}"</strong> ({deleteModal.service.day})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModal({ open: false, service: null })}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurchServicesPage;
