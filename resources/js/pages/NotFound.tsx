import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="pt-20"></div>

      <section className="py-32 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-error/10 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-error" />
            </div>
          </div>

          <h1 className="text-display-lg md:text-display-xl font-bold text-neutral-900 mb-4">
            404
          </h1>

          <p className="text-h3 font-semibold text-neutral-900 mb-3">
            Page Not Found
          </p>

          <p className="text-body-lg text-neutral-600 mb-8 max-w-xl mx-auto">
            Oops! It looks like the page you're looking for doesn't exist. Don't worry, we can help you get back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              Go Home
            </Button>
            <Button variant="default" size="lg" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-16">
            <h2 className="text-h5 font-semibold text-neutral-900 mb-6">
              Quick Links
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Sermons', href: '/sermons' },
                { label: 'Events', href: '/events' },
                { label: 'Ministries', href: '/ministries' },
                { label: 'News', href: '/news' },
                { label: 'Visit Us', href: '/visit' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 rounded-md border border-neutral-300 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;
