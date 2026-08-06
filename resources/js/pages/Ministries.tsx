import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { HeroSection, MinistryCard } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Users, Music, BookOpen, Heart, MapPin, Calendar } from 'lucide-react';

export const MinistriesPage: React.FC = () => {
  const [activeMinistry, setActiveMinistry] = useState('all');

  const ministries = [
    {
      id: 'small-groups',
      name: 'Small Groups',
      description: 'Connect with others through Bible study, prayer, and fellowship',
      icon: <Users className="w-8 h-8" />,
      image: 'https://via.placeholder.com/400x300',
      leader: 'David Johnson',
      members: 45,
      schedule: 'Weekly on Tuesday & Thursday at 7:00 PM',
      details: 'Our small groups are the heart of our church community. We meet in homes throughout the city to study Scripture, pray together, and support one another in our faith journeys.',
    },
    {
      id: 'worship',
      name: 'Worship & Music',
      description: 'Express your faith through contemporary and traditional worship',
      icon: <Music className="w-8 h-8" />,
      image: 'https://via.placeholder.com/400x300',
      leader: 'Sarah Chen',
      members: 32,
      schedule: 'Sundays 09:00 AM & 11:00 AM',
      details: 'Join our dynamic worship team! Whether you sing, play instruments, or use technical skills, we welcome you to lead others in worship.',
    },
    {
      id: 'education',
      name: 'Christian Education',
      description: 'Grow in knowledge through Bible classes and discipleship',
      icon: <BookOpen className="w-8 h-8" />,
      image: 'https://via.placeholder.com/400x300',
      leader: 'Pastor John',
      members: 78,
      schedule: 'Sundays 10:00 AM (between services)',
      details: 'Our education ministry provides quality biblical teaching for all ages, from children through adults, helping people grow in their understanding and application of Scripture.',
    },
    {
      id: 'outreach',
      name: 'Outreach & Missions',
      description: 'Serve our community and the world',
      icon: <Heart className="w-8 h-8" />,
      image: 'https://via.placeholder.com/400x300',
      leader: 'Michael Torres',
      members: 56,
      schedule: 'Monthly on first Saturday',
      details: 'We partner with local and international organizations to serve the vulnerable, share the Gospel, and make a lasting difference in our community and beyond.',
    },
    {
      id: 'youth',
      name: 'Youth Ministry',
      description: 'Equipping young people to follow Jesus',
      icon: <Calendar className="w-8 h-8" />,
      image: 'https://via.placeholder.com/400x300',
      leader: 'Joshua Lee',
      members: 43,
      schedule: 'Fridays 6:00 PM & Sundays 1:00 PM',
      details: 'Our youth ministry creates a fun, safe environment for teens to grow spiritually, build friendships, and discover their purpose in God\'s kingdom.',
    },
    {
      id: 'care',
      name: 'Community Care',
      description: 'Provide compassionate support during life\'s challenges',
      icon: <MapPin className="w-8 h-8" />,
      image: 'https://via.placeholder.com/400x300',
      leader: 'Ruth Martinez',
      members: 38,
      schedule: 'As needed',
      details: 'Our care ministry walks alongside members during difficult times, providing prayer, counseling resources, meals, and practical assistance.',
    },
  ];

  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title="Our Ministries"
        subtitle="Get Involved"
        description="Discover how you can use your gifts to serve God and impact others."
        minHeight="md"
      />

      {/* Ministries Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <MinistryCard
                key={ministry.id}
                name={ministry.name}
                description={ministry.description}
                icon={ministry.icon}
                image={ministry.image}
                leader={ministry.leader}
                members={ministry.members}
                schedule={ministry.schedule}
                onClick={() => setActiveMinistry(ministry.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Details */}
      {activeMinistry !== 'all' && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {ministries
              .filter((m) => m.id === activeMinistry)
              .map((ministry) => (
                <Card key={ministry.id} padding="lg" shadow="lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="overflow-hidden rounded-lg h-64 bg-neutral-200">
                      <img src={ministry.image} alt={ministry.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-h3 font-semibold text-neutral-900 mb-4">
                        {ministry.name}
                      </h2>
                      <p className="text-body-lg text-neutral-700 mb-6">
                        {ministry.details}
                      </p>
                      <div className="space-y-2 mb-6">
                        <p className="text-body-base text-neutral-700">
                          <span className="font-semibold">Leader:</span> {ministry.leader}
                        </p>
                        <p className="text-body-base text-neutral-700">
                          <span className="font-semibold">Members:</span> {ministry.members}
                        </p>
                        <p className="text-body-base text-neutral-700">
                          <span className="font-semibold">Schedule:</span> {ministry.schedule}
                        </p>
                      </div>
                      <Button variant="primary" size="lg">
                        Join {ministry.name}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </section>
      )}

      {/* How to Get Involved */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            How to Get Involved
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Explore
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Learn about different ministries and find one that aligns with your interests and gifts.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Connect
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Talk with ministry leaders to understand how you can contribute and grow.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🙌</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Serve
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Use your talents and passion to make a difference in the lives of others.
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg">
              Get Connected
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MinistriesPage;
