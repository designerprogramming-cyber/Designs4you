import { AdminSettings, ServiceItem } from '../types';
import { SETTINGS } from '../settings';
import { SERVICES_DATA } from '../translations';
import contentData from '../../assets/data/content.json';

export interface DynamicAppConfig {
  settings: AdminSettings & {
    heroTitle: { ar: string; en: string };
    heroDesc: { ar: string; en: string };
    logoUrl?: string;
  };
  services: ServiceItem[];
  portfolio: Array<{
    id: string;
    url: string;
    filename: string;
    category: string;
    title: { ar: string; en: string };
  }>;
  videos: Array<{
    id: string;
    url: string;
    title: { ar: string; en: string };
    duration: string;
    thumbnail: string;
  }>;
  reviews: Array<{
    id: string;
    name: string;
    country: string;
    rating: number;
    comment: { ar: string; en: string };
    image?: string;
    type?: { ar: string; en: string };
  }>;
}

const STORAGE_KEY = 'designs4you_app_config_db_v2';

// Safe default values merged from files
export const DEFAULT_CONFIG: DynamicAppConfig = {
  settings: {
    ...SETTINGS,
    heroTitle: {
      ar: "مرحباً بكم في مركز خدمات Designs4you",
      en: "Welcome to Designs4you Service Center"
    },
    heroDesc: {
      ar: "اختر الخدمة التي تحتاجها وسنقوم بتوصيلك بالقسم الصحيح فوراً.",
      en: "Choose the service you need and we will connect you to the correct department immediately."
    },
    logoUrl: "" // Empty by default to fallback to text logo, or can take base64 / custom URL
  },
  services: SERVICES_DATA,
  portfolio: contentData.portfolio || [],
  videos: contentData.videos || [],
  reviews: contentData.reviews || []
};

// Singleton storage manager
export const stateStore = {
  getConfig(): DynamicAppConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with defaults to ensure any missing fields are present
        return {
          settings: { ...DEFAULT_CONFIG.settings, ...parsed.settings },
          services: parsed.services || DEFAULT_CONFIG.services,
          portfolio: parsed.portfolio || DEFAULT_CONFIG.portfolio,
          videos: parsed.videos || DEFAULT_CONFIG.videos,
          reviews: parsed.reviews || DEFAULT_CONFIG.reviews
        };
      }
    } catch (e) {
      console.error('Failed to parse app config from localStorage, using defaults', e);
    }
    return DEFAULT_CONFIG;
  },

  saveConfig(config: DynamicAppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      // Dispatch custom event to let other parts of app know config updated
      window.dispatchEvent(new Event('designs4you_config_changed'));
    } catch (e) {
      console.error('Failed to save config to localStorage', e);
      alert('Error: Local storage limit exceeded. If you uploaded large image files, please use external image URLs instead.');
    }
  },

  resetConfig(): DynamicAppConfig {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('designs4you_config_changed'));
    } catch (e) {
      console.error('Failed to reset config', e);
    }
    return DEFAULT_CONFIG;
  }
};
