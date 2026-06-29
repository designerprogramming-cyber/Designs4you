import { AdminSettings } from './types';

/**
 * Designs4you Service Center - Admin Settings
 * Changing values here will dynamically update the website's configuration,
 * including primary WhatsApp forwarding numbers, phone calls, social links, and brand colors.
 */
export const SETTINGS: AdminSettings = {
  company: "Designs4you",
  whatsapp: "201006464349", // Clean international format for WhatsApp API
  phone: "01006464349",
  email: "designerprogramming@gmail.com",
  address: {
    ar: "مصر، القاهرة، جسر السويس",
    en: "Gesr El-Suez, Cairo, Egypt"
  },
  workingHours: {
    ar: "يومياً من الساعة 10:00 صباحاً وحتى 10:00 مساءً",
    en: "Daily from 10:00 AM to 10:00 PM"
  },
  mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.123456789012!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1719600000000!5m2!1sen!2seg",
  social: {
    facebook: "https://www.facebook.com/designs4you",
    instagram: "https://www.instagram.com/designs4you",
    tiktok: "https://www.tiktok.com/@designs4you",
    youtube: "https://www.youtube.com/@designs4you"
  },
  primaryColor: "#0A84FF",
  secondaryColor: "#25D366",
  defaultLanguage: "ar",
  prices: {
    embroidery: {
      ar: "تبدأ من 150 ج.م",
      en: "Starting from $10"
    },
    dtf: {
      ar: "تبدأ من 250 ج.م",
      en: "Starting from $15"
    },
    maintenance: {
      ar: "تبدأ من 300 ج.م",
      en: "Starting from $20"
    },
    course: {
      ar: "تبدأ من 1500 ج.م",
      en: "Starting from $99"
    }
  }
};

