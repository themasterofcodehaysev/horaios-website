import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { HeroSection, EventCard } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Search, Sparkles, CalendarRange, Star, CalendarDays, ChevronLeft, ChevronRight, History, Clock3 } from 'lucide-react';
import { eventService } from '../services/publicContent.service';
import type { EventPublic, EventCategoryPublic, PaginatedMeta } from '../types';

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'TBD';
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });
};

const formatTime = (timeStr: string | null): string => {
  if (!timeStr) return 'TBD';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

type Scope = 'upcoming' | 'past' | 'all';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventPublic[]>([]);
  const [categories, setCategories] = useState<EventCategoryPublic[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [scope, setScope] = useState<Scope>('upcoming');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await eventService.getPublicCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    try {
      setFeaturedLoading(true);
      const res = await eventService.getPublicEvents({
        featured: true,
        scope: 'upcoming',
        per_page: 3,
        page: 1,
        sort_by: 'start_date',
        sort_dir: 'asc',
      });
      setFeaturedEvents(res.data || []);
    } catch {
      setFeaturedEvents([]);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await eventService.getPublicEvents({
        search: searchDebounced || undefined,
        category_slug: selectedCategory || undefined,
        scope,
        page,
        per_page: 9,
        sort_by: 'start_date',
        sort_dir: scope === 'past' ? 'desc' : 'asc',
      });
      setEvents(res.data || []);
      setMeta(res.meta || null);
    } catch {
      setEvents([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [searchDebounced, selectedCategory, scope, page]);

  useEffect(() => { fetchCategories(); fetchFeatured(); }, [fetchCategories, fetchFeatured]);
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    setPage(1);
  }, [scope, selectedCategory]);

  const hasActiveFilters = !!selectedCategory || !!searchDebounced || scope !== 'upcoming';

  const scopeOptions: { key: Scope; label: string; icon: React.ReactNode }[] = [
    { key: 'upcoming', label: 'Upcoming', icon: <Clock3 className="w-4 h-4" /> },
    { key: 'past', label: 'Past', icon: <History className="w-4 h-4" /> },
    { key: 'all', label: 'All', icon: <CalendarRange className="w-4 h-4" /> },
  ];

  const groupedByMonth: Record<string, EventPublic[]> = {};
  events.forEach((ev) => {
    const key = ev.start_date
      ? new Date(ev.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
      : 'Undated';
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(ev);
  });

  return (
    <Layout>
      <HeroSection
        title="Events"
        subtitle="What's Happening"
        description="Join us for worship, fellowship, community outreach, and spiritual growth. There's a place for everyone at Horaios Baptist Church."
        minHeight="md"
      />

      <section className="py-10 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search events, locations, descriptions..."
              icon={<Search className="w-5 h-5" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl w-fit">
              {scopeOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setScope(opt.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-body-sm font-semibold transition-all ${
                    scope === opt.key
                      ? 'bg-white text-primary-navy shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => { setSelectedCategory(''); setPage(1); }}
                className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all whitespace-nowrap ${
                  !selectedCategory
                    ? 'bg-primary-red text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                  className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.slug
                      ? 'bg-primary-red text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearch('');
                    setSearchDebounced('');
                    setScope('upcoming');
                    setPage(1);
                  }}
                  className="px-4 py-2 rounded-full text-body-sm font-semibold text-primary-red hover:bg-primary-red/5 transition-colors whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {scope !== 'past' && !hasActiveFilters && page === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Featured Events
                </h2>
              </div>
              {featuredLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-4">
                      <div className="aspect-video bg-neutral-200 rounded-xl" />
                      <div className="h-5 bg-neutral-200 rounded w-3/4" />
                      <div className="h-3 bg-neutral-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : featuredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredEvents.map((ev) => (
                    <Link
                      key={ev.id}
                      to={`/events/${ev.slug}`}
                      className="group h-full relative"
                    >
                      <div className="h-full">
                        <EventCard
                          title={ev.title}
                          date={
                            ev.start_date && ev.end_date && ev.start_date !== ev.end_date
                              ? `${formatDate(ev.start_date)} — ${formatDate(ev.end_date)}`
                              : formatDate(ev.start_date)
                          }
                          time={formatTime(ev.start_time)}
                          location={ev.location || 'On Campus'}
                          description={ev.description || undefined}
                          image={ev.featured_image || undefined}
                          featured={ev.featured}
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1 bg-amber-400 text-neutral-950 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary-navy" />
                {scope === 'upcoming' ? 'Upcoming Events' : scope === 'past' ? 'Past Events' : 'All Events'}
                {selectedCategory && ` — ${categories.find(c => c.slug === selectedCategory)?.name || 'Category'}`}
                {searchDebounced && ` matching "${searchDebounced}"`}
              </h2>
              {meta && (
                <span className="text-body-xs text-neutral-500 font-medium">
                  {meta.total} {meta.total === 1 ? 'event' : 'events'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-4">
                    <div className="aspect-video bg-neutral-200 rounded-xl" />
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card padding="lg" className="text-center py-16 bg-white">
                <CalendarRange className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-h5 font-bold text-neutral-800 mb-2">
                  {scope === 'past' ? 'No Past Events' : scope === 'upcoming' ? 'No Upcoming Events' : 'No Events Found'}
                </h3>
                <p className="text-body-sm text-neutral-500 max-w-sm mx-auto mb-6">
                  {hasActiveFilters
                    ? 'Try adjusting your search, date range, or category filters.'
                    : scope === 'upcoming'
                      ? 'Check back soon — new events are added regularly.'
                      : 'No events in the history matching these filters yet.'}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedCategory('');
                      setSearch('');
                      setSearchDebounced('');
                      setScope('upcoming');
                      setPage(1);
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedByMonth).map(([month, monthEvents]) => (
                  <div key={month} className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 flex items-center justify-center px-4 rounded-xl bg-primary-navy/10 border border-primary-navy/20">
                        <CalendarDays className="w-4 h-4 text-primary-navy mr-2" />
                        <span className="text-body-sm font-extrabold text-primary-navy uppercase tracking-wider">
                          {month}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-neutral-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {monthEvents.map((ev) => (
                        <Link
                          key={ev.id}
                          to={`/events/${ev.slug}`}
                          className="group h-full"
                        >
                          <EventCard
                            title={ev.title}
                            date={
                              ev.start_date && ev.end_date && ev.start_date !== ev.end_date
                                ? `${formatDate(ev.start_date)} — ${formatDate(ev.end_date)}`
                                : formatDate(ev.start_date)
                            }
                            time={formatTime(ev.start_time)}
                            location={ev.location || 'On Campus'}
                            description={ev.description || undefined}
                            image={ev.featured_image || undefined}
                            featured={ev.featured}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={meta.current_page <= 1 || loading}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-body-sm font-semibold text-neutral-700 px-4">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  disabled={meta.current_page >= meta.last_page || loading}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-navy/10 text-primary-navy">
            <CalendarDays className="w-7 h-7" />
          </div>
          <h2 className="text-h3 font-bold text-neutral-900">Never Miss an Event</h2>
          <p className="text-body-lg text-neutral-700 max-w-xl mx-auto">
            Subscribe to our public calendar and get all upcoming church events automatically synced to your phone or desktop.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="primary" size="lg">
              <CalendarRange className="w-5 h-5 mr-2" />
              Subscribe to Calendar
            </Button>
            <Button variant="secondary" size="lg">
              Download .ics File
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
