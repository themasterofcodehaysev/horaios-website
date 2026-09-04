import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, MapPin, Mail, Phone, User,
  Sparkles, Heart, MessageCircle, HandHeart, Search, Users,
} from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Layout } from '../components/layout';
import { Breadcrumb } from '../components/common';
import { MinistryCard } from '../components/sections';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ministryService } from '../services/publicContent.service';
import type { MinistryPublic } from '../types';

export const MinistryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ministry, setMinistry] = useState<MinistryPublic | null>(null);
  const [relatedMinistries, setRelatedMinistries] = useState<MinistryPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const setMetaDescription = useCallback((description: string | null) => {
    if (!description) return;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, []);

  useEffect(() => {
    const fetchMinistry = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await ministryService.getPublicMinistryDetail(id);
        setMinistry(data);

        try {
          const related = await ministryService.getRelatedMinistries(id);
          setRelatedMinistries(related.slice(0, 3));
        } catch {
          setRelatedMinistries([]);
        }
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          setError('The requested ministry was not found.');
        } else {
          setError(err?.response?.data?.message || 'Unable to load ministry.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMinistry();
  }, [id]);

  useEffect(() => {
    if (ministry) {
      const title = ministry.seo_title || `${ministry.name} | Horaios Baptist Church Ministries`;
      document.title = title;
      setMetaDescription(ministry.seo_description || ministry.description || null);
    }
    return () => {
      document.title = 'Horaios Baptist Church';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', '');
    };
  }, [ministry, setMetaDescription]);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-[45vh] min-h-[360px] bg-neutral-300" />
          <div className="max-w-6xl mx-auto -mt-24 px-4 sm:px-6 space-y-8 pb-20">
            <div className="h-5 w-32 bg-neutral-200 rounded" />
            <div className="h-12 w-2/3 bg-white rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-80 bg-white rounded-2xl border border-neutral-200" />
              </div>
              <div className="h-96 bg-neutral-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !ministry) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <Heart className="w-14 h-14 text-neutral-300 mx-auto mb-5" />
          <h2 className="text-h4 font-bold text-neutral-800 mb-2">Ministry Not Found</h2>
          <p className="text-body-sm text-neutral-500 mb-8">
            {error || 'This ministry may have been removed or does not exist.'}
          </p>
          <button
            onClick={() => navigate('/ministries')}
            className="px-5 py-2.5 bg-primary-red text-white rounded-lg font-medium text-body-sm hover:bg-primary-dark-red transition-colors"
          >
            Back to All Ministries
          </button>
        </div>
      </Layout>
    );
  }

  const meetingSchedule = [ministry.meeting_day, ministry.meeting_time].filter(Boolean).join(' at ');

  return (
    <Layout>
      <section
        className="relative w-full h-[50vh] min-h-[400px] max-h-[560px] flex items-end overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: ministry.featured_image
              ? `url(${ministry.featured_image})`
              : undefined,
            backgroundColor: ministry.featured_image ? undefined : '#0f172a',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-red/30 via-primary-red/60 to-primary-red" />
        <div className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 pb-14 text-white space-y-5">
          <Link
            to="/ministries"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Ministries
          </Link>

          <Breadcrumb
            items={[
              { label: 'Ministries', href: '/ministries' },
              ...(ministry.category ? [{ label: ministry.category.name }] : []),
              { label: ministry.name },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {ministry.category && (
              <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white border border-white/10 uppercase tracking-wider">
                {ministry.category.name}
              </span>
            )}
            {ministry.featured && (
              <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-neutral-900">
                ★ Featured Ministry
              </span>
            )}
          </div>

          <div>
            <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight leading-[1.05] mb-3">
              {ministry.name}
            </h1>
            {ministry.leader && (
              <p className="text-body-lg font-medium text-primary-100 flex items-center gap-2">
                <User className="w-4 h-4" /> Led by <span className="text-white font-semibold">{ministry.leader}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg" shadow="sm" className="space-y-5">
              <h2 className="text-h4 font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                About This Ministry
              </h2>
              {ministry.description ? (
                <div data-color-mode="light" className="prose prose-neutral max-w-none prose-headings:font-bold prose-h3:text-h5 prose-p:text-body-base prose-p:leading-relaxed prose-li:text-body-base">
                  <MarkdownPreview source={ministry.description} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
                </div>
              ) : (
                <p className="text-body-base text-neutral-500 italic">No description provided.</p>
              )}
            </Card>

            <div className="bg-gradient-to-br from-primary-red to-primary-red rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <HandHeart className="w-8 h-8 text-primary-200" />
                <h3 className="text-h4 font-bold">Ready to Join This Ministry?</h3>
              </div>
              <p className="text-body-lg text-primary-100 max-w-2xl">
                We'd love to have you serve with us. Take the next step — connect with the ministry leader and discover how your gifts can make an impact.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white !text-primary-red hover:bg-primary-100 transition-colors"
                  onClick={() => setJoining(true)}
                  disabled={joining}
                >
                  <Users className="w-5 h-5 mr-2" />
                  {joining ? 'Connecting...' : `Join ${ministry.name}`}
                </Button>
                {ministry.email && (
                  <a
                    href={`mailto:${ministry.email}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white text-body-sm font-semibold border border-white/15 hover:bg-white/15 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Email Leader
                  </a>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit space-y-5">
            <Card padding="lg" shadow="md" className="space-y-6">
              <h3 className="text-h6 font-bold text-neutral-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary-red" /> Ministry Information
              </h3>
              <ul className="space-y-5">
                {ministry.leader && (
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-red/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary-red" />
                    </div>
                    <div>
                      <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">Leader</p>
                      <p className="text-body-sm font-bold text-neutral-900">{ministry.leader}</p>
                    </div>
                  </li>
                )}
                {meetingSchedule && (
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-red/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary-red" />
                    </div>
                    <div>
                      <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">Meeting Time</p>
                      <p className="text-body-sm font-bold text-neutral-900">{meetingSchedule}</p>
                    </div>
                  </li>
                )}
                {ministry.location && (
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</p>
                      <p className="text-body-sm font-bold text-neutral-900 leading-snug">{ministry.location}</p>
                    </div>
                  </li>
                )}
                {(ministry.email || ministry.phone) && (
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">Contact</p>
                      {ministry.email && (
                        <a
                          href={`mailto:${ministry.email}`}
                          className="text-body-sm font-semibold text-primary-red hover:text-primary-red transition-colors flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" /> {ministry.email}
                        </a>
                      )}
                      {ministry.phone && (
                        <a
                          href={`tel:${ministry.phone}`}
                          className="text-body-sm font-semibold text-primary-red hover:text-primary-red transition-colors flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" /> {ministry.phone}
                        </a>
                      )}
                    </div>
                  </li>
                )}
              </ul>

              <Button
                variant="primary"
                size="lg"
                className="w-full !py-3.5"
                onClick={() => setJoining(true)}
                disabled={joining}
              >
                <HandHeart className="w-4 h-4 mr-2" />
                {joining ? 'Processing...' : 'Join Ministry'}
              </Button>
            </Card>
          </aside>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="primary" size="sm" className="uppercase tracking-wider">Next Steps</Badge>
            <h2 className="text-h3 font-bold text-neutral-900">How to Get Involved</h2>
            <p className="text-body-base text-neutral-600 max-w-xl mx-auto">
              Three simple steps to connect, grow, and serve through our ministry community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center h-full border border-neutral-200 hover:border-primary-red/30 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary-red/10 text-primary-red flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <div className="text-body-xs font-bold text-primary-red uppercase tracking-wider mb-2">Step 1</div>
              <h4 className="text-h6 font-bold text-neutral-900 mb-3">Explore</h4>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                Browse ministries and learn more about each one — their mission, values, and how they serve our church.
              </p>
            </Card>

            <Card padding="lg" className="text-center h-full border border-neutral-200 hover:border-primary-red/30 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary-red/10 text-primary-red flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div className="text-body-xs font-bold text-primary-red uppercase tracking-wider mb-2">Step 2</div>
              <h4 className="text-h6 font-bold text-neutral-900 mb-3">Connect</h4>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                Reach out to the ministry leader. Ask questions, share your heart, and find where you fit best.
              </p>
            </Card>

            <Card padding="lg" className="text-center h-full border border-neutral-200 hover:border-primary-red/30 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <HandHeart className="w-7 h-7" />
              </div>
              <div className="text-body-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Step 3</div>
              <h4 className="text-h6 font-bold text-neutral-900 mb-3">Serve</h4>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                Use your unique gifts. Jump in, attend meetings, and begin making an eternal difference with others.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setJoining(true)}
              disabled={joining}
            >
              <Heart className="w-5 h-5 mr-2" />
              {joining ? 'Connecting...' : 'Get Connected Today'}
            </Button>
          </div>
        </div>
      </section>

      {relatedMinistries.length > 0 && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Explore Other Ministries
              </h3>
              <Link
                to="/ministries"
                className="inline-flex items-center gap-1 text-body-sm font-semibold text-primary-red hover:underline"
              >
                View All Ministries <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedMinistries.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/ministries/${rel.id}`}
                  className="group h-full"
                >
                  <MinistryCard
                    name={rel.name}
                    description={rel.description || ''}
                    image={rel.featured_image || undefined}
                    leader={rel.leader || undefined}
                    schedule={meetingSchedule || undefined}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default MinistryDetailPage;
