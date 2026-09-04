import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { contactService } from '../services/publicContent.service';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await contactService.submitContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title="Get In Touch"
        subtitle="Contact Us"
        description="Have questions or want to connect? We'd love to hear from you."
        minHeight="md"
      />

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-h3 font-semibold text-neutral-900 mb-8">
                Send us a Message
              </h2>

              {submitted && (
                <Alert variant="success" title="Message Sent!" className="mb-6">
                  Thank you for contacting us. We'll get back to you soon!
                </Alert>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-body-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone (Optional)"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <Input
                  label="Subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-label-md text-neutral-700 mb-2 font-medium">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 rounded-md border-2 border-neutral-300 focus:border-primary-red focus:outline-none transition-all"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Send className="w-5 h-5" />}
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-h3 font-semibold text-neutral-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                {settings.address && (
                  <div>
                    <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                      📍 Address
                    </h4>
                    <p className="text-body-base text-neutral-700">
                      {settings.address}
                    </p>
                  </div>
                )}

                {settings.phone && (
                  <div>
                    <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                      📞 Phone
                    </h4>
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-body-base text-primary-red hover:text-primary-dark-red font-medium"
                    >
                      {settings.phone}
                    </a>
                  </div>
                )}

                {settings.email && (
                  <div>
                    <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                      ✉️ Email
                    </h4>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-body-base text-primary-red hover:text-primary-dark-red font-medium"
                    >
                      {settings.email}
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                    🕐 Office Hours
                  </h4>
                  <p className="text-body-base text-neutral-700 mb-2">
                    <span className="font-medium">Monday - Friday:</span> 9:00 AM - 5:00 PM
                  </p>
                  <p className="text-body-base text-neutral-700">
                    <span className="font-medium">Saturday - Sunday:</span> Available during services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      {(settings.facebook || settings.youtube || settings.telegram || settings.instagram) && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h3 font-semibold text-neutral-900 mb-6">
              Other Ways to Connect
            </h2>

            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="default">
                    Follow on Facebook
                  </Button>
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="default">
                    Subscribe on YouTube
                  </Button>
                </a>
              )}
              {settings.telegram && (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="default">
                    Join Telegram Channel
                  </Button>
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="default">
                    Follow on Instagram
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ContactPage;
