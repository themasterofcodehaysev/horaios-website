import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Heart, Send, CheckCircle2, AlertTriangle, Shield, Users, Sparkles, Clock, Lock } from 'lucide-react';
import { prayerService } from '../services/publicContent.service';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const PrayerPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
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
      await prayerService.submitPrayerRequest({
        ...formData,
        allow_public_prayer: Boolean(formData.allow_public_prayer),
        is_anonymous: Boolean(formData.is_anonymous),
      });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors || {})[0]]?.[0] || 
        'Failed to submit prayer request. Please check the fields and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <HeroSection
        title="Prayer Requests"
        subtitle="We Are Here For You"
        description="Share your prayer needs with our pastoral team and church community. We believe in the transformative power of prayer in Jesus' name."
        minHeight="md"
        primaryCTA={{
          label: 'Plan Your Visit',
          onClick: () => navigate('/visit'),
        }}
        secondaryCTA={{
          label: 'Contact Us',
          onClick: () => navigate('/contact'),
        }}
      />

      <section className="py-20 md:py-24 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {success ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-elevation-md border border-neutral-200 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-50 border border-green-200 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="inline-block px-3 py-1 bg-green-100/70 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                Request Received
              </span>
              <h2 className="text-display-xs sm:text-h2 font-bold text-neutral-900 mb-3">
                Prayer Request Submitted
              </h2>
              <p className="text-body-base text-neutral-600 mb-8 leading-relaxed max-w-lg mx-auto">
                Thank you for sharing your prayer needs with {settings.church_name || 'Horaios Baptist Church'}. Our pastoral care and prayer ministry team will faithfully lift up your request before God.
              </p>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-left mb-8 max-w-md mx-auto space-y-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2 font-semibold text-neutral-800">
                  <Shield className="w-4 h-4 text-primary-red" />
                  <span>Confidentiality & Care</span>
                </div>
                <p>
                  Your prayer request has been logged in our pastoral system. Unless marked public, only authorized church pastors and prayer ministers can view it.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setSuccess(false)}
                >
                  Submit Another Request
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Context & Scripture */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-red/10 border border-primary-red/20 text-primary-red text-xs font-bold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Pastoral Intercession</span>
                </div>
                <h2 className="text-display-sm font-bold text-neutral-900 tracking-tight leading-tight">
                  How Can We <span className="text-primary-red">Pray For You?</span>
                </h2>
                <p className="text-body-base text-neutral-700 leading-relaxed">
                  No request is too small or too large for God. Whether you are walking through illness, celebrating a blessing, seeking guidance, or facing difficult trials, our church family is honored to stand with you in prayer.
                </p>

                {/* Scripture Card */}
                <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-elevation-sm border border-neutral-800 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-red-300 mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <blockquote className="text-body-sm text-neutral-200 italic leading-relaxed mb-3">
                    "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
                  </blockquote>
                  <cite className="text-xs font-bold uppercase tracking-wider text-red-300 not-italic block">
                    — Philippians 4:6–7
                  </cite>
                </div>

                {/* Privacy Assurance */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
                    <Lock className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Pastoral Confidentiality</h4>
                      <p className="text-xs text-neutral-600 mt-0.5">By default, all requests are kept strictly confidential between you and the pastoral team.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
                    <Users className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Weekly Prayer Team</h4>
                      <p className="text-xs text-neutral-600 mt-0.5">Our ministry team intercedes weekly during our Wednesday prayer meeting.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Prayer Form */}
              <div className="lg:col-span-7">
                <Card padding="lg" className="bg-white rounded-3xl border border-neutral-200/80 shadow-elevation-sm p-6 sm:p-10">
                  <h3 className="text-h4 font-bold text-neutral-900 mb-2">
                    Submit Your Prayer Request
                  </h3>
                  <p className="text-body-sm text-neutral-600 mb-6">
                    Please fill out the form below. Required fields are marked with an asterisk (*).
                  </p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-body-sm text-red-700">{error}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-label-md text-neutral-800 font-semibold mb-1.5">
                          Your Name <span className="text-primary-red">*</span>
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-label-md text-neutral-800 font-semibold mb-1.5">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-label-md text-neutral-800 font-semibold mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 012 345 678"
                      />
                    </div>

                    <div>
                      <label className="block text-label-md text-neutral-800 font-semibold mb-1.5">
                        Prayer Title <span className="text-primary-red">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Brief summary of your prayer need"
                      />
                    </div>

                    <div>
                      <label className="block text-label-md text-neutral-800 font-semibold mb-1.5">
                        Prayer Request Details <span className="text-primary-red">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.request}
                        onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red text-body-sm resize-none transition-all"
                        placeholder="Please describe how we can specifically pray for you (minimum 10 characters)..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-label-md text-neutral-800 font-semibold mb-1.5">
                          Category
                        </label>
                        <select
                          value={formData.request_type}
                          onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red text-body-sm bg-white"
                        >
                          <option value="general">General Request</option>
                          <option value="healing">Healing & Health</option>
                          <option value="guidance">Wisdom & Guidance</option>
                          <option value="thanksgiving">Praise & Thanksgiving</option>
                          <option value="emergency">Urgent / Emergency</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-label-md text-neutral-800 font-semibold mb-1.5">
                          Urgency Level
                        </label>
                        <select
                          value={formData.urgency}
                          onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red text-body-sm bg-white"
                        >
                          <option value="low">Low (Ongoing prayer)</option>
                          <option value="medium">Medium (Standard)</option>
                          <option value="high">High (Needs prayer this week)</option>
                          <option value="urgent">Urgent (Immediate attention)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.allow_public_prayer}
                          onChange={(e) => setFormData({ ...formData, allow_public_prayer: e.target.checked })}
                          className="w-4 h-4 mt-0.5 text-primary-red border-neutral-300 rounded focus:ring-primary-red accent-primary-red"
                        />
                        <div>
                          <span className="text-body-sm font-semibold text-neutral-900 block">
                            Allow this request to be shared with the church congregation
                          </span>
                          <span className="text-xs text-neutral-500">
                            If unchecked, only pastors and elders will see your request.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.is_anonymous}
                          onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                          className="w-4 h-4 mt-0.5 text-primary-red border-neutral-300 rounded focus:ring-primary-red accent-primary-red"
                        />
                        <div>
                          <span className="text-body-sm font-semibold text-neutral-900 block">
                            Submit anonymously
                          </span>
                          <span className="text-xs text-neutral-500">
                            Your name will be hidden from public prayer lists.
                          </span>
                        </div>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={submitting}
                      className="mt-6 shadow-elevation-sm"
                    >
                      {submitting ? (
                        <>Submitting Prayer Request...</>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          <span>Submit Prayer Request</span>
                        </span>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PrayerPage;
