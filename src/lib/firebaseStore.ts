import { 
  db, 
  storage, 
  auth,
  isFirebaseConfigured 
} from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { DEFAULT_CONFIG, DynamicAppConfig } from './stateStore';
import { ServiceItem, Language } from '../types';

export interface FAQItem {
  id: string;
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
  category: string;
}

export interface AnnouncementItem {
  id: string;
  text: { ar: string; en: string };
  active: boolean;
}

// Upload a file - Completely decoupled from Firebase Storage to keep it in the free tier!
export async function uploadToStorage(file: File, folder: string): Promise<string> {
  const name = file.name;
  if (folder === 'portfolio' || folder === 'gallery') {
    return `/assets/gallery/${name}`;
  } else if (file.type.startsWith('video') || folder === 'videos') {
    return `/assets/videos/${name}`;
  } else {
    return `/assets/images/${name}`;
  }
}

// Delete a file from Firebase Storage given its public URL
export async function deleteFromStorage(fileUrl: string): Promise<void> {
  // No-op to avoid any Firebase Storage interaction
  console.log('Skipped deleting local asset file from Storage:', fileUrl);
}

// Database Seeding: Check if Firestore has data, if not, write the default configuration
export async function seedDatabaseIfEmpty(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const settingsRef = doc(db, "config", "settings");
    const settingsSnap = await getDoc(settingsRef);
    
    if (!settingsSnap.exists()) {
      console.log("Firestore is empty. Seeding default data...");
      
      // 1. Seed general Settings
      await setDoc(settingsRef, DEFAULT_CONFIG.settings);
      
      // 2. Seed Services
      for (let i = 0; i < DEFAULT_CONFIG.services.length; i++) {
        const service = DEFAULT_CONFIG.services[i];
        const docRef = doc(db, "services", service.id);
        await setDoc(docRef, { ...service, order: i });
      }
      
      // 3. Seed Portfolio items
      for (const item of DEFAULT_CONFIG.portfolio) {
        const docRef = doc(db, "portfolio", item.id);
        await setDoc(docRef, item);
      }
      
      // 4. Seed Videos
      for (const item of DEFAULT_CONFIG.videos) {
        const docRef = doc(db, "videos", item.id);
        await setDoc(docRef, item);
      }
      
      // 5. Seed Reviews
      for (const item of DEFAULT_CONFIG.reviews) {
        const docRef = doc(db, "reviews", item.id);
        await setDoc(docRef, item);
      }
      
      // 6. Seed FAQs (Initial values)
      const initialFAQs: FAQItem[] = [
        {
          id: 'faq-1',
          question: {
            ar: 'ما هي مدة تصميم التطريز؟',
            en: 'How long does embroidery digitizing take?'
          },
          answer: {
            ar: 'تستغرق عملية تصميم التطريز بين 24 إلى 48 ساعة حسب تعقيد الرسمة وتفاصيلها.',
            en: 'The embroidery digitizing process takes between 24 to 48 hours depending on design complexity.'
          },
          category: 'embroidery'
        },
        {
          id: 'faq-2',
          question: {
            ar: 'هل تتوفر صيانة منزلية لماكينات التطريز؟',
            en: 'Is there home maintenance service for embroidery machines?'
          },
          answer: {
            ar: 'نعم، يتنقل فريق المهندسين لدينا لعمل زيارات صيانة دورية وإصلاح أعطال في مقر العميل بجميع المحافظات.',
            en: 'Yes, our engineering team travels to perform periodic maintenance and on-site repairs across all governorates.'
          },
          category: 'maintenance'
        }
      ];
      for (const item of initialFAQs) {
        const docRef = doc(db, "faqs", item.id);
        await setDoc(docRef, item);
      }

      // 7. Seed Announcements
      const initialAnnouncements: AnnouncementItem[] = [
        { id: 'ann-1', text: { ar: '⭐ مرحبًا بك في Designs4you', en: '⭐ Welcome to Designs4you' }, active: true },
        { id: 'ann-2', text: { ar: '🎨 تصميمات احترافية للتطريز و DTF', en: '🎨 Professional Embroidery & DTF Designs' }, active: true },
        { id: 'ann-3', text: { ar: '🔧 خدمات صيانة متخصصة لماكينات التطريز', en: '🔧 Expert Embroidery Machine Maintenance' }, active: true },
        { id: 'ann-4', text: { ar: '🎓 كورسات احترافية لتعلم Wilcom وصيانة الماكينات', en: '🎓 Professional Wilcom & Maintenance Courses' }, active: true },
        { id: 'ann-5', text: { ar: '⚡ سرعة في الرد وخدمة عملاء مميزة', en: '⚡ Fast Response & Excellent Customer Support' }, active: true },
        { id: 'ann-6', text: { ar: '📱 تواصل معنا مباشرة عبر واتساب', en: '📱 Contact us instantly via WhatsApp' }, active: true }
      ];
      for (const item of initialAnnouncements) {
        const docRef = doc(db, "announcements", item.id);
        await setDoc(docRef, item);
      }
      
      console.log("Database seeded successfully.");
    }
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}

// Complete Configuration Data Fetching from Firestore
export async function fetchFullConfigFromFirebase(): Promise<DynamicAppConfig & { faqs: FAQItem[], announcements: AnnouncementItem[] }> {
  if (!isFirebaseConfigured || !db) {
    // If Firebase is not configured, fallback to localStorage/mock defaults
    const local = DEFAULT_CONFIG;
    return {
      ...local,
      faqs: [
        {
          id: 'faq-1',
          question: { ar: 'ما هي مدة تصميم التطريز؟', en: 'How long does embroidery digitizing take?' },
          answer: { ar: 'تستغرق عملية تصميم التطريز بين 24 إلى 48 ساعة حسب تعقيد الرسمة وتفاصيلها.', en: 'The embroidery digitizing process takes between 24 to 48 hours depending on design complexity.' },
          category: 'embroidery'
        },
        {
          id: 'faq-2',
          question: { ar: 'هل تتوفر صيانة منزلية لماكينات التطريز؟', en: 'Is there home maintenance service for embroidery machines?' },
          answer: { ar: 'نعم، يتنقل فريق المهندسين لدينا لعمل زيارات صيانة دورية وإصلاح أعطال في مقر العميل بجميع المحافظات.', en: 'Yes, our engineering team travels to perform periodic maintenance and on-site repairs across all governorates.' },
          category: 'maintenance'
        }
      ],
      announcements: [
        { id: 'ann-1', text: { ar: '⭐ مرحبًا بك في Designs4you', en: '⭐ Welcome to Designs4you' }, active: true },
        { id: 'ann-2', text: { ar: '🎨 تصميمات احترافية للتطريز و DTF', en: '🎨 Professional Embroidery & DTF Designs' }, active: true },
        { id: 'ann-3', text: { ar: '🔧 خدمات صيانة متخصصة لماكينات التطريز', en: '🔧 Expert Embroidery Machine Maintenance' }, active: true },
        { id: 'ann-4', text: { ar: '🎓 كورسات احترافية لتعلم Wilcom وصيانة الماكينات', en: '🎓 Professional Wilcom & Maintenance Courses' }, active: true },
        { id: 'ann-5', text: { ar: '⚡ سرعة في الرد وخدمة عملاء مميزة', en: '⚡ Fast Response & Excellent Customer Support' }, active: true },
        { id: 'ann-6', text: { ar: '📱 تواصل معنا مباشرة عبر واتساب', en: '📱 Contact us instantly via WhatsApp' }, active: true }
      ]
    };
  }
  
  try {
    // Seeding check
    await seedDatabaseIfEmpty();
    
    // 1. Fetch settings
    const settingsSnap = await getDoc(doc(db, "config", "settings"));
    const settings = settingsSnap.exists() ? settingsSnap.data() as any : DEFAULT_CONFIG.settings;
    
    // 2. Fetch services ordered by 'order'
    const servicesQuery = query(collection(db, "services"), orderBy("order", "asc"));
    const servicesSnap = await getDocs(servicesQuery);
    let services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ServiceItem[];
    if (services.length === 0) {
      services = DEFAULT_CONFIG.services;
    }
    
    // 3. Fetch portfolio items
    const portfolioSnap = await getDocs(collection(db, "portfolio"));
    const portfolio = portfolioSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    
    // 4. Fetch videos
    const videosSnap = await getDocs(collection(db, "videos"));
    const videos = videosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    
    // 5. Fetch reviews
    const reviewsSnap = await getDocs(collection(db, "reviews"));
    const reviews = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    
    // 6. Fetch FAQs
    const faqsSnap = await getDocs(collection(db, "faqs"));
    const faqs = faqsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FAQItem[];

    // 7. Fetch Announcements
    const announcementsSnap = await getDocs(collection(db, "announcements"));
    const announcements = announcementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AnnouncementItem[];
    
    // 8. Fetch Banners
    const bannersSnap = await getDocs(collection(db, "banners"));
    let banners = bannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    if (banners.length === 0) {
      banners = DEFAULT_CONFIG.banners;
    } else {
      banners.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    // 9. Fetch Pricing List
    const pricingSnap = await getDocs(collection(db, "pricingList"));
    let pricingList = pricingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    if (pricingList.length === 0) {
      pricingList = DEFAULT_CONFIG.pricingList;
    } else {
      pricingList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    return {
      settings,
      services,
      portfolio,
      videos,
      reviews,
      faqs,
      announcements,
      banners,
      pricingList
    };
  } catch (error) {
    console.error("Error loading config from Firebase:", error);
    return {
      ...DEFAULT_CONFIG,
      faqs: [],
      announcements: []
    };
  }
}

// --- FIRESTORE WRITES AND CREUD OPERATIONS ---

// Save general settings
export async function saveSettingsToFirebase(settings: any): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = "config/settings";
  try {
    await setDoc(doc(db, "config", "settings"), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Services CRUD
export async function addServiceToFirebase(service: ServiceItem, order: number): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `services/${service.id}`;
  try {
    await setDoc(doc(db, "services", service.id), { ...service, order });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateServiceInFirebase(serviceId: string, service: Partial<ServiceItem>): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `services/${serviceId}`;
  try {
    await updateDoc(doc(db, "services", serviceId), service);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteServiceFromFirebase(serviceId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `services/${serviceId}`;
  try {
    await deleteDoc(doc(db, "services", serviceId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveAllServicesOrder(services: ServiceItem[]): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  for (let i = 0; i < services.length; i++) {
    const serviceId = services[i].id;
    const path = `services/${serviceId}`;
    try {
      await updateDoc(doc(db, "services", serviceId), { order: i });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

// Portfolio CRUD
export async function addPortfolioToFirebase(item: any): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `portfolio/${item.id}`;
  try {
    await setDoc(doc(db, "portfolio", item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deletePortfolioFromFirebase(itemId: string, fileUrl?: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `portfolio/${itemId}`;
  try {
    await deleteDoc(doc(db, "portfolio", itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
  if (fileUrl) {
    await deleteFromStorage(fileUrl);
  }
}

export async function updatePortfolioInFirebase(itemId: string, item: any): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `portfolio/${itemId}`;
  try {
    await setDoc(doc(db, "portfolio", itemId), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Videos CRUD
export async function addVideoToFirebase(item: any): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `videos/${item.id}`;
  try {
    await setDoc(doc(db, "videos", item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteVideoFromFirebase(itemId: string, videoUrl?: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `videos/${itemId}`;
  try {
    await deleteDoc(doc(db, "videos", itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
  if (videoUrl) {
    await deleteFromStorage(videoUrl);
  }
}

// Reviews CRUD
export async function addReviewToFirebase(item: any): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `reviews/${item.id}`;
  try {
    await setDoc(doc(db, "reviews", item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteReviewFromFirebase(itemId: string, imageUrl?: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `reviews/${itemId}`;
  try {
    await deleteDoc(doc(db, "reviews", itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
  if (imageUrl) {
    await deleteFromStorage(imageUrl);
  }
}

// FAQs CRUD
export async function addFAQToFirebase(item: FAQItem): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `faqs/${item.id}`;
  try {
    await setDoc(doc(db, "faqs", item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteFAQFromFirebase(itemId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `faqs/${itemId}`;
  try {
    await deleteDoc(doc(db, "faqs", itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Announcements CRUD
export async function addAnnouncementToFirebase(item: AnnouncementItem): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `announcements/${item.id}`;
  try {
    await setDoc(doc(db, "announcements", item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteAnnouncementFromFirebase(itemId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const path = `announcements/${itemId}`;
  try {
    await deleteDoc(doc(db, "announcements", itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
