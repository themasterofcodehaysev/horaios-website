import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, User, Share2, Copy, Check,
  Sparkles, ChevronRight, Linkedin, Facebook, Twitter, Newspaper, Mail,
} from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Layout } from '../components/layout';
import { Breadcrumb } from '../components/common';
import { BlogCard } from '../components/sections';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { blogService } from '../services/publicContent.service';
import type { BlogPostPublic } from '../types';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostPublic | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

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

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getPublicPostDetail(slug);
        setPost(data);

        try {
          const related = await blogService.getRelatedPosts(slug);
          setRelatedPosts(related.slice(0, 3));
        } catch {
          setRelatedPosts([]);
        }
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          setError('The requested article was not found.');
        } else {
          setError(err?.response?.data?.message || 'Unable to load article.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      const title = post.seo_title || `${post.title} | Horaios Baptist Church News`;
      document.title = title;
      setMetaDescription(post.seo_description || post.excerpt || null);
    }
    return () => {
      document.title = 'Horaios Baptist Church';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', '');
    };
  }, [post, setMetaDescription]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 animate-pulse space-y-8">
          <div className="h-5 w-32 bg-neutral-200 rounded" />
          <div className="h-12 w-3/4 bg-neutral-200 rounded" />
          <div className="aspect-[21/9] bg-neutral-200 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-11/12" />
            <div className="h-4 bg-neutral-200 rounded w-10/12" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <Newspaper className="w-14 h-14 text-neutral-300 mx-auto mb-5" />
          <h2 className="text-h4 font-bold text-neutral-800 mb-2">Article Not Found</h2>
          <p className="text-body-sm text-neutral-500 mb-8">
            {error || 'This article may have been removed or does not exist.'}
          </p>
          <button
            onClick={() => navigate('/news')}
            className="px-5 py-2.5 bg-primary-red text-white rounded-lg font-medium text-body-sm hover:bg-primary-dark-red transition-colors"
          >
            Back to All News
          </button>
        </div>
      </Layout>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <Layout>
      {post.featured_image && (
        <div className="relative w-full h-[38vh] min-h-[280px] max-h-[460px] bg-neutral-900 overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-navy/40 via-primary-navy/60 to-primary-navy/95" />
        </div>
      )}

      <article className="relative max-w-4xl mx-auto -mt-24 z-10 pb-20 px-4 sm:px-6 space-y-10">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 p-6 sm:p-10 space-y-6">
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-neutral-600 hover:text-primary-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All News
          </Link>

          <Breadcrumb
            items={[
              { label: 'News', href: '/news' },
              ...(post.category ? [{ label: post.category.name, href: `/news?category=${post.category.slug}` }] : []),
              { label: post.title },
            ]}
          />

          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {post.category && (
                <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-primary-red/10 text-primary-red uppercase tracking-wider">
                  {post.category.name}
                </span>
              )}
              {post.featured && (
                <span className="text-body-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                  ★ Featured
                </span>
              )}
            </div>

            <h1 className="text-display-md sm:text-display-lg font-extrabold text-neutral-900 leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-neutral-600 font-medium">
              {post.author && (
                <span className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                  <User className="w-4 h-4 text-primary-red" /> {post.author.display_name}
                </span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1.5 text-neutral-500 text-body-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </header>
        </div>

        <section className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xs space-y-6">
          {post.excerpt && (
            <div className="bg-neutral-50 border-l-4 border-l-primary-red rounded-xl p-5 sm:p-6 text-neutral-700 text-body-lg leading-relaxed italic">
              {post.excerpt}
            </div>
          )}

          {post.content && (
            <div data-color-mode="light" className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-h2:text-h4 prose-h3:text-h5 prose-p:text-body-base prose-p:leading-relaxed prose-a:text-primary-red prose-a:no-underline hover:prose-a:underline">
              <MarkdownPreview source={post.content} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
          <div className="flex items-center gap-2 text-body-xs font-bold text-neutral-600 uppercase tracking-wider">
            <Share2 className="w-4 h-4 text-primary-red" /> Share This Article
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] text-white rounded-lg text-body-xs font-medium hover:bg-[#0958a8] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-body-xs font-medium hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-body-xs font-medium hover:bg-neutral-800 transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" /> X
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

        {relatedPosts.length > 0 && (
          <section className="space-y-5">
            <h3 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/news/${rel.slug}`}
                  className="group h-full"
                >
                  <BlogCard
                    title={rel.title}
                    excerpt={rel.excerpt || ''}
                    author={rel.author?.display_name || 'Horaios Church'}
                    date={rel.published_at ? new Date(rel.published_at).toLocaleDateString() : 'Recent'}
                    image={rel.featured_image || 'https://via.placeholder.com/400x250?text=News'}
                    category={rel.category?.name || undefined}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <Card padding="lg" className="text-center bg-gradient-to-br from-primary-navy via-primary-navy to-accent-blue border-0 !text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />
            <div className="relative">
              <Mail className="w-10 h-10 text-primary-100 mx-auto mb-4" />
              <h2 className="text-h3 font-bold mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-body-lg text-primary-100 max-w-xl mx-auto mb-7">
                Get weekly updates, inspiring articles, and the latest news delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-white/20 text-body-base shadow-lg"
                />
                <Button variant="primary" size="lg" className="bg-white !text-primary-navy hover:bg-primary-100 transition-colors whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </article>
    </Layout>
  );
};

export default BlogDetailPage;
