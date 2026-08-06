import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
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
                    className="w-full px-3 py-2 rounded-md border-2 border-neutral-300 focus:border-primary-navy focus:outline-none transition-all"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Send className="w-5 h-5" />}
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-h3 font-semibold text-neutral-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                <div>
                  <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                    📍 Address
                  </h4>
                  <p className="text-body-base text-neutral-700">
                    Phnom Penh, Cambodia
                  </p>
                </div>

                <div>
                  <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                    📞 Phone
                  </h4>
                  <a
                    href="tel:+"
                    className="text-body-base text-primary-navy hover:text-primary-dark-navy font-medium"
                  >
                    +855 (0) 23 XXX XXXX
                  </a>
                </div>

                <div>
                  <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                    ✉️ Email
                  </h4>
                  <a
                    href="mailto:info@horaiosbaptist.org"
                    className="text-body-base text-primary-navy hover:text-primary-dark-navy font-medium"
                  >
                    info@horaiosbaptist.org
                  </a>
                </div>

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

                <div>
                  <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                    🌐 Departments
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium text-neutral-900">Pastoral:</span>{' '}
                      <a href="mailto:" className="text-primary-navy hover:text-primary-dark-navy">
                        pastoral@horaiosbaptist.org
                      </a>
                    </li>
                    <li>
                      <span className="font-medium text-neutral-900">Worship:</span>{' '}
                      <a href="mailto:" className="text-primary-navy hover:text-primary-dark-navy">
                        worship@horaiosbaptist.org
                      </a>
                    </li>
                    <li>
                      <span className="font-medium text-neutral-900">Youth:</span>{' '}
                      <a href="mailto:" className="text-primary-navy hover:text-primary-dark-navy">
                        youth@horaiosbaptist.org
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h3 font-semibold text-neutral-900 mb-6">
            Other Ways to Connect
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="default" fullWidth>
              Follow on Facebook
            </Button>
            <Button variant="default" fullWidth>
              Subscribe on YouTube
            </Button>
            <Button variant="default" fullWidth>
              Follow on Instagram
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
