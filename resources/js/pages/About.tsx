import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections';
import { Button } from '../components/ui/Button';
import { 
  Target, 
  Heart, 
  Mail, 
  Globe, 
  User, 
  Phone, 
  Loader2, 
  BookOpen, 
  Users, 
  Church, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  Award
} from 'lucide-react';
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

      {/* Our Story & Journey Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
            
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold">
                <Church className="w-4 h-4" />
                Our Journey of Faith
              </div>
              <h2 className="text-display-md font-extrabold text-neutral-900 leading-tight">
                Rooted in Scripture, Growing in Grace
              </h2>
              <p className="text-body-lg text-neutral-700 leading-relaxed">
                {settings.footer_text || 'Founded in faith and rooted in Scripture, Horaios Baptist Church is dedicated to worshiping God, discipling believers, and demonstrating the transformative love of Jesus Christ across Cambodia.'}
              </p>
              <p className="text-body-base text-neutral-600 leading-relaxed">
                What began as a small prayer gathering of faithful believers has grown into a vibrant church family. Through seasons of growth and challenge, our central anchor remains steadfast: to know Christ and make Him known through biblical preaching, authentic community, and compassionate outreach.
              </p>
              <p className="text-body-base text-neutral-600 leading-relaxed">
                We believe that every person—regardless of their background—has immense value in God's eyes and is invited to experience His unfailing grace and purpose.
              </p>
            </div>

            {/* Visual Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-elevation-lg aspect-[4/3] bg-neutral-100 border border-neutral-200/60">
                <img 
                  src={placeholderImage(600, 450, 'Church Building & Worship')} 
                  alt="Horaios Baptist Church Sanctuary" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-sm">
                  <p className="text-label-md font-bold text-neutral-900">Horaios Baptist Church</p>
                  <p className="text-caption text-primary-red font-semibold">Phnom Penh, Cambodia</p>
                </div>
              </div>
            </div>

          </div>

          {/* Timeline Milestones */}
          <div className="bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/80">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-h4 font-bold text-neutral-900">Milestones of God's Faithfulness</h3>
              <p className="text-body-sm text-neutral-600 mt-1">Key moments in the story of Horaios Baptist Church</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-primary-red/10 text-primary-red text-caption font-extrabold">2018</span>
                  <h4 className="text-h6 font-bold text-neutral-900 mt-3 mb-1">Founding Prayer</h4>
                  <p className="text-body-sm text-neutral-600 leading-relaxed">
                    A small group begins meeting for prayer, Bible study, and Gospel fellowship.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-primary-navy/10 text-primary-navy text-caption font-extrabold">2020</span>
                  <h4 className="text-h6 font-bold text-neutral-900 mt-3 mb-1">Weekly Worship</h4>
                  <p className="text-body-sm text-neutral-600 leading-relaxed">
                    Regular Sunday services launch with dedicated children's and youth ministries.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 text-caption font-extrabold">2023</span>
                  <h4 className="text-h6 font-bold text-neutral-900 mt-3 mb-1">Community Outreach</h4>
                  <p className="text-body-sm text-neutral-600 leading-relaxed">
                    Expansion of local mercy ministries, small groups, and community blessing projects.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 text-caption font-extrabold">Today & Beyond</span>
                  <h4 className="text-h6 font-bold text-neutral-900 mt-3 mb-1">Multiplying Disciples</h4>
                  <p className="text-body-sm text-neutral-600 leading-relaxed">
                    Training next-generation leaders and sharing Christ's love throughout the nation.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Core Values & Biblical Foundations */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
              <Award className="w-3.5 h-3.5" />
              What We Believe & Value
            </div>
            <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
              Our Core Biblical Values
            </h2>
            <p className="text-body-lg text-neutral-600 mt-3">
              These fundamental convictions shape our worship, relationships, and mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-elevation-sm hover:border-primary-red/40 hover:shadow-elevation-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-red/10 text-primary-red flex items-center justify-center mb-5">
                  <Church className="w-6 h-6" />
                </div>
                <h3 className="text-h5 font-bold text-neutral-900 mb-2">
                  Christ-Centered
                </h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed mb-4">
                  Jesus Christ is the cornerstone, head, and supreme focus of everything we do.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 text-caption font-bold text-primary-red">
                Colossians 1:18
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-elevation-sm hover:border-primary-navy/40 hover:shadow-elevation-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-navy/10 text-primary-navy flex items-center justify-center mb-5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-h5 font-bold text-neutral-900 mb-2">
                  Bible-Rooted
                </h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed mb-4">
                  God's inspired Word is our supreme authority for truth, doctrine, and living.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 text-caption font-bold text-primary-navy">
                2 Timothy 3:16-17
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-elevation-sm hover:border-amber-500/40 hover:shadow-elevation-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-h5 font-bold text-neutral-900 mb-2">
                  Authentic Fellowship
                </h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed mb-4">
                  We cultivate honest, supportive relationships that encourage spiritual maturity.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 text-caption font-bold text-amber-700">
                Acts 2:42-47
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-elevation-sm hover:border-emerald-500/40 hover:shadow-elevation-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-5">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-h5 font-bold text-neutral-900 mb-2">
                  Gospel Mission
                </h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed mb-4">
                  Passionate about proclaiming Christ's love locally and empowering disciples globally.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 text-caption font-bold text-emerald-700">
                Matthew 28:19-20
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission Statements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-gradient-to-br from-primary-red/5 to-primary-red/10 rounded-3xl p-8 sm:p-10 border-2 border-primary-red/20 shadow-elevation-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary-red text-white flex items-center justify-center mb-6 shadow-elevation-md">
                  <Target className="w-7 h-7" />
                </div>
                <span className="text-caption font-bold text-primary-red uppercase tracking-wider">Our Aspiration</span>
                <h3 className="text-h3 font-bold text-neutral-900 mt-1 mb-4">
                  Our Vision
                </h3>
                <p className="text-body-lg text-neutral-700 leading-relaxed">
                  To be a thriving, multiplying community of faithful believers who passionately love Jesus, embody biblical truth, and transform cities and families through the Gospel.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-primary-red/20 flex items-center gap-2 text-primary-red font-semibold text-body-sm">
                <CheckCircle2 className="w-4 h-4" /> Rooted in the Great Commission
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-navy/5 to-primary-navy/10 rounded-3xl p-8 sm:p-10 border-2 border-primary-navy/20 shadow-elevation-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary-navy text-white flex items-center justify-center mb-6 shadow-elevation-md">
                  <Heart className="w-7 h-7" />
                </div>
                <span className="text-caption font-bold text-primary-navy uppercase tracking-wider">Our Daily Calling</span>
                <h3 className="text-h3 font-bold text-neutral-900 mt-1 mb-4">
                  Our Mission
                </h3>
                <p className="text-body-lg text-neutral-700 leading-relaxed">
                  To glorify God by proclaiming the Gospel of Jesus Christ, nurturing believers in biblical discipleship, and extending compassionate care to our neighbors and the world.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-primary-navy/20 flex items-center gap-2 text-primary-navy font-semibold text-body-sm">
                <CheckCircle2 className="w-4 h-4" /> Living out the Great Commandment
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section id="leadership" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
              <User className="w-3.5 h-3.5" />
              Pastoral Care & Guidance
            </div>
            <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
              Our Leadership Team
            </h2>
            <p className="text-body-lg text-neutral-600 mt-3">
              Serving God's flock with humility, biblical dedication, and pastoral love.
            </p>
          </div>

          {loadingLeaders ? (
            <div className="py-16 flex justify-center items-center gap-3 text-neutral-500">
              <Loader2 className="w-7 h-7 animate-spin text-primary-red" />
              <span className="text-body-base font-medium">Loading leadership team...</span>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-body-base">
              No leadership members published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {leaders.map((leader) => (
                <div 
                  key={leader.id} 
                  className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-elevation-sm hover:shadow-elevation-xl hover:border-primary-red/30 transition-all duration-300 flex flex-col"
                >
                  {/* Portrait & Image Container */}
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                    {leader.photo ? (
                      <img
                        src={getImageUrl(leader.photo)}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                        <User className="w-16 h-16 opacity-40" />
                        <span className="text-[11px] font-semibold text-neutral-400 mt-2">Pastoral Leader</span>
                      </div>
                    )}

                    {/* Gradient scrim for readable badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-30 transition-opacity duration-300" />

                    {/* Quick Role Badge at bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white transition-transform duration-300 group-hover:translate-y-1 group-hover:opacity-0">
                      <div>
                        <p className="text-xs font-bold leading-tight drop-shadow-sm">{leader.name}</p>
                        <p className="text-[10px] uppercase font-semibold text-white/80 tracking-wider drop-shadow-sm">{leader.role}</p>
                      </div>
                    </div>

                    {/* Interactive Hover Reveal Drawer - Pure Primary Red */}
                    <div className="absolute inset-0 bg-primary-red/95 text-white p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider mb-2">
                          {leader.role}
                        </span>
                        <h4 className="text-body-base font-bold text-white leading-snug">
                          {leader.name}
                        </h4>
                        <div className="w-8 h-0.5 bg-white/40 my-2.5 rounded-full" />
                        <p className="text-xs text-white/90 leading-relaxed line-clamp-6 font-normal">
                          {leader.bio || "Dedicated servant of Christ Jesus, fostering discipleship and spiritual growth within the church family."}
                        </p>
                      </div>

                      {/* Contact Quick Bar */}
                      <div className="pt-3 border-t border-white/20 flex items-center gap-2">
                        {leader.email && (
                          <a
                            href={`mailto:${leader.email}`}
                            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-primary-red flex items-center justify-center transition-colors shadow-xs"
                            title={`Email ${leader.name}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {leader.phone && (
                          <a
                            href={`tel:${leader.phone}`}
                            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-primary-red flex items-center justify-center transition-colors shadow-xs"
                            title={`Call ${leader.name}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {leader.facebook && (
                          <a
                            href={leader.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-primary-red flex items-center justify-center transition-colors shadow-xs"
                            title="Facebook Profile"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <span className="text-[10px] text-white/80 ml-auto font-semibold tracking-wide">
                          Reach Out →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Bottom Card Footer (Visible when not hovering) */}
                  <div className="p-4 bg-white flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h4 className="text-body-sm font-bold text-neutral-900 truncate group-hover:text-primary-red transition-colors">
                        {leader.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-primary-red uppercase tracking-wider truncate mt-0.5">
                        {leader.role}
                      </p>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-primary-red/10 text-neutral-400 group-hover:text-primary-red flex items-center justify-center flex-shrink-0 transition-colors">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Visitor Guide / What to Expect on Sunday */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-red/10 text-primary-red text-label-sm uppercase tracking-wider font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              First Time Visiting?
            </div>
            <h2 className="text-display-md font-bold text-neutral-900 tracking-tight">
              What to Expect on Sunday
            </h2>
            <p className="text-body-lg text-neutral-600 mt-3">
              We know visiting a new church can feel intimidating. Here is what you can look forward to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-primary-red/10 text-primary-red flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-h6 font-bold text-neutral-900 mb-2">Warm Welcome</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                Friendly greeters are ready to welcome you, answer questions, and help you find a comfortable seat.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-primary-navy/10 text-primary-navy flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-h6 font-bold text-neutral-900 mb-2">Inspiring Worship</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                A blended worship service of modern praise and hymns, followed by faithful biblical preaching.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-h6 font-bold text-neutral-900 mb-2">Come As You Are</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                There is no formal dress code. Casual, comfortable, or traditional attire are all welcomed equally.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-h6 font-bold text-neutral-900 mb-2">Kids & Family Care</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                Safe and engaging children's classes staffed by loving, background-checked teachers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Join Our Faith Community CTA */}
      <section className="py-20 bg-gradient-hero text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-caption uppercase tracking-wider font-bold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> You Are Always Welcome
          </div>
          <h2 className="text-display-lg font-bold text-white mb-6">
            Join Us This Sunday
          </h2>
          <p className="text-body-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you have questions about faith or are looking for a spiritual home in Cambodia, our church family is excited to meet you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-white text-primary-dark-red font-bold hover:bg-neutral-100 shadow-elevation-md"
              onClick={() => navigate('/visit')}
            >
              Plan Your Visit This Sunday
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              className="bg-white text-primary-red font-bold border border-white hover:bg-white/90 hover:text-primary-dark-red shadow-elevation-md"
              onClick={() => navigate('/contact')}
            >
              Contact Church Office
            </Button>
          </div>
        </div>

        {/* Decorative blur backdrop */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-black/20 rounded-full blur-3xl pointer-events-none" />
      </section>
    </Layout>
  );
};

export default AboutPage;

