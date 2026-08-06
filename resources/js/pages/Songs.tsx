import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Music, Sparkles, ChevronRight, Star, ChevronLeft } from 'lucide-react';
import { Layout } from '../components/layout';
import { songService } from '../admin/services/song.service';
import type { SongItem, SongCategory, PaginatedResponse } from '../admin/types';

export const SongsPage: React.FC = () => {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [categories, setCategories] = useState<SongCategory[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<SongItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await songService.getPublicCategories();
      setCategories(data);
    } catch { /* ignore */ }
  }, []);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await songService.getPublicSongs({
        search,
        category_slug: selectedCategory || undefined,
        page,
        per_page: 12,
      });
      setSongs(res.data);
      setMeta(res.meta);
    } catch {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, page]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  // Separate featured songs
  const featuredSongs = songs.filter(s => s.featured);

  return (
    <Layout>
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-primary-navy via-primary-dark-navy to-accent-blue py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-body-xs font-semibold uppercase tracking-wider text-primary-100 mb-4 border border-white/10">
            <Music className="w-3.5 h-3.5 text-primary-300" /> Digital Worship Songbook
          </div>
          <h1 className="text-display-lg font-extrabold tracking-tight mb-4">
            Worship Songs & Lyrics
          </h1>
          <p className="text-body-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed mb-8">
            Access our digital collection of worship lyrics on your phone during services, small groups, and personal reflection.
          </p>

          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title, artist, or lyrics..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-neutral-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-red/30 text-body-base placeholder-neutral-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 max-w-6xl mx-auto space-y-10">
        {/* Category Pills */}
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

        {/* Featured Songs Banner (if on page 1 and no search query) */}
        {!search && !selectedCategory && page === 1 && featuredSongs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-h5 font-bold text-neutral-900">
              <Sparkles className="w-5 h-5 text-amber-500" /> Featured Worship Songs
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredSongs.slice(0, 3).map((song) => (
                <Link
                  key={song.id}
                  to={`/songs/${song.slug}`}
                  className="group relative bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-3 right-3">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    {song.category && (
                      <span className="inline-block text-body-xs font-semibold text-primary-300 uppercase tracking-wider mb-2">
                        {song.category.name}
                      </span>
                    )}
                    <h3 className="text-h4 font-bold leading-tight group-hover:text-primary-100 transition-colors mb-2">
                      {song.title}
                    </h3>
                    <p className="text-body-xs text-neutral-300">
                      {song.artist || 'Traditional Worship'}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-body-xs font-medium text-neutral-300 group-hover:text-white">
                    <span>Read Lyrics</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Songs Grid / List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h4 font-bold text-neutral-900">
              {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.name || 'Category'} Songs` : 'All Worship Songs'}
            </h2>
            {meta && (
              <span className="text-body-xs text-neutral-500 font-medium">
                {meta.total} {meta.total === 1 ? 'song' : 'songs'} available
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 h-40 space-y-3">
                  <div className="h-5 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-4 bg-neutral-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 px-4">
              <Music className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-h5 font-bold text-neutral-800 mb-1">No Songs Found</h3>
              <p className="text-body-sm text-neutral-500 max-w-sm mx-auto mb-6">
                We couldn't find any worship songs matching your search criteria.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory(''); setPage(1); }}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-body-sm font-medium hover:bg-neutral-800"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {songs.map((song) => (
                <Link
                  key={song.id}
                  to={`/songs/${song.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {song.category ? (
                        <span className="text-body-xs font-semibold px-2.5 py-0.5 rounded-md bg-accent-blue/10 text-accent-blue">
                          {song.category.name}
                        </span>
                      ) : (
                        <span className="text-body-xs text-neutral-400">Worship</span>
                      )}
                      {song.featured && (
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <h3 className="text-h5 font-bold text-neutral-900 group-hover:text-primary-red transition-colors leading-snug mb-1">
                      {song.title}
                    </h3>
                    <p className="text-body-xs text-neutral-500">
                      {song.artist || 'Traditional'} {song.composer && `• ${song.composer}`}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-body-xs font-semibold text-primary-red">
                    <span>View Lyrics</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

export default SongsPage;
