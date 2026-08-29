import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHURCH_INFO } from '../../constants';
import { FacebookIcon, YoutubeIcon } from '../common/SocialIcons';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="relative z-10 bg-gradient-footer text-white border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.png"
                alt="Horaios Baptist Church Logo"
                className="w-12 h-12 rounded-full object-contain bg-white p-0.5"
              />
              <div>
                <h3 className="text-h6 font-bold tracking-wide">HORAIOS BAPTIST CHURCH</h3>
                <p className="text-label-sm tracking-widest text-primary-light-red uppercase">CAMBODIA</p>
              </div>
            </Link>
            <p className="text-body-sm text-white/80 mb-6">
              A community of faith serving God and loving our neighbors in Phnom Penh, Cambodia.
            </p>
            <div className="flex gap-3">
              <a
                href={CHURCH_INFO.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Horaios Baptist Church on Facebook"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={CHURCH_INFO.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to Horaios Ministry Cambodia on YouTube"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
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
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-body-sm text-white/80">Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="tel:+" className="text-body-sm text-white/80 hover:text-white transition-colors">
                  +855 (0) 23 XXX XXXX
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@horaiosbaptist.org" className="text-body-sm text-white/80 hover:text-white transition-colors">
                  info@horaiosbaptist.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-white/60">
            &copy; {currentYear} Horaios Baptist Church. All rights reserved.
          </p>
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
