import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, MapPin,
  Sparkles, ChevronRight,
  CalendarDays, Users, AlertCircle, CheckCircle2, XCircle, PlayCircle, CalendarRange,
} from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Layout } from '../components/layout';
import { Breadcrumb, ShareBar } from '../components/common';
import { EventCard } from '../components/sections';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { eventService, contactService } from '../services/publicContent.service';
import { downloadIcsFile, generateSingleEventIcs, getGoogleCalendarUrl } from '../utils/calendar';
import type { EventPublic, EventStatus } from '../types';
import { useLanguage, translate, getDateLocale } from '../context/LanguageContext';

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(getDateLocale(), {
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
  const { t } = useLanguage();
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: 1,
    notes: '',
  });
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setRegSubmitting(true);
    setRegError(null);

    try {
      await contactService.submitContactMessage({
        name: regForm.name.trim(),
        email: regForm.email.trim(),
        phone: regForm.phone.trim() || undefined,
        subject: `Event Registration: ${event.title}`,
        message: `New registration for "${event.title}".\nDate: ${event.start_date || 'N/A'}${event.start_time ? ` at ${event.start_time}` : ''}\nLocation: ${event.location || 'N/A'}\nAttendees Count: ${regForm.attendees}\nNotes: ${regForm.notes?.trim() || 'None'}`,
      });
      setRegSuccess(true);
    } catch (err: any) {
      setRegError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors || {})[0]]?.[0] ||
        translate('ui.failed_to_complete_registration_please_try_a', 'Failed to complete registration. Please try again.')
      );
    } finally {
      setRegSubmitting(false);
    }
  };

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
          setError(translate('ui.the_requested_event_was_not_found', 'The requested event was not found.'));
        } else {
          setError(err?.response?.data?.message || translate('ui.unable_to_load_event', 'Unable to load event.'));
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
          <h2 className="text-h4 font-bold text-neutral-800 mb-2">{t('ui.event_not_found', 'Event Not Found')}</h2>
          <p className="text-body-sm text-neutral-500 mb-8">
            {error || translate('ui.this_event_may_have_been_removed_or_does_not', 'This event may have been removed or does not exist.')}
          </p>
          <button
            onClick={() => navigate('/events')}
            className="px-5 py-2.5 bg-primary-red text-white rounded-lg font-medium text-body-sm hover:bg-primary-dark-red transition-colors"
          >
            {t('ui.back_to_all_events', 'Back to All Events')}
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

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pt-28 sm:pt-32 pb-20 border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-neutral-600 hover:text-primary-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('ui.back_to_all_events', 'Back to All Events')}
          </Link>

        <Breadcrumb
          items={[
            { label: t('nav.events', 'Events'), href: '/events' },
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
              {statusCfg.icon} {translate(`event_status.${status}`, statusCfg.label)}
            </span>
            {event.featured && (
              <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                {t('ui.featured', '★ Featured')}
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
                {t('event_detail.about_title', 'About This Event')}
              </h2>
              {event.description ? (
                <div data-color-mode="light" className="prose prose-neutral max-w-none prose-headings:font-bold prose-h3:text-h5 prose-p:text-body-base prose-p:leading-relaxed">
                  <MarkdownPreview source={event.description} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
                </div>
              ) : (
                <p className="text-body-base text-neutral-500 italic">{t('ui.no_description_provided', 'No description provided.')}</p>
              )}
            </section>

            <ShareBar
              title={event.title}
              description={event.location || event.category?.name || ''}
              label={t('ui.share_event', 'Share Event')}
            />
          </div>

          <aside className="lg:sticky lg:top-28 h-fit space-y-5">
            <Card padding="lg" shadow="md" className="space-y-6">
              <div>
                <h3 className="text-h6 font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-primary-red" /> {t('event_detail.details_title', 'Event Details')}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-red/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-primary-red" />
                    </div>
                    <div>
                      <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('event_detail.date', 'Date')}</p>
                      <p className="text-body-sm font-bold text-neutral-900">{dateRange || translate('ui.tbd_caps', 'TBD')}</p>
                    </div>
                  </li>
                  {timeRange && (
                    <li className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-red/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-primary-red" />
                      </div>
                      <div>
                        <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('event_detail.time', 'Time')}</p>
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
                        <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('event_detail.location', 'Location')}</p>
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
                    title={translate('ui.title_map', '{title} map', { title: event.title })}
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
                        {status === 'cancelled' ? t('ui.registration_cancelled', 'Registration Cancelled') : t('ui.registration_required', 'Registration Required')}
                      </p>
                      {event.registration_limit !== null && (
                        <p className="text-body-xs text-neutral-600 mt-0.5">
                          {event.registrations_count !== undefined && (
                            <>
                              {event.registrations_count}/{event.registration_limit} {t('ui.registered', 'registered')}
                              {spotsLeft !== null && spotsLeft > 0 && translate('ui.count_spots_left', ' • {count} spots left', { count: spotsLeft })}
                              {spotsLeft !== null && spotsLeft <= 0 && translate('ui.event_is_full', ' • Event is full')}
                            </>
                          )}
                          {event.registrations_count === undefined && translate('ui.limit_count_attendees', 'Limit: {count} attendees', { count: event.registration_limit })}
                        </p>
                      )}
                    </div>
                  </div>
                  {canRegister && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setRegSuccess(false);
                        setRegError(null);
                        setIsRegisterModalOpen(true);
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {t('event_detail.register_now', 'Register Now')}
                    </Button>
                  )}
                  {spotsLeft !== null && spotsLeft <= 0 && status !== 'cancelled' && status !== 'completed' && (
                    <p className="text-body-xs font-semibold text-center text-amber-700">
                      {t('ui.this_event_is_currently_at_capacity', 'This event is currently at capacity.')}
                    </p>
                  )}
                </div>
              )}
            </Card>

            <Card padding="lg" className="text-center border-dashed border-2 bg-neutral-50/70 space-y-3">
              <Calendar className="w-8 h-8 text-primary-red mx-auto" />
              <h4 className="text-h6 font-bold text-neutral-900">{t('event_detail.add_calendar', 'Add to Calendar')}</h4>
              <p className="text-body-xs text-neutral-500">
                {t('ui.never_miss_this_event_sync_it_directly_with_', 'Never miss this event. Sync it directly with your calendar.')}
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => window.open(getGoogleCalendarUrl(event), '_blank')}
                >
                  <CalendarRange className="w-4 h-4 mr-2" />
                  Google Calendar
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => downloadIcsFile(generateSingleEventIcs(event), `${event.slug || 'event'}.ics`)}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {t('ui.download_ics', 'Download .ics')}
                </Button>
              </div>
            </Card>
          </aside>
        </div>

        {relatedEvents.length > 0 && (
          <section className="space-y-5 pt-6 border-t border-neutral-200">
            <h3 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> {t('ui.related_events', 'Related Events')}
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
                    time={formatTime(rel.start_time) || translate('ui.tbd_caps', 'TBD')}
                    location={rel.location || translate('ui.tbd_caps', 'TBD')}
                    description={rel.description || undefined}
                    image={rel.featured_image || undefined}
                    featured={rel.featured}
                    category={rel.category?.name || undefined}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        <Card padding="lg" className="text-center bg-gradient-to-r from-primary-red via-primary-red to-primary-red border-0 !text-white">
          <CalendarDays className="w-10 h-10 text-primary-100 mx-auto mb-4" />
          <h2 className="text-h3 font-bold mb-3">{t('ui.add_this_event_to_your_calendar', 'Add This Event to Your Calendar')}</h2>
          <p className="text-body-lg text-primary-100 max-w-xl mx-auto mb-6">
            {t('ui.easily_save_this_gathering_to_apple_calendar', 'Easily save this gathering to Apple Calendar, Outlook, or Google Calendar so you don\'t miss it.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="bg-white !text-primary-red hover:bg-primary-100 transition-colors font-bold shadow-md"
              onClick={() => downloadIcsFile(generateSingleEventIcs(event), `${event.slug || 'event'}.ics`)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {t('ui.download_ics', 'Download .ics')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="!bg-white/10 !text-white hover:!bg-white/20 border-0 font-bold"
              onClick={() => window.open(getGoogleCalendarUrl(event), '_blank')}
            >
              <CalendarRange className="w-5 h-5 mr-2" />
              Google Calendar
            </Button>
          </div>
        </Card>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title={`${t('event_detail.modal_title', 'Register for')} ${event.title}`}
        size="md"
      >
        {regSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full">
              {t('event_detail.reg_received', 'Registration Received')}
            </span>
            <h3 className="text-h4 font-bold text-neutral-900">{t('event_detail.reg_success', "You're Registered!")}</h3>
            <p className="text-body-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
              {t('ui.thank_you', 'Thank you,')} <span className="font-semibold text-neutral-900">{regForm.name}</span>{t('ui.your_spot_for', '! Your spot for')}{' '}
              <span className="font-semibold text-neutral-900">{event.title}</span> ({regForm.attendees} {regForm.attendees === 1 ? translate('ui.attendee', 'attendee') : translate('ui.attendees', 'attendees')}{t('ui.has_been_received_we_look_forward_to_having_', ') has been received. We look forward to having you!')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.open(getGoogleCalendarUrl(event), '_blank')}
              >
                <CalendarRange className="w-4 h-4 mr-1.5" /> Google Calendar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => downloadIcsFile(generateSingleEventIcs(event), `${event.slug || 'event'}.ics`)}
              >
                <Calendar className="w-4 h-4 mr-1.5" /> {t('ui.download_ics', 'Download .ics')}
              </Button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-body-xs font-semibold text-neutral-500 hover:text-neutral-800"
              >
                {t('form.done', 'Done')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-body-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-body-xs text-neutral-600 space-y-1">
              <p className="font-bold text-neutral-900">{event.title}</p>
              <p>{formatDate(event.start_date)}{timeRange ? ` • ${timeRange}` : ''}</p>
              {event.location && <p className="text-neutral-500">{event.location}</p>}
            </div>

            <Input
              label={t('ui.full_name', 'Full Name')}
              required
              value={regForm.name}
              onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
              placeholder={t('ui.e_g_john_doe', 'e.g. John Doe')}
            />

            <Input
              label={t('form.email', 'Email Address')}
              type="email"
              required
              value={regForm.email}
              onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
              placeholder="you@example.com"
            />

            <Input
              label={t('form.phone', 'Phone Number')}
              type="tel"
              required
              value={regForm.phone}
              onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              placeholder="e.g. +855 12 345 678"
            />

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('event_detail.attendees', 'Number of Attendees')}
              </label>
              <input
                type="number"
                min={1}
                max={spotsLeft && spotsLeft > 0 ? spotsLeft : 20}
                value={regForm.attendees}
                onChange={(e) => setRegForm({ ...regForm, attendees: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-red/30"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-neutral-700 mb-1">
                {t('event_detail.notes_label', 'Notes / Special Requests (Optional)')}
              </label>
              <textarea
                rows={2}
                value={regForm.notes}
                onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                placeholder={t('ui.dietary_requirements_children_attending_acce', 'Dietary requirements, children attending, accessibility assistance, etc.')}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-red/30"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsRegisterModalOpen(false)}
                disabled={regSubmitting}
              >
                {t('form.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={regSubmitting}
              >
                {regSubmitting ? t('ui.registering', 'Registering...') : t('event_detail.register_btn', 'Register')}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
};

export default EventDetailPage;
