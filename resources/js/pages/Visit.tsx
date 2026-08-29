import React from 'react';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const VisitPage: React.FC = () => {
  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title="Plan Your Visit"
        subtitle="Welcome"
        description="Everything you need to know before your first visit to Horaios Baptist Church."
        minHeight="md"
      />

      {/* Service Times */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Service Times
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="border-l-4 border-primary-red">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-h6 font-semibold text-neutral-900 mb-2">
                    Sunday Morning
                  </h3>
                  <p className="text-body-base font-medium text-primary-red mb-2">
                    9:00 AM & 11:00 AM
                  </p>
                  <p className="text-body-sm text-neutral-600">
                    Main Worship Service with childcare provided
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="border-l-4 border-primary-red">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-h6 font-semibold text-neutral-900 mb-2">
                    Wednesday Evening
                  </h3>
                  <p className="text-body-base font-medium text-primary-red mb-2">
                    7:00 PM
                  </p>
                  <p className="text-body-sm text-neutral-600">
                    Prayer Meeting & Bible Study
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="border-l-4 border-success">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-h6 font-semibold text-neutral-900 mb-2">
                    Special Events
                  </h3>
                  <p className="text-body-base font-medium text-success mb-2">
                    Various Times
                  </p>
                  <p className="text-body-sm text-neutral-600">
                    Check calendar for seasonal events
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Location & Directions */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="rounded-lg overflow-hidden h-96 bg-neutral-200">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-neutral-600">Map coming soon</p>
              </div>
            </div>

            {/* Location Info */}
            <div>
              <h2 className="text-h3 font-semibold text-neutral-900 mb-6">
                Location & Contact
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">Address</p>
                    <p className="text-body-base text-neutral-600">
                      Phnom Penh, Cambodia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">Phone</p>
                    <a href="tel:+" className="text-body-base text-primary-red hover:text-primary-dark-red">
                      +855 (0) 23 XXX XXXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">Email</p>
                    <a href="mailto:info@horaiosbaptist.org" className="text-body-base text-primary-red hover:text-primary-dark-red">
                      info@horaiosbaptist.org
                    </a>
                  </div>
                </div>
              </div>

              <Button variant="primary" size="lg" fullWidth className="mb-4">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Amenities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Our Facilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">👶</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Nursery & Childcare
              </h4>
              <p className="text-body-sm text-neutral-600">
                Infant through age 3 care available during services
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🧒</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Children's Ministry
              </h4>
              <p className="text-body-sm text-neutral-600">
                Age-appropriate classes and activities during services
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">♿</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Accessibility
              </h4>
              <p className="text-body-sm text-neutral-600">
                Wheelchair accessible facilities and reserved seating
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🅿️</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Parking
              </h4>
              <p className="text-body-sm text-neutral-600">
                Ample free parking available for all guests
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                Fellowship Hall
              </h4>
              <p className="text-body-sm text-neutral-600">
                Space for events, meals, and community gatherings
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">📶</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                WiFi Available
              </h4>
              <p className="text-body-sm text-neutral-600">
                Free wireless internet throughout the facility
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            What to Expect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Warm Welcome
                </h4>
                <p className="text-body-base text-neutral-700">
                  You'll be greeted by friendly volunteers who can answer questions and help you get oriented.
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Contemporary Worship
                </h4>
                <p className="text-body-base text-neutral-700">
                  Experience uplifting worship music and a welcoming atmosphere of praise and prayer.
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Biblical Teaching
                </h4>
                <p className="text-body-base text-neutral-700">
                  Hear expository teaching from Scripture that challenges and encourages your faith.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Community Fellowship
                </h4>
                <p className="text-body-base text-neutral-700">
                  Connect with others before and after service with light refreshments and genuine conversation.
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Inclusive Atmosphere
                </h4>
                <p className="text-body-base text-neutral-700">
                  We welcome people of all backgrounds, beliefs, and life stages to worship with us.
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  Spiritual Growth
                </h4>
                <p className="text-body-base text-neutral-700">
                  Discover resources and community to deepen your relationship with God.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h3 font-semibold text-white mb-6">
            Ready to Visit?
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            We can't wait to meet you! Come as you are and experience God's love in our community.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="bg-primary-red hover:bg-primary-dark-red"
          >
            Get Directions & More Info
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default VisitPage;
