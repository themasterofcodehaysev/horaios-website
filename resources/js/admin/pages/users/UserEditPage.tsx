import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { userService } from '../../services/user.service';
import { roleService } from '../../services/role.service';
import { useToast } from '../../hooks/useToast';
import { Role } from '../../types';

export default function UserEditPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role_id: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, rolesRes] = await Promise.all([
          userService.get(uuid!),
          roleService.list()
        ]);
        
        const userData = userRes;
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          password: '',
          confirm_password: '',
          role_id: userData.role?.id ? String(userData.role.id) : (userData as any).role_id || '',
          status: userData.status || 'active'
        });
        
        setRoles(Array.isArray(rolesRes) ? rolesRes : []);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setErrorState('Failed to load user data. They may not exist.');
        addToast({ type: 'error', title: 'Failed to load user', message: 'The user data could not be loaded. They may not exist.' });
      } finally {
        setFetching(false);
      }
    };
    if (uuid) fetchData();
  }, [uuid]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (formData.password) {
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    }
    
    if (!formData.role_id) newErrors.role_id = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const payload: any = { ...formData };
      delete payload.confirm_password;
      if (!payload.password) delete payload.password;
      
      await userService.update(uuid!, payload);
      addToast({ type: 'success', title: 'User updated', message: 'The user was updated successfully.' });
      navigate('/admin/users');
    } catch (err: any) {
      console.error('Failed to update user', err);
      addToast({ type: 'error', title: 'Failed to update user', message: err?.response?.data?.message || 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await userService.delete(uuid!);
      addToast({ type: 'success', title: 'User deleted', message: 'The user was deleted successfully.' });
      navigate('/admin/users');
    } catch (err: any) {
      console.error('Failed to delete user', err);
      addToast({ type: 'error', title: 'Failed to delete user', message: err?.response?.data?.message || 'Please try again.' });
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto py-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96">
          <div className="grid grid-cols-2 gap-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
          <p>{errorState}</p>
          <button onClick={() => navigate('/admin/users')} className="mt-4 text-primary-navy hover:underline">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit User</h1>
          <p className="text-sm text-gray-500">Update user information</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">User Information</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.first_name ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.last_name ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                disabled={!formData.password}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.confirm_password ? 'border-red-500' : 'border-gray-200'} disabled:bg-gray-50`}
              />
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all bg-white ${errors.role_id ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Delete User
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary-red hover:bg-primary-dark-red rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
