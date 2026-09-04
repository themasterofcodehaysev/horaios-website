import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FacebookIcon, YoutubeIcon, TelegramIcon, InstagramIcon } from '../common/SocialIcons';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Songs', href: '/songs' },
    { label: 'Events', href: '/events' },
    { label: 'News', href: '/news' },
    { label: 'Visit', href: '/visit' },
    { label: 'Give', href: '/give' },
    { label: 'Contact', href: '/contact' },
  ];

  const copyrightText = settings.copyright
    ? `© ${currentYear} ${settings.copyright}`
    : `© ${currentYear} ${settings.church_name}. All rights reserved.`;

  return (
    <footer className="relative z-10 bg-gradient-footer text-white border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={settings.logo || '/images/logo.png'}
                alt={`${settings.church_name} Logo`}
                className="w-12 h-12 rounded-full object-contain bg-white p-0.5"
              />
              <div>
                <h3 className="text-h6 font-bold tracking-wide">{settings.church_name.toUpperCase()}</h3>
                <p className="text-label-sm tracking-widest text-primary-light-red uppercase">CAMBODIA</p>
              </div>
            </Link>
            <p className="text-body-sm text-white/80 mb-6">
              {settings.footer_text}
            </p>
            <div className="flex gap-3">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${settings.church_name} on Facebook`}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Subscribe to ${settings.church_name} on YouTube`}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              )}
              {settings.telegram && (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Join ${settings.church_name} on Telegram`}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <TelegramIcon className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${settings.church_name} on Instagram`}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-h6 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-body-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Part 2 */}
          <div>
            <h4 className="text-h6 font-semibold mb-4">More Links</h4>
            <ul className="space-y-2">
              {quickLinks.slice(5).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-body-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-h6 font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-body-sm text-white/80">{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-body-sm text-white/80 hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-body-sm text-white/80 hover:text-white transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-white/60">{copyrightText}</p>
          <div className="flex gap-4">
            <Link to="#" className="text-body-sm text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-body-sm text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

