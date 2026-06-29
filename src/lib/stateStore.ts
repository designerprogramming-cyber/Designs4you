import { AdminSettings, ServiceItem, Language, BannerSlide, PricingItem, MaintenanceBooking, SocialLinkItem, Customer, QuickQuote, SEOConfig, MusicTrack } from '../types';
import { SETTINGS } from '../settings';
import { SERVICES_DATA } from '../translations';
import contentData from '../../assets/data/content.json';
import { db, storage, auth, isFirebaseConfigured } from './firebase';
import { handleFirestoreError, OperationType } from './firebaseStore';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  writeBatch,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

// Firebase File Upload helper - Completely decoupled from Firebase Storage to keep it in the free tier!
export async function uploadFile(file: File, folder: string): Promise<string> {
  // We do not use Firebase Storage to save costs.
  // Instead, return the local asset path based on the filename so it reads from the local assets folder.
  const name = file.name;
  if (folder === 'portfolio' || folder === 'gallery') {
    return `/assets/gallery/${name}`;
  } else if (file.type.startsWith('video') || folder === 'videos') {
    return `/assets/videos/${name}`;
  } else {
    return `/assets/images/${name}`;
  }
}

// Actual Firebase Storage helpers for optional Background Music system
export async function uploadAudioToStorage(file: File): Promise<string> {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Firebase is not configured');
  }
  const storageRef = ref(storage, `music/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

export async function deleteAudioFromStorage(url: string): Promise<void> {
  if (!isFirebaseConfigured || !storage) return;
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err) {
    console.error('Failed to delete audio from Firebase Storage:', err);
  }
}

// Firebase File Delete helper
export async function deleteFile(url: string): Promise<void> {
  // No-op for local assets to avoid any Firebase Storage interaction
  console.log('Skipped deleting local asset file:', url);
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
        await setDoc(doc(db, 'customers', existingDoc.id), {
          name: name || currentData.name,
          email: email || currentData.email,
          country: country || currentData.country,
          ordersCount: (currentData.ordersCount || 0) + 1,
          lastVisit: new Date().toISOString(),
        }, { merge: true });
      } else {
        const newId = doc(collection(db, 'customers')).id;
        await setDoc(doc(db, 'customers', newId), {
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
      await setDoc(doc(db, 'customers', id), data, { merge: true });
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
      await deleteDoc(doc(db, 'customers', id));
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
      await setDoc(docRef, data);
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
      await deleteDoc(doc(db, 'quotes', id));
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
      await setDoc(doc(db, 'quotes', id), { status }, { merge: true });
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
        await setDoc(doc(db, 'seo', 'config'), DEFAULT_SEO_CONFIG);
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
      await setDoc(doc(db, 'seo', 'config'), seoConfig);
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
      await setDoc(docRef, data);
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
      await deleteDoc(doc(db, 'maintenanceBookings', id));
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
      await setDoc(doc(db, 'maintenanceBookings', id), { status }, { merge: true });
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
        // DB is empty! Seed with default settings only if signed in
        if (auth?.currentUser) {
          try {
            await setDoc(doc(db, 'config', 'settings'), { settings: DEFAULT_CONFIG.settings });
          } catch (err) {
            console.warn('Failed to seed settings doc:', err);
          }
        } else {
          activeConfig.settings = { ...activeConfig.settings, ...DEFAULT_CONFIG.settings };
          window.dispatchEvent(new Event('designs4you_config_changed'));
        }
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
          // Collection empty, seed it only if signed in
          if (auth?.currentUser) {
            try {
              console.log(`Seeding empty collection: ${collectionName}`);
              const batch = writeBatch(db);
              defaultData.forEach((item) => {
                const docRef = doc(collection(db, collectionName), item.id);
                const { id, ...itemData } = item;
                batch.set(docRef, itemData);
              });
              await batch.commit();
            } catch (err) {
              console.warn(`Failed to seed collection ${collectionName}:`, err);
            }
          } else {
            // Unauthenticated: just use local defaultData
            (activeConfig as any)[configKey] = defaultData;
            window.dispatchEvent(new Event('designs4you_config_changed'));
          }
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

    if (isFirebaseConfigured && db) {
      try {
        // Save Settings
        await setDoc(doc(db, 'config', 'settings'), { settings: config.settings });

        // Save Services
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const batchS = writeBatch(db);
        servicesSnapshot.forEach((doc) => batchS.delete(doc.ref));
        config.services.forEach((item, index) => {
          const docRef = doc(collection(db, 'services'), item.id);
          batchS.set(docRef, { ...item, order: index });
        });
        await batchS.commit();

        // Save Portfolio
        const portfolioSnapshot = await getDocs(collection(db, 'portfolio'));
        const batchP = writeBatch(db);
        portfolioSnapshot.forEach((doc) => batchP.delete(doc.ref));
        config.portfolio.forEach((item, index) => {
          const docRef = doc(collection(db, 'portfolio'), item.id);
          const { id, ...rest } = item;
          batchP.set(docRef, { ...rest, order: index });
        });
        await batchP.commit();

        // Save Videos
        const videosSnapshot = await getDocs(collection(db, 'videos'));
        const batchV = writeBatch(db);
        videosSnapshot.forEach((doc) => batchV.delete(doc.ref));
        config.videos.forEach((item, index) => {
          const docRef = doc(collection(db, 'videos'), item.id);
          const { id, ...rest } = item;
          batchV.set(docRef, { ...rest, order: index });
        });
        await batchV.commit();

        // Save Reviews
        const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
        const batchR = writeBatch(db);
        reviewsSnapshot.forEach((doc) => batchR.delete(doc.ref));
        config.reviews.forEach((item, index) => {
          const docRef = doc(collection(db, 'reviews'), item.id);
          const { id, ...rest } = item;
          batchR.set(docRef, { ...rest, order: index });
        });
        await batchR.commit();

        // Save FAQs
        const faqsSnapshot = await getDocs(collection(db, 'faqs'));
        const batchF = writeBatch(db);
        faqsSnapshot.forEach((doc) => batchF.delete(doc.ref));
        config.faqs.forEach((item, index) => {
          const docRef = doc(collection(db, 'faqs'), item.id);
          const { id, ...rest } = item;
          batchF.set(docRef, { ...rest, order: index });
        });
        await batchF.commit();

        // Save Announcements
        const annSnapshot = await getDocs(collection(db, 'announcements'));
        const batchA = writeBatch(db);
        annSnapshot.forEach((doc) => batchA.delete(doc.ref));
        config.announcements.forEach((item, index) => {
          const docRef = doc(collection(db, 'announcements'), item.id);
          const { id, ...rest } = item;
          batchA.set(docRef, { ...rest, order: index });
        });
        await batchA.commit();

        // Save Banners
        const bannersSnapshot = await getDocs(collection(db, 'banners'));
        const batchB = writeBatch(db);
        bannersSnapshot.forEach((doc) => batchB.delete(doc.ref));
        config.banners.forEach((item, index) => {
          const docRef = doc(collection(db, 'banners'), item.id);
          const { id, ...rest } = item;
          batchB.set(docRef, { ...rest, order: index });
        });
        await batchB.commit();

        // Save Pricing List
        const pricingSnapshot = await getDocs(collection(db, 'pricingList'));
        const batchPL = writeBatch(db);
        pricingSnapshot.forEach((doc) => batchPL.delete(doc.ref));
        config.pricingList.forEach((item, index) => {
          const docRef = doc(collection(db, 'pricingList'), item.id);
          const { id, ...rest } = item;
          batchPL.set(docRef, { ...rest, order: index });
        });
        await batchPL.commit();

        // Save Music Tracks
        if (config.musicTracks) {
          const musicSnapshot = await getDocs(collection(db, 'musicTracks'));
          const batchM = writeBatch(db);
          musicSnapshot.forEach((doc) => batchM.delete(doc.ref));
          config.musicTracks.forEach((item, index) => {
            const docRef = doc(collection(db, 'musicTracks'), item.id);
            const { id, ...rest } = item;
            batchM.set(docRef, { ...rest, order: index });
          });
          await batchM.commit();
        }

      } catch (error) {
        console.error('Failed to save configuration directly to Firebase:', error);
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

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'config', 'settings'), { settings: DEFAULT_CONFIG.settings });
        
        // Reset services
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const batchS = writeBatch(db);
        servicesSnapshot.forEach((doc) => batchS.delete(doc.ref));
        DEFAULT_CONFIG.services.forEach((item, index) => {
          const docRef = doc(collection(db, 'services'), item.id);
          batchS.set(docRef, { ...item, order: index });
        });
        await batchS.commit();

        // Reset portfolio
        const portfolioSnapshot = await getDocs(collection(db, 'portfolio'));
        const batchP = writeBatch(db);
        portfolioSnapshot.forEach((doc) => batchP.delete(doc.ref));
        DEFAULT_CONFIG.portfolio.forEach((item, index) => {
          const docRef = doc(collection(db, 'portfolio'), item.id);
          const { id, ...rest } = item;
          batchP.set(docRef, { ...rest, order: index });
        });
        await batchP.commit();

        // Reset videos
        const videosSnapshot = await getDocs(collection(db, 'videos'));
        const batchV = writeBatch(db);
        videosSnapshot.forEach((doc) => batchV.delete(doc.ref));
        DEFAULT_CONFIG.videos.forEach((item, index) => {
          const docRef = doc(collection(db, 'videos'), item.id);
          const { id, ...rest } = item;
          batchV.set(docRef, { ...rest, order: index });
        });
        await batchV.commit();

        // Reset reviews
        const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
        const batchR = writeBatch(db);
        reviewsSnapshot.forEach((doc) => batchR.delete(doc.ref));
        DEFAULT_CONFIG.reviews.forEach((item, index) => {
          const docRef = doc(collection(db, 'reviews'), item.id);
          const { id, ...rest } = item;
          batchR.set(docRef, { ...rest, order: index });
        });
        await batchR.commit();

        // Reset faqs
        const faqsSnapshot = await getDocs(collection(db, 'faqs'));
        const batchF = writeBatch(db);
        faqsSnapshot.forEach((doc) => batchF.delete(doc.ref));
        DEFAULT_CONFIG.faqs.forEach((item, index) => {
          const docRef = doc(collection(db, 'faqs'), item.id);
          const { id, ...rest } = item;
          batchF.set(docRef, { ...rest, order: index });
        });
        await batchF.commit();

        // Reset announcements
        const annSnapshot = await getDocs(collection(db, 'announcements'));
        const batchA = writeBatch(db);
        annSnapshot.forEach((doc) => batchA.delete(doc.ref));
        DEFAULT_CONFIG.announcements.forEach((item, index) => {
          const docRef = doc(collection(db, 'announcements'), item.id);
          const { id, ...rest } = item;
          batchA.set(docRef, { ...rest, order: index });
        });
        await batchA.commit();

        // Reset banners
        const bannersSnapshot = await getDocs(collection(db, 'banners'));
        const batchB = writeBatch(db);
        bannersSnapshot.forEach((doc) => batchB.delete(doc.ref));
        DEFAULT_CONFIG.banners.forEach((item, index) => {
          const docRef = doc(collection(db, 'banners'), item.id);
          const { id, ...rest } = item;
          batchB.set(docRef, { ...rest, order: index });
        });
        await batchB.commit();

        // Reset pricingList
        const pricingSnapshot = await getDocs(collection(db, 'pricingList'));
        const batchPL = writeBatch(db);
        pricingSnapshot.forEach((doc) => batchPL.delete(doc.ref));
        DEFAULT_CONFIG.pricingList.forEach((item, index) => {
          const docRef = doc(collection(db, 'pricingList'), item.id);
          const { id, ...rest } = item;
          batchPL.set(docRef, { ...rest, order: index });
        });
        await batchPL.commit();

      } catch (error) {
        console.error('Failed to reset config on Firebase:', error);
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
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(collection(db, 'reviews'), review.id);
        const { id, ...rest } = review;
        await setDoc(docRef, rest);
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
