import React, { useState, useEffect, useCallback } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Layout } from '../components/layout';
import { HeroSection, MinistryCard } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Heart, MapPin, Calendar, Users, Music, BookOpen,
  Search, X, ChevronLeft, ChevronRight, AlertTriangle, Loader2,
} from 'lucide-react';
import { ministryService } from '../services/publicContent.service';
import type { MinistryPublic, MinistryCategoryPublic, MinistryFilters, PaginatedResponse } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  worship: <Music className="w-8 h-8" />,
  education: <BookOpen className="w-8 h-8" />,
  outreach: <Heart className="w-8 h-8" />,
  youth: <Calendar className="w-8 h-8" />,
  care: <MapPin className="w-8 h-8" />,
};

const getIconFor = (category?: MinistryCategoryPublic | null) => {
  if (!category) return <Users className="w-8 h-8" />;
  const slug = category.slug?.toLowerCase() || '';
  for (const key of Object.keys(iconMap)) {
    if (slug.includes(key)) return iconMap[key];
  }
  return <Users className="w-8 h-8" />;
};

const formatSchedule = (m: MinistryPublic): string => {
  const parts: string[] = [];
  if (m.meeting_day) parts.push(m.meeting_day);
  if (m.meeting_time) parts.push(m.meeting_time);
  if (m.location) parts.push(m.location);
  return parts.join(' • ');
};

export const MinistriesPage: React.FC = () => {
  const [activeMinistry, setActiveMinistry] = useState<number | string | null>(null);
  const [ministries, setMinistries] = useState<MinistryPublic[]>([]);
  const [categories, setCategories] = useState<MinistryCategoryPublic[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<MinistryPublic>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MinistryFilters>({ page: 1, per_page: 9 });
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const fetchMinistries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const f: MinistryFilters = { ...filters };
      if (activeCategory !== 'all') f.category_slug = activeCategory;
      const result = await ministryService.getPublicMinistries(f);
      setMinistries(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load ministries');
    } finally {
      setLoading(false);
    }
  }, [filters, activeCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await ministryService.getPublicCategories();
      setCategories(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchMinistries(); }, [fetchMinistries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setFilters(f => ({ ...f, page: 1 }));
  }, [activeCategory]);

  const active = ministries.find(m => m.id === activeMinistry || m.slug === activeMinistry);

  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title="Our Ministries"
        subtitle="Get Involved"
        description="Discover how you can use your gifts to serve God and impact others."
        minHeight="md"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search ministries by name, leader, or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 border border-neutral-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-body-xs font-medium transition-colors border ${
                  activeCategory === 'all'
                    ? 'bg-primary-red text-white border-primary-red'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                All Ministries
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-body-xs font-medium transition-colors border ${
                    activeCategory === c.slug
                      ? 'bg-primary-red text-white border-primary-red'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <div className="h-40 bg-neutral-100 rounded-lg" />
                  <div className="h-5 bg-neutral-100 rounded w-3/4" />
                  <div className="h-4 bg-neutral-50 rounded w-full" />
                  <div className="h-4 bg-neutral-50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-body-base text-neutral-600 mb-3">{error}</p>
              <button onClick={fetchMinistries} className="text-body-sm text-primary-red font-medium hover:underline">
                Retry
              </button>
            </div>
          ) : ministries.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-body-base text-neutral-500">
                No ministries found. Check back soon for opportunities to get involved.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ministries.map((ministry) => (
                  <MinistryCard
                    key={ministry.id}
                    name={ministry.name}
                    description={ministry.description || ''}
                    icon={getIconFor(ministry.category)}
                    image={ministry.featured_image || undefined}
                    leader={ministry.leader || undefined}
                    schedule={formatSchedule(ministry)}
                    onClick={() => setActiveMinistry(ministry.id)}
                  />
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-body-xs text-neutral-500">
                    Showing {meta.from || 0}–{meta.to || 0} of {meta.total} ministries
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={meta.current_page <= 1}
                      onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
                      className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-body-sm font-medium text-neutral-700 px-3">
                      Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button
                      disabled={meta.current_page >= meta.last_page}
                      onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                      className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {active && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card padding="lg" shadow="lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="overflow-hidden rounded-lg h-64 bg-neutral-200 flex items-center justify-center">
                  {active.featured_image ? (
                    <img src={active.featured_image} alt={active.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-neutral-300">{getIconFor(active.category)}</div>
                  )}
                </div>
                <div>
                  {active.category && (
                    <span className="inline-block mb-3 text-body-xs font-semibold px-2.5 py-1 rounded-full bg-primary-red/10 text-primary-red">
                      {active.category.name}
                    </span>
                  )}
                  <h2 className="text-h3 font-semibold text-neutral-900 mb-4">
                    {active.name}
                  </h2>
                  {active.description && (
                    <div data-color-mode="light" className="prose prose-neutral max-w-none mb-6 text-body-base text-neutral-700">
                      <MarkdownPreview source={active.description} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
                    </div>
                  )}
                  <div className="space-y-2 mb-6">
                    {active.leader && (
                      <p className="text-body-base text-neutral-700">
                        <span className="font-semibold">Leader:</span> {active.leader}
                      </p>
                    )}
                    {active.meeting_day && (
                      <p className="text-body-base text-neutral-700">
                        <span className="font-semibold">Meeting:</span> {formatSchedule(active)}
                      </p>
                    )}
                    {active.email && (
                      <p className="text-body-base text-neutral-700">
                        <span className="font-semibold">Email:</span>{' '}
                        <a href={`mailto:${active.email}`} className="text-primary-red hover:underline">
                          {active.email}
                        </a>
                      </p>
                    )}
                    {active.phone && (
                      <p className="text-body-base text-neutral-700">
                        <span className="font-semibold">Phone:</span>{' '}
                        <a href={`tel:${active.phone}`} className="text-primary-red hover:underline">
                          {active.phone}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="primary" size="lg">
                      Join {active.name}
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => setActiveMinistry(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            How to Get Involved
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Explore
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Learn about different ministries and find one that aligns with your interests and gifts.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Connect
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Talk with ministry leaders to understand how you can contribute and grow.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🙌</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Serve
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Use your talents and passion to make a difference in the lives of others.
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg">
              Get Connected
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MinistriesPage;
