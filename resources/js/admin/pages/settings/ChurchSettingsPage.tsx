import { useState, useEffect } from 'react';
import {
  Save, Loader2, CheckCircle2, AlertCircle, QrCode, Heart,
  CreditCard, RefreshCw, Building2, Smartphone, DollarSign, Info
} from 'lucide-react';
import { settingsService } from '../../services/settings.service';
import ImageUpload from '../../components/ui/ImageUpload';

const TABS = ['General', 'Contact', 'Giving', 'Social Media', 'System', 'Advanced'];

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
          <ImageUpload
            value={settings.general?.logo || ''}
            onChange={url => handleInputChange('general', 'logo', url)}
            folder="general"
            label="Logo"
            helperText="Upload the church logo (PNG/SVG recommended)."
          />
        </div>
        <div>
          <ImageUpload
            value={settings.general?.favicon || ''}
            onChange={url => handleInputChange('general', 'favicon', url)}
            folder="general"
            label="Favicon"
            helperText="Upload the favicon (ICO or PNG, 32×32)."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
        <textarea
          rows={2}
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.general?.footer_text || ''}
          onChange={e => handleInputChange('general', 'footer_text', e.target.value)}
          placeholder="Footer text description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Copyright</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.general?.copyright || ''}
          onChange={e => handleInputChange('general', 'copyright', e.target.value)}
          placeholder="© 2026 HORAIOS BAPTIST CHURCH"
        />
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.website || ''}
            onChange={e => handleInputChange('contact', 'website', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.google_map_url || ''}
            onChange={e => {
              let val = e.target.value.trim();
              const srcMatch = val.match(/src="([^"]+)"/);
              if (srcMatch) val = srcMatch[1];
              handleInputChange('contact', 'google_map_url', val);
            }}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-xs text-gray-500 mt-1">Use the embed URL or paste the full iframe code from Google Maps Share &gt; Embed a map</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Directions URL</label>
          <input
            type="url"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.google_map_directions_url || ''}
            onChange={e => handleInputChange('contact', 'google_map_directions_url', e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
          />
          <p className="text-xs text-gray-500 mt-1">Use the short URL for directions (opens in new tab)</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.latitude || ''}
            onChange={e => handleInputChange('contact', 'latitude', e.target.value)}
            placeholder="11.5564"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
            value={settings.contact?.longitude || ''}
            onChange={e => handleInputChange('contact', 'longitude', e.target.value)}
            placeholder="104.9282"
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

  const renderGivingTab = () => (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-sm text-blue-900 flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-700 shrink-0">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-blue-950 mb-0.5">Generous Giving & Receiving Account Configuration</h4>
          <p className="text-blue-800/80 text-xs leading-relaxed">
            Configure the receiving accounts and settings for all 4 giving channels: <strong>One-Time Card</strong>, <strong>Monthly Recurring</strong>, <strong>Bank Transfer</strong>, and <strong>Mobile Banking</strong>.
            These details will be displayed to church members and online donors on the public <strong>Generous Giving</strong> page.
          </p>
        </div>
      </div>

      {/* Global Status & Currencies */}
      <div className="p-5 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span>General Giving Configuration</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Overall Online Giving Status
            </label>
            <select
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm bg-white"
              value={settings.giving?.giving_enabled ?? 'true'}
              onChange={e => handleInputChange('giving', 'giving_enabled', e.target.value)}
            >
              <option value="true">Enabled (Accept Contributions Online)</option>
              <option value="false">Disabled (Temporarily Pause Online Giving)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Accepted Currencies
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm bg-white"
              value={settings.giving?.giving_currency || ''}
              onChange={e => handleInputChange('giving', 'giving_currency', e.target.value)}
              placeholder="e.g. USD / KHR"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            General Offering Note & Tax Receipt Notice
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm bg-white"
            value={settings.giving?.giving_note || ''}
            onChange={e => handleInputChange('giving', 'giving_note', e.target.value)}
            placeholder="Notice regarding tax receipts, thank you message, or inquiries contact..."
          />
        </div>
      </div>

      {/* 1. One-Time Card Giving Channel */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-red/10 text-primary-red flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">1. One-Time Card Giving Channel</h4>
              <p className="text-xs text-gray-500">Credit or debit card processing (Visa, Mastercard, UnionPay)</p>
            </div>
          </div>
          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
            Credit / Debit Card
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Merchant / Receiving Account Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_onetime_merchant_name || ''}
              onChange={e => handleInputChange('giving', 'giving_onetime_merchant_name', e.target.value)}
              placeholder="e.g. Horaios Baptist Church Online"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              External One-Time Portal Link (Optional)
            </label>
            <input
              type="url"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_onetime_portal_url || ''}
              onChange={e => handleInputChange('giving', 'giving_onetime_portal_url', e.target.value)}
              placeholder="https://donate.stripe.com/... or https://giving.tithe.ly/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            One-Time Card Giving Notes / Security Guidelines
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
            value={settings.giving?.giving_onetime_notes || ''}
            onChange={e => handleInputChange('giving', 'giving_onetime_notes', e.target.value)}
            placeholder="e.g. 256-bit SSL encrypted. Digital receipts sent automatically to donor email."
          />
        </div>
      </div>

      {/* 2. Monthly Recurring Giving Channel */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">2. Monthly Recurring Giving Channel</h4>
              <p className="text-xs text-gray-500">Scheduled monthly partnership & automatic standing gifts</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
            Monthly Recurring
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Recurring Receiving Account / Fund Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_recurring_account_name || ''}
              onChange={e => handleInputChange('giving', 'giving_recurring_account_name', e.target.value)}
              placeholder="e.g. Horaios Baptist Church - Monthly Stewardship"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Recurring Standing Order Reference / Code
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_recurring_standing_order_ref || ''}
              onChange={e => handleInputChange('giving', 'giving_recurring_standing_order_ref', e.target.value)}
              placeholder="e.g. MONTHLY-TITHE-[NAME]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            External Recurring Subscription URL (Optional)
          </label>
          <input
            type="url"
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
            value={settings.giving?.giving_recurring_portal_url || ''}
            onChange={e => handleInputChange('giving', 'giving_recurring_portal_url', e.target.value)}
            placeholder="https://giving.tithe.ly/recurring/... or https://donorbox.org/..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Recurring Giving Instructions & Setup Guide
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
            value={settings.giving?.giving_recurring_instructions || ''}
            onChange={e => handleInputChange('giving', 'giving_recurring_instructions', e.target.value)}
            placeholder="Instructions for donors to schedule recurring standing transfers in their banking app or card..."
          />
        </div>
      </div>

      {/* 3. Bank Transfer Channel */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">3. Bank Transfer & Wire Information</h4>
              <p className="text-xs text-gray-500">Direct deposit, local ACH, and international SWIFT wire transfers</p>
            </div>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
            Bank Transfer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Beneficiary Account Name <span className="text-primary-red">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_bank_account_name || settings.giving?.giving_account_name || ''}
              onChange={e => {
                handleInputChange('giving', 'giving_bank_account_name', e.target.value);
                handleInputChange('giving', 'giving_account_name', e.target.value);
              }}
              placeholder="e.g. HORAIOS BAPTIST CHURCH"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bank / Financial Institution Name <span className="text-primary-red">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_bank_name || ''}
              onChange={e => handleInputChange('giving', 'giving_bank_name', e.target.value)}
              placeholder="e.g. ABA Bank / Canadia Bank"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              USD Account Number <span className="text-primary-red">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm font-mono"
              value={settings.giving?.giving_bank_account_number_usd || settings.giving?.giving_account_number || ''}
              onChange={e => {
                handleInputChange('giving', 'giving_bank_account_number_usd', e.target.value);
                handleInputChange('giving', 'giving_account_number', e.target.value);
              }}
              placeholder="e.g. 001 234 567"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              KHR (Riel) Account Number
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm font-mono"
              value={settings.giving?.giving_bank_account_number_khr || ''}
              onChange={e => handleInputChange('giving', 'giving_bank_account_number_khr', e.target.value)}
              placeholder="e.g. 001 234 568"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              SWIFT / BIC Code
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm font-mono"
              value={settings.giving?.giving_bank_swift_code || ''}
              onChange={e => handleInputChange('giving', 'giving_bank_swift_code', e.target.value)}
              placeholder="e.g. ABACXXPP"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bank Branch & Physical Address
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_bank_branch || ''}
              onChange={e => handleInputChange('giving', 'giving_bank_branch', e.target.value)}
              placeholder="e.g. BKK3 Branch, St 348, Phnom Penh 12304, Cambodia"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Wire Transfer Memo / Reference Template
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
              value={settings.giving?.giving_bank_wire_memo || ''}
              onChange={e => handleInputChange('giving', 'giving_bank_wire_memo', e.target.value)}
              placeholder="e.g. [Your Name] - Tithe/Offering"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Bank Transfer & Wire Instructions
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
            value={settings.giving?.giving_bank_instructions || ''}
            onChange={e => handleInputChange('giving', 'giving_bank_instructions', e.target.value)}
            placeholder="Detailed instructions for domestic and international wire transfers..."
          />
        </div>
      </div>

      {/* 4. Mobile Banking & KHQR Channel */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">4. Mobile Banking & QR Code Channel</h4>
              <p className="text-xs text-gray-500">ABA Mobile, Bakong, Wing, Acleda, and KHQR mobile scan</p>
            </div>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-medium">
            Mobile Banking
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUpload
              value={settings.giving?.giving_qr_image || ''}
              onChange={url => handleInputChange('giving', 'giving_qr_image', url)}
              folder="giving"
              label="Banking KHQR Code Image"
              helperText="Upload the official KHQR / Bakong / ABA QR code image for members to scan on mobile."
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Supported Mobile Apps / Providers
              </label>
              <input
                type="text"
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
                value={settings.giving?.giving_mobile_provider || ''}
                onChange={e => handleInputChange('giving', 'giving_mobile_provider', e.target.value)}
                placeholder="e.g. ABA Mobile, Bakong, Wing, Acleda"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mobile Account Beneficiary Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
                value={settings.giving?.giving_mobile_account_name || settings.giving?.giving_account_name || ''}
                onChange={e => handleInputChange('giving', 'giving_mobile_account_name', e.target.value)}
                placeholder="e.g. HORAIOS BAPTIST CHURCH"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile Account / Bakong ID
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm font-mono"
                  value={settings.giving?.giving_mobile_account_number || settings.giving?.giving_account_number || ''}
                  onChange={e => handleInputChange('giving', 'giving_mobile_account_number', e.target.value)}
                  placeholder="e.g. 001 234 567"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Payee Contact Phone
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
                  value={settings.giving?.giving_mobile_phone || ''}
                  onChange={e => handleInputChange('giving', 'giving_mobile_phone', e.target.value)}
                  placeholder="e.g. +855 23 888 999"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Mobile Banking Step-by-Step Instructions
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue text-sm"
            value={settings.giving?.giving_mobile_instructions || settings.giving?.giving_instructions || ''}
            onChange={e => {
              handleInputChange('giving', 'giving_mobile_instructions', e.target.value);
              handleInputChange('giving', 'giving_instructions', e.target.value);
            }}
            placeholder="1. Open ABA Mobile, Bakong, or Wing...&#10;2. Tap Transfer or Scan KHQR...&#10;3. Enter account or scan QR..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('giving')}
          disabled={saving}
          className="bg-accent-blue hover:bg-[#152752] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 font-medium text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Giving Settings
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


  const renderLocalizationTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
        <select
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.system?.timezone || 'UTC'}
          onChange={e => handleInputChange('system', 'timezone', e.target.value)}
        >
          <option value="UTC">UTC</option>
          <option value="Asia/Phnom_Penh">Asia/Phnom_Penh</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Los_Angeles">America/Los_Angeles</option>
          <option value="Europe/London">Europe/London</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
        <select
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.system?.default_language || 'en'}
          onChange={e => handleInputChange('system', 'default_language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="km">Khmer</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => handleSave('system')}
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
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="maintenance_mode"
          checked={settings.advanced?.maintenance_mode === 'true'}
          onChange={e => handleInputChange('advanced', 'maintenance_mode', e.target.checked ? 'true' : 'false')}
          className="w-4 h-4 text-accent-blue border-gray-300 rounded focus:ring-accent-blue"
        />
        <label htmlFor="maintenance_mode" className="text-sm font-medium text-gray-700">Maintenance Mode</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.advanced?.maintenance_message || ''}
          onChange={e => handleInputChange('advanced', 'maintenance_message', e.target.value)}
          placeholder="Message to show during maintenance"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Analytics ID</label>
        <input
          type="text"
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue"
          value={settings.advanced?.analytics_id || ''}
          onChange={e => handleInputChange('advanced', 'analytics_id', e.target.value)}
          placeholder="e.g. G-XXXXXXXXXX"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
        <textarea
          rows={5}
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue font-mono text-sm"
          value={settings.advanced?.custom_css || ''}
          onChange={e => handleInputChange('advanced', 'custom_css', e.target.value)}
          placeholder="/* Custom CSS styles */"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom JavaScript</label>
        <textarea
          rows={5}
          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-accent-blue focus:border-accent-blue font-mono text-sm"
          value={settings.advanced?.custom_js || ''}
          onChange={e => handleInputChange('advanced', 'custom_js', e.target.value)}
          placeholder="// Custom JavaScript code"
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
          {activeTab === 'Giving' && renderGivingTab()}
          {activeTab === 'Social Media' && renderSocialTab()}
          {activeTab === 'System' && renderLocalizationTab()}
          {activeTab === 'Advanced' && renderAdvancedTab()}
        </div>
      </div>
    </div>
  );
}
