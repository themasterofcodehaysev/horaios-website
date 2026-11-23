import React, { useState } from 'react';
import { KeyRound, UserCircle, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/auth.service';

import { useLanguage, translate } from '../../context/LanguageContext';
export default function AccountSettingsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.display_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t('admin_ui.new_password_and_confirmation_do_not_match', 'New password and confirmation do not match.'));
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      addToast({ type: 'success', title: t('admin_ui.password_changed', 'Password changed'), message: t('admin_ui.your_password_has_been_updated', 'Your password has been updated.') });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const message = err?.response?.data?.message || translate('admin_msg.failed_to_change_password_please_check_your_curr', 'Failed to change password. Please check your current password.');
      setError(message);
      addToast({ type: 'error', title: t('admin_ui.could_not_change_password', 'Could not change password'), message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={t('admin_ui.account_settings', 'Account Settings')} description={t('admin_ui.manage_your_profile_and_password', 'Manage your profile and password.')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">{t('admin_ui.profile', 'Profile')}</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">{t('contact.form.name', 'Name')}</dt>
              <dd className="font-medium text-gray-900">{displayName || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t('visit.email', 'Email')}</dt>
              <dd className="font-medium text-gray-900">{user?.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t('admin_ui.role', 'Role')}</dt>
              <dd className="font-medium text-gray-900">{user?.role?.display_name || user?.role?.name || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">{t('admin_ui.change_password', 'Change Password')}</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_ui.current_password', 'Current Password')}</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showCurrentPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                  title={showCurrentPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('ui.new_password', 'New Password')}</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showNewPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                  title={showNewPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('ui.confirm_new_password', 'Confirm New Password')}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                  title={showConfirmPassword ? t('ui.hide_password', 'Hide password') : t('ui.show_password', 'Show password')}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {saving ? t('admin_ui.saving', 'Saving...') : t('admin_ui.update_password', 'Update Password')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
