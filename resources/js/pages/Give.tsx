import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Heart } from 'lucide-react';

export const GivePage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const donationLevels = [
    { amount: 10, label: 'Seed', description: 'Plant a seed of faith' },
    { amount: 25, label: 'Nurture', description: 'Help us grow' },
    { amount: 50, label: 'Sustain', description: 'Keep ministry going' },
    { amount: 100, label: 'Launch', description: 'Help us reach further' },
    { amount: 250, label: 'Transform', description: 'Change lives' },
    { amount: 500, label: 'Impact', description: 'Make a lasting difference' },
  ];

  return (
    <Layout>
      <div className="pt-20"></div>

      <HeroSection
        title="Generous Giving"
        subtitle="Support Our Ministry"
        description="Your generosity enables us to serve our community and spread the Gospel."
        minHeight="md"
      />

      {/* Why Give */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Why Give?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">⛪</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Ministry & Outreach
              </h4>
              <p className="text-body-sm text-neutral-600">
                Your gifts fund our worship services, discipleship programs, and community outreach.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Spiritual Growth
              </h4>
              <p className="text-body-sm text-neutral-600">
                Support educational programs that help people grow in their faith and knowledge.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Community Impact
              </h4>
              <p className="text-body-sm text-neutral-600">
                Enable us to serve vulnerable populations and demonstrate Christ's love through action.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Give Online */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="lg" shadow="lg">
            <h2 className="text-h3 font-semibold text-neutral-900 mb-8 text-center">
              Make a Contribution
            </h2>

            {/* Preset Amounts */}
            <div className="mb-8">
              <p className="text-body-base font-medium text-neutral-900 mb-4">
                Select an amount or enter a custom amount:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {donationLevels.map((level) => (
                  <button
                    key={level.amount}
                    onClick={() => setSelectedAmount(level.amount)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedAmount === level.amount
                        ? 'border-primary-navy bg-primary-navy text-white'
                        : 'border-neutral-200 text-neutral-900 hover:border-primary-navy'
                    }`}
                  >
                    <div className="font-semibold">${level.amount}</div>
                    <div className="text-label-sm mt-1">{level.label}</div>
                  </button>
                ))}
              </div>

              {selectedAmount && (
                <div className="text-center mb-6 p-4 bg-primary-navy/10 rounded-lg">
                  <p className="text-h5 font-semibold text-primary-navy">
                    ${selectedAmount}
                  </p>
                  <p className="text-body-sm text-neutral-600">
                    Thank you for your generosity!
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" fullWidth className="sm:flex-1">
                <Heart className="w-5 h-5 mr-2" />
                Give via Credit Card
              </Button>
              <Button variant="default" size="lg" fullWidth className="sm:flex-1">
                Other Methods
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Other Ways to Give
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">🏦</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Bank Transfer
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Give via direct deposit or bank transfer
              </p>
              <Button variant="default" size="sm" fullWidth>
                Learn More
              </Button>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Mobile App
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Give through our mobile giving app
              </p>
              <Button variant="default" size="sm" fullWidth>
                Download
              </Button>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                Recurring Gift
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Set up automatic monthly giving
              </p>
              <Button variant="default" size="sm" fullWidth>
                Set Up
              </Button>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-4xl mb-4">💒</div>
              <h4 className="text-h6 font-semibold text-neutral-900 mb-3">
                In Person
              </h4>
              <p className="text-body-sm text-neutral-600 mb-4">
                Give during our Sunday services
              </p>
              <Button variant="default" size="sm" fullWidth>
                Visit Us
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Your Impact
          </h2>

          <Card padding="lg" shadow="lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-h4 font-bold text-primary-navy mb-2">$5</p>
                <p className="text-body-sm text-neutral-600">
                  Provides a meal for a family in need
                </p>
              </div>

              <div>
                <p className="text-h4 font-bold text-primary-navy mb-2">$25</p>
                <p className="text-body-sm text-neutral-600">
                  Supports a week of youth program activities
                </p>
              </div>

              <div>
                <p className="text-h4 font-bold text-primary-navy mb-2">$100</p>
                <p className="text-body-sm text-neutral-600">
                  Funds Bible materials for 10 children
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 text-center mb-12">
            Giving FAQs
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Is my donation tax-deductible?',
                a: 'Yes. Horaios Baptist Church is a 501(c)(3) nonprofit organization. Tax receipts are automatically sent.',
              },
              {
                q: 'Is my donation information secure?',
                a: 'All donations are processed through secure, encrypted payment gateways. We never store credit card information.',
              },
              {
                q: 'Can I give anonymously?',
                a: 'Yes. You can give anonymously during services or indicate your preference when giving online.',
              },
            ].map((faq, i) => (
              <Card key={i} padding="lg">
                <h4 className="text-h6 font-semibold text-neutral-900 mb-2">
                  {faq.q}
                </h4>
                <p className="text-body-base text-neutral-700">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GivePage;
