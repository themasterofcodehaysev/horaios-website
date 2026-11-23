import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

import { useLanguage } from '../context/LanguageContext';
export const RegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t('ui.passwords_do_not_match', 'Passwords do not match'));
      return;
    }
    if (!agreed) {
      alert(t('ui.please_agree_to_the_terms', 'Please agree to the terms'));
      return;
    }
    console.log('Register:', formData);
  };

  return (
    <Layout hideNavigation hideFooter>
      <div className="min-h-screen bg-gradient-to-br from-primary-red to-primary-light-red flex items-center justify-center px-4 py-12">
        <Card padding="lg" shadow="lg" className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="/images/logo.png"
              alt={t('ui.horaios_baptist_church_logo', 'Horaios Baptist Church Logo')}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-contain shadow-md"
            />
            <h1 className="text-h4 font-semibold text-neutral-900 mb-2">
              {t('ui.create_account', 'Create Account')}
            </h1>
            <p className="text-body-sm text-neutral-600">
              {t('ui.join_our_faith_community', 'Join our faith community')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('ui.full_name', 'Full Name')}
              type="text"
              name="name"
              placeholder={t('ui.john_doe', 'John Doe')}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label={t('visit.email', 'Email')}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label={t('ui.password', 'Password')}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label={t('ui.confirm_password', 'Confirm Password')}
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <span className="text-body-sm text-neutral-600">
                {t('ui.i_agree_to_the', 'I agree to the')}{' '}
                <a href="#" className="text-primary-red hover:text-primary-dark-red font-medium">
                  {t('footer.terms_of_service', 'Terms of Service')}
                </a>{' '}
                {t('ui.and', 'and')}{' '}
                <a href="#" className="text-primary-red hover:text-primary-dark-red font-medium">
                  {t('footer.privacy_policy', 'Privacy Policy')}
                </a>
              </span>
            </label>

            <Button type="submit" variant="primary" fullWidth size="lg">
              {t('ui.create_account', 'Create Account')}
            </Button>

            <p className="text-center text-body-sm text-neutral-600">
              {t('ui.already_have_an_account', 'Already have an account?')}{' '}
              <a href="/login" className="text-primary-red hover:text-primary-dark-red font-medium">
                {t('ui.sign_in_b6d422', 'Sign in')}
              </a>
            </p>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;
