import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, MapPin, Share2, Copy, Check,
  Sparkles, ChevronRight,
  CalendarDays, Users, AlertCircle, CheckCircle2, XCircle, PlayCircle, CalendarRange,
} from 'lucide-react';
import { FacebookIcon, LinkedinIcon, TwitterIcon } from '../components/common/SocialIcons';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Layout } from '../components/layout';
import { Breadcrumb } from '../components/common';
import { EventCard } from '../components/sections';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { eventService } from '../services/publicContent.service';
import type { EventPublic, EventStatus } from '../types';

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
};

const formatTime = (timeStr: string | null): string => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const eventStatusConfig: Record<EventStatus, { label: string; className: string; icon: React.ReactNode }> = {
  upcoming: {
    label: 'Upcoming',
    className: 'bg-sky-100 text-sky-800',
    icon: <CalendarDays className="w-3.5 h-3.5" />,
  },
  today: {
    label: 'Today',
    className: 'bg-emerald-100 text-emerald-800',
    icon: <PlayCircle className="w-3.5 h-3.5" />,
  },
  ongoing: {
    label: 'Ongoing',
    className: 'bg-emerald-100 text-emerald-800',
    icon: <PlayCircle className="w-3.5 h-3.5 animate-pulse" />,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  completed: {
    label: 'Completed',
    className: 'bg-neutral-200 text-neutral-700',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

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

  const getComputedStatus = useCallback((ev: EventPublic): EventStatus => {
    if (ev.status === 'cancelled') return 'cancelled';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = ev.start_date ? new Date(ev.start_date) : null;
    const end = ev.end_date ? new Date(ev.end_date) : start;

    if (!start) return 'upcoming';

    const startDt = new Date(start);
    if (ev.start_time) {
      const [h, m] = ev.start_time.split(':').map(Number);
      startDt.setHours(h, m, 0, 0);
    }
    const endDt = end ? new Date(end) : new Date(startDt);
    if (end && ev.end_time) {
      const [h, m] = ev.end_time.split(':').map(Number);
      endDt.setHours(h, m, 0, 0);
    } else {
      endDt.setHours(23, 59, 59, 999);
    }

    const now = new Date();
    if (now < startDt) return 'upcoming';
    if (now >= startDt && now <= endDt) {
      const startDay = new Date(start); startDay.setHours(0,0,0,0);
      const today0 = new Date(); today0.setHours(0,0,0,0);
      if (startDay.getTime() === today0.getTime()) return 'today';
      return 'ongoing';
    }
    return 'completed';
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getPublicEventDetail(id);
        setEvent(data);

        try {
          const related = await eventService.getRelatedEvents(id);
          setRelatedEvents(related.slice(0, 3));
        } catch {
          setRelatedEvents([]);
        }
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          setError('The requested event was not found.');
        } else {
          setError(err?.response?.data?.message || 'Unable to load event.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      const title = event.seo_title || `${event.title} | Horaios Baptist Church Events`;
      document.title = title;
      setMetaDescription(event.seo_description || event.description || null);
    }
    return () => {
      document.title = 'Horaios Baptist Church';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', '');
    };
  }, [event, setMetaDescription]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 animate-pulse space-y-8">
          <div className="h-5 w-32 bg-neutral-200 rounded" />
          <div className="h-12 w-3/4 bg-neutral-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-neutral-200 rounded-2xl" />
              <div className="h-5 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-11/12" />
              <div className="h-4 bg-neutral-200 rounded w-10/12" />
            </div>
            <div className="h-96 bg-neutral-200 rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <CalendarRange className="w-14 h-14 text-neutral-300 mx-auto mb-5" />
          <h2 className="text-h4 font-bold text-neutral-800 mb-2">Event Not Found</h2>
          <p className="text-body-sm text-neutral-500 mb-8">
            {error || 'This event may have been removed or does not exist.'}
          </p>
          <button
            onClick={() => navigate('/events')}
            className="px-5 py-2.5 bg-primary-red text-white rounded-lg font-medium text-body-sm hover:bg-primary-dark-red transition-colors"
          >
            Back to All Events
          </button>
        </div>
      </Layout>
    );
  }

  const status: EventStatus = event.event_status || getComputedStatus(event);
  const statusCfg = eventStatusConfig[status];
  const dateRange = event.start_date && event.end_date && event.start_date !== event.end_date
    ? `${formatDate(event.start_date)} — ${formatDate(event.end_date)}`
    : formatDate(event.start_date);

  const timeRange = event.start_time || event.end_time
    ? [formatTime(event.start_time), formatTime(event.end_time)].filter(Boolean).join(' — ')
    : '';

  const spotsLeft = event.registration_limit && event.registrations_count !== undefined
    ? event.registration_limit - event.registrations_count
    : null;

  const canRegister = event.registration_required && status !== 'completed' && status !== 'cancelled'
    && (spotsLeft === null || spotsLeft > 0);

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(event.title);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-10 pb-20">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-neutral-600 hover:text-primary-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Events
        </Link>

        <Breadcrumb
          items={[
            { label: 'Events', href: '/events' },
            ...(event.category ? [{ label: event.category.name }] : []),
            { label: event.title },
          ]}
        />

        {event.featured_image && (
          <div className="aspect-[21/9] max-h-[420px] bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-200">
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {event.category && (
              <Badge variant="primary" size="sm">{event.category.name}</Badge>
            )}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-xs font-bold uppercase tracking-wider ${statusCfg.className}`}>
              {statusCfg.icon} {statusCfg.label}
            </span>
            {event.featured && (
              <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                ★ Featured
              </span>
            )}
          </div>
          <h1 className="text-display-md sm:text-display-lg font-extrabold text-neutral-900 leading-[1.1] tracking-tight">
            {event.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-h4 font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                About This Event
              </h2>
              {event.description ? (
                <div data-color-mode="light" className="prose prose-neutral max-w-none prose-headings:font-bold prose-h3:text-h5 prose-p:text-body-base prose-p:leading-relaxed">
                  <MarkdownPreview source={event.description} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
                </div>
              ) : (
                <p className="text-body-base text-neutral-500 italic">No description provided.</p>
              )}
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-2 text-body-xs font-bold text-neutral-600 uppercase tracking-wider">
                <Share2 className="w-4 h-4 text-primary-red" /> Share Event
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] text-white rounded-lg text-body-xs font-medium hover:bg-[#0958a8] transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-body-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  <FacebookIcon className="w-3.5 h-3.5" /> Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-body-xs font-medium hover:bg-neutral-800 transition-colors"
                >
                  <TwitterIcon className="w-3.5 h-3.5" /> X
                </a>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-xs font-medium hover:bg-neutral-100 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit space-y-5">
            <Card padding="lg" shadow="md" className="space-y-6">
              <div>
                <h3 className="text-h6 font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-primary-red" /> Event Details
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-red/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-primary-red" />
                    </div>
                    <div>
                      <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</p>
                      <p className="text-body-sm font-bold text-neutral-900">{dateRange || 'TBD'}</p>
                    </div>
                  </li>
                  {timeRange && (
                    <li className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-red/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-primary-red" />
                      </div>
                      <div>
                        <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">Time</p>
                        <p className="text-body-sm font-bold text-neutral-900">{timeRange}</p>
                      </div>
                    </li>
                  )}
                  {event.location && (
                    <li className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</p>
                        <p className="text-body-sm font-bold text-neutral-900 leading-snug">{event.location}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {event.google_map_url && (
                <div className="rounded-xl overflow-hidden border border-neutral-200 aspect-[4/3] bg-neutral-100">
                  <iframe
                    src={event.google_map_url}
                    title={`${event.title} map`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              )}

              {event.registration_required && (
                <div className={`rounded-2xl p-5 space-y-4 border ${
                  status === 'cancelled'
                    ? 'bg-red-50 border-red-100'
                    : canRegister
                      ? 'bg-primary-red/5 border-primary-red/20'
                      : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {status === 'cancelled' ? (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    ) : canRegister ? (
                      <CheckCircle2 className="w-5 h-5 text-primary-red shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-body-sm font-bold text-neutral-900">
                        {status === 'cancelled' ? 'Registration Cancelled' : 'Registration Required'}
                      </p>
                      {event.registration_limit !== null && (
                        <p className="text-body-xs text-neutral-600 mt-0.5">
                          {event.registrations_count !== undefined && (
                            <>
                              {event.registrations_count}/{event.registration_limit} registered
                              {spotsLeft !== null && spotsLeft > 0 && ` • ${spotsLeft} spots left`}
                              {spotsLeft !== null && spotsLeft <= 0 && ' • Event is full'}
                            </>
                          )}
                          {event.registrations_count === undefined && `Limit: ${event.registration_limit} attendees`}
                        </p>
                      )}
                    </div>
                  </div>
                  {canRegister && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => setRegistering(true)}
                      disabled={registering}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {registering ? 'Processing...' : 'Register Now'}
                    </Button>
                  )}
                  {spotsLeft !== null && spotsLeft <= 0 && status !== 'cancelled' && status !== 'completed' && (
                    <p className="text-body-xs font-semibold text-center text-amber-700">
                      This event is currently at capacity.
                    </p>
                  )}
                </div>
              )}
            </Card>

            <Card padding="lg" className="text-center border-dashed border-2 bg-neutral-50/70 space-y-3">
              <Calendar className="w-8 h-8 text-primary-red mx-auto" />
              <h4 className="text-h6 font-bold text-neutral-900">Add to Calendar</h4>
              <p className="text-body-xs text-neutral-500">
                Never miss an event. Sync our calendar with yours.
              </p>
              <Button variant="secondary" size="md" className="w-full">
                <CalendarDays className="w-4 h-4 mr-2" />
                Subscribe Calendar
              </Button>
            </Card>
          </aside>
        </div>

        {relatedEvents.length > 0 && (
          <section className="space-y-5 pt-6 border-t border-neutral-200">
            <h3 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Related Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/events/${rel.id}`}
                  className="group h-full"
                >
                  <EventCard
                    title={rel.title}
                    date={formatDate(rel.start_date)}
                    time={formatTime(rel.start_time) || 'TBD'}
                    location={rel.location || 'TBD'}
                    description={rel.description || undefined}
                    image={rel.featured_image || undefined}
                    featured={rel.featured}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        <Card padding="lg" className="text-center bg-gradient-to-r from-primary-red via-primary-red to-primary-red border-0 !text-white">
          <CalendarDays className="w-10 h-10 text-primary-100 mx-auto mb-4" />
          <h2 className="text-h3 font-bold mb-3">Never Miss an Event</h2>
          <p className="text-body-lg text-primary-100 max-w-xl mx-auto mb-6">
            Subscribe to our public calendar and get all upcoming events automatically synced to your device.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" className="bg-white !text-primary-red hover:bg-primary-100 transition-colors">
              <Calendar className="w-5 h-5 mr-2" />
              Download .ics
            </Button>
            <Button variant="secondary" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20 border-0">
              <CalendarRange className="w-5 h-5 mr-2" />
              Google Calendar
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default EventDetailPage;
