import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { HeroSection, BlogCard } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { Search, Sparkles, Newspaper, Star, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { blogService } from '../services/publicContent.service';
import type { BlogPostPublic, BlogCategoryPublic, PaginatedMeta } from '../types';

export const NewsPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostPublic[]>([]);
  const [categories, setCategories] = useState<BlogCategoryPublic[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await blogService.getPublicCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    try {
      setFeaturedLoading(true);
      const res = await blogService.getPublicPosts({
        featured: true,
        per_page: 3,
        page: 1,
      });
      setFeaturedPosts(res.data || []);
    } catch {
      setFeaturedPosts([]);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await blogService.getPublicPosts({
        search: searchDebounced || undefined,
        category_slug: selectedCategory || undefined,
        page,
        per_page: 6,
      });
      setPosts(res.data || []);
      setMeta(res.meta || null);
    } catch {
      setPosts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [searchDebounced, selectedCategory, page]);

  useEffect(() => { fetchCategories(); fetchFeatured(); }, [fetchCategories, fetchFeatured]);
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const hasActiveFilters = !!selectedCategory || !!searchDebounced;

  return (
    <Layout>
      <HeroSection
        title="News & Updates"
        subtitle="Latest News"
        description="Stay informed about what's happening at Horaios Baptist Church — stories, announcements, and encouraging articles for our community."
        minHeight="md"
      />

      <section className="py-10 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search articles, topics, authors..."
              icon={<Search className="w-5 h-5" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                  setPage(1);
                }}
                className="px-4 py-2 rounded-full text-body-sm font-semibold text-primary-red hover:bg-primary-red/5 transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {!hasActiveFilters && page === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Featured Articles
                </h2>
              </div>
              {featuredLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-4">
                      <div className="aspect-[4/3] bg-neutral-200 rounded-xl" />
                      <div className="h-5 bg-neutral-200 rounded w-3/4" />
                      <div className="h-3 bg-neutral-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : featuredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/news/${post.slug}`}
                      className="group h-full relative"
                    >
                      <div className="h-full">
                        <BlogCard
                          title={post.title}
                          excerpt={post.excerpt || ''}
                          author={post.author?.display_name || 'Horaios Church'}
                          date={post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}
                          image={post.featured_image || 'https://via.placeholder.com/400x250?text=News'}
                          category={post.category?.name || undefined}
                          featured={post.featured}
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

          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-h4 font-bold text-neutral-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary-navy" />
                {selectedCategory
                  ? `${categories.find(c => c.slug === selectedCategory)?.name || 'Category'} Articles`
                  : searchDebounced
                    ? `Search Results for "${searchDebounced}"`
                    : 'Latest News'}
              </h2>
              {meta && (
                <span className="text-body-xs text-neutral-500 font-medium">
                  {meta.total} {meta.total === 1 ? 'article' : 'articles'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-4">
                    <div className="aspect-[4/3] bg-neutral-200 rounded-xl" />
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card padding="lg" className="text-center py-16 bg-white">
                <Newspaper className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-h5 font-bold text-neutral-800 mb-2">No Articles Found</h3>
                <p className="text-body-sm text-neutral-500 max-w-sm mx-auto mb-6">
                  {hasActiveFilters
                    ? 'Try adjusting your search or category filters.'
                    : 'Check back soon for the latest news and updates from our church.'}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedCategory('');
                      setSearch('');
                      setSearchDebounced('');
                      setPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/news/${post.slug}`}
                    className="group h-full"
                  >
                    <BlogCard
                      title={post.title}
                      excerpt={post.excerpt || ''}
                      author={post.author?.display_name || 'Horaios Church'}
                      date={post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}
                      image={post.featured_image || 'https://via.placeholder.com/400x250?text=News'}
                      category={post.category?.name || undefined}
                      featured={post.featured}
                    />
                  </Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card
            padding="lg"
            className="text-center bg-gradient-to-br from-primary-navy via-primary-navy to-accent-blue border-0 !text-white relative overflow-hidden"
          >
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
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
