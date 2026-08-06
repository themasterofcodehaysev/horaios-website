import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, MoreVertical, Edit2, Trash2,
  ChevronLeft, ChevronRight, X, Users, AlertTriangle,
} from 'lucide-react';
import { userService } from '../../services/user.service';
import { roleService } from '../../services/role.service';
import type { User, Role, PaginatedResponse, UserFilters } from '../../types';

const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<User>['meta'] | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({ page: 1, per_page: 15 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.list(filters);
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchRoles = useCallback(async () => {
    try {
      const result = await roleService.list();
      setRoles(result);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      setDeleting(true);
      await userService.delete(deleteModal.user.uuid);
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    inactive: 'bg-neutral-100 text-neutral-500',
    locked: 'bg-red-50 text-red-700',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Users</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Link
          to="/admin/users/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
            </button>
          )}
        </div>
        <select
          value={filters.role_id || ''}
          onChange={(e) => setFilters(f => ({ ...f, role_id: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
          className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Roles</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.display_name}</option>)}
        </select>
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined, page: 1 }))}
          className="px-3 py-2.5 border border-neutral-200 rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="animate-pulse divide-y divide-neutral-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-neutral-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-32 bg-neutral-100 rounded" />
                  <div className="h-3 w-48 bg-neutral-50 rounded" />
                </div>
                <div className="h-6 w-16 bg-neutral-100 rounded-full" />
                <div className="h-6 w-20 bg-neutral-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
            <button onClick={fetchUsers} className="text-body-sm text-primary-600 font-medium hover:underline">Retry</button>
          </div>
        ) : users.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Users className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500">No users found</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_120px_120px_80px] gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-body-xs text-neutral-500 font-medium uppercase tracking-wide">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
              <span className="text-right">Actions</span>
            </div>
            {/* Table Rows */}
            <div className="divide-y divide-neutral-100">
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_120px_80px] gap-2 md:gap-4 items-center px-5 py-3 hover:bg-neutral-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-label-md font-bold shrink-0">
                      {user.display_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-sm text-neutral-900 font-medium truncate">{user.display_name}</p>
                      <p className="text-body-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-body-sm text-neutral-700">{user.role?.display_name || '—'}</span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1 text-body-xs px-2 py-0.5 rounded-full font-medium ${statusColors[user.status] || 'bg-neutral-100 text-neutral-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'locked' ? 'bg-red-500' : 'bg-neutral-400'}`} />
                      {user.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-body-xs text-neutral-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-400" />
                    </button>
                    {actionMenu === user.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-neutral-200 shadow-lg z-20 py-1 animate-scale-in">
                          <button
                            onClick={() => { setActionMenu(null); navigate(`/admin/users/${user.uuid}/edit`); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-body-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            <Edit2 className="w-4 h-4" /> Edit User
                          </button>
                          <button
                            onClick={() => { setActionMenu(null); setDeleteModal({ open: true, user }); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-body-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete User
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-body-xs text-neutral-500">
            Showing {meta.from || 0}–{meta.to || 0} of {meta.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={meta.current_page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
              className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
              .filter(p => p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 1)
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-1 text-neutral-400">…</span>
                  )}
                  <button
                    onClick={() => setFilters(f => ({ ...f, page }))}
                    className={`w-8 h-8 rounded-lg text-body-sm font-medium ${
                      page === meta.current_page
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
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

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, user: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-h5 text-neutral-900 text-center font-semibold mb-2">Delete User</h3>
            <p className="text-body-sm text-neutral-500 text-center mb-6">
              Are you sure you want to delete <strong>{deleteModal.user.display_name}</strong>? This action can be undone later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, user: null })}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-body-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersListPage;
