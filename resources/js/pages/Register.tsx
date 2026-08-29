import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const RegisterPage: React.FC = () => {
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
      alert('Passwords do not match');
      return;
    }
    if (!agreed) {
      alert('Please agree to the terms');
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
              alt="Horaios Baptist Church Logo"
              className="w-16 h-16 rounded-full mx-auto mb-4 object-contain shadow-md"
            />
            <h1 className="text-h4 font-semibold text-neutral-900 mb-2">
              Create Account
            </h1>
            <p className="text-body-sm text-neutral-600">
              Join our faith community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
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
                I agree to the{' '}
                <a href="#" className="text-primary-red hover:text-primary-dark-red font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-red hover:text-primary-dark-red font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button type="submit" variant="primary" fullWidth size="lg">
              Create Account
            </Button>

            <p className="text-center text-body-sm text-neutral-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary-red hover:text-primary-dark-red font-medium">
                Sign in
              </a>
            </p>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;
