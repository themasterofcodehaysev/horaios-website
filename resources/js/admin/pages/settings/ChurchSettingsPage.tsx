import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { settingsService } from '../../services/settings.service';

const TABS = ['General', 'Contact', 'Social Media', 'Service Times', 'SEO', 'Localization', 'Advanced'];

export default function ChurchSettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [settings, setSettings] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getAll();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (group: string, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] || {}),
        [key]: value
      }
    }));
  };

  const handleSave = async (group: string) => {
    setSaving(true);
    setMessage(null);
    try {
      await settingsService.update(settings[group] || {});
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-64 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Church Name</label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.general?.church_name || ''}
            onChange={e => handleInputChange('general', 'church_name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.general?.short_name || ''}
            onChange={e => handleInputChange('general', 'short_name', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
               {settings.general?.logo_url ? (
                 <img src={settings.general.logo_url} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                 <Upload className="w-6 h-6 text-gray-400" />
               )}
             </div>
             <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
               {settings.general?.favicon_url ? (
                 <img src={settings.general.favicon_url} alt="Favicon" className="w-full h-full object-cover" />
               ) : (
                 <Upload className="w-6 h-6 text-gray-400" />
               )}
             </div>
             <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('general')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.contact?.address || ''}
          onChange={e => handleInputChange('contact', 'address', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.phone || ''}
            onChange={e => handleInputChange('contact', 'phone', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.email || ''}
            onChange={e => handleInputChange('contact', 'email', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.website || ''}
            onChange={e => handleInputChange('contact', 'website', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('contact')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      {['facebook', 'youtube', 'telegram', 'instagram'].map(platform => (
        <div key={platform}>
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform} URL</label>
          <input
            type="url"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.social?.[platform] || ''}
            onChange={e => handleInputChange('social', platform, e.target.value)}
            placeholder={`https://${platform}.com/...`}
          />
        </div>
      ))}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('social')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Service</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.services?.sunday_service || ''}
          onChange={e => handleInputChange('services', 'sunday_service', e.target.value)}
          placeholder="e.g. 9:00 AM & 11:30 AM"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bible Study</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.services?.bible_study || ''}
          onChange={e => handleInputChange('services', 'bible_study', e.target.value)}
          placeholder="e.g. Wednesday 7:00 PM"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Youth Meeting</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.services?.youth_meeting || ''}
          onChange={e => handleInputChange('services', 'youth_meeting', e.target.value)}
          placeholder="e.g. Friday 6:00 PM"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Meeting</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.services?.prayer_meeting || ''}
          onChange={e => handleInputChange('services', 'prayer_meeting', e.target.value)}
          placeholder="e.g. Saturday 10:00 AM"
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('services')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderSeoTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.seo?.meta_title || ''}
          onChange={e => handleInputChange('seo', 'meta_title', e.target.value)}
          placeholder="Default meta title for website"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.seo?.meta_description || ''}
          onChange={e => handleInputChange('seo', 'meta_description', e.target.value)}
          placeholder="Default meta description for SEO"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.seo?.keywords || ''}
          onChange={e => handleInputChange('seo', 'keywords', e.target.value)}
          placeholder="church, christian, worship, community"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.seo?.google_analytics || ''}
          onChange={e => handleInputChange('seo', 'google_analytics', e.target.value)}
          placeholder="e.g. G-XXXXXXXXXX"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.seo?.facebook_pixel || ''}
          onChange={e => handleInputChange('seo', 'facebook_pixel', e.target.value)}
          placeholder="e.g. XXXXXXXXXXXXXX"
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('seo')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderLocalizationTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
        <select
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.localization?.timezone || 'UTC'}
          onChange={e => handleInputChange('localization', 'timezone', e.target.value)}
        >
          <option value="UTC">UTC</option>
          <option value="Asia/Phnom_Penh">Asia/Phnom_Penh</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Los_Angeles">America/Los_Angeles</option>
          <option value="Europe/London">Europe/London</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
        <select
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.localization?.language || 'en'}
          onChange={e => handleInputChange('localization', 'language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="km">Khmer</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
        <select
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.localization?.date_format || 'Y-m-d'}
          onChange={e => handleInputChange('localization', 'date_format', e.target.value)}
        >
          <option value="Y-m-d">YYYY-MM-DD</option>
          <option value="m/d/Y">MM/DD/YYYY</option>
          <option value="d/m/Y">DD/MM/YYYY</option>
          <option value="F j, Y">Month DD, YYYY</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
        <select
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.localization?.time_format || 'H:i'}
          onChange={e => handleInputChange('localization', 'time_format', e.target.value)}
        >
          <option value="H:i">24-hour (14:30)</option>
          <option value="g:i A">12-hour (2:30 PM)</option>
        </select>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('localization')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
        <input
          type="url"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.advanced?.google_maps_url || ''}
          onChange={e => handleInputChange('advanced', 'google_maps_url', e.target.value)}
          placeholder="Embed URL for mapping"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Copyright</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.advanced?.footer_copyright || ''}
          onChange={e => handleInputChange('advanced', 'footer_copyright', e.target.value)}
          placeholder="© 2026 HORAIOS BAPTIST CHURCH"
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('advanced')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Church Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global configuration and details for the church.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm ${message.type === 'success' ? 'bg-green-50/50 text-green-800 border border-green-100' : 'bg-red-50/50 text-red-800 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-accent-blue' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue rounded-t-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{activeTab} Settings</h2>
          {activeTab === 'General' && renderGeneralTab()}
          {activeTab === 'Contact' && renderContactTab()}
          {activeTab === 'Social Media' && renderSocialTab()}
          {activeTab === 'Service Times' && renderServicesTab()}
          {activeTab === 'SEO' && renderSeoTab()}
          {activeTab === 'Localization' && renderLocalizationTab()}
          {activeTab === 'Advanced' && renderAdvancedTab()}
        </div>
      </div>
    </div>
  );
}
