import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { authService } from '../admin/services/auth.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(formData.email, formData.password);
      authService.storeAuth(response.token, response.user, rememberMe);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err?.response?.data?.message || 
        err?.response?.data?.errors?.email?.[0] || 
        'Invalid email or password. Please try again.'
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
              alt="Horaios Baptist Church Logo"
              className="w-16 h-16 rounded-full mx-auto mb-4 object-contain shadow-md"
            />
            <h1 className="text-h4 font-semibold text-neutral-900 mb-2">
              Horaios CMS Sign In
            </h1>
            <p className="text-body-sm text-neutral-600">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="error" title="Authentication Failed">
                {error}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between text-body-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-primary-red focus:ring-primary-red"
                />
                <span className="text-neutral-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary-red hover:text-primary-dark-red font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <p className="text-body-xs text-neutral-500">
              Horaios Baptist Church CMS &bull; Production Ready
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
