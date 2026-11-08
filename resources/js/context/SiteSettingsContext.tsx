import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ServiceTimeItem {
  id?: number;
  day: string;
  time: string;
  type: string;
  title?: string;
  location?: string | null;
  description?: string | null;
  icon?: string | null;
}

export interface SiteSettings {
  church_name: string;
  short_name: string;
  logo: string;
  favicon: string;
  footer_text: string;
  copyright: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  google_map_url: string;
  google_map_directions_url: string;
  latitude: string;
  longitude: string;
  facebook: string;
  youtube: string;
  telegram: string;
  instagram: string;
  service_times: string;
  service_location: string;
  pastor_name: string;
  parsedServiceTimes: ServiceTimeItem[];
  // Giving & Online Contribution Settings
  giving_enabled?: boolean | string;
  giving_currency?: string;
  giving_note?: string;

  // 1. One-Time Card Giving
  giving_onetime_card_enabled?: boolean | string;
  giving_onetime_merchant_name?: string;
  giving_onetime_portal_url?: string;
  giving_onetime_notes?: string;

  // 2. Monthly Recurring Giving
  giving_recurring_enabled?: boolean | string;
  giving_recurring_account_name?: string;
  giving_recurring_portal_url?: string;
  giving_recurring_standing_order_ref?: string;
  giving_recurring_instructions?: string;

  // 3. Bank Transfer (Wire / Direct Deposit)
  giving_bank_name?: string;
  giving_account_name?: string;
  giving_account_number?: string;
  giving_bank_account_name?: string;
  giving_bank_account_number_usd?: string;
  giving_bank_account_number_khr?: string;
  giving_bank_swift_code?: string;
  giving_bank_branch?: string;
  giving_bank_wire_memo?: string;
  giving_bank_instructions?: string;

  // 4. Mobile Banking & QR Code
  giving_qr_image?: string;
  giving_mobile_provider?: string;
  giving_mobile_account_name?: string;
  giving_mobile_account_number?: string;
  giving_mobile_phone?: string;
  giving_instructions?: string;
  giving_mobile_instructions?: string;
  giving_online_url?: string;
}

const defaultSettings: SiteSettings = {
  church_name: "Horaios Baptist Church",
  short_name: "Horaios Church",
  logo: "/images/logo.png",
  favicon: "/images/logo.png",
  footer_text: "Established to be the sign, symbol, and instrument of the Kingdom of God in Cambodia.",
  copyright: "",
  address: "House No: 9L, Street 3BT Chamreun Phal-1, Sangkat Boeung Tompun, Khan Meanchey, Phnom Penh, Cambodia",
  phone: "",
  email: "",
  website: "",
  google_map_url: "",
  google_map_directions_url: "",
  latitude: "",
  longitude: "",
  facebook: "https://www.facebook.com/profile.php?id=61583373172735",
  youtube: "https://www.youtube.com/@horaiosministrycambodia7430",
  telegram: "",
  instagram: "",
  service_times: "",
  service_location: "",
  pastor_name: "",
  parsedServiceTimes: [
    { title: "Main Sunday Worship", day: "Sunday Morning", time: "9:00 AM & 11:00 AM", type: "Main Worship Service", status: "active" },
    { title: "Mid-Week Prayer & Bible Study", day: "Wednesday Evening", time: "7:00 PM - 8:30 PM", type: "Prayer & Discipleship", status: "active" },
    { title: "Youth Fellowship & Worship", day: "Saturday Afternoon", time: "2:30 PM - 4:30 PM", type: "Youth & Students", status: "active" },
  ],
  giving_enabled: true,
  giving_currency: "USD / KHR",
  giving_note: "Your faithful giving empowers our Sunday services, community outreach programs, and Gospel ministries.",

  // 1. One-Time Card Giving
  giving_onetime_card_enabled: true,
  giving_onetime_merchant_name: "Horaios Baptist Church Online",
  giving_onetime_portal_url: "",
  giving_onetime_notes: "Secure 256-bit SSL encrypted card processing. Receipts are generated automatically.",

  // 2. Monthly Recurring Giving
  giving_recurring_enabled: true,
  giving_recurring_account_name: "Horaios Baptist Church - Stewardship",
  giving_recurring_portal_url: "",
  giving_recurring_standing_order_ref: "MONTHLY-TITHE-[YOUR NAME]",
  giving_recurring_instructions: "Set up a monthly auto-transfer in your mobile banking app or pledge using our recurring card option.",

  // 3. Bank Transfer
  giving_bank_name: "ABA Bank",
  giving_account_name: "HORAIOS BAPTIST CHURCH",
  giving_account_number: "001 234 567",
  giving_bank_account_name: "HORAIOS BAPTIST CHURCH",
  giving_bank_account_number_usd: "001 234 567",
  giving_bank_account_number_khr: "001 234 568",
  giving_bank_swift_code: "ABACXXPP",
  giving_bank_branch: "Boeung Tompun Branch, Phnom Penh, Cambodia",
  giving_bank_wire_memo: "[Your Name] - Tithe/Offering",
  giving_bank_instructions: "Please include your full name and 'Tithe' or 'Offering' in the wire transfer memo.",

  // 4. Mobile Banking & QR Code
  giving_qr_image: "",
  giving_mobile_provider: "ABA Mobile / Bakong / Wing / Acleda",
  giving_mobile_account_name: "HORAIOS BAPTIST CHURCH",
  giving_mobile_account_number: "001 234 567",
  giving_mobile_phone: "+855 (0) 23 888 999",
  giving_instructions: "1. Open your mobile banking app (ABA Mobile, Bakong, etc.).\n2. Scan the church QR code.\n3. Enter your giving amount and mention 'Tithe' or 'Offering' in the remarks.\n4. Confirm your transfer.",
  giving_mobile_instructions: "1. Open ABA Mobile, Bakong, or Wing.\n2. Tap 'Transfer to Bank Account' or 'Scan KHQR'.\n3. Select ABA Bank and enter account number 001 234 567.\n4. Input the amount and note 'Offering'.\n5. Confirm payment.",
  giving_online_url: "",
};

function extractMapEmbedUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/src="([^"]+)"/);
  if (match) return match[1];
  return url;
}

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: defaultSettings,
  loading: true,
});

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch site settings
    fetch("/api/v1/settings/church/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const flat: Record<string, any> = {};
          Object.values(data.data).forEach((group: any) => {
            Object.assign(flat, group);
          });
          
          const cleanMapUrl = extractMapEmbedUrl(flat.google_map_url || '');

          setSettings((prev) => ({
            ...prev,
            ...flat,
            google_map_url: cleanMapUrl,
          }));
        }
      })
      .catch((err) => console.error("Failed to load site settings:", err))
      .finally(() => setLoading(false));

    // 2. Fetch dedicated church services from the new church_services table
    fetch("/api/v1/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const items: ServiceTimeItem[] = data.data
            .filter((s: any) => !s.status || s.status === 'active')
            .map((s: any) => ({
              id: s.id,
              day: s.day,
              time: s.time,
              type: s.type || s.title,
              title: s.title,
              location: s.location,
              description: s.description,
              icon: s.icon,
              status: s.status || 'active',
            }));
          setSettings((prev) => ({
            ...prev,
            parsedServiceTimes: items,
          }));
        }
      })
      .catch((err) => console.error("Failed to load church services:", err));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

