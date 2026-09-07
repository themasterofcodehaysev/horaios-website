import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Target, Heart, Mail, Globe, User, Phone, Loader2 } from 'lucide-react';
import { placeholderImage } from '../lib/placeholderImage';
import { leaderService } from '../admin/services/leader.service';
import type { Leader } from '../admin/types';
import { getImageUrl } from '../utils/imageUrl';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(true);

  useEffect(() => {
    let isMounted = true;
    leaderService
      .getPublicLeaders()
      .then((data) => {
        if (isMounted) setLeaders(data);
      })
      .catch(() => {
        if (isMounted) setLeaders([]);
      })
      .finally(() => {
        if (isMounted) setLoadingLeaders(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title={`About ${settings.church_name || 'Horaios Baptist Church'}`}
        subtitle="Our Story"
        description="Discover who we are and what drives our mission to serve Christ and community."
        minHeight="md"
        primaryCTA={{
          label: 'Plan Your Visit',
          onClick: () => navigate('/visit'),
        }}
        secondaryCTA={{
          label: 'Contact Us',
          onClick: () => navigate('/contact'),
        }}
      />

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-semibold text-neutral-900 mb-6">
              Our Journey
            </h2>
            <p className="text-body-lg text-neutral-700 max-w-2xl mx-auto">
              {settings.footer_text || 'Founded in faith and rooted in Scripture, Horaios Baptist Church has been a beacon of hope and spiritual transformation in Cambodia.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-body-lg text-neutral-700">
                Our church started as a small gathering of believers dedicated to worshiping God and making disciples. Over the years, God has blessed us with growth, but our core mission remains unchanged: to glorify Jesus Christ through authentic worship, biblical teaching, and sacrificial service.
              </p>
              <p className="text-body-lg text-neutral-700">
                We believe that true transformation happens when people encounter the love of Jesus Christ. Our church is committed to creating an environment where every person—regardless of their background—can experience God's grace and grow in their faith.
              </p>
              <p className="text-body-lg text-neutral-700">
                Today, we're grateful for the diverse community God has gathered. Together, we're reaching our city for Christ and making an impact for eternity.
              </p>
            </div>
            <div className="bg-neutral-200 rounded-2xl h-96 overflow-hidden shadow-elevation-sm">
              <img src={placeholderImage(500, 400, 'Church building')} alt="Church sanctuary" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
              Our Identity
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-5xl mb-4">✝️</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Christ-Centered
              </h4>
              <p className="text-body-sm text-neutral-600">
                Jesus Christ is our foundation, focus, and future.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-5xl mb-4">📖</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Bible-Based
              </h4>
              <p className="text-body-sm text-neutral-600">
                God's Word is our authority and guide for life.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Community-Focused
              </h4>
              <p className="text-body-sm text-neutral-600">
                We value authentic relationships and belonging.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Mission-Minded
              </h4>
              <p className="text-body-sm text-neutral-600">
                We're committed to reaching and serving others.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card padding="lg" className="border-l-4 border-primary-red shadow-elevation-sm">
              <div className="flex items-start gap-4 mb-4">
                <Target className="w-8 h-8 text-primary-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-h5 font-semibold text-neutral-900 mb-3">
                    Our Vision
                  </h3>
                  <p className="text-body-base text-neutral-700">
                    To be a thriving community of believers who passionately follow Jesus Christ, authentically live out the Gospel, and transform lives and communities through God's love.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="border-l-4 border-primary-navy shadow-elevation-sm">
              <div className="flex items-start gap-4 mb-4">
                <Heart className="w-8 h-8 text-primary-navy flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-h5 font-semibold text-neutral-900 mb-3">
                    Our Mission
                  </h3>
                  <p className="text-body-base text-neutral-700">
                    To glorify God by making disciples of Jesus Christ, growing in biblical knowledge and spiritual maturity, and engaging in compassionate ministry to our community and world.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-primary-red uppercase tracking-wide mb-3">
              Our Leaders
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900">
              Leadership Team
            </h2>
            <p className="text-body-sm text-neutral-600 max-w-xl mx-auto mt-2">
              Serving God's flock with humility, biblical dedication, and pastoral care.
            </p>
          </div>

          {loadingLeaders ? (
            <div className="py-12 flex justify-center items-center gap-2 text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin text-primary-red" />
              <span>Loading leadership team...</span>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-body-sm">
              No leadership members published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => (
                <Card key={leader.id} padding="lg" className="text-center flex flex-col justify-between hover:shadow-elevation-md transition-all">
                  <div>
                    <div className="mb-5 overflow-hidden rounded-xl h-56 bg-neutral-200 relative flex items-center justify-center">
                      {leader.photo ? (
                        <img
                          src={getImageUrl(leader.photo)}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                          <User className="w-16 h-16 text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-h5 font-bold text-neutral-900 mb-1">
                      {leader.name}
                    </h4>
                    <p className="text-body-xs uppercase tracking-wider text-primary-red font-bold mb-3">
                      {leader.role}
                    </p>
                    {leader.bio && (
                      <p className="text-body-sm text-neutral-600 leading-relaxed line-clamp-3">
                        {leader.bio}
                      </p>
                    )}
                  </div>

                  {(leader.email || leader.phone || leader.facebook) && (
                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-center gap-3 text-neutral-500">
                      {leader.email && (
                        <a
                          href={`mailto:${leader.email}`}
                          className="p-2 rounded-full hover:bg-neutral-100 hover:text-primary-red transition-colors"
                          title={leader.email}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {leader.phone && (
                        <a
                          href={`tel:${leader.phone}`}
                          className="p-2 rounded-full hover:bg-neutral-100 hover:text-primary-red transition-colors"
                          title={leader.phone}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      {leader.facebook && (
                        <a
                          href={leader.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-full hover:bg-neutral-100 hover:text-primary-red transition-colors"
                          title="Facebook Profile"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join Our Community */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h2 font-semibold text-neutral-900 mb-6">
            Join Our Faith Community
          </h2>
          <p className="text-body-lg text-neutral-700 mb-8">
            Whether you're new to faith or seeking a deeper relationship with God, we'd love to welcome you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/visit')}>
              Visit This Sunday
            </Button>
            <Button variant="default" size="lg" onClick={() => navigate('/ministries')}>
              Explore Ministries
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;

