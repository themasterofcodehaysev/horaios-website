import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { authService } from '../admin/services/auth.service';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
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
              Forgot your password?
            </h1>
            <p className="text-body-sm text-neutral-600">
              Enter your email and we'll send you a link to reset it.
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="error" title="Something went wrong">
                {error}
              </Alert>
            </div>
          )}

          {sent ? (
            <Alert variant="success" title="Check your email">
              If that email address is registered, a password reset link is on its way. It expires in 60 minutes.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <Link to="/login" className="text-body-sm text-primary-red hover:text-primary-dark-red font-medium">
              Back to sign in
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
