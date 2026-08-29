import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, RefreshCw, AlertTriangle, ExternalLink, CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react';
import { footerService } from '../../services/footer.service';
import type { FooterSetting } from '../../types';

const FooterManagementPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, Record<string, FooterSetting>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const TABS = ['General', 'Contact', 'Social', 'Quick Links'];
  const [activeTab, setActiveTab] = useState('General');

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await footerService.getAllSettings();
      const grouped = data.reduce((acc, setting) => {
        if (!acc[setting.group]) {
          acc[setting.group] = {};
        }
        acc[setting.group][setting.key] = setting;
        return acc;
      }, {} as Record<string, Record<string, FooterSetting>>);
      setSettings(grouped);
    } catch (err: any) {
      console.error('Failed to fetch footer settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (group: string) => {
    setSaving(true);
    setMessage(null);
    try {
      const groupSettings = settings[group] || {};
      const settingsData: Record<string, string> = {};
      
      Object.entries(groupSettings).forEach(([key]) => {
        const input = document.getElementById(`footer-${key}`) as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
          settingsData[key] = input.value;
        }
      });

      await footerService.updateBatchSettings(settingsData);
      setMessage({ type: 'success', text: 'Footer settings saved successfully.' });
      fetchSettings();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to save footer settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleInitialize = async () => {
    if (!confirm('This will create default footer settings. Continue?')) return;
    try {
      await footerService.initializeDefaultSettings();
      fetchSettings();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to initialize settings');
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1">Logo URL</label>
        <input
          type="text"
          id="footer-footer_logo"
          defaultValue={settings.general?.footer_logo?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="https://example.com/logo.png"
        />
      </div>
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1">Description</label>
        <textarea
          id="footer-footer_description"
          rows={3}
          defaultValue={settings.general?.footer_description?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
          placeholder="A brief description of your church"
        />
      </div>
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1">Copyright Text</label>
        <input
          type="text"
          id="footer-footer_copyright"
          defaultValue={settings.general?.footer_copyright?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="© 2026 Your Church Name"
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button
          onClick={() => handleSave('general')}
          disabled={saving}
          className="px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1">Address</label>
        <textarea
          id="footer-footer_address"
          rows={2}
          defaultValue={settings.contact?.footer_address?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
          placeholder="123 Church Street, City, Country"
        />
      </div>
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1">Phone</label>
        <input
          type="text"
          id="footer-footer_phone"
          defaultValue={settings.contact?.footer_phone?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="+855 (0) 23 XXX XXXX"
        />
      </div>
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1">Email</label>
        <input
          type="email"
          id="footer-footer_email"
          defaultValue={settings.contact?.footer_email?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="info@yourchurch.org"
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button
          onClick={() => handleSave('contact')}
          disabled={saving}
          className="px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" /> Facebook URL
        </label>
        <input
          type="url"
          id="footer-footer_facebook"
          defaultValue={settings.social?.footer_facebook?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="https://facebook.com/yourchurch"
        />
      </div>
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" /> YouTube URL
        </label>
        <input
          type="url"
          id="footer-footer_youtube"
          defaultValue={settings.social?.footer_youtube?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="https://youtube.com/@yourchurch"
        />
      </div>
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" /> Instagram URL
        </label>
        <input
          type="url"
          id="footer-footer_instagram"
          defaultValue={settings.social?.footer_instagram?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="https://instagram.com/yourchurch"
        />
      </div>
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-1 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" /> Telegram URL
        </label>
        <input
          type="url"
          id="footer-footer_telegram"
          defaultValue={settings.social?.footer_telegram?.value || ''}
          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="https://t.me/yourchurch"
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button
          onClick={() => handleSave('social')}
          disabled={saving}
          className="px-4 py-2.5 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );

  const renderQuickLinksTab = () => (
    <div className="space-y-6">
      <div className="bg-neutral-50 rounded-lg p-4">
        <p className="text-body-sm text-neutral-600 mb-2">
          Quick links are managed through the Navigation menu. Configure your footer navigation menu in the Navigation section.
        </p>
        <a
          href="/admin/navigation"
          className="inline-flex items-center gap-2 text-primary-red hover:underline text-body-sm font-medium"
        >
          <LinkIcon className="w-4 h-4" /> Go to Navigation Settings
        </a>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-neutral-200 rounded-lg w-1/3"></div>
        <div className="h-64 bg-neutral-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Footer Management</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage footer content, contact information, and social links.
          </p>
        </div>
        <button
          onClick={handleInitialize}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-sm font-medium hover:bg-neutral-50 shadow-xs"
        >
          <RefreshCw className="w-4 h-4" /> Initialize Defaults
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${
          message.type === 'success' 
            ? 'bg-green-50/50 text-green-800 border border-green-100' 
            : 'bg-red-50/50 text-red-800 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-neutral-100 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-primary-red' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-red rounded-t-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">{activeTab} Settings</h2>
          {activeTab === 'General' && renderGeneralTab()}
          {activeTab === 'Contact' && renderContactTab()}
          {activeTab === 'Social' && renderSocialTab()}
          {activeTab === 'Quick Links' && renderQuickLinksTab()}
        </div>
      </div>
    </div>
  );
};

export default FooterManagementPage;
