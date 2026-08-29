import React, { useState } from 'react';
import { Heart, Mail, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { prayerService } from '../services/publicContent.service';

const PrayerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    request: '',
    request_type: 'general',
    urgency: 'medium',
    allow_public_prayer: false,
    is_anonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await prayerService.submitPrayerRequest(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        title: '',
        request: '',
        request_type: 'general',
        urgency: 'medium',
        allow_public_prayer: false,
        is_anonymous: false,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit prayer request');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-h2 text-neutral-900 font-semibold mb-2">Prayer Request Submitted</h1>
            <p className="text-body text-neutral-600 mb-6">
              Thank you for sharing your prayer request with us. Our prayer team will be praying for you.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-primary-red mx-auto mb-4" />
          <h1 className="text-h2 text-neutral-900 font-semibold mb-2">Prayer Request</h1>
          <p className="text-body text-neutral-600">
            Share your prayer request with our community. We're here to pray with you.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="(optional)"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1">
                Prayer Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Brief title for your prayer request"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1">
                Prayer Request <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.request}
                onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                placeholder="Share your prayer request with us..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">
                  Request Type
                </label>
                <select
                  value={formData.request_type}
                  onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="general">General</option>
                  <option value="healing">Healing</option>
                  <option value="guidance">Guidance</option>
                  <option value="thanksgiving">Thanksgiving</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allow_public_prayer}
                  onChange={(e) => setFormData({ ...formData, allow_public_prayer: e.target.checked })}
                  className="w-4 h-4 text-primary-red border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-body-sm text-neutral-700">
                  Allow this prayer request to be visible publicly for others to pray
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_anonymous}
                  onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                  className="w-4 h-4 text-primary-red border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-body-sm text-neutral-700">
                  Submit anonymously (name will not be displayed)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Prayer Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrayerPage;
