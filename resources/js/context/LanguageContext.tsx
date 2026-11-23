import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations, type Language } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isKhmer: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  isKhmer: false,
});

const STORAGE_KEY = 'horaios_lang';

let currentLanguage: Language = 'en';

/**
 * Translates using the language active at call time. Use inside memoized
 * callbacks and effects, where a captured `t` could hold a previous language.
 */
export const translate = (
  key: string,
  fallback?: string,
  vars?: Record<string, string | number>,
): string => {
  const text = translations[currentLanguage]?.[key] || translations.en[key] || (fallback !== undefined ? fallback : key);
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
};

/** Locale for date formatting. English keeps each caller's existing locale. */
export const getDateLocale = (englishLocale?: string): string | undefined =>
  currentLanguage === 'km' ? 'km-KH' : englishLocale;

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('admin_language');
      if (saved === 'km' || saved === 'en') {
        currentLanguage = saved;
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    currentLanguage = lang;
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem('admin_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English dictionary if present
    if (language !== 'en' && translations.en[key]) {
      return translations.en[key];
    }
    return fallback !== undefined ? fallback : key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    isKhmer: language === 'km',
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
