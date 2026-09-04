import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Maximize2, Minimize2, Play, Pause,
  AArrowUp, AArrowDown, RefreshCw, Calendar, Music, Sparkles, ChevronRight,
} from 'lucide-react';
import { Layout } from '../components/layout';
import { Seo } from '../components/common';
import type { SeoStructuredData } from '../components/common/Seo';
import { songService } from '../admin/services/song.service';
import type { SongItem } from '../admin/types';

const SITE_NAME = 'Horaios Baptist Church';

/**
 * NOTE: SongItem has no seo_title/seo_description/seo_image/canonical_url
 * fields (unlike BlogItem/EventItem/MinistryItem) -- the songs table and
 * SongResource simply don't carry them. These are sensible fallbacks built
 * from data that actually exists, not a stand-in for those admin-editable
 * SEO fields.
 */
function buildSongSeo(song: SongItem) {
  const canonicalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : undefined;

  const description = `"${song.title}"${song.artist ? ` by ${song.artist}` : ''} — worship song lyrics${
    song.category?.name ? ` (${song.category.name})` : ''
  } from ${SITE_NAME}.`;

  const jsonLd: SeoStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: song.title,
    description,
    ...(song.category?.name ? { genre: song.category.name } : {}),
    ...(song.composer ? { composer: { '@type': 'Person', name: song.composer } } : {}),
    lyrics: { '@type': 'CreativeWork', text: song.lyrics },
    dateModified: song.updated_at,
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
  };

  return { title: `${song.title} | ${SITE_NAME} Worship`, description, canonicalUrl, jsonLd };
}

export const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [song, setSong] = useState<SongItem | null>(null);
  const [relatedSongs, setRelatedSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Worship Mode State
  const [worshipMode, setWorshipMode] = useState(false);

  // Reading Font Size State (Default: 18px, Range: 14px - 32px)
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('song_font_size');
    return saved ? Number(saved) : 18;
  });

  // Auto Scroll State
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1); // 1 = normal, 1.5 = medium, 2 = fast
  const scrollIntervalRef = useRef<number | null>(null);

  // Save font size preference
  useEffect(() => {
    localStorage.setItem('song_font_size', String(fontSize));
  }, [fontSize]);

  // Fetch Song Details & Related Songs
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await songService.getPublicSongDetail(id);
        setSong(data);

        // Fetch related songs
        try {
          const related = await songService.getRelatedSongs(id);
          setRelatedSongs(related);
        } catch {
          setRelatedSongs([]);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Song not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    // Reset worship mode & scrolling on route change
    setWorshipMode(false);
    setIsAutoScrolling(false);
  }, [id]);

  // Auto Scroll Mechanism
  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    setIsAutoScrolling(true);

    const stepMs = Math.round(50 / scrollSpeed);
    scrollIntervalRef.current = window.setInterval(() => {
      window.scrollBy({ top: 1, behavior: 'smooth' });

      // Check if reached bottom of page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        stopAutoScroll();
      }
    }, stepMs);
  }, [scrollSpeed]);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsAutoScrolling(false);
  }, []);

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, []);

  // Update speed while running
  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
  }, [scrollSpeed, isAutoScrolling, startAutoScroll]);

  // Font Size Adjustments
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 36));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 14));
  const resetFontSize = () => setFontSize(18);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-16 px-4 animate-pulse space-y-6">
          <div className="h-6 w-32 bg-neutral-200 rounded" />
          <div className="h-10 w-3/4 bg-neutral-200 rounded" />
          <div className="h-4 w-1/2 bg-neutral-100 rounded" />
          <div className="h-80 bg-neutral-100 rounded-2xl p-6 space-y-4">
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-5/6 bg-neutral-200 rounded" />
            <div className="h-4 w-4/6 bg-neutral-200 rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !song) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-20 px-4 text-center">
          <Music className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-h4 font-bold text-neutral-800 mb-2">Song Not Found</h2>
          <p className="text-body-sm text-neutral-500 mb-6">{error || 'The requested song does not exist or has been removed.'}</p>
          <Link to="/songs" className="px-5 py-2.5 bg-primary-red text-white rounded-lg font-medium text-body-sm hover:bg-primary-dark-red">
            Back to Song Library
          </Link>
        </div>
      </Layout>
    );
  }

  const songSeo = buildSongSeo(song);

  // Render Worship Mode Fullscreen Shell
  if (worshipMode) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col justify-between p-4 sm:p-8 animate-fade-in select-none">
        <Seo
          title={songSeo.title}
          description={songSeo.description}
          canonicalUrl={songSeo.canonicalUrl}
          jsonLd={songSeo.jsonLd}
        />
        {/* Worship Mode Top Control Bar */}
        <header className="sticky top-0 z-50 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-3 sm:p-4 mb-8 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWorshipMode(false)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-body-xs font-bold rounded-xl transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-amber-400" />
              Exit Worship Mode
            </button>
            <span className="hidden sm:inline-block text-body-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md">
              ★ Worship Mode Active
            </span>
          </div>

          {/* Reading & Scroll Options in Worship Mode */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Font Size Controls */}
            <div className="flex items-center bg-neutral-800 rounded-xl p-1 border border-neutral-700">
              <button onClick={decreaseFontSize} className="p-1.5 hover:bg-neutral-700 rounded-lg text-neutral-300" title="Decrease Font Size">
                <AArrowDown className="w-4 h-4" />
              </button>
              <span className="text-body-xs font-mono px-2 font-bold text-neutral-200">{fontSize}px</span>
              <button onClick={increaseFontSize} className="p-1.5 hover:bg-neutral-700 rounded-lg text-neutral-300" title="Increase Font Size">
                <AArrowUp className="w-4 h-4" />
              </button>
            </div>

            {/* Auto Scroll Toggle */}
            <div className="flex items-center gap-1.5 bg-neutral-800 rounded-xl p-1 border border-neutral-700">
              <button
                onClick={toggleAutoScroll}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-xs font-bold transition-colors ${
                  isAutoScrolling ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-700 text-white hover:bg-neutral-600'
                }`}
              >
                {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAutoScrolling ? 'Pause' : 'Auto Scroll'}
              </button>

              {/* Speed Buttons */}
              <button
                onClick={() => setScrollSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                className="px-2 py-1 bg-neutral-700 text-neutral-300 hover:bg-neutral-600 rounded-lg text-body-xs font-mono font-bold"
                title="Change scroll speed"
              >
                {scrollSpeed}x
              </button>
            </div>
          </div>
        </header>

        {/* Immersion Lyrics Area */}
        <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-6 px-2 text-center">
          <h1 className="text-display-md sm:text-display-xl font-black text-white tracking-tight mb-2">
            {song.title}
          </h1>
          {song.artist && (
            <p className="text-body-base text-neutral-400 font-medium mb-8">
              {song.artist}
            </p>
          )}

          <div
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
            className="font-sans text-neutral-100 whitespace-pre-wrap font-semibold tracking-wide text-left sm:text-center space-y-4"
          >
            {song.lyrics}
          </div>
        </main>

        {/* Worship Mode Footer */}
        <footer className="mt-12 text-center text-body-xs text-neutral-500 border-t border-neutral-800 pt-4">
          Horaios Baptist Church &bull; Worship Mode Active &bull; Phone Screen Optimized
        </footer>
      </div>
    );
  }

  // Normal Layout View
  return (
    <Layout>
      <Seo
        title={songSeo.title}
        description={songSeo.description}
        canonicalUrl={songSeo.canonicalUrl}
        jsonLd={songSeo.jsonLd}
      />
      <article className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-8">
        {/* Top Navigation & Worship Mode Button */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <Link
            to="/songs"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-neutral-600 hover:text-primary-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Songbook
          </Link>

          <button
            onClick={() => setWorshipMode(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-amber-400 font-bold rounded-xl text-body-sm hover:shadow-lg transition-all transform hover:scale-105 border border-amber-400/20"
          >
            <Maximize2 className="w-4 h-4 text-amber-400" /> Enter Worship Mode
          </button>
        </div>

        {/* Song Header Info */}
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            {song.category && (
              <span className="text-body-xs font-semibold px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue">
                {song.category.name}
              </span>
            )}
            {song.featured && (
              <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                ★ Featured Worship Song
              </span>
            )}
          </div>

          <h1 className="text-display-md font-extrabold text-neutral-900 leading-tight">
            {song.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-neutral-500 font-medium">
            {song.artist && <span>By <strong className="text-neutral-700">{song.artist}</strong></span>}
            {song.composer && <span>Composer: <strong className="text-neutral-700">{song.composer}</strong></span>}
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1 text-body-xs text-neutral-400">
              <Calendar className="w-3.5 h-3.5" /> Updated {new Date(song.updated_at).toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* Reading Options & Auto Scroll Bar */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          {/* Font Size Adjuster */}
          <div className="flex items-center gap-3">
            <span className="text-body-xs font-bold text-neutral-500 uppercase tracking-wider">
              Text Size
            </span>
            <div className="flex items-center bg-white rounded-xl border border-neutral-200 p-1 shadow-xs">
              <button
                onClick={decreaseFontSize}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-700 transition-colors"
                title="Decrease Font Size"
              >
                <AArrowDown className="w-4 h-4" />
              </button>
              <span className="text-body-xs font-mono font-bold px-3 text-neutral-900">{fontSize}px</span>
              <button
                onClick={increaseFontSize}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-700 transition-colors"
                title="Increase Font Size"
              >
                <AArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={resetFontSize}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors border-l border-neutral-200 ml-1"
                title="Reset Font Size"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Auto Scroll Controls */}
          <div className="flex items-center gap-3">
            <span className="text-body-xs font-bold text-neutral-500 uppercase tracking-wider">
              Auto Scroll
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoScroll}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-body-xs font-bold transition-all ${
                  isAutoScrolling
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAutoScrolling ? 'Pause' : 'Start Scroll'}
              </button>

              <select
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xl text-body-xs font-mono font-bold text-neutral-800 focus:outline-none"
              >
                <option value={1}>1.0x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2.0x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lyrics Display Panel */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-sm">
          <div
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
            className="font-sans text-neutral-900 whitespace-pre-wrap font-medium leading-relaxed"
          >
            {song.lyrics}
          </div>
        </div>

        {/* Related Songs Section (Max 5) */}
        {relatedSongs.length > 0 && (
          <section className="pt-8 border-t border-neutral-200 space-y-4">
            <h3 className="text-h5 font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> More {song.category?.name || 'Worship'} Songs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedSongs.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/songs/${rel.id}`}
                  className="group bg-neutral-50 hover:bg-white rounded-2xl p-4 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-body-sm font-bold text-neutral-900 group-hover:text-primary-red transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-body-xs text-neutral-500">
                      {rel.artist || 'Worship'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
};

export default SongDetailPage;
