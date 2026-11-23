import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Trash2, Eye, EyeOff } from 'lucide-react';
import { userService } from '../../services/user.service';
import { roleService } from '../../services/role.service';
import { useToast } from '../../hooks/useToast';
import { Role } from '../../types';

import { useLanguage, translate } from '../../../context/LanguageContext';
export default function UserEditPage() {
  const { t } = useLanguage();
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role_id: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isCustomDisplayName, setIsCustomDisplayName] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, rolesRes] = await Promise.all([
          userService.get(uuid!),
          roleService.list()
        ]);
        
        const userData = userRes;
        const initialFirst = userData.first_name || '';
        const initialLast = userData.last_name || '';
        const initialDisplay = userData.display_name || '';
        const defaultCombined = `${initialFirst} ${initialLast}`.trim();
        
        setIsCustomDisplayName(Boolean(initialDisplay && initialDisplay !== defaultCombined));

        setFormData({
          first_name: initialFirst,
          last_name: initialLast,
          display_name: initialDisplay,
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
        setErrorState(translate('admin_msg.failed_to_load_user_data_they_may_not_exist', 'Failed to load user data. They may not exist.'));
        addToast({ type: 'error', title: translate('admin_ui.failed_to_load_user', 'Failed to load user'), message: translate('admin_ui.the_user_data_could_not_be_loaded_they_may_n', 'The user data could not be loaded. They may not exist.') });
      } finally {
        setFetching(false);
      }
    };
    if (uuid) fetchData();
  }, [uuid]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = translate('admin_msg.first_name_is_required', 'First name is required');
    if (!formData.last_name) newErrors.last_name = translate('admin_msg.last_name_is_required', 'Last name is required');
    if (!formData.email) newErrors.email = translate('admin_msg.email_is_required', 'Email is required');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = translate('admin_msg.invalid_email_format', 'Invalid email format');
    
    if (formData.password) {
      if (formData.password.length < 8) newErrors.password = translate('admin_msg.password_must_be_at_least_8_characters', 'Password must be at least 8 characters');
      if (formData.password !== formData.confirm_password) newErrors.confirm_password = translate('admin_msg.passwords_do_not_match', 'Passwords do not match');
    }
    
    if (!formData.role_id) newErrors.role_id = translate('admin_msg.role_is_required', 'Role is required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'display_name') {
      const defaultCombined = `${formData.first_name} ${formData.last_name}`.trim();
      setIsCustomDisplayName(value.trim().length > 0 && value.trim() !== defaultCombined);
      setFormData(prev => ({ ...prev, display_name: value }));
    } else if (name === 'first_name' || name === 'last_name') {
      setFormData(prev => {
        const nextFirst = name === 'first_name' ? value : prev.first_name;
        const nextLast = name === 'last_name' ? value : prev.last_name;
        return {
          ...prev,
          [name]: value,
          display_name: !isCustomDisplayName ? `${nextFirst} ${nextLast}`.trim() : prev.display_name
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      addToast({ type: 'success', title: t('admin_ui.user_updated', 'User updated'), message: t('admin_ui.the_user_was_updated_successfully', 'The user was updated successfully.') });
      navigate('/admin/users');
    } catch (err: any) {
      console.error('Failed to update user', err);
      addToast({ type: 'error', title: t('admin_ui.failed_to_update_user', 'Failed to update user'), message: err?.response?.data?.message || translate('admin_msg.please_try_again', 'Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await userService.delete(uuid!);
      addToast({ type: 'success', title: t('admin_ui.user_deleted', 'User deleted'), message: t('admin_ui.the_user_was_deleted_successfully', 'The user was deleted successfully.') });
      navigate('/admin/users');
    } catch (err: any) {
      console.error('Failed to delete user', err);
      addToast({ type: 'error', title: t('admin_ui.failed_to_delete_user', 'Failed to delete user'), message: err?.response?.data?.message || translate('admin_msg.please_try_again', 'Please try again.') });
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
            {t('admin_ui.back_to_users', 'Back to Users')}
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
          <h1 className="text-2xl font-semibold text-gray-900">{t('admin_ui.edit_user', 'Edit User')}</h1>
          <p className="text-sm text-gray-500">{t('admin_ui.update_user_information', 'Update user information')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">{t('admin_ui.user_information', 'User Information')}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_ui.first_name', 'First Name *')}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_ui.last_name', 'Last Name *')}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_ui.display_name', 'Display Name')}</label>
              <input
                type="text"
                name="display_name"
                placeholder={t('admin_ui.leave_blank_to_use_first_last_name', 'Leave blank to use First + Last name')}
                value={formData.display_name}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.display_name ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.display_name && <p className="text-red-500 text-xs mt-1">{errors.display_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_ui.email', 'Email *')}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('visit.phone', 'Phone')}</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('ui.password', 'Password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={t('admin_ui.leave_blank_to_keep_current_password', 'Leave blank to keep current password')}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 pr-11 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                  title={showPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('ui.confirm_password', 'Confirm Password')}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={!formData.password}
                  className={`w-full rounded-lg border px-4 py-2 pr-11 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all ${errors.confirm_password ? 'border-red-500' : 'border-gray-200'} disabled:bg-gray-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={!formData.password}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                  title={showConfirmPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_ui.role_442e8e', 'Role *')}</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all bg-white ${errors.role_id ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="">{t('admin_ui.select_a_role', 'Select a role')}</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_ui.status', 'Status')}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-primary-navy focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="active">{t('admin_ui.active', 'Active')}</option>
                <option value="inactive">{t('admin_ui.inactive', 'Inactive')}</option>
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
              {t('admin_ui.delete_user', 'Delete User')}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                {t('form.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary-red hover:bg-primary-dark-red rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {loading ? t('admin_ui.saving', 'Saving...') : t('admin_ui.save_changes', 'Save Changes')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin_ui.delete_user_b8a0cb', 'Delete User?')}</h3>
            <p className="text-sm text-gray-500 mb-6">{t('admin_ui.are_you_sure_you_want_to_delete_this_user_th', 'Are you sure you want to delete this user? This action cannot be undone.')}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t('form.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                {t('form.delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
