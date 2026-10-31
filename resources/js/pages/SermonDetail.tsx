import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, User, BookOpen,
  Video, Sparkles, ChevronRight, Play,
} from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Layout } from '../components/layout';
import { Seo, ShareBar } from '../components/common';
import type { SeoStructuredData } from '../components/common/Seo';
import { sermonService } from '../admin/services/sermon.service';
import { getImageUrl } from '../utils/imageUrl';
import { getYouTubeId, getSermonThumbnail } from '../utils/youtube';
import type { SermonItem } from '../admin/types';

const SITE_NAME = 'Horaios Baptist Church';

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * NOTE: SermonItem has no seo_title/seo_description/seo_image/canonical_url
 * fields (unlike BlogItem/EventItem/MinistryItem) -- the sermons table and
 * SermonResource simply don't carry them. These are sensible fallbacks built
 * from data that actually exists (summary, description, thumbnail), not a
 * stand-in for those admin-editable SEO fields.
 */
function buildSermonSeo(sermon: SermonItem) {
  const canonicalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : undefined;

  const description = sermon.summary
    || (sermon.description ? truncate(stripMarkdown(sermon.description), 160) : null)
    || `${sermon.title}${sermon.speaker ? ` — a message from ${sermon.speaker.name}` : ''} at ${SITE_NAME}.`;

  const thumb = getSermonThumbnail(sermon);

  const jsonLd: SeoStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: sermon.title,
    description,
    ...(sermon.published_at ? { datePublished: sermon.published_at } : {}),
    dateModified: sermon.updated_at,
    ...(sermon.speaker ? { author: { '@type': 'Person', name: sermon.speaker.name } } : {}),
    ...(thumb ? { image: thumb } : {}),
    publisher: { '@type': 'Organization', name: SITE_NAME },
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
  };

  return {
    title: `${sermon.title} | ${SITE_NAME} Sermons`,
    description,
    canonicalUrl,
    image: thumb || undefined,
    jsonLd,
  };
}

export const SermonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sermon, setSermon] = useState<SermonItem | null>(null);
  const [relatedSermons, setRelatedSermons] = useState<SermonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [id]);

  useEffect(() => {
    const fetchSermon = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await sermonService.getPublicSermonDetail(id);
        setSermon(data);

        try {
          const related = await sermonService.getRelatedSermons(id);
          setRelatedSermons(related);
        } catch {
          setRelatedSermons([]);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Sermon not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchSermon();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pt-28 sm:pt-32 pb-16 px-4 animate-pulse space-y-6">
          <div className="h-6 w-32 bg-neutral-200 rounded" />
          <div className="h-10 w-3/4 bg-neutral-200 rounded" />
          <div className="aspect-video bg-neutral-200 rounded-2xl" />
          <div className="h-40 bg-neutral-100 rounded-2xl p-6" />
        </div>
      </Layout>
    );
  }

  if (error || !sermon) {
    return (
      <Layout>
        <div className="max-w-md mx-auto pt-32 pb-20 px-4 text-center">
          <Video className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-h4 font-bold text-neutral-800 mb-2">Sermon Not Found</h2>
          <p className="text-body-sm text-neutral-500 mb-6">{error || 'The requested sermon does not exist or has been removed.'}</p>
          <Link to="/sermons" className="px-5 py-2.5 bg-primary-red text-white rounded-lg font-medium text-body-sm hover:bg-primary-dark-red">
            Back to Sermons Library
          </Link>
        </div>
      </Layout>
    );
  }

  const youtubeId = getYouTubeId(sermon.youtube_url);
  const sermonSeo = buildSermonSeo(sermon);

  return (
    <Layout>
      <Seo
        title={sermonSeo.title}
        description={sermonSeo.description}
        canonicalUrl={sermonSeo.canonicalUrl}
        image={sermonSeo.image}
        type="article"
        jsonLd={sermonSeo.jsonLd}
      />
      <div className="min-h-screen bg-slate-50 pt-28 sm:pt-32 pb-20 border-t border-slate-200/60">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
          {/* Back Link */}
          <div>
            <Link
              to="/sermons"
              className="inline-flex items-center gap-1.5 text-body-sm font-medium text-neutral-600 hover:text-primary-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sermons Library
            </Link>
          </div>

        {/* Sermon Title & Meta Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {sermon.category && (
              <span className="text-body-xs font-semibold px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue">
                {sermon.category.name}
              </span>
            )}
            {sermon.series && (
              <span className="text-body-xs font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                Series: {sermon.series.name}
              </span>
            )}
            {sermon.featured && (
              <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                ★ Featured Message
              </span>
            )}
          </div>

          <h1 className="text-display-md sm:text-display-lg font-extrabold text-neutral-900 leading-tight">
            {sermon.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-neutral-600 font-medium pt-1">
            {sermon.speaker && (
              <span className="flex items-center gap-1.5 text-neutral-900 font-bold">
                <User className="w-4 h-4 text-primary-red" /> {sermon.speaker.name}
              </span>
            )}
            {sermon.scripture_reference && (
              <span className="flex items-center gap-1.5 italic text-neutral-700">
                <BookOpen className="w-4 h-4 text-accent-blue" /> {sermon.scripture_reference}
              </span>
            )}
            {sermon.published_at && (
              <span className="flex items-center gap-1.5 text-neutral-500 text-body-xs">
                <Calendar className="w-3.5 h-3.5" /> Published {new Date(sermon.published_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </header>

        {/* YouTube Video Player Embed or Interactive Thumbnail Preview */}
        {isPlaying && youtubeId ? (
          <div className="aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          <div
            onClick={() => {
              if (youtubeId) {
                setIsPlaying(true);
              } else if (sermon.youtube_url) {
                window.open(sermon.youtube_url, '_blank', 'noopener,noreferrer');
              }
            }}
            className="aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 relative group cursor-pointer"
          >
            {getSermonThumbnail(sermon) ? (
              <img
                src={getSermonThumbnail(sermon)}
                alt={sermon.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                <Video className="w-16 h-16 text-neutral-600" />
              </div>
            )}

            {/* Gradient Overlay & Big Red Play Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20 group-hover:from-black/85 group-hover:via-black/40 transition-all flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-red text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-primary-dark-red transition-all duration-300">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1.5 fill-current" />
              </div>
              <span className="mt-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-body-xs font-bold uppercase tracking-wider border border-white/20 group-hover:bg-primary-red group-hover:border-primary-red transition-colors">
                Watch Full Message
              </span>
            </div>
          </div>
        )}

        {/* Summary Banner */}
        {sermon.summary && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-neutral-700 text-body-base leading-relaxed italic border-l-4 border-l-primary-red">
            "{sermon.summary}"
          </div>
        )}

        {/* Full Message Notes & Description */}
        {sermon.description && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-xs space-y-4">
            <h2 className="text-h4 font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Message Notes & Study Guide
            </h2>
            <div data-color-mode="light" className="prose prose-neutral max-w-none">
              <MarkdownPreview source={sermon.description} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
            </div>
          </div>
        )}

        {/* Speaker Profile Card */}
        {sermon.speaker && (
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-neutral-700 border-2 border-white/20 overflow-hidden shrink-0 flex items-center justify-center">
              {sermon.speaker.photo ? (
                <img src={sermon.speaker.photo} alt={sermon.speaker.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-neutral-400" />
              )}
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-body-xs font-semibold text-primary-300 uppercase tracking-wider">
                Preacher / Speaker
              </span>
              <h3 className="text-h4 font-bold">{sermon.speaker.name}</h3>
              {sermon.speaker.position && (
                <p className="text-body-xs text-neutral-300 font-medium">{sermon.speaker.position}</p>
              )}
              {sermon.speaker.biography && (
                <p className="text-body-xs text-neutral-300 leading-relaxed pt-1">
                  {sermon.speaker.biography}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Social Share Bar */}
        <ShareBar
          title={sermon.title}
          description={sermon.scripture_reference || (typeof sermon.speaker === 'object' ? sermon.speaker?.name : sermon.speaker) || ''}
          label="Share This Message"
        />

        {/* Related Sermons Section */}
        {relatedSermons.length > 0 && (
          <section className="pt-8 border-t border-neutral-200 space-y-4">
            <h3 className="text-h5 font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Related Sermons & Messages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedSermons.map((rel) => {
                const relThumb = getSermonThumbnail(rel);
                return (
                  <Link
                    key={rel.id}
                    to={`/sermons/${rel.id}`}
                    className="group bg-white hover:bg-neutral-50 rounded-2xl p-3 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all flex items-center gap-3"
                  >
                    <div className="w-24 sm:w-28 aspect-video bg-neutral-900 rounded-xl overflow-hidden shrink-0 relative">
                      {relThumb ? (
                        <img src={relThumb} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          <Video className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 pr-2 min-w-0 flex-1">
                      <h4 
                        className="text-body-sm font-bold text-neutral-900 group-hover:text-primary-red transition-colors truncate"
                        title={rel.title}
                      >
                        {rel.title}
                      </h4>
                      <p 
                        className="text-body-xs text-neutral-500 truncate"
                        title={`${rel.speaker?.name || 'Horaios Baptist Church'}${rel.scripture_reference ? ` • ${rel.scripture_reference}` : ''}`}
                      >
                        {rel.speaker?.name || 'Horaios Baptist Church'}
                        {rel.scripture_reference && ` • ${rel.scripture_reference}`}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        </article>
      </div>
    </Layout>
  );
};

export default SermonDetailPage;
