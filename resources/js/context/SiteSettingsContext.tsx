import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ServiceTimeItem {
  day: string;
  time: string;
  type: string;
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
}

const defaultSettings: SiteSettings = {
  church_name: "Horaios Baptist Church",
  short_name: "Horaios Church",
  logo: "/images/logo.png",
  favicon: "/images/logo.png",
  footer_text: "A community of faith serving God and loving our neighbors in Phnom Penh, Cambodia.",
  copyright: "",
  address: "Phnom Penh, Cambodia",
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
    { day: "Sunday Morning", time: "9:00 AM & 11:00 AM", type: "Main Worship Service" },
    { day: "Wednesday Evening", time: "7:00 PM", type: "Prayer Meeting & Bible Study" },
  ],
};

function extractMapEmbedUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/src="([^"]+)"/);
  if (match) return match[1];
  return url;
}

function parseServiceTimes(raw: string): ServiceTimeItem[] {
  if (!raw) return defaultSettings.parsedServiceTimes;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    // ignore
  }
  return defaultSettings.parsedServiceTimes;
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
    fetch("/api/v1/settings/church/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const flat: Record<string, any> = {};
          Object.values(data.data).forEach((group: any) => {
            Object.assign(flat, group);
          });
          
          const cleanMapUrl = extractMapEmbedUrl(flat.google_map_url || '');
          const serviceTimes = parseServiceTimes(flat.service_times);

          setSettings({
            ...defaultSettings,
            ...flat,
            google_map_url: cleanMapUrl,
            parsedServiceTimes: serviceTimes,
          });
        }
      })
      .catch((err) => console.error("Failed to load site settings:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

