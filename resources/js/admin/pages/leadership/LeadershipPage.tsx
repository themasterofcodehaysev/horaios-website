import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Users, Edit2, Trash2, CheckCircle,
  XCircle, Loader2, AlertTriangle, X, Mail, Phone, Globe, User, Search,
  ArrowUpDown
} from 'lucide-react';
import { leaderService } from '../../services/leader.service';
import type { Leader } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';
import ImageUpload from '../../components/ui/ImageUpload';
import { useToast } from '../../hooks/useToast';

export const LeadershipPage: React.FC = () => {
  const { addToast } = useToast();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    leader: Partial<Leader> | null;
  }>({ open: false, mode: 'create', leader: null });

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    phone: '',
    facebook: '',
    photo: '',
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; leader: Leader | null }>({ open: false, leader: null });
  const [deleting, setDeleting] = useState(false);

  const fetchLeaders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaderService.getAdminLeaders();
      setLeaders(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load leadership team');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaders();
  }, [fetchLeaders]);

  const openCreateModal = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      email: '',
      phone: '',
      facebook: '',
      photo: '',
      display_order: leaders.length + 1,
      status: 'active',
    });
    setModal({ open: true, mode: 'create', leader: null });
  };

  const openEditModal = (leader: Leader) => {
    setFormData({
      name: leader.name,
      role: leader.role,
      bio: leader.bio || '',
      email: leader.email || '',
      phone: leader.phone || '',
      facebook: leader.facebook || '',
      photo: leader.photo || '',
      display_order: leader.display_order,
      status: leader.status,
    });
    setModal({ open: true, mode: 'edit', leader });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Name and Role/Position are required.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (modal.mode === 'edit' && modal.leader?.id) {
        await leaderService.updateLeader(modal.leader.id, formData);
        addToast({
          type: 'success',
          title: 'Leader Updated',
          message: `${formData.name} has been updated successfully.`,
        });
      } else {
        await leaderService.createLeader(formData);
        addToast({
          type: 'success',
          title: 'Leader Added',
          message: `${formData.name} has been added to the leadership team.`,
        });
      }
      setModal({ open: false, mode: 'create', leader: null });
      fetchLeaders();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Operation Failed',
        message: err?.response?.data?.message || 'Failed to save leadership member',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (leader: Leader) => {
    try {
      const updated = await leaderService.toggleLeaderStatus(leader.id);
      setLeaders((prev) => prev.map((l) => (l.id === leader.id ? updated : l)));
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `${leader.name} is now ${updated.status}.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Status Update Failed',
        message: err?.response?.data?.message || 'Failed to toggle status',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.leader) return;
    setDeleting(true);
    try {
      await leaderService.deleteLeader(deleteModal.leader.id);
      addToast({
        type: 'success',
        title: 'Leader Removed',
        message: `${deleteModal.leader.name} was removed from the leadership team.`,
      });
      setDeleteModal({ open: false, leader: null });
      fetchLeaders();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err?.response?.data?.message || 'Failed to delete leader',
      });
    } finally {
      setDeleting(false);
    }
  };

  const filteredLeaders = leaders.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.role.toLowerCase().includes(search.toLowerCase()) ||
    (l.email && l.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-neutral-900 font-bold flex items-center gap-2.5">
            <Users className="w-7 h-7 text-primary-red" />
            Leadership Team
          </h1>
          <p className="text-body-xs text-neutral-500">
            Manage pastors, elders, directors, and ministry leaders displayed on the About page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Leader
        </button>
      </div>

      {/* Search Bar & Summary */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, position, or email..."
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="text-body-xs text-neutral-500 font-medium">
          Total Leaders: <span className="font-bold text-neutral-900">{leaders.length}</span> ({leaders.filter((l) => l.status === 'active').length} active)
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-primary-red" />
          <p className="text-body-sm">Loading leadership team...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center text-red-600 shadow-xs">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-body-sm font-semibold">{error}</p>
          <button
            onClick={fetchLeaders}
            className="mt-4 px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium"
          >
            Try Again
          </button>
        </div>
      ) : filteredLeaders.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-400 shadow-xs">
          <Users className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <h3 className="text-h6 text-neutral-700 font-semibold mb-1">
            {search ? 'No leaders found' : 'No leadership members yet'}
          </h3>
          <p className="text-body-xs text-neutral-500 mb-6">
            {search ? 'Try adjusting your search terms.' : 'Add pastors, directors, and leaders to showcase your church leadership.'}
          </p>
          {!search && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Leader
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 text-body-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16 text-center">Order</th>
                  <th className="py-3.5 px-4">Leader / Position</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Bio / Summary</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-body-sm">
                {filteredLeaders.map((leader) => (
                  <tr key={leader.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Display Order */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-700 font-bold rounded text-body-xs">
                        #{leader.display_order}
                      </span>
                    </td>

                    {/* Leader info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                          {leader.photo ? (
                            <img
                              src={getImageUrl(leader.photo)}
                              alt={leader.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-neutral-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900">{leader.name}</div>
                          <div className="text-body-xs font-medium text-primary-red">
                            {leader.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-body-xs text-neutral-600">
                        {leader.email && (
                          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                            <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <a href={`mailto:${leader.email}`} className="hover:text-primary-red truncate">
                              {leader.email}
                            </a>
                          </div>
                        )}
                        {leader.phone && (
                          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                            <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>{leader.phone}</span>
                          </div>
                        )}
                        {leader.facebook && (
                          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                            <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <a href={leader.facebook} target="_blank" rel="noreferrer" className="hover:text-primary-red truncate">
                              Facebook Profile
                            </a>
                          </div>
                        )}
                        {!leader.email && !leader.phone && !leader.facebook && (
                          <span className="text-neutral-400 italic">No contact details</span>
                        )}
                      </div>
                    </td>

                    {/* Bio */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-body-xs text-neutral-600 line-clamp-2">
                        {leader.bio || <span className="text-neutral-400 italic">No biography provided</span>}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(leader)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-body-xs font-semibold cursor-pointer transition-colors ${
                          leader.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                        title="Click to toggle active status"
                      >
                        {leader.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-neutral-400" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(leader)}
                          className="p-1.5 text-neutral-600 hover:text-primary-red hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit leader"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, leader })}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete leader"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-h5 font-bold text-neutral-900">
                {modal.mode === 'create' ? 'Add Leadership Member' : 'Edit Leadership Member'}
              </h2>
              <button
                onClick={() => setModal({ open: false, mode: 'create', leader: null })}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pastor John Doe"
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div>
                  <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                    Role / Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Pastor"
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                  Biography / Ministry Description
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe their pastoral role, calling, and ministry focus..."
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <ImageUpload
                  value={formData.photo}
                  onChange={(url) => setFormData({ ...formData, photo: url })}
                  folder="leaders"
                  label="Portrait Photo"
                  helperText="Upload a professional portrait photo for the About page."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="pastor@church.org"
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm"
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+855 12 345 678"
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm"
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-semibold text-neutral-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-body-sm"
                  />
                </div>
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
                    <option value="active">Active (Visible on About page)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: 'create', leader: null })}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg text-body-sm font-medium hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modal.mode === 'create' ? 'Create Leader' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.leader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-h5 font-bold text-neutral-900">Remove Leadership Member?</h3>
              <p className="text-body-sm text-neutral-500 mt-2">
                Are you sure you want to remove <span className="font-semibold text-neutral-800">{deleteModal.leader.name}</span> ({deleteModal.leader.role}) from the leadership team? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, leader: null })}
                className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg text-body-sm font-medium hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Leader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipPage;
