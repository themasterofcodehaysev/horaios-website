import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { SectionDivider } from '../components/layout/SectionDivider';
import { HeroSection, EventCard, SermonCard, BlogCard, FeatureBox, SongCard } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Gallery, type GalleryItem } from '../components/ui/Gallery';
import { songService } from '../admin/services/song.service';
import type { SongItem } from '../admin/types';
import { placeholderImage } from '../lib/placeholderImage';
import { Calendar, Music, BookOpen, Users, Heart, MapPin } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

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
  const [featuredSongs, setFeaturedSongs] = useState<SongItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    songService
      .getPublicSongs({ featured: true, per_page: 4 })
      .then((res) => {
        if (isMounted) setFeaturedSongs(res.data);
      })
      .catch(() => {
        if (isMounted) setFeaturedSongs([]);
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

      {/* Service Times Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
              Join Us For Worship
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900">
              Service Times
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {settings.parsedServiceTimes.map((item, idx) => (
              <Card key={idx} padding="lg" className="text-center">
                <div className="text-5xl mb-4">{idx === 0 ? '⛪' : idx === 1 ? '🙏' : '🎵'}</div>
                <h3 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {item.day}
                </h3>
                <p className="text-body-base text-primary-red font-medium mb-2">
                  {item.time}
                </p>
                <p className="text-body-sm text-neutral-600">
                  {item.type}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/visit')}>
              View Full Schedule
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
              Our Story
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900 mb-8">
              Welcome to Horaios Baptist Church
            </h2>
          </div>

          <Card padding="lg" shadow="md">
            <div className="prose prose-lg max-w-none">
              <p className="text-body-lg text-neutral-700 mb-6">
                Horaios Baptist Church is a vibrant community of believers dedicated to worship, discipleship, and service. Our mission is to glorify God through authentic faith, caring relationships, and transformative ministry.
              </p>

              <p className="text-body-lg text-neutral-700 mb-6">
                Whether you're exploring faith for the first time or deepening your spiritual journey, you'll find a warm welcome here. We believe every person has immense value and purpose in God's kingdom.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">✝️</div>
                  <p className="font-semibold text-neutral-900">Christ-Centered</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">👥</div>
                  <p className="font-semibold text-neutral-900">Community-Focused</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">🌱</div>
                  <p className="font-semibold text-neutral-900">Growth-Oriented</p>
                </div>
              </div>

              <p className="text-body-lg text-neutral-700">
                Come as you are and experience the peace, joy, and purpose that comes from a life centered on Christ.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <Button variant="primary" size="lg" onClick={() => navigate('/about')}>
                Learn More About Us
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
                What's Happening
              </p>
              <h2 className="text-h2 font-semibold text-neutral-900">
                Upcoming Events
              </h2>
            </div>
            <Button variant="default" className="hidden sm:inline-flex" onClick={() => navigate('/events')}>
              View All Events →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard
              title="Weekly Prayer Meeting"
              date="Wed, Aug 13"
              time="7:00 PM"
              location="Main Chapel"
              description="Join our community for prayer and intercession as we lift up the needs of our church and community."
              featured={false}
              onClick={() => navigate('/events')}
            />

            <EventCard
              title="Youth Group Outing"
              date="Sat, Aug 16"
              time="2:00 PM"
              location="City Park"
              description="Fun activities and fellowship for young adults. Food and games provided!"
              featured={false}
              onClick={() => navigate('/events')}
            />

            <EventCard
              title="Sunday Worship Service"
              date="Sun, Aug 17"
              time="9:00 AM & 11:00 AM"
              location="Main Sanctuary"
              description="Experience dynamic worship and inspiring teaching. Childcare provided."
              featured={true}
              onClick={() => navigate('/events')}
            />
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button variant="default" onClick={() => navigate('/events')}>
              View All Events →
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
                Spiritual Growth
              </p>
              <h2 className="text-h2 font-semibold text-neutral-900">
                Latest Sermons
              </h2>
            </div>
            <Button variant="default" className="hidden sm:inline-flex" onClick={() => navigate('/sermons')}>
              All Sermons →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SermonCard
              title="Faith in Action"
              speaker="Pastor John"
              date="Aug 10, 2025"
              series="Living Faith"
              description="Discover how genuine faith transforms our actions and impacts our world."
              onClick={() => navigate('/sermons')}
            />

            <SermonCard
              title="God's Grace in Our Weakness"
              speaker="Pastor Sarah"
              date="Aug 3, 2025"
              series="Amazing Grace"
              description="Explore how God's strength is made perfect in our weakness and challenges."
              onClick={() => navigate('/sermons')}
            />

            <SermonCard
              title="Building Kingdom Community"
              speaker="Pastor David"
              date="Jul 27, 2025"
              series="Kingdom Living"
              description="Learn how to build authentic community that reflects God's love and purpose."
              onClick={() => navigate('/sermons')}
            />
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button variant="default" onClick={() => navigate('/sermons')}>
              All Sermons →
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Songs */}
      {featuredSongs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
                  Worship With Us
                </p>
                <h2 className="text-h2 font-semibold text-neutral-900">
                  Featured Songs
                </h2>
              </div>
              <Button variant="default" className="hidden sm:inline-flex" onClick={() => navigate('/songs')}>
                All Songs →
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Button variant="default" onClick={() => navigate('/songs')}>
                All Songs →
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Ministries */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
              Get Involved
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900">
              Our Ministries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureBox
              icon={<Users className="w-6 h-6" />}
              title="Small Groups"
              description="Connect with others through Bible study, prayer, and meaningful discussion in intimate settings."
              onClick={() => navigate('/ministries')}
            />

            <FeatureBox
              icon={<Heart className="w-6 h-6" />}
              title="Outreach & Missions"
              description="Serve our community and the world through local partnerships and global mission work."
              onClick={() => navigate('/ministries')}
            />

            <FeatureBox
              icon={<Music className="w-6 h-6" />}
              title="Worship & Music"
              description="Join our vibrant music ministry and express your faith through contemporary and traditional worship."
              highlight={true}
              onClick={() => navigate('/ministries')}
            />

            <FeatureBox
              icon={<BookOpen className="w-6 h-6" />}
              title="Christian Education"
              description="Grow in your faith with Bible classes, seminars, and discipleship programs for all ages."
              onClick={() => navigate('/ministries')}
            />

            <FeatureBox
              icon={<Calendar className="w-6 h-6" />}
              title="Youth Ministry"
              description="Equipping young people to follow Jesus with programs designed for spiritual growth and fun."
              onClick={() => navigate('/ministries')}
            />

            <FeatureBox
              icon={<MapPin className="w-6 h-6" />}
              title="Community Care"
              description="Provide compassionate support through prayer, counseling, and assistance during life's transitions."
              onClick={() => navigate('/ministries')}
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg" onClick={() => navigate('/ministries')}>
              Explore All Ministries
            </Button>
          </div>
        </div>
      </section>

      {/* Church Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
              Life Together
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900">
              Church Gallery
            </h2>
          </div>

          <Gallery items={GALLERY_ITEMS} columns={3} />
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
                Latest Updates
              </p>
              <h2 className="text-h2 font-semibold text-neutral-900">
                News & Updates
              </h2>
            </div>
            <Button variant="default" className="hidden sm:inline-flex" onClick={() => navigate('/news')}>
              All News →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogCard
              title="Summer Vacation Bible School Begins"
              excerpt="Join us for an exciting week of Bible lessons, activities, and fun for children ages 3-12."
              author="Admin"
              date="Aug 8, 2025"
              image={placeholderImage(400, 250, 'News')}
              category="Events"
              onClick={() => navigate('/news')}
            />

            <BlogCard
              title="New Discipleship Program Launches"
              excerpt="Introducing a new pathway for spiritual growth and leadership development in our church."
              author="Admin"
              date="Aug 6, 2025"
              image={placeholderImage(400, 250, 'News')}
              category="Announcements"
              onClick={() => navigate('/news')}
            />

            <BlogCard
              title="Summer Missions Trip Impact Report"
              excerpt="See how our team blessed communities and spread Christ's love during our recent mission work."
              author="Admin"
              date="Aug 1, 2025"
              image={placeholderImage(400, 250, 'News')}
              category="Missions"
              featured={true}
              onClick={() => navigate('/news')}
            />
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button variant="default" onClick={() => navigate('/news')}>
              All News →
            </Button>
          </div>
        </div>
      </section>

      {/* Prayer & Giving CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prayer CTA */}
            <div className="text-center md:text-left">
              <h3 className="text-h4 font-semibold text-white mb-3">
                Prayer Requests
              </h3>
              <p className="text-body-lg text-white/90 mb-6">
                Share your prayer needs with our church family. We're here to support and intercede for you.
              </p>
              <Button variant="default" className="border-2 border-white bg-white text-primary-red hover:bg-white/10 hover:text-white" onClick={() => navigate('/prayer')}>
                Submit Prayer Request
              </Button>
            </div>

            {/* Giving CTA */}
            <div className="text-center md:text-left">
              <h3 className="text-h4 font-semibold text-white mb-3">
                Generous Giving
              </h3>
              <p className="text-body-lg text-white/90 mb-6">
                Support our ministry and mission. Your generosity enables us to serve our community.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="bg-primary-red hover:bg-primary-dark-red w-full md:w-auto"
                onClick={() => navigate('/give')}
              >
                Give Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
              Stories of Faith
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900">
              Member Testimonies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} padding="lg" className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <p className="text-body-base text-neutral-700 mb-4 italic">
                  "This church community has transformed my faith journey. The genuine love and support I've experienced here has been life-changing."
                </p>
                <p className="text-label-md font-semibold text-neutral-900">
                  Name {i}
                </p>
                <p className="text-body-sm text-neutral-600">
                  Member since 2023
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
