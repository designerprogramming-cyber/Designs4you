import { AdminSettings, ServiceItem, Language, BannerSlide, PricingItem, MaintenanceBooking, SocialLinkItem, Customer, QuickQuote, SEOConfig, MusicTrack } from '../types';
import { SETTINGS } from '../settings';
import { SERVICES_DATA } from '../translations';
import contentData from '../../assets/data/content.json';
import { db, isFirebaseConfigured } from './firebase';
import { callNetlifyAdminApi } from './netlifyClient';
import { handleFirestoreError, OperationType } from './firebaseStore';
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

export interface FAQItem {
  id: string;
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
  order?: number;
}

export interface AnnouncementItem {
  id: string;
  text: { ar: string; en: string };
  active: boolean;
  order?: number;
}

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
    order?: number;
  }>;
  videos: Array<{
    id: string;
    url: string;
    title: { ar: string; en: string };
    duration: string;
    thumbnail: string;
    order?: number;
  }>;
  reviews: Array<{
    id: string;
    name: string;
    country: string;
    rating: number;
    comment: { ar: string; en: string };
    image?: string;
    type?: { ar: string; en: string };
    order?: number;
  }>;
  faqs: FAQItem[];
  announcements: AnnouncementItem[];
  banners: BannerSlide[];
  pricingList: PricingItem[];
  musicTracks?: MusicTrack[];
}

const STORAGE_KEY = 'designs4you_app_config_db_v3';

// Standard Default FAQs
const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq_1",
    question: {
      ar: "ما هي خدماتكم الرئيسية؟",
      en: "What are your main services?"
    },
    answer: {
      ar: "نحن نقدم خدمات تصميم التطريز والطباعة الرقمية DTF، صيانة جميع أنواع ماكينات التطريز، وكورسات تدريبية شاملة لبرنامج ويلكوم وصيانة الماكينات.",
      en: "We offer professional embroidery design, DTF printing, maintenance for all types of embroidery machines, and comprehensive courses for Wilcom and machine repair."
    },
    order: 0
  },
  {
    id: "faq_2",
    question: {
      ar: "هل تقدمون زيارات صيانة للمنازل أو المصانع؟",
      en: "Do you offer maintenance visits to homes or factories?"
    },
    answer: {
      ar: "نعم، لدينا فريق من المهندسين المتخصصين لزيارتكم في الموقع وحل المشاكل التقنية وتوفير قطع الغيار الأصلية في أسرع وقت.",
      en: "Yes, we have a team of expert engineers to visit you on-site, resolve technical issues, and provide genuine spare parts as quickly as possible."
    },
    order: 1
  },
  {
    id: "faq_3",
    question: {
      ar: "كيف يمكنني طلب كورس تدريبي؟",
      en: "How can I enroll in a training course?"
    },
    answer: {
      ar: "يمكنك ملء طلب التسعير السريع وتحديد قسم الكورسات، وسيقوم فريق الدعم بالتواصل معك فوراً عبر واتساب لتحديد المواعيد والمحتوى.",
      en: "You can fill out the quick quote form and select the training department, and our support team will contact you instantly via WhatsApp to schedule your sessions."
    },
    order: 2
  }
];

// Standard Default Announcements
const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann_1",
    text: {
      ar: "⭐ مرحبًا بك في مركز خدمات Designs4you",
      en: "⭐ Welcome to Designs4you Service Center"
    },
    active: true,
    order: 0
  },
  {
    id: "ann_2",
    text: {
      ar: "🎨 تصميمات احترافية فائقة الدقة للتطريز و DTF",
      en: "🎨 High-Precision Professional Embroidery & DTF Designs"
    },
    active: true,
    order: 1
  },
  {
    id: "ann_3",
    text: {
      ar: "🔧 مهندسون متخصصون لصيانة ماكينات التطريز والدعم الفني",
      en: "🔧 Expert Engineers for Embroidery Machine Maintenance & Tech Support"
    },
    active: true,
    order: 2
  },
  {
    id: "ann_4",
    text: {
      ar: "🎓 كورسات معتمدة لتعلم تصميم ويلكوم وتشغيل الماكينات",
      en: "🎓 Certified Courses for Wilcom Design & Machine Operations"
    },
    active: true,
    order: 3
  }
];

// Standard Default Banners
const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: "banner_1",
    title: {
      ar: "مرحباً بكم في مركز خدمات Designs4you",
      en: "Welcome to Designs4you Service Center"
    },
    desc: {
      ar: "المركز الاحترافي الأول لخدمات تصميمات التطريز وصيانة الماكينات والتدريب وطباعة الـ DTF.",
      en: "The premier certified center for embroidery patterns, machine diagnostics, training, and digital DTF transfers."
    },
    btnText: {
      ar: "طلب تسعير سريع",
      en: "Quick Quote Request"
    },
    btnLink: "quote",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    order: 0
  }
];

// Standard Default Pricing Items
const DEFAULT_PRICING: PricingItem[] = [
  {
    id: "p1",
    title: { ar: "تصميمات تطريز ويلكوم", en: "Wilcom Embroidery Designs" },
    price: "150",
    unit: { ar: "للتصميم المعتمد", en: "per approved pattern" },
    icon: "Palette",
    order: 0
  },
  {
    id: "p2",
    title: { ar: "طباعة تصاميم دي تي إف", en: "DTF Printing Designs" },
    price: "250",
    unit: { ar: "للمتر المطبوع", en: "per printed meter" },
    icon: "Shirt",
    order: 1
  },
  {
    id: "p3",
    title: { ar: "صيانة ماكينات التطريز", en: "Embroidery Machine Diagnostics" },
    price: "300",
    unit: { ar: "لالكشف والزيارة", en: "per technical visit" },
    icon: "Wrench",
    order: 2
  },
  {
    id: "p4",
    title: { ar: "كورس تصميم التطريز ويلكوم", en: "Wilcom Design Masterclass" },
    price: "1500",
    unit: { ar: "للكورس الشامل", en: "per complete course" },
    icon: "GraduationCap",
    order: 3
  },
  {
    id: "p5",
    title: { ar: "كورس صيانة ماكينات التطريز", en: "Machine Maintenance Course" },
    price: "2500",
    unit: { ar: "للكورس الشامل", en: "per complete course" },
    icon: "GraduationCap",
    order: 4
  }
];

// Default social link settings
const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: "sl_1", platform: "facebook", url: "https://www.facebook.com/designs4you", active: true },
  { id: "sl_2", platform: "instagram", url: "https://www.instagram.com/designs4you", active: true },
  { id: "sl_3", platform: "tiktok", url: "https://www.tiktok.com/@designs4you", active: true },
  { id: "sl_4", platform: "youtube", url: "https://www.youtube.com/@designs4you", active: true },
  { id: "sl_5", platform: "snapchat", url: "", active: false },
  { id: "sl_6", platform: "x", url: "", active: false },
  { id: "sl_7", platform: "linkedin", url: "", active: false },
  { id: "sl_8", platform: "telegram", url: "", active: false },
  { id: "sl_9", platform: "whatsapp", url: "", active: false }
];

// Safe default values merged from files
export const DEFAULT_CONFIG: DynamicAppConfig = {
  settings: {
    ...SETTINGS,
    websiteName: "Designs4you",
    browserTitle: "Designs4you Service Center | مركز خدمات التطريز والصيانة",
    metaDescription: "المركز الاحترافي الأول لخدمات تصميمات التطريز وصيانة الماكينات والتدريب وطباعة الـ DTF",
    seoKeywords: "designs4you, embroidery design, machine maintenance, dtf printing, wilcom course, صيانة ماكينات تطريز, تصميم ويلكوم",
    copyrightText: {
      ar: "جميع الحقوق محفوظة لـ Designs4you © 2026",
      en: "All rights reserved to Designs4you © 2026"
    },
    enableAutoCurrency: true,
    heroTitle: {
      ar: "مرحباً بكم في مركز خدمات Designs4you",
      en: "Welcome to Designs4you Service Center"
    },
    heroDesc: {
      ar: "اختر الخدمة التي تحتاجها وسنقوم بتوصيلك بالقسم الصحيح فوراً.",
      en: "Choose the service you need and we will connect you to the correct department immediately."
    },
    logoUrl: "",
    faviconUrl: "",
    announcementSpeed: 3,
    currency: { ar: "ج.م", en: "EGP" },
    socialLinks: DEFAULT_SOCIAL_LINKS,
    enableMusic: true,
    defaultVolume: 20
  },
  services: SERVICES_DATA,
  portfolio: (contentData.portfolio || []).map((p: any, index: number) => ({ ...p, order: index })),
  videos: (contentData.videos || []).map((v: any, index: number) => ({ ...v, order: index })),
  reviews: (contentData.reviews || []).map((r: any, index: number) => ({ ...r, order: index })),
  faqs: DEFAULT_FAQS,
  announcements: DEFAULT_ANNOUNCEMENTS,
  banners: DEFAULT_BANNERS,
  pricingList: DEFAULT_PRICING,
  musicTracks: []
};

// Internal active configuration cache
let activeConfig: DynamicAppConfig = { ...DEFAULT_CONFIG };

// Load initial state from LocalStorage if Firebase is not active
const loadLocalConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      activeConfig = {
        settings: { ...DEFAULT_CONFIG.settings, ...parsed.settings },
        services: parsed.services || DEFAULT_CONFIG.services,
        portfolio: parsed.portfolio || DEFAULT_CONFIG.portfolio,
        videos: parsed.videos || DEFAULT_CONFIG.videos,
        reviews: parsed.reviews || DEFAULT_CONFIG.reviews,
        faqs: parsed.faqs || DEFAULT_CONFIG.faqs || DEFAULT_FAQS,
        announcements: parsed.announcements || parsed.announcementBanner || DEFAULT_CONFIG.announcements,
        banners: parsed.banners || DEFAULT_CONFIG.banners,
        pricingList: parsed.pricingList || DEFAULT_CONFIG.pricingList,
        musicTracks: parsed.musicTracks || []
      };
    }
  } catch (e) {
    console.error('Failed to load initial configuration:', e);
  }
};

loadLocalConfig();

// Cloudinary Configuration for Direct Client-side Unsigned Uploads
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkg7idmsh';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Cloudinary File Upload helper - Uploads directly to Cloudinary using unsigned upload preset
export async function uploadFile(file: File, folder: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Cloudinary supports 'auto' to auto-detect images, videos, and raw files
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
    
    console.log(`Uploading file ${file.name} to Cloudinary...`);
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errText}`);
    }

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    throw new Error('Cloudinary response missing secure_url');
  } catch (err) {
    console.error('Failed to upload file to Cloudinary, falling back to local base64:', err);
    // Fallback to Base64 for local/offline mode to ensure it works and persists perfectly!
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

// Cloudinary Upload for background music system
export async function uploadAudioToStorage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
    
    console.log(`Uploading audio track ${file.name} to Cloudinary...`);
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary audio upload failed: ${errText}`);
    }

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    throw new Error('Cloudinary response missing secure_url');
  } catch (err) {
    console.error('Failed to upload audio to Cloudinary:', err);
    throw err;
  }
}

export async function deleteAudioFromStorage(url: string): Promise<void> {
  // Cloudinary direct deletion from client-side is disabled for unsigned preset safety.
  console.log('Skipped deleting Cloudinary asset file:', url);
}

// File Delete helper
export async function deleteFile(url: string): Promise<void> {
  console.log('Skipped deleting Cloudinary asset file:', url);
}

// Submit / retrieve maintenance bookings
export async function upsertCustomer(name: string, phone: string, email: string, country: string): Promise<void> {
  if (!phone) return;
  const cleanPhone = phone.trim();
  
  if (isFirebaseConfigured && db) {
    try {
      const customersRef = collection(db, 'customers');
      const snap = await getDocs(customersRef);
      const existingDoc = snap.docs.find(d => d.data().phone === cleanPhone);
      
      if (existingDoc) {
        const currentData = existingDoc.data();
        await callNetlifyAdminApi({
          action: 'setDoc',
          collectionName: 'customers',
          docId: existingDoc.id,
          data: {
            name: name || currentData.name,
            email: email || currentData.email,
            country: country || currentData.country,
            ordersCount: (currentData.ordersCount || 0) + 1,
            lastVisit: new Date().toISOString(),
          },
          merge: true
        });
      } else {
        const newId = doc(collection(db, 'customers')).id;
        await callNetlifyAdminApi({
          action: 'setDoc',
          collectionName: 'customers',
          docId: newId,
          data: {
            name: name || 'Customer',
            phone: cleanPhone,
            email: email || '',
            country: country || 'EG',
            ordersCount: 1,
            lastVisit: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            blocked: false
          }
        });
      }
    } catch (err) {
      console.error('Failed to upsert customer in Firestore:', err);
    }
  } else {
    try {
      const customers: Customer[] = JSON.parse(localStorage.getItem('designs4you_customers') || '[]');
      const index = customers.findIndex(c => c.phone === cleanPhone);
      
      if (index >= 0) {
        customers[index].ordersCount += 1;
        customers[index].lastVisit = new Date().toISOString();
        if (name) customers[index].name = name;
        if (email) customers[index].email = email;
        if (country) customers[index].country = country;
      } else {
        customers.push({
          id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
          name: name || 'Customer',
          phone: cleanPhone,
          email: email || '',
          country: country || 'EG',
          ordersCount: 1,
          lastVisit: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          blocked: false
        });
      }
      localStorage.setItem('designs4you_customers', JSON.stringify(customers));
    } catch (err) {
      console.error('Failed to upsert customer in LocalStorage:', err);
    }
  }
}

export async function fetchCustomers(): Promise<Customer[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    } catch (err) {
      console.error('Failed to fetch customers from Firestore:', err);
      return [];
    }
  } else {
    try {
      return JSON.parse(localStorage.getItem('designs4you_customers') || '[]');
    } catch (err) {
      console.error('Failed to fetch customers from LocalStorage:', err);
      return [];
    }
  }
}

export async function saveCustomer(customer: Customer): Promise<void> {
  const { id, ...data } = customer;
  if (!id) return;
  if (isFirebaseConfigured && db) {
    try {
      await callNetlifyAdminApi({
        action: 'setDoc',
        collectionName: 'customers',
        docId: id,
        data,
        merge: true
      });
    } catch (err) {
      console.error('Failed to save customer in Firestore:', err);
    }
  } else {
    try {
      const customers: Customer[] = JSON.parse(localStorage.getItem('designs4you_customers') || '[]');
      const updated = customers.map(c => c.id === id ? { ...c, ...data } : c);
      localStorage.setItem('designs4you_customers', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save customer in LocalStorage:', err);
    }
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await callNetlifyAdminApi({
        action: 'deleteDoc',
        collectionName: 'customers',
        docId: id
      });
    } catch (err) {
      console.error('Failed to delete customer from Firestore:', err);
    }
  } else {
    try {
      let customers: Customer[] = JSON.parse(localStorage.getItem('designs4you_customers') || '[]');
      customers = customers.filter(c => c.id !== id);
      localStorage.setItem('designs4you_customers', JSON.stringify(customers));
    } catch (err) {
      console.error('Failed to delete customer from LocalStorage:', err);
    }
  }
}

export async function fetchQuickQuotes(): Promise<QuickQuote[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'quotes'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuickQuote));
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return list;
    } catch (err) {
      console.error('Failed to fetch quick quotes from Firestore:', err);
      return [];
    }
  } else {
    try {
      const list = JSON.parse(localStorage.getItem('designs4you_quotes') || '[]');
      list.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return list;
    } catch (err) {
      console.error('Failed to fetch quick quotes from LocalStorage:', err);
      return [];
    }
  }
}

export async function addQuickQuote(quote: QuickQuote): Promise<void> {
  const data = { ...quote, createdAt: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(collection(db, 'quotes'));
      await callNetlifyAdminApi({
        action: 'setDoc',
        collectionName: 'quotes',
        docId: docRef.id,
        data
      });
      await upsertCustomer(quote.name, quote.phone, '', quote.country);
    } catch (err) {
      console.error('Failed to add quick quote in Firestore:', err);
    }
  } else {
    try {
      const list = JSON.parse(localStorage.getItem('designs4you_quotes') || '[]');
      list.push({ ...data, id: Date.now().toString() });
      localStorage.setItem('designs4you_quotes', JSON.stringify(list));
      await upsertCustomer(quote.name, quote.phone, '', quote.country);
    } catch (err) {
      console.error('Failed to add quick quote in LocalStorage:', err);
    }
  }
}

export async function deleteQuickQuote(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await callNetlifyAdminApi({
        action: 'deleteDoc',
        collectionName: 'quotes',
        docId: id
      });
    } catch (err) {
      console.error('Failed to delete quick quote from Firestore:', err);
    }
  } else {
    try {
      let list = JSON.parse(localStorage.getItem('designs4you_quotes') || '[]');
      list = list.filter((q: any) => q.id !== id);
      localStorage.setItem('designs4you_quotes', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to delete quick quote from LocalStorage:', err);
    }
  }
}

export async function updateQuickQuoteStatus(id: string, status: 'new' | 'review' | 'processing' | 'completed' | 'cancelled'): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await callNetlifyAdminApi({
        action: 'setDoc',
        collectionName: 'quotes',
        docId: id,
        data: { status },
        merge: true
      });
    } catch (err) {
      console.error('Failed to update quick quote status in Firestore:', err);
    }
  } else {
    try {
      const list = JSON.parse(localStorage.getItem('designs4you_quotes') || '[]');
      const updated = list.map((q: any) => q.id === id ? { ...q, status } : q);
      localStorage.setItem('designs4you_quotes', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update quick quote status in LocalStorage:', err);
    }
  }
}

const DEFAULT_SEO_CONFIG: SEOConfig = {
  metaTitle: 'ديزاينز فور يو لخدمات ماكينات التطريز والدعم الفني',
  metaDescription: 'المركز المتكامل والمعتمد الأول لصيانة وقطع غيار ماكينات التطريز والدعم الفني في الشرق الأوسط.',
  keywords: 'تطريز, صيانة ماكينات تطريز, ويلكوم, Wilcom, قطع غيار, تصاميم تطريز, كورسات تطريز',
  openGraph: 'https://designs4you.com/assets/images/logo.png',
  twitterCards: 'https://designs4you.com/assets/images/logo.png',
  favicon: '/favicon.ico',
  googleVerification: 'google-site-verification-placeholder',
  facebookVerification: 'facebook-domain-verification-placeholder',
  robotsTxt: 'User-agent: *\nAllow: /',
  sitemapXml: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://designs4you.com/</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>'
};

export async function fetchSEOConfig(): Promise<SEOConfig> {
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, 'seo', 'config'));
      if (docSnap.exists()) {
        return { ...DEFAULT_SEO_CONFIG, ...docSnap.data() } as SEOConfig;
      } else {
        await callNetlifyAdminApi({
          action: 'setDoc',
          collectionName: 'seo',
          docId: 'config',
          data: DEFAULT_SEO_CONFIG
        });
        return DEFAULT_SEO_CONFIG;
      }
    } catch (err) {
      console.error('Failed to fetch SEO config from Firestore:', err);
      return DEFAULT_SEO_CONFIG;
    }
  } else {
    try {
      const data = localStorage.getItem('designs4you_seo_config');
      return data ? { ...DEFAULT_SEO_CONFIG, ...JSON.parse(data) } : DEFAULT_SEO_CONFIG;
    } catch (err) {
      console.error('Failed to fetch SEO config from LocalStorage:', err);
      return DEFAULT_SEO_CONFIG;
    }
  }
}

export async function saveSEOConfig(seoConfig: SEOConfig): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await callNetlifyAdminApi({
        action: 'setDoc',
        collectionName: 'seo',
        docId: 'config',
        data: seoConfig
      });
    } catch (err) {
      console.error('Failed to save SEO config in Firestore:', err);
    }
  } else {
    try {
      localStorage.setItem('designs4you_seo_config', JSON.stringify(seoConfig));
    } catch (err) {
      console.error('Failed to save SEO config in LocalStorage:', err);
    }
  }
}

export async function addMaintenanceBooking(booking: MaintenanceBooking): Promise<void> {
  const data = { ...booking, status: (booking as any).status || 'new', createdAt: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    const docRef = doc(collection(db, 'maintenanceBookings'));
    try {
      await callNetlifyAdminApi({
        action: 'setDoc',
        collectionName: 'maintenanceBookings',
        docId: docRef.id,
        data
      });
      await upsertCustomer(booking.name, booking.phone, booking.email, 'EG');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'maintenanceBookings/' + docRef.id);
    }
  } else {
    try {
      const bookings = JSON.parse(localStorage.getItem('designs4you_maintenance_bookings') || '[]');
      bookings.push({ ...data, id: Date.now().toString() });
      localStorage.setItem('designs4you_maintenance_bookings', JSON.stringify(bookings));
      await upsertCustomer(booking.name, booking.phone, booking.email, 'EG');
    } catch (err) {
      console.error('Failed to save booking to LocalStorage:', err);
      throw err;
    }
  }
}

export async function fetchMaintenanceBookings(): Promise<MaintenanceBooking[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'maintenanceBookings'));
      const bookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceBooking));
      bookings.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return bookings;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'maintenanceBookings');
    }
  } else {
    try {
      const bookings = JSON.parse(localStorage.getItem('designs4you_maintenance_bookings') || '[]');
      bookings.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return bookings;
    } catch (err) {
      console.error('Failed to fetch bookings from LocalStorage:', err);
      return [];
    }
  }
}

export async function deleteMaintenanceBooking(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await callNetlifyAdminApi({
        action: 'deleteDoc',
        collectionName: 'maintenanceBookings',
        docId: id
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'maintenanceBookings/' + id);
    }
  } else {
    try {
      let bookings = JSON.parse(localStorage.getItem('designs4you_maintenance_bookings') || '[]');
      bookings = bookings.filter((b: any) => b.id !== id);
      localStorage.setItem('designs4you_maintenance_bookings', JSON.stringify(bookings));
    } catch (err) {
      console.error('Failed to delete booking from LocalStorage:', err);
      throw err;
    }
  }
}

export async function updateMaintenanceBookingStatus(id: string, status: 'new' | 'processing' | 'completed' | 'closed'): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await callNetlifyAdminApi({
        action: 'setDoc',
        collectionName: 'maintenanceBookings',
        docId: id,
        data: { status },
        merge: true
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'maintenanceBookings/' + id);
    }
  } else {
    try {
      const bookings = JSON.parse(localStorage.getItem('designs4you_maintenance_bookings') || '[]');
      const updated = bookings.map((b: any) => b.id === id ? { ...b, status } : b);
      localStorage.setItem('designs4you_maintenance_bookings', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update booking status in LocalStorage:', err);
      throw err;
    }
  }
}

// Start realtime Firebase listener if active
if (isFirebaseConfigured && db) {
  try {
    // 1. Settings sync
    onSnapshot(doc(db, 'config', 'settings'), async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        activeConfig.settings = { ...activeConfig.settings, ...data.settings };
        window.dispatchEvent(new Event('designs4you_config_changed'));
      } else {
        // DB is empty! Just use default settings
        activeConfig.settings = { ...activeConfig.settings, ...DEFAULT_CONFIG.settings };
        window.dispatchEvent(new Event('designs4you_config_changed'));
      }
    }, (error) => {
      console.warn('Settings subscription error (safely handled):', error);
    });

    // Helper to sync standard collections
    const syncCollection = (collectionName: string, configKey: keyof DynamicAppConfig, defaultData: any[]) => {
      const colRef = collection(db, collectionName);
      onSnapshot(colRef, async (snapshot) => {
        if (!snapshot.empty) {
          const items: any[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          // Sort items by order key
          items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          (activeConfig as any)[configKey] = items;
          window.dispatchEvent(new Event('designs4you_config_changed'));
        } else {
          // Collection empty, just use local defaultData
          (activeConfig as any)[configKey] = defaultData;
          window.dispatchEvent(new Event('designs4you_config_changed'));
        }
      }, (error) => {
        console.warn(`Collection subscription error for ${collectionName} (safely handled):`, error);
        // Fallback to local default data on error to keep UI functional
        if (!(activeConfig as any)[configKey] || (activeConfig as any)[configKey].length === 0) {
          (activeConfig as any)[configKey] = defaultData;
          window.dispatchEvent(new Event('designs4you_config_changed'));
        }
      });
    };

    // 2. Services sync
    syncCollection('services', 'services', DEFAULT_CONFIG.services);

    // 3. Portfolio sync
    syncCollection('portfolio', 'portfolio', DEFAULT_CONFIG.portfolio);

    // 4. Videos sync
    syncCollection('videos', 'videos', DEFAULT_CONFIG.videos);

    // 5. Reviews sync
    syncCollection('reviews', 'reviews', DEFAULT_CONFIG.reviews);

    // 6. FAQs sync
    syncCollection('faqs', 'faqs', DEFAULT_CONFIG.faqs);

    // 7. Announcements sync
    syncCollection('announcements', 'announcements', DEFAULT_CONFIG.announcements);

    // 8. Banners sync
    syncCollection('banners', 'banners', DEFAULT_CONFIG.banners);

    // 9. Pricing sync
    syncCollection('pricingList', 'pricingList', DEFAULT_CONFIG.pricingList);

    // 10. Music tracks sync
    syncCollection('musicTracks', 'musicTracks', []);

  } catch (e) {
    console.error('Failed to establish Firebase listeners:', e);
  }
}

// Export the singleton store
export const stateStore = {
  getConfig(): DynamicAppConfig {
    return activeConfig;
  },

  async saveConfig(config: DynamicAppConfig): Promise<void> {
    activeConfig = { ...config };
    window.dispatchEvent(new Event('designs4you_config_changed'));

    if (isFirebaseConfigured) {
      try {
        await callNetlifyAdminApi({
          action: 'syncConfig',
          config
        });
      } catch (error) {
        console.error('Failed to sync configuration via Netlify Function:', error);
        throw error;
      }
    } else {
      // Fallback to LocalStorage if Firebase is not active
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      } catch (e) {
        console.error('Failed to save config to local storage:', e);
      }
    }
  },

  async resetConfig(): Promise<DynamicAppConfig> {
    activeConfig = { ...DEFAULT_CONFIG };
    window.dispatchEvent(new Event('designs4you_config_changed'));

    if (isFirebaseConfigured) {
      try {
        await callNetlifyAdminApi({
          action: 'syncConfig',
          config: DEFAULT_CONFIG
        });
      } catch (error) {
        console.error('Failed to reset configuration via Netlify Function:', error);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to reset config from local storage:', e);
      }
    }
    return DEFAULT_CONFIG;
  },

  async addPendingReview(review: any): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        await callNetlifyAdminApi({
          action: 'setDoc',
          collectionName: 'reviews',
          docId: review.id,
          data: review
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'reviews/' + review.id);
      }
    } else {
      try {
        const config = this.getConfig();
        const updated = [...config.reviews, review];
        await this.saveConfig({ ...config, reviews: updated });
      } catch (err) {
        console.error('Failed to save pending review locally:', err);
        throw err;
      }
    }
  }
};
