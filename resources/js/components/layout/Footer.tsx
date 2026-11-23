import React, { useState } from 'react';
import { Mail, MapPin, Phone, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FacebookIcon, YoutubeIcon, TelegramIcon, InstagramIcon } from '../common/SocialIcons';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useLanguage, translate } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const { t } = useLanguage();

  const quickLinks = [
    { label: t('footer.home', 'Home'), href: '/' },
    { label: t('footer.about', 'About'), href: '/about' },
    { label: t('footer.ministries', 'Ministries'), href: '/ministries' },
    { label: t('footer.sermons', 'Sermons'), href: '/sermons' },
    { label: t('footer.songs', 'Songs'), href: '/songs' },
    { label: t('footer.events', 'Events'), href: '/events' },
    { label: t('footer.news', 'News'), href: '/news' },
    { label: t('footer.prayer_request', 'Prayer Request'), href: '/prayer' },
    { label: t('footer.visit', 'Visit'), href: '/visit' },
    { label: t('footer.give', 'Give'), href: '/give' },
    { label: t('footer.contact', 'Contact'), href: '/contact' },
  ];

  const copyrightText = settings.copyright
    ? `© ${currentYear} ${settings.copyright}`
    : translate('ui.year_name_all_rights_reserved', '© {year} {name}. All rights reserved.', { year: currentYear, name: settings.church_name });

  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="relative z-10 bg-gradient-footer text-white border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={settings.logo || '/images/logo.png'}
                alt={translate('ui.name_logo', '{name} Logo', { name: settings.church_name })}
                className="w-12 h-12 rounded-full object-contain bg-white p-0.5"
              />
              <div>
                <h3 className="text-h6 font-bold tracking-wide">{settings.church_name.toUpperCase()}</h3>
                <p className="text-label-sm tracking-widest text-primary-light-red uppercase">{t('footer.cambodia', 'CAMBODIA')}</p>
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
                  aria-label={translate('ui.follow_name_on_facebook', 'Follow {name} on Facebook', { name: settings.church_name })}
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
                  aria-label={translate('ui.subscribe_to_name_on_youtube', 'Subscribe to {name} on YouTube', { name: settings.church_name })}
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
                  aria-label={translate('ui.join_name_on_telegram', 'Join {name} on Telegram', { name: settings.church_name })}
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
                  aria-label={translate('ui.follow_name_on_instagram', 'Follow {name} on Instagram', { name: settings.church_name })}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-h6 font-semibold mb-4">{t('footer.quick_links', 'Quick Links')}</h4>
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
            <h4 className="text-h6 font-semibold mb-4">{t('footer.more_links', 'More Links')}</h4>
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
            <h4 className="text-h6 font-semibold mb-4">{t('footer.get_in_touch', 'Get In Touch')}</h4>
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
            <button
              type="button"
              onClick={() => setPolicyModal('privacy')}
              className="text-body-sm text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.privacy_policy', 'Privacy Policy')}
            </button>
            <button
              type="button"
              onClick={() => setPolicyModal('terms')}
              className="text-body-sm text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.terms_of_service', 'Terms of Service')}
            </button>
          </div>
        </div>
      </div>
    </footer>

    <Modal
      isOpen={policyModal !== null}
      onClose={() => setPolicyModal(null)}
      title={policyModal === 'privacy' ? t('footer.privacy_policy', 'Privacy Policy') : t('footer.terms_of_service', 'Terms of Service')}
      size="md"
    >
      {policyModal === 'privacy' && (
        <div className="space-y-4 text-neutral-700 text-body-sm leading-relaxed">
          <div className="flex items-center gap-3 p-3 bg-primary-red/5 rounded-xl border border-primary-red/10 text-primary-red">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p className="font-semibold text-xs uppercase tracking-wider">
              {settings.church_name || 'Horaios Baptist Church'} {t('ui.privacy_commitment', 'Privacy Commitment')}
            </p>
          </div>
          <p>
            {t('ui.we_take_your_privacy_and_confidence_seriousl', 'We take your privacy and confidence seriously. When you submit information through our website (such as contact messages, ministry applications, or prayer requests), your personal details are treated with utmost care and pastoral discretion.')}
          </p>
          <h4 className="text-body-base font-bold text-neutral-900 pt-1">{t('ui.information_collection_use', 'Information Collection & Use')}</h4>
          <p>
            {t('ui.personal_contact_details_name_email_phone_nu', 'Personal contact details (name, email, phone number) are collected only when voluntarily provided to connect you with our ministry leaders or reply to inquiries.')}
          </p>
          <h4 className="text-body-base font-bold text-neutral-900 pt-1">{t('ui.prayer_ministry_privacy', 'Prayer & Ministry Privacy')}</h4>
          <p>
            {t('ui.prayer_requests_marked_as_confidential_are_s', 'Prayer requests marked as confidential are shared exclusively with pastoral leadership and intercessory teams. We never sell, rent, or distribute personal information to external commercial third parties.')}
          </p>
          <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            {t('ui.for_questions_regarding_privacy_please_conta', 'For questions regarding privacy, please contact')} <a href={`mailto:${settings.email || 'admin@horaiosbaptist.org'}`} className="text-primary-red font-medium underline">{settings.email || 'our church office'}</a>.
          </p>
        </div>
      )}

      {policyModal === 'terms' && (
        <div className="space-y-4 text-neutral-700 text-body-sm leading-relaxed">
          <div className="flex items-center gap-3 p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-800">
            <FileText className="w-5 h-5 shrink-0 text-primary-navy" />
            <p className="font-semibold text-xs uppercase tracking-wider">
              {t('ui.terms_of_website_use', 'Terms of Website Use')}
            </p>
          </div>
          <p>
            {t('ui.welcome_to_the_official_website_of', 'Welcome to the official website of')} {settings.church_name || 'Horaios Baptist Church'}{t('ui.by_accessing_and_using_this_site_you_agree_t', '. By accessing and using this site, you agree to these terms of service.')}
          </p>
          <h4 className="text-body-base font-bold text-neutral-900 pt-1">{t('ui.content_copyright', 'Content & Copyright')}</h4>
          <p>
            {t('ui.sermon_recordings_study_notes_event_informat', 'Sermon recordings, study notes, event information, ministry details, and media published on this site are provided for personal spiritual growth, worship, and church community edification.')}
          </p>
          <h4 className="text-body-base font-bold text-neutral-900 pt-1">{t('ui.acceptable_use', 'Acceptable Use')}</h4>
          <p>
            {t('ui.visitors_may_not_use_website_contact_forms_o', 'Visitors may not use website contact forms or prayer submission services to transmit unsolicited spam, unlawful materials, or offensive content.')}
          </p>
          <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            {settings.church_name} {t('ui.reserves_the_right_to_update_these_terms_to_', 'reserves the right to update these terms to reflect church operational practices.')}
          </p>
        </div>
      )}
    </Modal>
  </>
  );
};

export default Footer;

