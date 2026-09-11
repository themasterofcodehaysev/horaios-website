import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { SectionDivider } from '../components/layout/SectionDivider';
import { HeroSection, SongCard } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Gallery, type GalleryItem } from '../components/ui/Gallery';
import { songService } from '../admin/services/song.service';
import { sermonService } from '../admin/services/sermon.service';
import { ministryService, eventService } from '../services/publicContent.service';
import type { SongItem, SermonItem } from '../admin/types';
import type { MinistryPublic, EventPublic } from '../types';
import { placeholderImage } from '../lib/placeholderImage';
import { getImageUrl } from '../utils/imageUrl';
import { 
  Calendar, 
  Music, 
  BookOpen, 
  Users, 
  Heart, 
  MapPin, 
  Clock, 
  Video, 
  Play, 
  Radio, 
  Sparkles, 
  Quote, 
  ChevronRight,
  HandHeart,
  ShieldCheck,
  Church,
  Loader2
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

// Helper to extract YouTube ID
const getYouTubeId = (url: string | null): string | null => {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper for sermon thumbnails
const getSermonThumbnail = (sermon: SermonItem): string => {
  if (sermon.thumbnail) return getImageUrl(sermon.thumbnail);
  const ytId = getYouTubeId(sermon.youtube_url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  return placeholderImage(800, 450, sermon.title);
};

// Helper for event date badges
const formatEventDate = (dateStr: string | null) => {
  if (!dateStr) return { month: 'EVENT', day: '--', dayOfWeek: 'DAY' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: 'EVENT', day: '--', dayOfWeek: 'DAY' };
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { day: 'numeric' });
  const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  return { month, day, dayOfWeek };
};

// Helper for 12-hour time format
const formatTimeString = (timeStr: string | null): string => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    let hour = parseInt(parts[0], 10);
    const minute = parts[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
  return timeStr;
};

// Placeholder gallery content pending a real church gallery/media API endpoint.
const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'gallery-1', url: placeholderImage(600, 400, 'Sunday Worship'), caption: 'Sunday Worship' },
  { id: 'gallery-2', url: placeholderImage(600, 400, 'Community Outreach'), caption: 'Community Outreach' },
  { id: 'gallery-3', url: placeholderImage(600, 400, 'Youth Fellowship'), caption: 'Youth Fellowship' },
  { id: 'gallery-4', url: placeholderImage(600, 400, 'Baptism Service'), caption: 'Baptism Service' },
  { id: 'gallery-5', url: placeholderImage(600, 400, 'Choir Practice'), caption: 'Choir Practice' },
  { id: 'gallery-6', url: placeholderImage(600, 400, 'Church Picnic'), caption: 'Church Picnic' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [loadingSermons, setLoadingSermons] = useState(true);

  const [ministries, setMinistries] = useState<MinistryPublic[]>([]);
  const [loadingMinistries, setLoadingMinistries] = useState(true);

  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [featuredSongs, setFeaturedSongs] = useState<SongItem[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch Sermons from DB
    sermonService
      .getPublicSermons({ per_page: 4 })
      .then((res) => {
        if (isMounted) setSermons(res.data || []);
      })
      .catch(() => {
        if (isMounted) setSermons([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSermons(false);
      });

    // 2. Fetch Ministries from DB
    ministryService
      .getPublicMinistries({ per_page: 4 })
      .then((res) => {
        if (isMounted) setMinistries(res.data || []);
      })
      .catch(() => {
        if (isMounted) setMinistries([]);
      })
      .finally(() => {
        if (isMounted) setLoadingMinistries(false);
      });

    // 3. Fetch Events from DB (upcoming first, fallback to published)
    eventService
      .getPublicEvents({ scope: 'upcoming', per_page: 3 })
      .then((res) => {
        if (isMounted) {
          if (res.data && res.data.length > 0) {
            setEvents(res.data);
          } else {
            eventService.getPublicEvents({ per_page: 3 }).then((fallbackRes) => {
              if (isMounted) setEvents(fallbackRes.data || []);
            });
          }
        }
      })
      .catch(() => {
        if (isMounted) setEvents([]);
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });

    // 4. Fetch Songs from DB (featured first, fallback to all published)
    songService
      .getPublicSongs({ featured: true, per_page: 4 })
      .then((res) => {
        if (isMounted) {
          if (res.data && res.data.length > 0) {
            setFeaturedSongs(res.data);
          } else {
            songService.getPublicSongs({ per_page: 4 }).then((fallbackRes) => {
              if (isMounted) setFeaturedSongs(fallbackRes.data || []);
            });
          }
        }
      })
      .catch(() => {
        if (isMounted) setFeaturedSongs([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSongs(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        subtitle="Welcome to our faith community"
        title="Experience Faith, Hope & Community"
        description="Join us for worship, prayer, and meaningful fellowship as we grow together in Christ."
        primaryCTA={{
          label: 'Plan Your Visit',
          onClick: () => navigate('/visit'),
        }}
        secondaryCTA={{
          label: 'Watch Sermons',
          onClick: () => navigate('/sermons'),
        }}
        backgroundGradient={true}
        showScrollIndicator={true}
      />

      <SectionDivider />

      {/* Service Times & Worship Schedule Ribbon */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-50 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-elevation-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              {/* Schedule Intro */}
              <div className="lg:max-w-xs flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider mb-2 font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  Join Us This Week
                </div>
                <h2 className="text-h3 font-bold text-neutral-900 tracking-tight">
                  Worship Schedule
                </h2>
                <p className="text-body-sm text-neutral-600 mt-1">
                  Gather with our church family in person or stream live online.
                </p>
              </div>

              {/* Schedule Timing Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                {settings.parsedServiceTimes && settings.parsedServiceTimes.length > 0 ? (
                  settings.parsedServiceTimes.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl p-5 border border-neutral-200/70 hover:border-primary-red/40 hover:shadow-elevation-sm transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-red/10 text-primary-red flex items-center justify-center font-bold text-xs">
                          {idx === 0 ? 'SUN' : idx === 1 ? 'MID' : 'GRP'}
                        </div>
                        <span className="text-label-md font-bold text-neutral-900">{item.day}</span>
                      </div>
                      <div>
                        <p className="text-h5 font-extrabold text-primary-red">{item.time}</p>
                        <p className="text-caption text-neutral-500 mt-1">{item.type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/70 hover:border-primary-red/40 hover:shadow-elevation-sm transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-red/10 text-primary-red flex items-center justify-center font-bold text-xs">
                          SUN
                        </div>
                        <span className="text-label-md font-bold text-neutral-900">Sunday Celebration</span>
                      </div>
                      <p className="text-h5 font-extrabold text-primary-red">9:00 AM & 11:00 AM</p>
                      <p className="text-caption text-neutral-500 mt-1">Main Sanctuary & Live Stream</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/70 hover:border-primary-navy/40 hover:shadow-elevation-sm transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-navy/10 text-primary-navy flex items-center justify-center font-bold text-xs">
                          WED
                        </div>
                        <span className="text-label-md font-bold text-neutral-900">Mid-Week Prayer</span>
                      </div>
                      <p className="text-h5 font-extrabold text-primary-navy">7:00 PM - 8:30 PM</p>
                      <p className="text-caption text-neutral-500 mt-1">Chapel & Online Prayer</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/70 hover:border-amber-500/40 hover:shadow-elevation-sm transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                          SAT
                        </div>
                        <span className="text-label-md font-bold text-neutral-900">Youth & Fellowship</span>
                      </div>
                      <p className="text-h5 font-extrabold text-neutral-900">2:30 PM - 4:30 PM</p>
                      <p className="text-caption text-neutral-500 mt-1">Youth Hall & Activities</p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 flex sm:flex-col justify-center gap-2">
                <Button variant="primary" size="md" onClick={() => navigate('/visit')}>
                  Plan A Visit
                </Button>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-body-xs font-semibold text-primary-red hover:text-primary-dark-red flex items-center justify-center gap-1 py-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> Directions
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Welcome / Our Story (Editorial Split Showcase) */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold">
                <Church className="w-4 h-4" />
                Who We Are
              </div>
              <h2 className="text-display-md font-extrabold text-neutral-900 leading-tight">
                A Warm, Christ-Centered Community Rooted in Grace
              </h2>
              <p className="text-body-lg text-neutral-700 leading-relaxed">
                Welcome to Horaios Baptist Church. Whether you are exploring faith for the first time or looking for a home church to deepen your walk with God, you will find open doors, authentic worship, and a loving spiritual family.
              </p>
              <p className="text-body-base text-neutral-600 leading-relaxed">
                We believe that God has called us to proclaim the gospel of Jesus Christ, disciple believers in biblical truth, and demonstrate Christ-like compassion across Cambodia and beyond.
              </p>

              {/* Minimalist Feature Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-red/10 text-primary-red flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-label-lg font-bold text-neutral-900">Biblical Truth</h3>
                    <p className="text-caption text-neutral-500 mt-1">Grounded in the authoritative Word of God.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-navy/10 text-primary-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-label-lg font-bold text-neutral-900">True Community</h3>
                    <p className="text-caption text-neutral-500 mt-1">Caring relationships and lifelong fellowship.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-label-lg font-bold text-neutral-900">Loving Impact</h3>
                    <p className="text-caption text-neutral-500 mt-1">Serving our neighbors with sacrificial love.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button variant="primary" size="lg" onClick={() => navigate('/about')}>
                  Our Story & Leadership →
                </Button>
                <Button variant="default" size="lg" onClick={() => navigate('/visit')}>
                  What To Expect
                </Button>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-elevation-lg aspect-[4/5] bg-neutral-100 border border-neutral-200/60">
                  <img
                    src={placeholderImage(600, 750, 'Church Community')}
                    alt="Horaios Baptist Church Fellowship"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Floating Quote Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/50 text-neutral-900">
                    <p className="text-body-sm font-medium italic text-neutral-800 leading-relaxed">
                      "For where two or three gather in my name, there am I with them."
                    </p>
                    <p className="text-caption font-bold text-primary-red uppercase tracking-wider mt-2">
                      — Matthew 18:20
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Sermons Cinema Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
                <Video className="w-3.5 h-3.5" />
                Spiritual Growth
              </div>
              <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
                Latest Sermons & Teaching
              </h2>
            </div>
            <Button variant="default" className="self-start md:self-auto" onClick={() => navigate('/sermons')}>
              Browse Sermon Library →
            </Button>
          </div>

          {loadingSermons ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-pulse">
              <div className="lg:col-span-7 bg-neutral-100 rounded-3xl h-96"></div>
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="h-28 bg-neutral-100 rounded-2xl"></div>
                <div className="h-28 bg-neutral-100 rounded-2xl"></div>
                <div className="h-28 bg-neutral-100 rounded-2xl"></div>
              </div>
            </div>
          ) : sermons.length > 0 ? (
            (() => {
              const featuredSermon = sermons.find(s => s.featured) || sermons[0];
              const recentSermons = sermons.filter(s => s.id !== featuredSermon?.id).slice(0, 3);

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Featured Message Banner */}
                  <div className="lg:col-span-7 bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-200/80 shadow-elevation-sm flex flex-col justify-between group">
                    <div 
                      className="relative aspect-video bg-neutral-900 overflow-hidden cursor-pointer" 
                      onClick={() => navigate(`/sermons/${featuredSermon.slug || featuredSermon.id}`)}
                    >
                      <img
                        src={getSermonThumbnail(featuredSermon)}
                        alt={featuredSermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary-red text-white flex items-center justify-center shadow-elevation-lg group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 fill-current ml-1" />
                        </div>
                      </div>

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-primary-red text-white text-caption font-bold uppercase tracking-wider shadow-sm">
                          {featuredSermon.featured ? 'Featured Message' : 'Latest Sermon'}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-body-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-white/80" /> 
                          {featuredSermon.published_at ? new Date(featuredSermon.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sunday Service'}
                        </span>
                        {featuredSermon.category && (
                          <span className="px-2 py-0.5 rounded bg-black/50 text-white/90">
                            {featuredSermon.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-caption font-semibold text-primary-red uppercase tracking-wide mb-2">
                          <span>{featuredSermon.series?.name || featuredSermon.category?.name || 'Sermon Series'}</span>
                          {featuredSermon.scripture_reference && (
                            <>
                              <span>•</span>
                              <span>{featuredSermon.scripture_reference}</span>
                            </>
                          )}
                        </div>
                        <h3 
                          className="text-h3 font-bold text-neutral-900 mb-3 group-hover:text-primary-red transition-colors cursor-pointer"
                          onClick={() => navigate(`/sermons/${featuredSermon.slug || featuredSermon.id}`)}
                        >
                          {featuredSermon.title}
                        </h3>
                        <p className="text-body-base text-neutral-600 leading-relaxed line-clamp-3">
                          {featuredSermon.summary || featuredSermon.description || 'Watch and listen to biblical messages that challenge, inspire, and deepen your faith in Christ.'}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden">
                            <img 
                              src={featuredSermon.speaker?.photo ? getImageUrl(featuredSermon.speaker.photo) : placeholderImage(100, 100, 'Preacher')} 
                              alt={featuredSermon.speaker?.name || 'Preacher'} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="text-label-md font-bold text-neutral-900">{featuredSermon.speaker?.name || 'Pastor'}</p>
                            <p className="text-caption text-neutral-500">{featuredSermon.speaker?.position || 'Preacher'}</p>
                          </div>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => navigate(`/sermons/${featuredSermon.slug || featuredSermon.id}`)}>
                          Watch Now
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Messages Queue */}
                  <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
                    {recentSermons.length > 0 ? (
                      recentSermons.map((sermon) => (
                        <div 
                          key={sermon.id}
                          className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/70 hover:border-primary-red/40 hover:bg-white hover:shadow-elevation-sm transition-all cursor-pointer flex gap-4 items-center group"
                          onClick={() => navigate(`/sermons/${sermon.slug || sermon.id}`)}
                        >
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 relative">
                            <img 
                              src={getSermonThumbnail(sermon)} 
                              alt={sermon.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-caption font-bold text-primary-red uppercase tracking-wider truncate block">
                              {sermon.series?.name || sermon.category?.name || 'Sermon'}
                            </span>
                            <h4 className="text-h6 font-bold text-neutral-900 truncate mt-1 group-hover:text-primary-red transition-colors">
                              {sermon.title}
                            </h4>
                            <p className="text-caption text-neutral-500 mt-1 line-clamp-2">
                              {sermon.summary || sermon.description || 'Listen to this biblical teaching from Horaios Baptist Church.'}
                            </p>
                            <p className="text-caption font-semibold text-neutral-400 mt-2 truncate">
                              {sermon.speaker?.name || 'Pastor'}{sermon.scripture_reference ? ` • ${sermon.scripture_reference}` : ''}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200/70 text-center flex flex-col items-center justify-center flex-1">
                        <Video className="w-10 h-10 text-neutral-400 mb-3" />
                        <p className="text-label-md font-bold text-neutral-700">More Sermons Coming Soon</p>
                        <p className="text-caption text-neutral-500 mt-1">Check back every Sunday for our latest live stream messages.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-neutral-200">
              <p className="text-body-base text-neutral-600">No sermons published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Ministries Showcase */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
              <Users className="w-3.5 h-3.5" />
              Get Connected
            </div>
            <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
              Ministries For Every Season of Life
            </h2>
            <p className="text-body-lg text-neutral-600 mt-3">
              We have vibrant ministries designed to help every individual and family grow in faith, serve others, and build lasting friendships.
            </p>
          </div>

          {loadingMinistries ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 h-72 border border-neutral-200"></div>
              ))}
            </div>
          ) : ministries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ministries.slice(0, 4).map((ministry, idx) => {
                const ministryStyles = [
                  { bg: 'bg-primary-red/10', text: 'text-primary-red', border: 'hover:border-primary-red/50', icon: Music },
                  { bg: 'bg-primary-navy/10', text: 'text-primary-navy', border: 'hover:border-primary-navy/50', icon: Users },
                  { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'hover:border-amber-500/50', icon: BookOpen },
                  { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'hover:border-emerald-500/50', icon: HandHeart },
                ];
                const style = ministryStyles[idx % ministryStyles.length];
                const IconComponent = style.icon;

                return (
                  <div 
                    key={ministry.id}
                    className={`bg-white rounded-2xl p-6 border border-neutral-200/80 ${style.border} hover:shadow-elevation-md transition-all cursor-pointer group flex flex-col justify-between`}
                    onClick={() => navigate(`/ministries/${ministry.slug || ministry.id}`)}
                  >
                    <div>
                      {ministry.featured_image ? (
                        <div className="w-full h-36 rounded-xl overflow-hidden mb-5 bg-neutral-100 relative">
                          <img
                            src={getImageUrl(ministry.featured_image)}
                            alt={ministry.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {ministry.category && (
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                              {ministry.category.name}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-xl ${style.bg} ${style.text} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                      )}

                      <h3 className="text-h5 font-bold text-neutral-900 mb-2 group-hover:text-primary-red transition-colors">
                        {ministry.name}
                      </h3>
                      <p className="text-body-sm text-neutral-600 leading-relaxed line-clamp-3">
                        {ministry.description || 'Get involved with our church community and serve together in God’s kingdom.'}
                      </p>

                      {ministry.leader && (
                        <p className="text-caption text-neutral-500 mt-3">
                          Leader: <span className="font-semibold text-neutral-800">{ministry.leader}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-body-xs font-bold text-primary-red">
                      <span>Explore Ministry</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200">
              <p className="text-body-base text-neutral-600">No ministries found.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="primary" size="lg" onClick={() => navigate('/ministries')}>
              Explore All Church Ministries →
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Agenda Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
                <Calendar className="w-3.5 h-3.5" />
                Mark Your Calendar
              </div>
              <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
                Upcoming Events & Gatherings
              </h2>
            </div>
            <Button variant="default" onClick={() => navigate('/events')}>
              View Full Calendar →
            </Button>
          </div>

          {loadingEvents ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-neutral-50 rounded-2xl p-6 h-28 border border-neutral-200"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 3).map((event, idx) => {
                const { month, day, dayOfWeek } = formatEventDate(event.start_date);
                const badgeStyles = [
                  { bg: 'bg-primary-red/10 text-primary-red border-primary-red/20', pill: 'bg-primary-red text-white' },
                  { bg: 'bg-primary-navy/10 text-primary-navy border-primary-navy/20', pill: 'bg-primary-navy text-white' },
                  { bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20', pill: 'bg-amber-600 text-white' },
                ];
                const badgeStyle = badgeStyles[idx % badgeStyles.length];

                return (
                  <div 
                    key={event.id}
                    className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 hover:border-primary-red/50 hover:bg-white hover:shadow-elevation-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group"
                    onClick={() => navigate(`/events/${event.slug || event.id}`)}
                  >
                    <div className="flex items-start sm:items-center gap-5">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${badgeStyle.bg} flex flex-col items-center justify-center flex-shrink-0 border`}>
                        <span className="text-caption font-bold uppercase tracking-wider">{month}</span>
                        <span className="text-h4 font-extrabold leading-none">{day}</span>
                        <span className="text-[10px] font-semibold text-neutral-500 uppercase">{dayOfWeek}</span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-full ${badgeStyle.pill} text-[11px] font-bold uppercase tracking-wider`}>
                            {event.category?.name || 'Event'}
                          </span>
                          {event.start_time && (
                            <span className="text-caption text-neutral-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> 
                              {formatTimeString(event.start_time)}{event.end_time ? ` - ${formatTimeString(event.end_time)}` : ''}
                            </span>
                          )}
                          {event.location && (
                            <span className="text-caption text-neutral-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {event.location}
                            </span>
                          )}
                        </div>
                        <h3 className="text-h5 font-bold text-neutral-900 group-hover:text-primary-red transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-body-sm text-neutral-600 mt-1 line-clamp-1 sm:line-clamp-none">
                          {event.description || 'Join us for this special church event.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <Button variant="default" size="sm" className="hidden sm:inline-flex">
                        Event Details
                      </Button>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-red group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-neutral-200">
              <p className="text-body-base text-neutral-600">No upcoming events scheduled right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Worship Songs (if available) */}
      {(loadingSongs || featuredSongs.length > 0) && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
                  <Music className="w-3.5 h-3.5" />
                  Worship With Us
                </div>
                <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
                  Featured Worship Songs
                </h2>
              </div>
              <Button variant="default" className="hidden sm:inline-flex" onClick={() => navigate('/songs')}>
                All Songs & Chords →
              </Button>
            </div>

            {loadingSongs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 h-48 border border-neutral-200"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredSongs.slice(0, 4).map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Church Life Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Life Together
            </div>
            <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
              Moments of Faith & Fellowship
            </h2>
            <p className="text-body-base text-neutral-600 mt-2">
              Glimpses into the life and joy of our church community.
            </p>
          </div>

          <Gallery items={GALLERY_ITEMS} columns={3} />
        </div>
      </section>

      {/* Heartfelt Community Testimony */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/80 shadow-elevation-md relative overflow-hidden">
            <Quote className="w-16 h-16 text-primary-red/15 absolute top-6 right-6 -z-0" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-6">
                Stories of Faith
              </div>

              <blockquote className="text-h4 sm:text-h3 font-semibold text-neutral-900 leading-relaxed italic mb-8">
                "From our very first Sunday at Horaios, my family found more than just a worship service—we discovered a true spiritual home. The biblical preaching and genuine love here transformed our walk with God."
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-red/10 text-primary-red font-bold text-h6 flex items-center justify-center border-2 border-primary-red/30">
                  SH
                </div>
                <div>
                  <p className="text-label-lg font-bold text-neutral-900">Serey & Lina</p>
                  <p className="text-caption text-neutral-500">Church Members • Serving in Small Groups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Prayer & Giving Banner (Brand Burgundy Gradient) */}
      <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Prayer Box */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-caption uppercase tracking-wider font-bold text-white/90 border border-white/20">
                <Heart className="w-3.5 h-3.5 text-amber-300" /> Need Prayer?
              </div>
              <h3 className="text-display-md font-bold text-white leading-tight">
                How Can We Pray For You Today?
              </h3>
              <p className="text-body-lg text-white/90 leading-relaxed">
                We believe in a God who listens and answers prayer. Share your confidential prayer requests with our pastoral team and prayer ministry.
              </p>
              <div className="pt-2">
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-white text-primary-dark-red font-bold hover:bg-neutral-100 shadow-elevation-md"
                  onClick={() => navigate('/prayer')}
                >
                  Submit Prayer Request
                </Button>
              </div>
            </div>

            {/* Giving Box */}
            <div className="space-y-4 md:border-l md:border-white/20 md:pl-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-caption uppercase tracking-wider font-bold text-white/90 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Faithful Stewardship
              </div>
              <h3 className="text-display-md font-bold text-white leading-tight">
                Generosity in Action
              </h3>
              <p className="text-body-lg text-white/90 leading-relaxed">
                Your faithful tithes and offerings fuel gospel ministry, children's education, community care, and church multiplication across Cambodia.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="bg-primary-dark-red hover:bg-black/30 border-2 border-white/80 text-white font-bold shadow-elevation-md"
                  onClick={() => navigate('/give')}
                >
                  Give Online
                </Button>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="bg-white text-primary-red font-bold border border-white hover:bg-white/90 hover:text-primary-dark-red shadow-elevation-md"
                  onClick={() => navigate('/visit')}
                >
                  Visit & Give In Person
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />
      </section>
    </Layout>
  );
};

export default HomePage;
