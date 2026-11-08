import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { SectionDivider } from '../components/layout/SectionDivider';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { songService } from '../admin/services/song.service';
import { sermonService } from '../admin/services/sermon.service';
import { ministryService, eventService } from '../services/publicContent.service';
import type { SongItem, SermonItem } from '../admin/types';
import type { MinistryPublic, EventPublic } from '../types';
import { placeholderImage } from '../lib/placeholderImage';
import { getImageUrl } from '../utils/imageUrl';
import { IconRenderer } from '../components/ui/IconRenderer';
import { 
  Calendar, 
  Music, 
  BookOpen, 
  Users, 
  Heart, 
  MapPin, 
  Clock, 
  Play, 
  Quote, 
  ChevronRight,
  HandHeart,
  ShieldCheck,
  Church,
  Smile,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { getYouTubeId, getSermonThumbnail } from '../utils/youtube';

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

    // 4. Fetch Songs from DB
    songService
      .getPublicSongs({ featured: true, per_page: 3 })
      .then((res) => {
        if (isMounted) {
          if (res.data && res.data.length > 0) {
            setFeaturedSongs(res.data);
          } else {
            songService.getPublicSongs({ per_page: 3 }).then((fallbackRes) => {
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
      {/* 1. Reverent Hero Section */}
      <HeroSection
        badge="Boeung Tompun • Phnom Penh, Cambodia"
        title="A Christ-Centered Family Rooted in Grace & Truth"
        description='"Get up and Walk in the name of Jesus" — Join us this Sunday as we worship God, grow deeply in biblical discipleship, and serve our community across Cambodia.'
        verse={{
          text: "In the name of Jesus Christ of Nazareth, rise up and walk.",
          reference: "Acts 3:6 • The Beautiful (Horaios) Gate"
        }}
        primaryCTA={{
          label: 'Plan Your Visit',
          onClick: () => navigate('/visit'),
        }}
        secondaryCTA={{
          label: 'Sunday Service Times',
          onClick: () => {
            const el = document.getElementById('worship-schedule');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        backgroundGradient={true}
        showScrollIndicator={true}
      />

      <SectionDivider />

      {/* 2. Sunday Worship Schedule & First-Time Visitor Ribbon */}
      <section id="worship-schedule" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-50/90 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-elevation-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              {/* Schedule Intro */}
              <div className="lg:max-w-xs flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-navy/10 text-primary-navy text-xs uppercase tracking-wider mb-2 font-bold">
                  <Church className="w-3.5 h-3.5" />
                  Worship Gatherings
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                  Join Us for Worship
                </h2>
                <p className="text-body-sm text-neutral-600 mt-1.5 leading-relaxed">
                  Gather in person at our sanctuary in Boeung Tompun, Phnom Penh or join our online live stream.
                </p>
              </div>

              {/* Schedule Timing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                {settings.parsedServiceTimes && settings.parsedServiceTimes.length > 0 ? (
                  settings.parsedServiceTimes.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl p-5 border border-neutral-200/80 hover:border-primary-navy/40 hover:shadow-elevation-sm transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon ? (
                          <div className="w-6 h-6 rounded-lg bg-primary-navy/10 text-primary-navy flex items-center justify-center text-xs shrink-0">
                            <IconRenderer icon={item.icon} fallback={<span className="w-2 h-2 rounded-full bg-primary-navy" />} />
                          </div>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-primary-navy shrink-0"></span>
                        )}
                        <span className="text-label-md font-bold text-neutral-900 truncate" title={item.day}>{item.day}</span>
                      </div>
                      <div>
                        <p className="text-h5 font-extrabold text-primary-navy">{item.time}</p>
                        <p className="text-caption text-neutral-500 mt-1">{item.type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 hover:border-primary-navy/40 hover:shadow-elevation-sm transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary-navy"></span>
                        <span className="text-label-md font-bold text-neutral-900">Sunday Worship</span>
                      </div>
                      <p className="text-h5 font-extrabold text-primary-navy">9:00 AM & 11:00 AM</p>
                      <p className="text-caption text-neutral-500 mt-1">Main Sanctuary & Live Stream</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 hover:border-primary-navy/40 hover:shadow-elevation-sm transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary-navy"></span>
                        <span className="text-label-md font-bold text-neutral-900">Mid-Week Prayer</span>
                      </div>
                      <p className="text-h5 font-extrabold text-primary-navy">7:00 PM - 8:30 PM</p>
                      <p className="text-caption text-neutral-500 mt-1">Wednesday Prayer & Study</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 hover:border-primary-navy/40 hover:shadow-elevation-sm transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary-navy"></span>
                        <span className="text-label-md font-bold text-neutral-900">Youth Fellowship</span>
                      </div>
                      <p className="text-h5 font-extrabold text-primary-navy">2:30 PM - 4:30 PM</p>
                      <p className="text-caption text-neutral-500 mt-1">Saturday Youth Hall</p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex sm:flex-col justify-center gap-2.5">
                <Button 
                  variant="outline" 
                  size="md" 
                  onClick={() => navigate('/visit')}
                  className="bg-white !text-primary-red border border-primary-red/30 hover:bg-neutral-50 font-bold shadow-sm"
                  style={{ color: '#74121c' }}
                >
                  Plan Your Visit
                </Button>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-body-xs font-semibold text-primary-navy hover:text-primary-navy/80 flex items-center justify-center gap-1.5 py-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> View Map & Directions
                </button>
              </div>

            </div>

            {/* Quick First-Time Visitor Assurance Bar */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-neutral-700">
              <div className="flex items-center gap-2.5">
                <Smile className="w-4 h-4 text-primary-navy flex-shrink-0" />
                <span className="text-caption font-medium">Come as you are (casual dress)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-primary-navy flex-shrink-0" />
                <span className="text-caption font-medium">Safe children's ministry</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Languages className="w-4 h-4 text-primary-navy flex-shrink-0" />
                <span className="text-caption font-medium">Khmer & English services</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary-navy flex-shrink-0" />
                <span className="text-caption font-medium">Boeung Tompun Phnom Penh</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Welcome / Pastoral Message & Spiritual Identity */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-navy/10 text-primary-navy text-xs uppercase tracking-wider font-bold">
                <Church className="w-4 h-4" />
                Welcome from Our Leadership
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-tight">
                You Have a Place at the Table
              </h2>
              <p className="text-body-lg text-neutral-700 leading-relaxed font-sans">
                Welcome to Horaios Baptist Church Cambodia. Whether you are exploring faith in Christ for the very first time or searching for a home church to plant roots in Phnom Penh, our hearts and doors are wide open to you.
              </p>
              <p className="text-body-base text-neutral-600 leading-relaxed font-sans">
                Named after the Beautiful (Horaios) Gate in Acts 3:2, we were established to be the sign, symbol, and instrument of the Kingdom of God. Our prayer and calling is that all who are spiritually, physically, or economically weak may find healing, restoration, and new strength to get up and walk in the name of Jesus.
              </p>

              {/* Three Spiritual Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-navy/10 text-primary-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-label-lg font-bold text-neutral-900">Biblical Truth</h3>
                    <p className="text-caption text-neutral-500 mt-1">Grounded faithfully in God’s inspired Word.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-navy text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-label-lg font-bold text-neutral-900">True Community</h3>
                    <p className="text-caption text-neutral-500 mt-1">Caring fellowship where no one walks alone.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-navy/10 text-primary-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-label-lg font-bold text-neutral-900">Loving Mission</h3>
                    <p className="text-caption text-neutral-500 mt-1">Serving Phnom Penh with compassionate action.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" onClick={() => navigate('/about')}>
                  Our Story & What We Believe →
                </Button>
                <Button variant="default" size="lg" onClick={() => navigate('/visit')}>
                  What to Expect on Sunday
                </Button>
              </div>
            </div>

            {/* Right Visual Composition with Scripture Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-elevation-lg aspect-[4/5] bg-neutral-100 border border-neutral-200/80">
                  <img
                    src={placeholderImage(600, 750, 'Church Worship & Fellowship')}
                    alt="Horaios Baptist Church Fellowship"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  
                  {/* Floating Scripture Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/60 text-neutral-900">
                    <Quote className="w-6 h-6 text-primary-red/40 mb-2" />
                    <p className="font-serif text-sm sm:text-base italic text-neutral-800 leading-relaxed">
                      "For where two or three gather in my name, there am I with them."
                    </p>
                    <p className="text-xs font-bold text-primary-red uppercase tracking-wider mt-2.5 font-sans">
                      — Matthew 18:20
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Sermons & God's Word (Biblical Nourishment, not Media Streaming) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-navy/10 text-primary-navy text-xs uppercase tracking-wider font-bold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                Biblical Teaching
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight">
                Grow in God's Word
              </h2>
              <p className="text-body-base text-neutral-600 mt-2 max-w-xl">
                Recent Sunday sermons and expositional teachings to strengthen your daily walk with Christ.
              </p>
            </div>
            <Button variant="default" className="self-start md:self-auto" onClick={() => navigate('/sermons')}>
              Browse All Sermons →
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
                  {/* Featured Sunday Message */}
                  <div className="lg:col-span-7 bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 shadow-elevation-sm flex flex-col justify-between group">
                    <div 
                      className="relative aspect-video bg-neutral-900 overflow-hidden cursor-pointer" 
                      onClick={() => navigate(`/sermons/${featuredSermon.slug || featuredSermon.id}`)}
                    >
                      <img
                        src={getSermonThumbnail(featuredSermon)}
                        alt={featuredSermon.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary-red text-white flex items-center justify-center shadow-elevation-md group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-primary-red text-white text-caption font-bold uppercase tracking-wider shadow-sm">
                          {featuredSermon.featured ? 'Featured Message' : 'Recent Message'}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-white/80" /> 
                          {featuredSermon.published_at ? new Date(featuredSermon.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sunday Service'}
                        </span>
                        {featuredSermon.category && (
                          <span className="px-2.5 py-0.5 rounded bg-black/50 text-white/90">
                            {featuredSermon.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-caption font-semibold text-primary-navy uppercase tracking-wide mb-2">
                          <span>{featuredSermon.series?.name || featuredSermon.category?.name || 'Sermon'}</span>
                          {featuredSermon.scripture_reference && (
                            <>
                              <span>•</span>
                              <span className="font-bold underline">{featuredSermon.scripture_reference}</span>
                            </>
                          )}
                        </div>
                        <h3 
                          className="font-serif text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary-navy transition-colors cursor-pointer truncate"
                          title={featuredSermon.title}
                          onClick={() => navigate(`/sermons/${featuredSermon.slug || featuredSermon.id}`)}
                        >
                          {featuredSermon.title}
                        </h3>
                        <p 
                          className="text-body-sm text-neutral-600 leading-relaxed line-clamp-2"
                          title={featuredSermon.summary || featuredSermon.description || 'Listen to this biblical teaching designed to strengthen your faith and obedience to Christ.'}
                        >
                          {featuredSermon.summary || featuredSermon.description || 'Listen to this biblical teaching designed to strengthen your faith and obedience to Christ.'}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
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
                          Watch Message
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Teaching List */}
                  <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
                    {recentSermons.length > 0 ? (
                      recentSermons.map((sermon) => (
                        <div 
                          key={sermon.id}
                          className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-primary-navy/40 hover:bg-white hover:shadow-elevation-sm transition-all cursor-pointer flex gap-4 items-center group"
                          onClick={() => navigate(`/sermons/${sermon.slug || sermon.id}`)}
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 relative">
                            <img 
                              src={getSermonThumbnail(sermon)} 
                              alt={sermon.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-caption font-bold text-primary-navy uppercase tracking-wider truncate block">
                              {sermon.series?.name || sermon.category?.name || 'Sermon'}
                            </span>
                            <h4 
                              className="font-serif text-base sm:text-lg font-bold text-neutral-900 truncate mt-0.5 group-hover:text-primary-navy transition-colors"
                              title={sermon.title}
                            >
                              {sermon.title}
                            </h4>
                            {sermon.scripture_reference && (
                              <p className="text-xs font-semibold text-neutral-700 mt-0.5">
                                {sermon.scripture_reference}
                              </p>
                            )}
                            <p className="text-caption text-neutral-500 mt-1 line-clamp-1">
                              {sermon.speaker?.name || 'Pastor'} • {sermon.published_at ? new Date(sermon.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Sunday Service'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/70 text-center flex flex-col items-center justify-center flex-1">
                        <BookOpen className="w-10 h-10 text-neutral-400 mb-3" />
                        <p className="text-label-md font-bold text-neutral-700">More Biblical Messages Coming Soon</p>
                        <p className="text-caption text-neutral-500 mt-1">Check back every Sunday for our latest sermons.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
              <p className="text-body-base text-neutral-600">No sermons published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Ministries & Discipleship for the Church Family */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-navy/10 text-primary-navy text-xs uppercase tracking-wider font-bold mb-3">
              <Users className="w-3.5 h-3.5" />
              Community & Discipleship
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight">
              Ministries for Every Season of Life
            </h2>
            <p className="text-body-base text-neutral-600 mt-2">
              Deepen your faith, build authentic relationships, and serve alongside fellow believers in our church family.
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
                  { bg: 'bg-primary-navy/10', text: 'text-primary-navy', border: 'hover:border-primary-navy/50', icon: Church },
                  { bg: 'bg-primary-navy text-white', text: 'text-white', border: 'hover:border-primary-navy/60', icon: Users },
                  { bg: 'bg-primary-navy/10', text: 'text-primary-navy', border: 'hover:border-primary-navy/50', icon: BookOpen },
                  { bg: 'bg-primary-navy/10', text: 'text-primary-navy', border: 'hover:border-primary-navy/50', icon: HandHeart },
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

                      <h3 
                        className="font-serif text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-navy transition-colors truncate"
                        title={ministry.name}
                      >
                        {ministry.name}
                      </h3>
                      <p 
                        className="text-body-sm text-neutral-600 leading-relaxed line-clamp-2"
                        title={ministry.description || 'Get involved with our church community and serve together in God’s kingdom.'}
                      >
                        {ministry.description || 'Get involved with our church community and serve together in God’s kingdom.'}
                      </p>

                      {ministry.leader && (
                        <p className="text-caption text-neutral-500 mt-3">
                          Leader: <span className="font-semibold text-neutral-800">{ministry.leader}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-body-xs font-bold text-primary-navy">
                      <span>Learn More</span>
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

      {/* 6. Upcoming Events & Gatherings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-navy/10 text-primary-navy text-xs uppercase tracking-wider font-bold mb-3">
                <Calendar className="w-3.5 h-3.5" />
                Church Calendar
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight">
                Upcoming Gatherings & Events
              </h2>
            </div>
            <Button variant="default" onClick={() => navigate('/events')}>
              View Full Calendar →
            </Button>
          </div>

          {loadingEvents ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 h-28 border border-slate-200"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 3).map((event, idx) => {
                const { month, day, dayOfWeek } = formatEventDate(event.start_date);
                const badgeStyles = [
                  { bg: 'bg-primary-navy text-white border-primary-navy', pill: 'bg-primary-navy text-white' },
                  { bg: 'bg-primary-navy/10 text-primary-navy border-primary-navy/20', pill: 'bg-primary-navy text-white' },
                  { bg: 'bg-slate-100 text-primary-navy border-slate-300', pill: 'bg-primary-navy text-white' },
                ];
                const badgeStyle = badgeStyles[idx % badgeStyles.length];

                return (
                  <div 
                    key={event.id}
                    className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-primary-navy/50 hover:bg-white hover:shadow-elevation-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group"
                    onClick={() => navigate(`/events/${event.slug || event.id}`)}
                  >
                    <div className="flex items-start sm:items-center gap-5">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${badgeStyle.bg} flex flex-col items-center justify-center flex-shrink-0 border`}>
                        <span className="text-caption font-bold uppercase tracking-wider">{month}</span>
                        <span className="text-h4 font-extrabold leading-none">{day}</span>
                        <span className="text-[10px] font-semibold opacity-80 uppercase">{dayOfWeek}</span>
                      </div>
                      <div className="min-w-0 flex-1">
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
                        <h3 
                          className="font-serif text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-primary-navy transition-colors truncate"
                          title={event.title}
                        >
                          {event.title}
                        </h3>
                        <p 
                          className="text-body-sm text-neutral-600 mt-1 line-clamp-2"
                          title={event.description || 'Join our church family for this gathering.'}
                        >
                          {event.description || 'Join our church family for this gathering.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <Button variant="default" size="sm" className="hidden sm:inline-flex">
                        Event Details
                      </Button>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-navy group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
              <p className="text-body-base text-neutral-600">No upcoming events scheduled right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Dedicated Prayer & Pastoral Care Section in Dignified Primary Navy */}
      <section className="py-20 bg-primary-navy text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-amber-300 mx-auto flex items-center justify-center mb-5 border border-white/20">
            <Heart className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-white/95 text-xs uppercase tracking-wider font-bold mb-3 border border-white/20">
            Pastoral Care & Prayer
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            How Can We Pray For You?
          </h2>
          <p className="text-body-lg text-white/90 mt-3 max-w-2xl mx-auto leading-relaxed font-sans">
            We believe that God hears and answers prayer. If you are carrying a burden, facing a major decision, or walking through illness, our pastoral staff and intercessory prayer team pray for every request by name.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/prayer')}
              className="bg-white !text-primary-navy hover:bg-neutral-100 font-bold shadow-elevation-md px-8 py-3.5 border-0 transition-all"
              style={{ color: '#273161' }}
            >
              Submit Confidential Prayer Request
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              onClick={() => navigate('/contact')}
              className="border-2 border-white/80 bg-white/10 text-white hover:bg-white hover:!text-primary-navy font-bold px-8 py-3.5 transition-all"
            >
              Speak with a Pastor
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/25 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 8. Faithful Stewardship & Giving Banner */}
      <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Giving Narrative */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs uppercase tracking-wider font-bold text-white/90 border border-white/20">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> Faithful Stewardship
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-white leading-tight">
                Partner in God's Work in Cambodia
              </h3>
              <p className="text-body-base text-white/90 leading-relaxed font-sans">
                Your faithful tithes and voluntary offerings directly support Gospel proclamation, dormitory shelter and education for underprivileged youth, and practical compassionate care across Phnom Penh and Cambodia.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white !text-primary-red hover:bg-primary-dark-red hover:!text-white border-2 border-white font-bold shadow-elevation-md px-8 py-3 transition-all"
                  onClick={() => navigate('/give')}
                >
                  Give Online
                </Button>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="border-2 border-white/80 bg-white/10 text-white font-bold hover:bg-white hover:text-brand-burgundy px-8 py-3"
                  onClick={() => navigate('/visit')}
                >
                  Give in Person
                </Button>
              </div>
            </div>

            {/* Scriptural Promise */}
            <div className="space-y-4 md:border-l md:border-white/20 md:pl-12">
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Quote className="w-8 h-8 text-amber-200/40 mb-3" />
                <p className="font-serif text-lg italic text-white/95 leading-relaxed">
                  "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                </p>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-widest mt-4 font-sans">
                  — 2 Corinthians 9:7
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/25 rounded-full blur-3xl pointer-events-none" />
      </section>
    </Layout>
  );
};

export default HomePage;
