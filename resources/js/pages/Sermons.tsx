import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Video, Sparkles, ChevronRight, Star, ChevronLeft, Calendar, User, BookOpen } from 'lucide-react';
import { Layout } from '../components/layout';
import { sermonService } from '../admin/services/sermon.service';
import type { SermonItem, SermonCategory, SermonSeries, Speaker, PaginatedResponse } from '../admin/types';

export const SermonsPage: React.FC = () => {
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [categories, setCategories] = useState<SermonCategory[]>([]);
  const [seriesList, setSeriesList] = useState<SermonSeries[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<SermonItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [page, setPage] = useState(1);

  const fetchFilters = useCallback(async () => {
    try {
      const [cData, sData, spData] = await Promise.all([
        sermonService.getPublicCategories(),
        sermonService.getPublicSeries(),
        sermonService.getPublicSpeakers(),
      ]);
      setCategories(cData);
      setSeriesList(sData);
      setSpeakers(spData);
    } catch { /* ignore */ }
  }, []);

  const fetchSermons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await sermonService.getPublicSermons({
        search,
        category_slug: selectedCategory || undefined,
        series_id: selectedSeries ? Number(selectedSeries) : undefined,
        speaker_id: selectedSpeaker ? Number(selectedSpeaker) : undefined,
        page,
        per_page: 12,
      });
      setSermons(res.data);
      setMeta(res.meta);
    } catch {
      setSermons([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedSeries, selectedSpeaker, page]);

  useEffect(() => { fetchFilters(); }, [fetchFilters]);
  useEffect(() => { fetchSermons(); }, [fetchSermons]);

  const featuredSermons = sermons.filter(s => s.featured);

  return (
    <Layout>
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-neutral-900 via-primary-red to-primary-red py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-body-xs font-semibold uppercase tracking-wider text-primary-100 mb-4 border border-white/10">
            <Video className="w-3.5 h-3.5 text-amber-400" /> Watch & Listen
          </div>
          <h1 className="text-display-lg font-extrabold tracking-tight mb-4">
            Sermons & Messages
          </h1>
          <p className="text-body-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed mb-8">
            Explore our video library of biblical teaching, Sunday morning messages, and sermon series from Horaios Baptist Church.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by sermon title, preacher, scripture, or theme..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-neutral-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-red/30 text-body-base placeholder-neutral-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 max-w-6xl mx-auto space-y-10">
        {/* Category Pills & Dropdowns */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => { setSelectedCategory(''); setPage(1); }}
              className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all whitespace-nowrap ${
                !selectedCategory ? 'bg-primary-red text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug ? 'bg-primary-red text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSeries}
              onChange={(e) => { setSelectedSeries(e.target.value); setPage(1); }}
              className="px-3.5 py-2 border border-neutral-200 rounded-lg text-body-xs bg-white text-neutral-700 font-medium"
            >
              <option value="">Filter by Series</option>
              {seriesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select
              value={selectedSpeaker}
              onChange={(e) => { setSelectedSpeaker(e.target.value); setPage(1); }}
              className="px-3.5 py-2 border border-neutral-200 rounded-lg text-body-xs bg-white text-neutral-700 font-medium"
            >
              <option value="">Filter by Preacher</option>
              {speakers.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
            </select>

            {(selectedCategory || selectedSeries || selectedSpeaker || search) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSeries('');
                  setSelectedSpeaker('');
                  setSearch('');
                  setPage(1);
                }}
                className="text-body-xs text-primary-red font-semibold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Featured Sermons Hero Banner */}
        {!search && !selectedCategory && !selectedSeries && !selectedSpeaker && page === 1 && featuredSermons.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-h5 font-bold text-neutral-900">
              <Sparkles className="w-5 h-5 text-amber-500" /> Featured Sermons
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSermons.slice(0, 3).map((sermon) => (
                <Link
                  key={sermon.id}
                  to={`/sermons/${sermon.slug}`}
                  className="group relative bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="aspect-video bg-neutral-800 relative overflow-hidden">
                    {sermon.thumbnail ? (
                      <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                        <Video className="w-10 h-10 text-neutral-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Video className="w-6 h-6 fill-current" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>

                  <div className="p-6 text-white flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {sermon.category && (
                        <span className="inline-block text-body-xs font-semibold text-primary-300 uppercase tracking-wider mb-1">
                          {sermon.category.name}
                        </span>
                      )}
                      <h3 className="text-h5 font-bold group-hover:text-primary-100 transition-colors leading-snug">
                        {sermon.title}
                      </h3>
                      {sermon.speaker && (
                        <p className="text-body-xs text-neutral-300 mt-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-neutral-400" /> {sermon.speaker.name}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-body-xs font-medium text-neutral-300 group-hover:text-white">
                      <span>Watch Message</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sermons Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h4 font-bold text-neutral-900">
              {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.name || 'Category'} Sermons` : 'All Sermons & Messages'}
            </h2>
            {meta && (
              <span className="text-body-xs text-neutral-500 font-medium">
                {meta.total} {meta.total === 1 ? 'sermon' : 'sermons'} available
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-4">
                  <div className="aspect-video bg-neutral-200 rounded-xl" />
                  <div className="h-5 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : sermons.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 px-4">
              <Video className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-h5 font-bold text-neutral-800 mb-1">No Sermons Found</h3>
              <p className="text-body-sm text-neutral-500 max-w-sm mx-auto mb-6">
                We couldn't find any sermons matching your search or filter options.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedSeries(''); setSelectedSpeaker(''); setPage(1); }}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-body-sm font-medium hover:bg-neutral-800"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon) => (
                <Link
                  key={sermon.id}
                  to={`/sermons/${sermon.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Media Preview */}
                    <div className="aspect-video bg-neutral-900 relative overflow-hidden">
                      {sermon.thumbnail ? (
                        <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                          <Video className="w-10 h-10 text-neutral-600" />
                        </div>
                      )}
                      {sermon.featured && (
                        <div className="absolute top-2 right-2 bg-amber-400 text-neutral-950 p-1 rounded-full shadow-md">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      )}
                      {sermon.youtube_url && (
                        <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Video
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        {sermon.category && (
                          <span className="text-body-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary-red/10 text-primary-red">
                            {sermon.category.name}
                          </span>
                        )}
                        {sermon.series && (
                          <span className="text-body-xs font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 truncate max-w-[140px]">
                            {sermon.series.name}
                          </span>
                        )}
                      </div>

                      <h3 className="text-h5 font-bold text-neutral-900 group-hover:text-primary-red transition-colors leading-snug">
                        {sermon.title}
                      </h3>

                      <div className="text-body-xs text-neutral-500 space-y-1">
                        {sermon.speaker && (
                          <p className="flex items-center gap-1 font-medium text-neutral-700">
                            <User className="w-3.5 h-3.5 text-neutral-400" /> {sermon.speaker.name}
                          </p>
                        )}
                        {sermon.scripture_reference && (
                          <p className="flex items-center gap-1 italic text-neutral-600">
                            <BookOpen className="w-3.5 h-3.5 text-neutral-400" /> {sermon.scripture_reference}
                          </p>
                        )}
                      </div>

                      {sermon.summary && (
                        <p className="text-body-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {sermon.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-body-xs font-semibold text-primary-red">
                    <span className="flex items-center gap-1 text-neutral-400 font-normal">
                      <Calendar className="w-3.5 h-3.5" />
                      {sermon.published_at ? new Date(sermon.published_at).toLocaleDateString() : 'Recent'}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Watch Sermon <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={meta.current_page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-body-sm font-semibold text-neutral-700 px-4">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default SermonsPage;
