import React from 'react';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { IconRenderer } from '../components/ui/IconRenderer';

export const VisitPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  const googleMapUrl = settings.google_map_url || '';
  const googleMapDirectionsUrl = settings.google_map_directions_url || '';
  const address = settings.address || 'Phnom Penh, Cambodia';
  const phone = settings.phone || '';
  const email = settings.email || '';

  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title={t('visit.hero.title', 'Plan Your Visit')}
        subtitle={t('visit.hero.subtitle', 'Welcome')}
        description={t('visit.hero.desc', 'Everything you need to know before your first visit to Horaios Baptist Church.')}
        minHeight="md"
      />

      {/* Service Times */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            {t('visit.service_times', 'Service Times')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(settings.parsedServiceTimes || [])
              .filter((item) => !item.status || item.status === 'active')
              .map((item, idx) => (
              <Card key={item.id ?? idx} padding="lg" className="border-l-4 border-primary-red hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-red/10 text-primary-red flex items-center justify-center flex-shrink-0 text-lg">
                    <IconRenderer
                      icon={item.icon}
                      fallback={<Clock className="w-6 h-6 text-primary-red" />}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-h6 font-semibold text-neutral-900 mb-0.5 truncate" title={item.title || item.day}>
                      {item.title || item.day}
                    </h3>
                    <p className="text-body-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      {item.day}
                    </p>
                    <p className="text-body-base font-bold text-primary-red mb-1">
                      {item.time}
                    </p>
                    <p className="text-body-sm text-neutral-600 line-clamp-2" title={item.description || item.type}>
                      {item.description || item.type}
                    </p>
                    {item.location && (
                      <p className="text-caption text-neutral-500 mt-2 flex items-center gap-1.5 pt-2 border-t border-neutral-100">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Directions */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Google Map */}
            <div className="rounded-lg overflow-hidden h-96 bg-neutral-200">
              {googleMapUrl ? (
                <iframe
                  src={googleMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('ui.horaios_baptist_church_location', 'Horaios Baptist Church Location')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-neutral-600">{t('ui.map_loading', 'Map loading...')}</p>
                </div>
              )}
            </div>

            {/* Location Info */}
            <div>
              <h2 className="text-h3 font-semibold text-neutral-900 mb-6">
                {t('visit.location_contact', 'Location & Contact')}
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">{t('visit.address', 'Address')}</p>
                    <p className="text-body-base text-neutral-600">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">{t('visit.phone', 'Phone')}</p>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-body-base text-primary-red hover:text-primary-dark-red">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">{t('visit.email', 'Email')}</p>
                    <a href={`mailto:${email}`} className="text-body-base text-primary-red hover:text-primary-dark-red">
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {googleMapDirectionsUrl && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mb-4"
                  onClick={() => window.open(googleMapDirectionsUrl, '_blank')}
                >
                  {t('visit.get_directions', 'Get Directions')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Amenities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            {t('visit.facilities', 'Our Facilities')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">👶</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                {t('visit.nursery_title', 'Nursery & Childcare')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('visit.nursery_desc', 'Infant through age 3 care available during services')}
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🧒</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                {t('visit.children_title', "Children's Ministry")}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('visit.children_desc', 'Age-appropriate classes and activities during services')}
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">♿</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                {t('visit.accessibility_title', 'Accessibility')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('visit.accessibility_desc', 'Wheelchair accessible facilities and reserved seating')}
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🅿️</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                {t('visit.parking_title', 'Parking')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('visit.parking_desc', 'Ample free parking available for all guests')}
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                {t('visit.fellowship_title', 'Fellowship Hall')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('visit.fellowship_desc', 'Space for events, meals, and community gatherings')}
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">📶</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                {t('visit.wifi_title', 'WiFi Available')}
              </h4>
              <p className="text-body-sm text-neutral-600">
                {t('visit.wifi_desc', 'Free wireless internet throughout the facility')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            {t('visit.what_to_expect', 'What to Expect')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('visit.expect_welcome_title', 'Warm Welcome')}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {t('visit.expect_welcome_desc', "You'll be greeted by friendly volunteers who can answer questions and help you get oriented.")}
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('visit.expect_worship_title', 'Contemporary Worship')}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {t('visit.expect_worship_desc', 'Experience uplifting worship music and a welcoming atmosphere of praise and prayer.')}
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('visit.expect_teaching_title', 'Biblical Teaching')}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {t('visit.expect_teaching_desc', 'Hear expository teaching from Scripture that challenges and encourages your faith.')}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('visit.expect_fellowship_title', 'Community Fellowship')}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {t('visit.expect_fellowship_desc', 'Connect with others before and after service with light refreshments and genuine conversation.')}
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('visit.expect_inclusive_title', 'Inclusive Atmosphere')}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {t('visit.expect_inclusive_desc', 'We welcome people of all backgrounds, beliefs, and life stages to worship with us.')}
                </p>
              </div>

              <div>
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {t('visit.expect_growth_title', 'Spiritual Growth')}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {t('visit.expect_growth_desc', 'Discover resources and community to deepen your relationship with God.')}
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
            {t('visit.cta_title', 'Ready to Visit?')}
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            {t('visit.cta_desc', "We can't wait to meet you! Come as you are and experience God's love in our community.")}
          </p>
          <Button
            variant="default"
            size="lg"
            className="bg-white text-primary-red hover:bg-neutral-100 font-bold shadow-lg transition-all"
            onClick={() => {
              if (googleMapDirectionsUrl) {
                window.open(googleMapDirectionsUrl, '_blank');
              } else if (googleMapUrl) {
                window.open(googleMapUrl, '_blank');
              } else {
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }
            }}
          >
            {t('visit.cta_button', 'Get Directions & More Info')}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default VisitPage;
