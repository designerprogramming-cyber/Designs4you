export type Language = 'ar' | 'en';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

export interface PriceSettings {
  embroidery: { ar: string; en: string };
  dtf: { ar: string; en: string };
  maintenance: { ar: string; en: string };
  course: { ar: string; en: string };
}

export interface AdminSettings {
  company: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: {
    ar: string;
    en: string;
  };
  workingHours: {
    ar: string;
    en: string;
  };
  mapsUrl: string;
  social: SocialLinks;
  primaryColor: string;
  secondaryColor: string;
  defaultLanguage: Language;
  prices: PriceSettings;
}

export interface QuoteForm {
  name: string;
  phone: string;
  country: 'EG' | 'SA' | 'AE' | 'OTH';
  region: string; // Governorate for EG, Region for SA, Emirate for AE, City for Others
  department: string;
  service: string;
  notes: string;
  requestId: string;
  designFileName?: string;
  designFileSize?: string;
}

export interface ServiceOption {
  id: string;
  title: {
    ar: string;
    en: string;
  };
}

export interface ServiceItem {
  id: string;
  icon: string; // lucide icon name or emoji
  faIcon: string; // Font Awesome icon class for double compliance
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  options: ServiceOption[];
}

