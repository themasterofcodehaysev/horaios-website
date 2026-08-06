import React from 'react';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Target, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title="About Horaios Baptist Church"
        subtitle="Our Story"
        description="Discover who we are and what drives our mission to serve Christ and community."
        minHeight="md"
      />

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-semibold text-neutral-900 mb-6">
              Our Journey
            </h2>
            <p className="text-body-lg text-neutral-700 max-w-2xl mx-auto">
              Founded in faith and rooted in Scripture, Horaios Baptist Church has been a beacon of hope and spiritual transformation in Cambodia.
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
            <div className="bg-neutral-200 rounded-lg h-96 overflow-hidden">
              <img src="https://via.placeholder.com/500x400" alt="Church building" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-label-lg text-accent-red uppercase tracking-wide mb-3">
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
            <Card padding="lg" className="border-l-4 border-primary-navy">
              <div className="flex items-start gap-4 mb-4">
                <Target className="w-8 h-8 text-primary-navy flex-shrink-0 mt-1" />
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

            <Card padding="lg" className="border-l-4 border-accent-red">
              <div className="flex items-start gap-4 mb-4">
                <Heart className="w-8 h-8 text-accent-red flex-shrink-0 mt-1" />
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
            <p className="text-label-lg text-accent-red uppercase tracking-wide mb-3">
              Our Leaders
            </p>
            <h2 className="text-h2 font-semibold text-neutral-900">
              Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Pastor John', role: 'Senior Pastor', image: 'https://via.placeholder.com/300x300' },
              { name: 'Pastor Sarah', role: 'Associate Pastor', image: 'https://via.placeholder.com/300x300' },
              { name: 'David Chen', role: 'Worship Leader', image: 'https://via.placeholder.com/300x300' },
            ].map((leader) => (
              <Card key={leader.name} padding="md" className="text-center">
                <div className="mb-4 overflow-hidden rounded-lg h-48 bg-neutral-200">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-1">
                  {leader.name}
                </h4>
                <p className="text-body-sm text-accent-red font-medium">
                  {leader.role}
                </p>
              </Card>
            ))}
          </div>
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
            <Button variant="primary" size="lg">
              Visit This Sunday
            </Button>
            <Button variant="default" size="lg">
              Join a Small Group
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
