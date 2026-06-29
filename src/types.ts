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

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  active: boolean;
}

export interface BannerSlide {
  id: string;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  btnText: { ar: string; en: string };
  btnLink: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  order: number;
}

export interface PricingItem {
  id: string;
  title: { ar: string; en: string };
  price: string;
  unit: { ar: string; en: string };
  icon: string;
  order: number;
}

export interface MaintenanceBooking {
  id?: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  machineType: string;
  machineModel: string;
  problemDesc: string;
  fileUrl?: string;
  fileName?: string;
  contactTime: string;
  createdAt?: string;
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
  faviconUrl?: string;
  announcementSpeed?: number;
  currency?: {
    ar: string;
    en: string;
  };
  socialLinks?: SocialLinkItem[];
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
  imageUrl?: string;
}

export interface Customer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  ordersCount: number;
  lastVisit: string;
  createdAt: string;
  blocked: boolean;
}

export interface QuickQuote {
  id?: string;
  name: string;
  phone: string;
  country: string;
  region: string;
  department: string;
  service: string;
  notes: string;
  requestId: string;
  designFileName?: string;
  designFileSize?: string;
  createdAt?: string;
  status: 'new' | 'review' | 'processing' | 'completed' | 'cancelled';
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  openGraph: string;
  twitterCards: string;
  favicon: string;
  googleVerification: string;
  facebookVerification: string;
  robotsTxt: string;
  sitemapXml: string;
}



