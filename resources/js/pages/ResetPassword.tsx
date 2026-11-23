import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { authService } from '../admin/services/auth.service';

import { useLanguage, translate } from '../context/LanguageContext';
export const ResetPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError(t('ui.passwords_do_not_match_01b0a9', 'Passwords do not match.'));
      return;
    }

    if (!token || !email) {
      setError(t('ui.this_reset_link_is_invalid_please_request_a_', 'This reset link is invalid. Please request a new one.'));
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, email, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(
        err?.response?.data?.errors?.token?.[0] ||
        err?.response?.data?.message ||
        translate('ui.this_reset_link_is_invalid_or_has_expired_pl', 'This reset link is invalid or has expired. Please request a new one.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hideNavigation hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-primary-red to-primary-light-red flex items-center justify-center px-4 py-12">
        <Card padding="lg" shadow="lg" className="w-full max-w-md bg-white">
          <div className="text-center mb-8">
            <img
              src="/images/logo.png"
              alt={t('ui.horaios_baptist_church_logo', 'Horaios Baptist Church Logo')}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-contain shadow-md"
            />
            <h1 className="text-h4 font-semibold text-neutral-900 mb-2">
              {t('ui.set_a_new_password', 'Set a new password')}
            </h1>
            <p className="text-body-sm text-neutral-600">
              {email ? translate('ui.for_email', 'For {email}', { email }) : t('ui.choose_a_strong_password_for_your_account', 'Choose a strong password for your account.')}
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="error" title={t('ui.couldn_t_reset_password', 'Couldn\'t reset password')}>
                {error}
              </Alert>
            </div>
          )}

          {done ? (
            <Alert variant="success" title={t('ui.password_updated', 'Password updated')}>
              {t('ui.redirecting_you_to_sign_in', 'Redirecting you to sign in...')}
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('ui.new_password', 'New Password')}
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label={t('ui.confirm_new_password', 'Confirm New Password')}
                type="password"
                name="password_confirmation"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
                {loading ? t('ui.resetting', 'Resetting...') : t('ui.reset_password', 'Reset Password')}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <Link to="/login" className="text-body-sm text-primary-red hover:text-primary-dark-red font-medium">
              {t('ui.back_to_sign_in', 'Back to sign in')}
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
