import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Palette, 
  Wrench, 
  GraduationCap, 
  Shirt, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  ArrowLeft, 
  Check, 
  Loader2, 
  Globe, 
  Sparkles, 
  MapPin, 
  User, 
  Smartphone, 
  FileText, 
  ArrowRight,
  Calculator,
  MessageCircle,
  Briefcase,
  Upload,
  FileUp,
  FileCheck,
  X,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SETTINGS } from './settings';
import { TRANSLATIONS, SERVICES_DATA } from './translations';
import { Language, QuoteForm } from './types';
import AnnouncementBar from './components/AnnouncementBar';
import PortfolioGallery from './components/PortfolioGallery';
import VideoGallery from './components/VideoGallery';
import AdminDashboard from './components/AdminDashboard';
import { Star, ShieldCheck, Clock, Award, Users, ThumbsUp, Video as VideoIcon, Volume2, VolumeX } from 'lucide-react';
import { stateStore, addMaintenanceBooking, uploadFile, addQuickQuote } from './lib/stateStore';
import contentData from '../assets/data/content.json';
import { useCurrency } from './lib/currency';

interface BannerCarouselProps {
  banners: any[];
  lang: Language;
  onServiceClick: (link: string) => void;
}

function BannerCarousel({ banners, lang, onServiceClick }: BannerCarouselProps) {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIdx(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners?.length]);

  if (!banners || banners.length === 0) {
    const defaultTitle = TRANSLATIONS[lang]?.heroTitle || (lang === 'ar' ? 'ديزاينز فور يو لخدمات ماكينات التطريز' : 'Designs4you Embroidery Machine Services');
    const defaultDesc = TRANSLATIONS[lang]?.heroDesc || (lang === 'ar' ? 'المركز المتكامل والمعتمد الأول لصيانة وقطع غيار ماكينات التطريز والدعم الفني في الشرق الأوسط.' : 'The premier full-service certified center for embroidery machine maintenance, original spare parts, and support.');
    return (
      <div className="text-center max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          {defaultTitle}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed font-light">
          {defaultDesc}
        </p>
      </div>
    );
  }

  const activeSlide = banners[currentSlideIdx];

  return (
    <div className="relative w-full h-full min-h-[350px] sm:min-h-[400px] flex flex-col justify-center p-6 sm:p-12 text-center overflow-hidden animate-fade-in">
      {/* Background Media container */}
      <div className="absolute inset-0 z-0">
        {activeSlide.mediaType === 'video' ? (
          <video
            src={activeSlide.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-35"
          />
        ) : (
          <img
            src={activeSlide.mediaUrl}
            alt=""
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        <motion.div
          key={activeSlide.id + '_pill'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#0A84FF]/20 bg-[#0A84FF]/10 text-xs text-[#0A84FF] font-medium"
        >
          <Sparkles size={12} />
          <span>{lang === 'ar' ? "مركز الخدمة المعتمد الأول" : "The #1 Authorized Service Center"}</span>
        </motion.div>

        <motion.h1
          key={activeSlide.id + '_h1'}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight"
        >
          {activeSlide.title[lang] || activeSlide.title['ar']}
        </motion.h1>

        <motion.p
          key={activeSlide.id + '_p'}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto font-light"
        >
          {activeSlide.desc[lang] || activeSlide.desc['ar']}
        </motion.p>

        <motion.div
          key={activeSlide.id + '_btn'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <button
            onClick={() => {
              onServiceClick(activeSlide.btnLink || 'quote');
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            {activeSlide.btnText[lang] || activeSlide.btnText['ar']}
          </button>
        </motion.div>
      </div>

      {/* Bullets navigation indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentSlideIdx(dotIdx)}
              className={`w-2 h-2 rounded-full transition-all ${
                dotIdx === currentSlideIdx ? 'bg-[#0A84FF] w-4' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MaintenanceBookingFormProps {
  lang: Language;
}

function MaintenanceBookingForm({ lang }: MaintenanceBookingFormProps) {
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bFile, setBFile] = useState<File | null>(null);
  const [bFileUrl, setBFileUrl] = useState('');
  const [bFileUploading, setBFileUploading] = useState(false);

  const handleBFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const name = (target.elements.namedItem('bName') as HTMLInputElement).value;
    const phone = (target.elements.namedItem('bPhone') as HTMLInputElement).value;
    const whatsapp = (target.elements.namedItem('bWhatsapp') as HTMLInputElement).value;
    const emailVal = (target.elements.namedItem('bEmail') as HTMLInputElement).value;
    const machineType = (target.elements.namedItem('bType') as HTMLInputElement).value;
    const machineModel = (target.elements.namedItem('bModel') as HTMLInputElement).value;
    const problemDesc = (target.elements.namedItem('bDesc') as HTMLTextAreaElement).value;
    const contactTime = (target.elements.namedItem('bTime') as HTMLInputElement).value;

    if (!name || !phone || !problemDesc) {
      alert(lang === 'ar' ? 'يرجى ملء الحقول الإلزامية الأساسية.' : 'Please fill all mandatory fields.');
      return;
    }

    setBookingLoading(true);
    try {
      await addMaintenanceBooking({
        name,
        phone,
        whatsapp,
        email: emailVal,
        machineType,
        machineModel,
        problemDesc,
        fileUrl: bFileUrl,
        fileName: bFile ? bFile.name : '',
        contactTime
      });
      setBookingSent(true);
      setBFile(null);
      setBFileUrl('');
    } catch (err) {
      console.error(err);
      alert(lang === 'ar' ? 'فشل إرسال حجز الصيانة.' : 'Submission failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (bookingSent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center space-y-2">
        <Check className="w-8 h-8 text-green-400 mx-auto" />
        <p className="text-xs sm:text-sm font-bold text-white">{lang === 'ar' ? 'تم استلام طلب حجز الصيانة بنجاح!' : 'Maintenance booking request received!'}</p>
        <p className="text-[10px] text-gray-400">{lang === 'ar' ? 'سيقوم المهندس المتخصص بالتواصل معك عبر واتساب لتأكيد موعد الجلسة المباشرة.' : 'A certified technician will contact you on WhatsApp to confirm your slot.'}</p>
        <button onClick={() => setBookingSent(false)} className="px-4 py-1.5 bg-[#0A84FF] hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold mt-2 cursor-pointer">{lang === 'ar' ? 'حجز طلب آخر' : 'Book Another Session'}</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleBFormSubmit} className="space-y-3.5 bg-black/40 border border-white/5 p-4 sm:p-6 rounded-2xl text-start">
      <h4 className="text-xs text-[#0A84FF] font-black uppercase tracking-wider">{lang === 'ar' ? 'نموذج حجز صيانة عن بعد فوري' : 'Technical Support Booking Form'}</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}</label>
          <input type="text" name="bName" required className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'رقم الهاتف للاتصال *' : 'Phone number *'}</label>
          <input type="text" name="bPhone" required className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'رقم الواتساب الرئيسي للتواصل' : 'WhatsApp Number'}</label>
          <input type="text" name="bWhatsapp" className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
          <input type="email" name="bEmail" className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'نوع الماكينة (براذر، تاجيما، صيني..)' : 'Machine Brand (Tajima, Brother..)'}</label>
          <input type="text" name="bType" className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'الموديل / سنة الصنع' : 'Machine Model / Year'}</label>
          <input type="text" name="bModel" className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'شرح تفصيلي للمشكلة أو العطل *' : 'Problem Description *'}</label>
          <textarea name="bDesc" required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white resize-none" />
        </div>
        
        {/* Optional File/Video upload */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-gray-400 font-bold flex justify-between items-center">
            <span>{lang === 'ar' ? 'إرفاق صورة أو فيديو للمشكلة (اختياري)' : 'Upload error photo or video (Optional)'}</span>
            {bFileUploading && <Loader2 size={12} className="animate-spin text-[#0A84FF]" />}
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={bFileUrl ? (bFile?.name || (lang === 'ar' ? 'تم تحميل الملف المرفق' : 'File uploaded successfully')) : ''} 
              placeholder={lang === 'ar' ? 'لم يتم إرفاق ملفات عطل' : 'No diagnostic files attached'} 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-white" 
            />
            <input 
              type="file" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBFileUploading(true);
                try {
                  const url = await uploadFile(file, 'bookings');
                  setBFile(file);
                  setBFileUrl(url);
                } catch (err) {
                  console.error(err);
                } finally {
                  setBFileUploading(false);
                }
              }} 
              accept="image/*,video/*" 
              id="bFileInput" 
              className="hidden" 
            />
            <button type="button" onClick={() => document.getElementById('bFileInput')?.click()} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold cursor-pointer hover:bg-white/10">{lang === 'ar' ? 'إرفاق' : 'Browse'}</button>
          </div>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-gray-400 font-bold">{lang === 'ar' ? 'الوقت المفضل للتواصل الفوري' : 'Preferred contact time slot'}</label>
          <input type="text" name="bTime" placeholder="مثال: من 5 مساءً حتى 9 مساءً" className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white" />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={bookingLoading || bFileUploading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
      >
        {bookingLoading ? <Loader2 size={14} className="animate-spin" /> : <Wrench size={14} />}
        <span>{lang === 'ar' ? 'إرسال طلب الحجز الفوري للمهندس' : 'Deploy Support Request'}</span>
      </button>
    </form>
  );
}

function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return isNaN(r) || isNaN(g) || isNaN(b) ? '10, 132, 255' : `${r}, ${g}, ${b}`;
}

export default function App() {
  // Page Loading State
  const [loading, setLoading] = useState(true);

  // Dynamic configuration state
  const [config, setConfig] = useState(() => stateStore.getConfig());
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    const handleConfigChange = () => {
      setConfig(stateStore.getConfig());
    };
    window.addEventListener('designs4you_config_changed', handleConfigChange);
    return () => window.removeEventListener('designs4you_config_changed', handleConfigChange);
  }, []);

  // Shadow variables to point to the dynamic database seamlessly!
  const SETTINGS = config.settings;
  const SERVICES_DATA = config.services;
  const contentData = {
    portfolio: config.portfolio,
    videos: config.videos,
    reviews: config.reviews
  };

  const { convertPrice } = useCurrency(SETTINGS.enableAutoCurrency);

  // ==========================================================
  // BACKGROUND MUSIC ENGINE
  // ==========================================================
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('designs4you_music_pref');
    if (saved) return saved === 'OFF';
    return false; // Default is ON (unmuted), but waits for first visitor interaction
  });

  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
  const selectedTrackRef = useRef<any | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef<boolean>(false);
  const fadeIntervalRef = useRef<any>(null);

  // Fade utility
  const fadeAudio = (targetVolume: number, durationMs: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audioRef.current.volume;
    const difference = targetVolume - startVolume;
    const stepTimeMs = 50;
    const steps = durationMs / stepTimeMs;
    const volumeStep = difference / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current);
        return;
      }
      currentStep++;
      let newVolume = startVolume + (volumeStep * currentStep);
      
      if (newVolume < 0) newVolume = 0;
      if (newVolume > 1) newVolume = 1;
      
      audioRef.current.volume = newVolume;

      if (currentStep >= steps) {
        audioRef.current.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (onComplete) onComplete();
      }
    }, stepTimeMs);
  };

  // Select a random track on first load
  useEffect(() => {
    if (config.musicTracks && config.musicTracks.length > 0 && !selectedTrackRef.current) {
      const randomIndex = Math.floor(Math.random() * config.musicTracks.length);
      const track = config.musicTracks[randomIndex];
      setSelectedTrack(track);
      selectedTrackRef.current = track;
    }
  }, [config.musicTracks]);

  // Start playback logic
  const startPlayback = () => {
    if (!selectedTrackRef.current) return;
    
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(selectedTrackRef.current.url);
        audioRef.current.loop = true;
        audioRef.current.volume = 0;
      } else if (audioRef.current.src !== selectedTrackRef.current.url) {
        audioRef.current.pause();
        audioRef.current = new Audio(selectedTrackRef.current.url);
        audioRef.current.loop = true;
        audioRef.current.volume = 0;
      }

      audioRef.current.play()
        .then(() => {
          const targetVol = (config.settings.defaultVolume ?? 20) / 100;
          fadeAudio(targetVol, 2000);
        })
        .catch(err => {
          console.error('Playback failed:', err);
        });
    } catch (err) {
      console.error('Error starting playback:', err);
    }
  };

  // Interaction trigger
  const initAndPlayAudio = () => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;

    window.removeEventListener('click', initAndPlayAudio);
    window.removeEventListener('touchstart', initAndPlayAudio);
    window.removeEventListener('scroll', initAndPlayAudio);
    window.removeEventListener('keydown', initAndPlayAudio);

    if (config.settings.enableMusic && selectedTrackRef.current && !isMusicMuted) {
      startPlayback();
    }
  };

  useEffect(() => {
    window.addEventListener('click', initAndPlayAudio);
    window.addEventListener('touchstart', initAndPlayAudio);
    window.addEventListener('scroll', initAndPlayAudio);
    window.addEventListener('keydown', initAndPlayAudio);

    return () => {
      window.removeEventListener('click', initAndPlayAudio);
      window.removeEventListener('touchstart', initAndPlayAudio);
      window.removeEventListener('scroll', initAndPlayAudio);
      window.removeEventListener('keydown', initAndPlayAudio);
    };
  }, [config.settings.enableMusic, selectedTrack, isMusicMuted]);

  // React to admin toggling global music enable setting
  useEffect(() => {
    if (!config.settings.enableMusic) {
      if (audioRef.current && !audioRef.current.paused) {
        fadeAudio(0, 2000, () => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
        });
      }
    } else if (config.settings.enableMusic && hasInteractedRef.current && !isMusicMuted && selectedTrack) {
      startPlayback();
    }
  }, [config.settings.enableMusic, selectedTrack]);

  // React to volume changes
  useEffect(() => {
    if (audioRef.current && !isMusicMuted && !fadeIntervalRef.current) {
      audioRef.current.volume = (config.settings.defaultVolume ?? 20) / 100;
    }
  }, [config.settings.defaultVolume, isMusicMuted]);

  // Handle Mute Button toggle in header
  const toggleMusicPlayPreference = () => {
    const nextMuted = !isMusicMuted;
    setIsMusicMuted(nextMuted);
    localStorage.setItem('designs4you_music_pref', nextMuted ? 'OFF' : 'ON');

    if (nextMuted) {
      if (audioRef.current && !audioRef.current.paused) {
        fadeAudio(0, 2000, () => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
        });
      }
    } else {
      if (config.settings.enableMusic && selectedTrackRef.current) {
        startPlayback();
      }
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const showMusicButton = !!(config.settings.enableMusic && config.musicTracks && config.musicTracks.length > 0);

  // Dynamically update Site Identity in the browser document head
  useEffect(() => {
    // 1. Browser Title
    document.title = SETTINGS.browserTitle || SETTINGS.company || "Designs4you";

    // 2. Favicon
    if (SETTINGS.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = SETTINGS.faviconUrl;
    }

    // 3. Meta Description
    if (SETTINGS.metaDescription) {
      let meta: HTMLMetaElement | null = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = SETTINGS.metaDescription;
    }

    // 4. SEO Keywords
    if (SETTINGS.seoKeywords) {
      let meta: HTMLMetaElement | null = document.querySelector("meta[name='keywords']");
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'keywords';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = SETTINGS.seoKeywords;
    }
  }, [SETTINGS.browserTitle, SETTINGS.company, SETTINGS.faviconUrl, SETTINGS.metaDescription, SETTINGS.seoKeywords]);

  // Language State (retrieved from LocalStorage or settings default)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('designs4you_lang');
    if (saved === 'ar' || saved === 'en') return saved;
    return SETTINGS.defaultLanguage;
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Active Navigation View state: 'home', 'design', 'maintenance', 'courses', 'dtf', 'quote', 'admin'
  const [activeView, setActiveView] = useState<string>(() => {
    const hash = window.location.hash || '';
    if (window.location.pathname === '/admin' || hash === '#/admin' || hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });

  // Sync route path to activeView state
  useEffect(() => {
    const hash = window.location.hash || '';
    if (location.pathname === '/admin' || hash === '#/admin' || hash === '#admin') {
      if (activeView !== 'admin') {
        setActiveView('admin');
      }
    } else if (location.pathname === '/') {
      if (activeView === 'admin') {
        setActiveView('home');
      }
    }
  }, [location.pathname, activeView]);

  // Sync activeView state to route path
  useEffect(() => {
    if (activeView === 'admin') {
      if (location.pathname !== '/admin') {
        navigate('/admin');
      }
    } else {
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [activeView, location.pathname, navigate]);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Testimonials client-side submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'EG',
    rating: 5,
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.email || !reviewForm.phone || !reviewForm.comment) {
      return;
    }

    setReviewSubmitting(true);
    try {
      const newReview = {
        id: 'rev_' + Date.now(),
        name: reviewForm.name,
        email: reviewForm.email,
        phone: reviewForm.phone,
        country: reviewForm.country,
        rating: reviewForm.rating,
        comment: { ar: reviewForm.comment, en: reviewForm.comment },
        type: { ar: lang === 'ar' ? 'عميل الموقع' : 'Website Client', en: 'Website Client' },
        approved: false,
        status: 'pending',
        order: config.reviews.length
      };

      await stateStore.addPendingReview(newReview);
      
      setReviewSuccess(true);
      setReviewForm({
        name: '',
        email: '',
        phone: '',
        country: 'EG',
        rating: 5,
        comment: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Interactive Form State for Quick Quote
  const [form, setForm] = useState<QuoteForm>({
    name: '',
    phone: '',
    country: 'EG',
    region: '',
    department: '',
    service: '',
    notes: '',
    requestId: ''
  });

  // Validation & Form Submission Loading State
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload states and reference
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Country Geolocation detection
  useEffect(() => {
    const detectCountry = async () => {
      try {
        let res = await fetch('https://ipapi.co/json/');
        if (!res.ok) {
          res = await fetch('https://ip-api.com/json');
        }
        if (res.ok) {
          const data = await res.json();
          const countryCode = (data.country_code || data.countryCode)?.toUpperCase();
          if (countryCode && ['EG', 'SA', 'AE'].includes(countryCode)) {
            setForm(prev => ({ 
              ...prev, 
              country: countryCode as 'EG' | 'SA' | 'AE' | 'OTH',
              region: '' // clear region to match country
            }));
          } else if (countryCode) {
            setForm(prev => ({ 
              ...prev, 
              country: 'OTH',
              region: ''
            }));
          }
        }
      } catch (err) {
        console.warn('Country detection failed (defaulted to EG):', err);
      }
    };
    detectCountry();
  }, []);

  // Handle local file validation and selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(lang === 'ar' ? 'حجم الملف يتعدى الـ 20 ميجابايت الحد الأقصى.' : 'File size exceeds the 20MB maximum limit.');
      setSelectedFile(null);
      setForm(prev => ({ ...prev, designFileName: undefined, designFileSize: undefined }));
      return;
    }

    // Validate extension (Images, Videos, and Design files)
    const allowedExtensions = ['ai', 'cdr', 'dst', 'emb', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'mp4', 'mov', 'avi', 'mkv'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(fileExtension)) {
      setFileError(lang === 'ar' ? 'صيغة الملف غير مدعومة. الصيغ المسموحة: الصور، الفيديوهات، وملفات التصميم' : 'File format not supported. Supported: Images, Videos, and Design files.');
      setSelectedFile(null);
      setForm(prev => ({ ...prev, designFileName: undefined, designFileSize: undefined }));
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setForm(prev => ({ 
      ...prev, 
      designFileName: file.name,
      designFileSize: sizeInMB
    }));
  };

  // Load translations based on current language
  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  // Dynamic Sequential-looking Request ID generator
  useEffect(() => {
    if (activeView === 'quote' && !form.requestId) {
      const year = new Date().getFullYear();
      let countStr = localStorage.getItem('designs4you_request_count');
      let countNum = countStr ? parseInt(countStr, 10) : 0;
      
      // If first time, seed with a realistic sequential starting index
      if (countNum === 0) {
        countNum = Math.floor(Math.random() * 200) + 125;
        localStorage.setItem('designs4you_request_count', countNum.toString());
      }
      
      const paddedCount = String(countNum).padStart(6, '0');
      setForm(prev => ({ ...prev, requestId: `D4Y-${year}-${paddedCount}` }));
    }
  }, [activeView, form.requestId]);

  // Regional lists for Saudi Arabia and UAE
  const SA_REGIONS = useMemo(() => lang === 'ar' ? [
    "الرياض", "مكة المكرمة", "المنطقة الشرقية", "المدينة المنورة", "القصيم", "عسير", "تبوك", "حائل", "الحدود الشمالية", "جازان", "نجران", "الباحة", "الجوف"
  ] : [
    "Riyadh", "Makkah", "Eastern Province", "Madinah", "Al-Qassim", "Asir", "Tabuk", "Hail", "Northern Borders", "Jazan", "Najran", "Al-Baha", "Al-Jouff"
  ], [lang]);

  const AE_EMIRATES = useMemo(() => lang === 'ar' ? [
    "أبوظبي", "دبي", "الشارقة", "عجمان", "أم القيوين", "رأس الخيمة", "الفجيرة"
  ] : [
    "Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al-Quwain", "Ras Al-Khaimah", "Fujairah"
  ], [lang]);

  // Handle Initial App Loading Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sync Language changes to local storage, HTML attributes, and Fonts
  useEffect(() => {
    localStorage.setItem('designs4you_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = lang === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif";
  }, [lang]);

  // Toggle Language between English and Arabic
  const handleLanguageToggle = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Select a service from Home card
  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'quote') {
      // Clear form presets if clicked directly
      setForm(prev => ({ ...prev, department: '', service: '', country: 'EG', region: '' }));
      setActiveView('quote');
    } else {
      setActiveView(serviceId);
    }
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle choosing a specific option inside a Service Page
  const handleOptionSelect = (deptId: string, optionTitle: string) => {
    // Dynamically set both department and selected option in form state
    setForm(prev => ({
      ...prev,
      department: deptId,
      service: optionTitle
    }));
    setFormError(null);
    setActiveView('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered sub-services based on selected department in form
  const availableServices = useMemo(() => {
    if (!form.department) return [];
    const dept = SERVICES_DATA.find(s => s.id === form.department);
    return dept ? dept.options.map(opt => opt.title[lang]) : [];
  }, [form.department, lang]);

  // Handle department changes in Form dropdown
  const handleDepartmentChange = (deptId: string) => {
    setForm(prev => ({
      ...prev,
      department: deptId,
      service: '' // reset service on department change
    }));
  };

  // Form Field Change Handler
  const handleFieldChange = (field: keyof QuoteForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  // Submit Quote Form directly to WhatsApp URL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify presence of all required fields
    if (!form.name.trim() || !form.phone.trim() || !form.region.trim() || !form.department || !form.service) {
      setFormError(t.validationError);
      return;
    }

    // Phone format intelligence validation
    const digitsOnly = form.phone.replace(/\D/g, '');
    let isValidPhone = true;

    if (form.country === 'EG') {
      // Egyptian phone should be 11 digits (e.g. starting with 01) or 12 digits (with country code 201)
      if (!(digitsOnly.length === 11 && digitsOnly.startsWith('01')) && 
          !(digitsOnly.length === 12 && digitsOnly.startsWith('201'))) {
        isValidPhone = false;
      }
    } else if (form.country === 'SA') {
      // Saudi phone starts with 5 or 05, should be 9 or 10 digits respectively
      if (!(digitsOnly.length === 9 && digitsOnly.startsWith('5')) && 
          !(digitsOnly.length === 10 && digitsOnly.startsWith('05')) &&
          !(digitsOnly.length === 12 && digitsOnly.startsWith('966'))) {
        isValidPhone = false;
      }
    } else if (form.country === 'AE') {
      // UAE phone starts with 5 or 05, or 971 country code
      if (!(digitsOnly.length >= 9 && digitsOnly.length <= 13)) {
        isValidPhone = false;
      }
    } else {
      // General length fallback validation
      if (digitsOnly.length < 7) {
        isValidPhone = false;
      }
    }

    if (!isValidPhone) {
      setFormError(t.invalidPhoneError);
      return;
    }

    setIsSubmitting(true);

    // Get Department name in selected language
    const deptObj = SERVICES_DATA.find(s => s.id === form.department);
    const deptName = deptObj ? deptObj.title[lang] : form.department;

    // Get clean Country Name string
    const countryNames = {
      EG: lang === 'ar' ? 'مصر 🇪🇬' : 'Egypt 🇪🇬',
      SA: lang === 'ar' ? 'السعودية 🇸🇦' : 'Saudi Arabia 🇸🇦',
      AE: lang === 'ar' ? 'الإمارات 🇦🇪' : 'UAE 🇦🇪',
      OTH: lang === 'ar' ? 'دولة أخرى 🌐' : 'Other Country 🌐'
    };
    const countryName = countryNames[form.country];

    // Construct highly professional, beautifully structured WhatsApp message matching premium SaaS style
    const currentDate = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
    const currentTime = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US');

    let formattedMessage = `Request ID:
${form.requestId}

Name:
${form.name}

Country:
${countryName}

Region:
${form.region}

Phone:
${form.phone}

Department:
${deptName}

Selected Service:
${form.service}

Notes:
${form.notes || (lang === 'ar' ? 'لا يوجد' : 'None')}`;

    if (form.designFileName) {
      formattedMessage += `

Design File:
${form.designFileName} (${form.designFileSize})`;
    }

    formattedMessage += `

Date:
${currentDate}

Time:
${currentTime}`;

    // Save to Firestore/Local database as well to populate our Stats & Customers CRM!
    const quoteData = {
      name: form.name,
      phone: form.phone,
      country: form.country,
      region: form.region,
      department: form.department,
      service: form.service,
      notes: form.notes,
      requestId: form.requestId || `REQ-${Date.now().toString()}`,
      designFileName: form.designFileName,
      designFileSize: form.designFileSize,
      status: 'new' as const,
    };
    addQuickQuote(quoteData).catch(err => console.error('Failed to save quick quote in database:', err));

    // Increment Request ID count for subsequent request tracking
    let currentCount = localStorage.getItem('designs4you_request_count');
    let countNum = currentCount ? parseInt(currentCount, 10) : 0;
    localStorage.setItem('designs4you_request_count', (countNum + 1).toString());

    // URL encode the message
    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${SETTINGS.whatsapp}?text=${encodedMessage}`;

    // Simulate luxury processing effect then open WhatsApp
    setTimeout(() => {
      setIsSubmitting(false);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      // Reset Request ID and selected file to generate a fresh one for any future submissions
      setForm(prev => ({ ...prev, requestId: '', designFileName: undefined, designFileSize: undefined }));
      setSelectedFile(null);
    }, 1000);
  };

  // Helper to render lucide icon dynamically
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Shirt':
        return <Shirt className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#111111] text-white selection:bg-[#0A84FF] selection:text-white antialiased overflow-x-hidden">
      
      {/* Dynamic Theme Color Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${config.settings.primaryColor || '#0A84FF'};
          --secondary-color: ${config.settings.secondaryColor || '#25D366'};
        }
        
        /* Background overrides */
        .bg-\\[\\#0A84FF\\] { background-color: var(--primary-color) !important; }
        .bg-\\[\\#25D366\\] { background-color: var(--secondary-color) !important; }
        
        /* Text color overrides */
        .text-\\[\\#0A84FF\\] { color: var(--primary-color) !important; }
        .text-\\[\\#25D366\\] { color: var(--secondary-color) !important; }
        
        /* Border overrides */
        .border-\\[\\#0A84FF\\] { border-color: var(--primary-color) !important; }
        .border-\\[\\#25D366\\] { border-color: var(--secondary-color) !important; }
        
        /* Border opacity overrides */
        .border-\\[\\#0A84FF\\]\\/20 { border-color: rgba(${hexToRgb(config.settings.primaryColor || '#0A84FF')}, 0.2) !important; }
        .border-\\[\\#0A84FF\\]\\/25 { border-color: rgba(${hexToRgb(config.settings.primaryColor || '#0A84FF')}, 0.25) !important; }
        .border-\\[\\#25D366\\]\\/30 { border-color: rgba(${hexToRgb(config.settings.secondaryColor || '#25D366')}, 0.3) !important; }
        .border-\\[\\#0A84FF\\]\\/40 { border-color: rgba(${hexToRgb(config.settings.primaryColor || '#0A84FF')}, 0.4) !important; }
        
        /* Hover border overrides */
        .hover\\:border-\\[\\#0A84FF\\]\\/40:hover { border-color: rgba(${hexToRgb(config.settings.primaryColor || '#0A84FF')}, 0.4) !important; }
        .hover\\:border-\\[\\#25D366\\]\\/40:hover { border-color: rgba(${hexToRgb(config.settings.secondaryColor || '#25D366')}, 0.4) !important; }
        
        /* Background opacity overrides */
        .bg-\\[\\#0A84FF\\]\\/10 { background-color: rgba(${hexToRgb(config.settings.primaryColor || '#0A84FF')}, 0.1) !important; }
        .bg-\\[\\#25D366\\]\\/10 { background-color: rgba(${hexToRgb(config.settings.secondaryColor || '#25D366')}, 0.1) !important; }
        
        /* Hover background overrides */
        .hover\\:bg-\\[\\#0A84FF\\]:hover { background-color: var(--primary-color) !important; }
        .hover\\:bg-\\[\\#25D366\\]:hover { background-color: var(--secondary-color) !important; }
        
        /* Selection color */
        ::selection {
          background-color: var(--primary-color) !important;
          color: white !important;
        }
      ` }} />
      
      {/* Premium Ambient Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0A84FF]/10 blur-[150px] animate-pulse duration-[8000s]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#25D366]/5 blur-[130px] animate-pulse duration-[10000s]" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* 1. Loading Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            id="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111111] text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 border-4 border-[#0A84FF]/20 border-t-[#0A84FF] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#0A84FF] font-sans">D4Y</span>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-slate-200 to-[#0A84FF] bg-clip-text text-transparent mb-2">
                Designs4you
              </h1>
              <p className="text-sm tracking-wider text-gray-400 uppercase font-mono px-4">
                Service Center • مركز الخدمات
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Announcement Top Bar */}
      <AnnouncementBar lang={lang} />

      {/* 2. Premium Fixed Glassmorphic Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#111111]/80 border-b border-white/10 px-4 py-3 md:px-8 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          {/* Back button displayed when outside Home view */}
          {activeView !== 'home' && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-medium text-gray-300 cursor-pointer"
            >
              {lang === 'ar' ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{t.back}</span>
            </motion.button>
          )}
          
          <div 
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group flex items-center gap-2.5"
          >
            {SETTINGS.logoUrl ? (
              <img 
                src={SETTINGS.logoUrl} 
                alt={SETTINGS.company} 
                className="h-9 w-auto object-contain rounded-lg border border-white/10 p-0.5 bg-black/25" 
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-extrabold text-white tracking-tight group-hover:text-[#0A84FF] transition-colors font-sans">
                {SETTINGS.company}
              </span>
              <span className="text-[9px] md:text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Service Center
              </span>
            </div>
          </div>
        </div>

        {/* Action Group - Top Right */}
        <div className="flex items-center gap-2.5">
          {/* Background Music Button */}
          {showMusicButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMusicPlayPreference}
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5 text-xs text-white backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer shadow-md"
              title={isMusicMuted ? (lang === 'ar' ? "تشغيل الموسيقى" : "Play Music") : (lang === 'ar' ? "كتم الموسيقى" : "Mute Music")}
            >
              {isMusicMuted ? (
                <VolumeX size={15} className="text-gray-400" />
              ) : (
                <Volume2 size={15} className="text-[#0A84FF] animate-pulse" />
              )}
            </motion.button>
          )}

          {/* Translation Switcher */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLanguageToggle}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer shadow-md"
            title={lang === 'ar' ? "Switch to English" : "تغيير للغة العربية"}
          >
            <Globe size={14} className="text-[#0A84FF]" />
            <span>{lang === 'ar' ? "English" : "العربية"}</span>
            <span className="text-sm">{lang === 'ar' ? "🇺🇸" : "🇪🇬"}</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col z-10 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Routes>
          <Route path="/admin" element={
            <motion.section
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex-1"
            >
              <AdminDashboard lang={lang} />
            </motion.section>
          } />
          <Route path="*" element={
            <AnimatePresence mode="wait">
          
          {/* --- VIEW: HOME --- */}
          {activeView === 'home' && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex-1 flex flex-col justify-center"
            >
              {/* Dynamic Banner Carousel Slider */}
              <div className="relative w-full max-w-5xl mx-auto mb-12 md:mb-16 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 min-h-[350px] flex items-center justify-center">
                <BannerCarousel
                  banners={config.banners || []}
                  lang={lang}
                  onServiceClick={handleServiceClick}
                />
              </div>

              {/* Grid of Bento Services Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES_DATA.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    onClick={() => handleServiceClick(service.id)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xl hover:border-[#0A84FF]/40 hover:bg-white/[0.08] transition-all flex flex-col justify-between"
                  >
                    {/* Hover Glow Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A84FF]/10 rounded-full blur-2xl group-hover:bg-[#0A84FF]/25 transition-all" />
                    
                    <div>
                      {/* Top Action line */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/25 flex items-center justify-center text-[#0A84FF] group-hover:bg-[#0A84FF] group-hover:text-white transition-all duration-300">
                          {renderIcon(service.icon, "w-6 h-6")}
                        </div>
                        <span className="text-xs font-mono font-bold text-[#0A84FF] group-hover:underline">
                          {lang === 'ar' ? 'عرض القسم ←' : 'Explore →'}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#0A84FF] transition-colors">
                        {service.title[lang]}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed mb-6">
                        {service.description[lang]}
                      </p>
                    </div>

                    {/* Bottom visual helper */}
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 group-hover:text-white transition-colors pt-2 border-t border-white/5">
                      <span>{lang === 'ar' ? `متاح (${service.options.length}) خدمات فرعية` : `Available (${service.options.length}) sub-services`}</span>
                      {lang === 'ar' ? <ChevronLeft size={12} className="group-hover:translate-x-[-4px] transition-transform" /> : <ChevronRight size={12} className="group-hover:translate-x-[4px] transition-transform" />}
                    </div>
                  </motion.div>
                ))}

                {/* HIGHLIGHTED: Quick Quote Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => handleServiceClick('quote')}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-[#25D366]/30 bg-gradient-to-br from-[#25D366]/5 to-transparent backdrop-blur-md p-6 shadow-xl hover:border-[#25D366]/60 hover:bg-[#25D366]/10 transition-all flex flex-col justify-between md:col-span-2 lg:col-span-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/10 rounded-full blur-2xl" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-[#25D366]">
                        {lang === 'ar' ? 'فوري وجاهز' : 'Instant & Live'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#25D366] transition-colors">
                      💰 {t.quickQuoteTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                      {lang === 'ar' 
                        ? 'احصل على تسعير فوري ومباشر لجميع احتياجاتك وتواصل مع الإدارة المختصة عبر واتساب بضغطة واحدة.'
                        : 'Get a quick, instant estimate for all your requirements and text the administration directly via WhatsApp in one click.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#25D366] pt-2 border-t border-[#25D366]/15">
                    <span>{lang === 'ar' ? 'اطلب تسعيراً الآن' : 'Request Quote Now'}</span>
                    {lang === 'ar' ? <ChevronLeft size={12} className="group-hover:translate-x-[-4px] transition-transform" /> : <ChevronRight size={12} className="group-hover:translate-x-[4px] transition-transform" />}
                  </div>
                </motion.div>
              </div>

              {/* Estimated Starting Prices Section */}
              <div className="py-16 mt-12 border-t border-white/5 relative">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#0A84FF]/20 bg-[#0A84FF]/10 text-xs text-[#0A84FF] font-medium mb-3"
                  >
                    <Calculator size={12} />
                    <span>{lang === 'ar' ? 'أسعار تنافسية مبدئية' : 'Competitive Starting Rates'}</span>
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-white mb-3">
                    {lang === 'ar' ? 'الأسعار التقديرية المبدئية' : 'Estimated Starting Prices'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {lang === 'ar' ? 'شفافية كاملة في التسعير لمساعدتك على بدء العمل والاستثمار بثقة.' : 'Complete transparent estimates to help you plan your workflow and investment.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {(config.pricingList || []).map((card, idx) => {
                    const converted = convertPrice(card.price);
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * idx }}
                        whileHover={{ y: -4 }}
                        className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] hover:border-[#0A84FF]/30 transition-all text-center flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] mx-auto mb-4">
                            {renderIcon(card.icon, "w-5 h-5")}
                          </div>
                          <h3 className="text-sm font-bold text-gray-300 mb-2">{card.title[lang]}</h3>
                        </div>
                        <div className="mt-4">
                          <span className="text-2xl font-black text-white block">
                            {converted.amount} <span className="text-xs font-bold text-[#0A84FF]">{converted.symbol[lang]}</span>
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">{card.unit?.[lang]}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Portfolio Gallery Section */}
              <PortfolioGallery lang={lang} />

              {/* Why Choose Us Section */}
              <div className="py-16 mt-12 border-t border-white/5">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs text-blue-400 font-medium mb-3"
                  >
                    <ShieldCheck size={12} />
                    <span>{lang === 'ar' ? 'الجودة والموثوقية المضمونة' : 'Certified Quality & Support'}</span>
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-white mb-3">
                    {t.whyTitle}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {t.whySubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Item 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:border-[#0A84FF]/30 transition-all"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#0A84FF]/5 rounded-full blur-xl group-hover:bg-[#0A84FF]/15 transition-all" />
                    <div className="w-12 h-12 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] mb-4">
                      <Award size={22} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{t.whyItem1Title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{t.whyItem1Desc}</p>
                  </motion.div>

                  {/* Item 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:border-green-500/30 transition-all"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full blur-xl group-hover:bg-green-500/15 transition-all" />
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-4">
                      <Clock size={22} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{t.whyItem2Title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{t.whyItem2Desc}</p>
                  </motion.div>

                  {/* Item 3 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition-all" />
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                      <Sparkles size={22} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{t.whyItem3Title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{t.whyItem3Desc}</p>
                  </motion.div>

                  {/* Item 4 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/15 transition-all" />
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                      <GraduationCap size={22} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{t.whyItem4Title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{t.whyItem4Desc}</p>
                  </motion.div>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="py-16 border-t border-white/5 relative bg-[#111111]/10">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-xs text-yellow-400 font-medium mb-3"
                  >
                    <ThumbsUp size={12} />
                    <span>{lang === 'ar' ? 'توصيات شركائنا الموثوقة' : 'Highly Recommended'}</span>
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-white mb-3">
                    {t.reviewsTitle}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {t.reviewsSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {((contentData.reviews || []).filter((r: any) => r.approved !== false && r.status !== 'pending' && r.status !== 'rejected')).map((review: any, index: number) => {
                    const initials = review.name ? review.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                    const gradientClasses = [
                      'from-[#0A84FF] to-blue-500',
                      'from-purple-500 to-pink-500',
                      'from-[#25D366] to-teal-500',
                    ][index % 3];

                    return (
                      <motion.div
                        key={review.id || index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] backdrop-blur-md relative flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex gap-1 mb-4 text-amber-400">
                            {[...Array(review.rating || 5)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed mb-6">
                            " {review.comment[lang]} "
                          </p>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                          {review.image ? (
                            <img 
                              src={review.image} 
                              alt={review.name} 
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-white/20"
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${gradientClasses} flex items-center justify-center text-white font-bold text-xs font-mono`}>
                              {initials}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-white">
                              {review.name} {review.country ? (review.country === 'EG' ? '🇪🇬' : review.country === 'SA' ? '🇸🇦' : review.country === 'AE' ? '🇦🇪' : '🌐') : ''}
                            </h4>
                            <span className="text-[10px] text-gray-500">
                              {review.type ? review.type[lang] : (lang === 'ar' ? 'شريك معتمد' : 'Verified Partner')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Submit review button */}
                <div className="text-center mt-12">
                  <button
                    onClick={() => {
                      setReviewSuccess(false);
                      setShowReviewModal(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs sm:text-sm shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 font-bold"
                  >
                    <ThumbsUp size={14} />
                    <span>{lang === 'ar' ? 'أضف تقييمك وتجربتك معنا' : 'Write a Review & Rate Us'}</span>
                  </button>
                </div>

                {/* Review Form Modal */}
                {showReviewModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#0c0d10] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-4 relative shadow-2xl"
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif" }}
                    >
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full cursor-pointer"
                      >
                        <X size={18} />
                      </button>

                      <div className="text-center">
                        <ThumbsUp className="w-8 h-8 text-yellow-500 mx-auto mb-2 animate-bounce" />
                        <h3 className="text-md sm:text-lg font-black text-white">{lang === 'ar' ? 'أضف تقييمك للمركز' : 'Share Your Experience'}</h3>
                        <p className="text-xs text-gray-400 mt-1">{lang === 'ar' ? 'يسعدنا سماع رأيك لتحسين خدماتنا باستمرار' : 'We love hearing your feedback to keep improving'}</p>
                      </div>

                      {reviewSuccess ? (
                        <div className="text-center py-6 space-y-3">
                          <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto border border-[#25D366]/20">
                            <Check size={24} />
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-white">
                            {lang === 'ar' ? 'تم إرسال تقييمك للمراجعة بنجاح!' : 'Your review was submitted for review!'}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {lang === 'ar' 
                              ? 'شكرًا لك على مشاركة تجربتك. سيتم مراجعة التقييم واعتماده من قبل الإدارة قريبًا.' 
                              : 'Thank you for sharing your experience. Our team will review and approve it shortly.'}
                          </p>
                          <button
                            onClick={() => setShowReviewModal(false)}
                            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 cursor-pointer"
                          >
                            {lang === 'ar' ? 'إغلاق النافذة' : 'Close'}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-4 text-start">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-400 font-bold">{lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}</label>
                              <input
                                type="text"
                                required
                                value={reviewForm.name}
                                onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="محمد أحمد"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-400 font-bold">{lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                              <input
                                type="tel"
                                required
                                value={reviewForm.phone}
                                onChange={e => setReviewForm(p => ({ ...p, phone: e.target.value }))}
                                placeholder="002010..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono text-start focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-400 font-bold">{lang === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}</label>
                              <input
                                type="email"
                                required
                                value={reviewForm.email}
                                onChange={e => setReviewForm(p => ({ ...p, email: e.target.value }))}
                                placeholder="example@mail.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-400 font-bold">{lang === 'ar' ? 'البلد / الدولة *' : 'Country *'}</label>
                              <select
                                value={reviewForm.country}
                                onChange={e => setReviewForm(p => ({ ...p, country: e.target.value }))}
                                className="w-full bg-[#0c0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              >
                                <option value="EG">🇪🇬 {lang === 'ar' ? 'مصر' : 'Egypt'}</option>
                                <option value="SA">🇸🇦 {lang === 'ar' ? 'السعودية' : 'Saudi Arabia'}</option>
                                <option value="AE">🇦🇪 {lang === 'ar' ? 'الإمارات' : 'UAE'}</option>
                                <option value="YE">🇾🇪 {lang === 'ar' ? 'اليمن' : 'Yemen'}</option>
                                <option value="OM">🇴🇲 {lang === 'ar' ? 'عمان' : 'Oman'}</option>
                                <option value="QA">🇶🇦 {lang === 'ar' ? 'قطر' : 'Qatar'}</option>
                                <option value="KW">🇰🇼 {lang === 'ar' ? 'الكويت' : 'Kuwait'}</option>
                                <option value="BH">🇧🇭 {lang === 'ar' ? 'البحرين' : 'Bahrain'}</option>
                                <option value="JO">🇯🇴 {lang === 'ar' ? 'الأردن' : 'Jordan'}</option>
                                <option value="IQ">🇮🇶 {lang === 'ar' ? 'العراق' : 'Iraq'}</option>
                                <option value="OTH">🌐 {lang === 'ar' ? 'دولة أخرى' : 'Other Country'}</option>
                              </select>
                            </div>
                          </div>

                          {/* Star Rating Select */}
                          <div className="space-y-1 text-center">
                            <label className="text-[10px] text-gray-400 font-bold block">{lang === 'ar' ? 'التقييم العام *' : 'Overall Rating *'}</label>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                                  className="text-amber-400 hover:scale-110 active:scale-95 transition-all cursor-pointer p-1"
                                >
                                  <Star size={24} fill={star <= reviewForm.rating ? "currentColor" : "none"} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1 text-start">
                            <label className="text-[10px] text-gray-400 font-bold">{lang === 'ar' ? 'التعليق / الملاحظات *' : 'Comment / Review Notes *'}</label>
                            <textarea
                              required
                              rows={3}
                              value={reviewForm.comment}
                              onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                              placeholder={lang === 'ar' ? 'اكتب تجربتك معنا بالتفصيل...' : 'Write your feedback here...'}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={reviewSubmitting}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 font-bold"
                          >
                            {reviewSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
                            <span>{lang === 'ar' ? 'إرسال التقييم للمراجعة' : 'Submit Review'}</span>
                          </button>
                        </form>
                      )}
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Dynamic FAQ Accordion Section */}
              {config.faqs && config.faqs.length > 0 && (
                <div className="py-16 border-t border-white/5 relative bg-[#111111]/10">
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#0A84FF]/20 bg-[#0A84FF]/10 text-xs text-[#0A84FF] font-medium mb-3"
                    >
                      <HelpCircle size={12} />
                      <span>{lang === 'ar' ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}</span>
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-white mb-3">
                      {lang === 'ar' ? 'الأسئلة الشائعة وإجاباتها' : 'FAQs & Answers'}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {lang === 'ar' ? 'كل ما تود معرفته عن خدمات Designs4you وتفاصيل الشحن والصيانة والدعم الفني.' : 'Everything you need to know about Designs4you services, support, maintenance, and training.'}
                    </p>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-4 px-4 sm:px-0">
                    {config.faqs.map((faq: any) => {
                      const isFaqOpen = openFaqId === faq.id;
                      return (
                        <div 
                          key={faq.id} 
                          className="rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenFaqId(isFaqOpen ? null : faq.id)}
                            className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white focus:outline-none cursor-pointer"
                          >
                            <span>{faq.question[lang] || faq.question['ar']}</span>
                            <div className={`w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 transition-transform duration-300 ${isFaqOpen ? 'rotate-180 text-[#0A84FF]' : ''}`}>
                              <ChevronDown size={14} />
                            </div>
                          </button>
                          
                          {isFaqOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 pt-0 border-t border-white/5 text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">
                                {faq.answer[lang] || faq.answer['ar']}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Video Gallery Section */}
              <VideoGallery lang={lang} />
            </motion.section>
          )}

          {/* --- VIEW: SERVICES OPTIONS (DYNAMIC PER ID) --- */}
          {activeView !== 'home' && activeView !== 'quote' && (
            (() => {
              const currentDept = SERVICES_DATA.find(s => s.id === activeView);
              if (!currentDept) return null;
              
              return (
                <motion.section
                  key={currentDept.id}
                  initial={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Department Page Header */}
                  <div className="mb-10 text-center max-w-3xl mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] mx-auto mb-4">
                      {renderIcon(currentDept.icon, "w-8 h-8")}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                      {currentDept.title[lang]}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
                      {currentDept.description[lang]}
                    </p>
                  </div>

                  {/* List of sub-service options */}
                  <div className="max-w-2xl mx-auto w-full grid grid-cols-1 gap-4">
                    {currentDept.options.map((option, idx) => (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => handleOptionSelect(currentDept.id, option.title[lang])}
                        className="group cursor-pointer relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#0A84FF]/30 p-5 transition-all flex items-center justify-between shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[#0A84FF] flex items-center justify-center text-xs font-bold font-mono">
                            0{idx + 1}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-gray-100 group-hover:text-white transition-colors">
                            {option.title[lang]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-gray-500 group-hover:text-[#0A84FF] transition-colors">
                            {lang === 'ar' ? 'طلب الخدمة' : 'Request'}
                          </span>
                          <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#0A84FF] group-hover:text-white flex items-center justify-center transition-all">
                            {lang === 'ar' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* SPECIAL MAINTENANCE SUB-SECTIONS (REMOTE BOOKING & SPARE PARTS SHOWROOM) */}
                  {currentDept.id === 'maintenance' && (
                    <div className="max-w-2xl mx-auto w-full mt-10 space-y-8">
                      {/* Section: Remote Maintenance & Diagnostics */}
                      <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-950/20 to-black/40 border border-[#0A84FF]/30 rounded-3xl relative overflow-hidden space-y-4">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0A84FF]/10 rounded-full blur-xl" />
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-[#0A84FF] animate-bounce" />
                          <span>{lang === 'ar' ? 'خدمة الصيانة والدعم الفني عن بعد' : 'Remote Maintenance & Live Diagnostics'}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {lang === 'ar' 
                            ? 'الآن يمكنك حجز جلسة صيانة تفاعلية ومباشرة مع مهندسينا لحل مشاكل ماكينات التطريز وضبط الإعدادات عن بعد.'
                            : 'Book a live video call or screen session with our expert engineers to diagnose issues, recalibrate, and get technical guidance.'}
                        </p>
                        
                        {/* Interactive Booking Form Component */}
                        <div className="pt-2">
                          <MaintenanceBookingForm lang={lang} />
                        </div>
                      </div>

                      {/* Section: Spare Parts & Components Gallery Integration */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h3 className="text-md sm:text-lg font-black text-white">{lang === 'ar' ? 'قطع الغيار والإكسسوارات المتاحة' : 'Spare Parts & Accessories Inventory'}</h3>
                          <span className="text-[10px] text-gray-500 font-mono">LIVE STORE</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {lang === 'ar' 
                            ? 'معرض تفاعلي لأجود أنواع قطع الغيار الأصلية والملحقات المتوفرة لدينا لماكينات التطريز.'
                            : 'An aesthetic interactive display of our genuine, high-grade replacement parts and components.'}
                        </p>

                        {/* Fetch from portfolio where category === 'maintenance' */}
                        {(() => {
                          const parts = (config.portfolio || []).filter(item => item.category === 'maintenance');
                          if (parts.length === 0) {
                            return (
                              <div className="text-center py-8 bg-white/[0.01] border border-white/5 rounded-2xl">
                                <p className="text-xs text-gray-500">{lang === 'ar' ? 'لا يوجد صور قطع غيار في المعرض حالياً.' : 'No spare parts photos listed.'}</p>
                              </div>
                            );
                          }
                          return (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-start">
                              {parts.map((item, idx) => (
                                <motion.div
                                  key={item.id || idx}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  whileHover={{ y: -3 }}
                                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 aspect-square cursor-pointer"
                                  onClick={() => handleServiceClick('quote')}
                                >
                                  <img src={item.url} alt={item.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-end">
                                    <p className="text-xs font-bold text-white truncate">{item.title[lang]}</p>
                                    <p className="text-[9px] text-[#0A84FF] font-bold mt-0.5">{lang === 'ar' ? 'اضغط لطلب القطعة' : 'Inquire component'}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                    </div>
                  )}

                  {/* Back button at bottom for easier thumb reach */}
                  <div className="text-center mt-12">
                    <button
                      onClick={() => {
                        setActiveView('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-all cursor-pointer"
                    >
                      {lang === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                      <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
                    </button>
                  </div>
                </motion.section>
              );
            })()
          )}

          {/* --- VIEW: QUICK QUOTE FORM --- */}
          {activeView === 'quote' && (
            <motion.section
              key="quote"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-xl">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] mx-auto mb-4 animate-pulse">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    {t.quickQuoteTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                    {t.quoteFormDesc}
                  </p>
                </div>

                {/* Form Container */}
                <form 
                  onSubmit={handleSubmit}
                  className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative"
                >
                  {/* Subtle Top Glow Accent */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#25D366] to-transparent" />

                  {formError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold text-center"
                    >
                      {formError}
                    </motion.div>
                  )}

                  {/* Form fields layout */}
                  <div className="space-y-5">
                    {/* Glassmorphic Auto-generated Request ID Badge */}
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-ping" />
                        <span>{t.requestIdLabel}</span>
                      </div>
                      <span className="text-[#0A84FF] font-bold tracking-wider text-sm bg-[#0A84FF]/10 px-2.5 py-1 rounded-md border border-[#0A84FF]/25">
                        {form.requestId || 'Generating...'}
                      </span>
                    </div>

                    {/* Field 1: Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                        <User size={13} className="text-[#0A84FF]" />
                        <span>{t.formName} <span className="text-red-400">*</span></span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder={lang === 'ar' ? 'مثال: محمد أحمد' : 'e.g. John Doe'}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all text-sm font-medium text-white"
                      />
                    </div>

                    {/* New Field: Country Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                        <Globe size={13} className="text-[#0A84FF]" />
                        <span>{t.countrySelect} <span className="text-red-400">*</span></span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['EG', 'SA', 'AE', 'OTH'] as const).map((cKey) => {
                          const isSelected = form.country === cKey;
                          const flagLabel = {
                            EG: t.egFlag,
                            SA: t.saFlag,
                            AE: t.aeFlag,
                            OTH: t.othFlag
                          }[cKey];
                          return (
                            <button
                              key={cKey}
                              type="button"
                              onClick={() => {
                                setForm(prev => ({ ...prev, country: cKey, region: '' }));
                                if (formError) setFormError(null);
                              }}
                              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white shadow-lg' 
                                  : 'bg-[#111111]/30 border-white/10 text-gray-400 hover:border-white/20'
                              }`}
                            >
                              {flagLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Field 2: Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                        <Smartphone size={13} className="text-[#0A84FF]" />
                        <span>{t.formPhone} <span className="text-red-400">*</span></span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={form.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder={
                          form.country === 'EG' ? '01xxxxxxxxx' :
                          form.country === 'SA' ? '05xxxxxxxx' :
                          form.country === 'AE' ? '05xxxxxxxx' :
                          '+1 234...'
                        }
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all text-sm font-medium tracking-wide font-mono text-white text-left dir-ltr"
                      />
                    </div>

                    {/* Grid of Gov and Dept */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Field 3: Governorate / Region Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                          <MapPin size={13} className="text-[#0A84FF]" />
                          <span>{t.regionSelect} <span className="text-red-400">*</span></span>
                        </label>
                        
                        {form.country === 'EG' && (
                          <select
                            required
                            value={form.region}
                            onChange={(e) => handleFieldChange('region', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] text-sm font-medium text-white appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#111111]">{lang === 'ar' ? '-- اختر المحافظة --' : '-- Select Governorate --'}</option>
                            {t.govs.map((gov) => (
                              <option key={gov} value={gov} className="bg-[#111111]">{gov}</option>
                            ))}
                          </select>
                        )}

                        {form.country === 'SA' && (
                          <select
                            required
                            value={form.region}
                            onChange={(e) => handleFieldChange('region', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] text-sm font-medium text-white appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#111111]">{lang === 'ar' ? '-- اختر المنطقة --' : '-- Select Region --'}</option>
                            {SA_REGIONS.map((region) => (
                              <option key={region} value={region} className="bg-[#111111]">{region}</option>
                            ))}
                          </select>
                        )}

                        {form.country === 'AE' && (
                          <select
                            required
                            value={form.region}
                            onChange={(e) => handleFieldChange('region', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] text-sm font-medium text-white appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#111111]">{lang === 'ar' ? '-- اختر الإمارات --' : '-- Select Emirate --'}</option>
                            {AE_EMIRATES.map((emirate) => (
                              <option key={emirate} value={emirate} className="bg-[#111111]">{emirate}</option>
                            ))}
                          </select>
                        )}

                        {form.country === 'OTH' && (
                          <input 
                            type="text" 
                            required
                            value={form.region}
                            onChange={(e) => handleFieldChange('region', e.target.value)}
                            placeholder={lang === 'ar' ? 'اكتب اسم المدينة والدولة' : 'City, Country Name'}
                            className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all text-sm font-medium text-white"
                          />
                        )}
                      </div>

                      {/* Field 4: Department */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                          <Briefcase size={13} className="text-[#0A84FF]" />
                          <span>{t.formDept} <span className="text-red-400">*</span></span>
                        </label>
                        <select
                          required
                          value={form.department}
                          onChange={(e) => handleDepartmentChange(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] text-sm font-medium text-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled className="bg-[#111111]">{lang === 'ar' ? '-- اختر القسم --' : '-- Select --'}</option>
                          {SERVICES_DATA.map((dept) => (
                            <option key={dept.id} value={dept.id} className="bg-[#111111]">{dept.title[lang]}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Field 5: Service */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                        <Check size={13} className="text-[#0A84FF]" />
                        <span>{t.formService} <span className="text-red-400">*</span></span>
                      </label>
                      <select
                        required
                        disabled={!form.department}
                        value={form.service}
                        onChange={(e) => handleFieldChange('service', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#111111]">
                          {!form.department ? t.selectDeptPlaceholder : t.selectServicePlaceholder}
                        </option>
                        {availableServices.map((srv) => (
                          <option key={srv} value={srv} className="bg-[#111111]">{srv}</option>
                        ))}
                      </select>
                    </div>

                    {/* Field 6: Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                        <FileText size={13} className="text-[#0A84FF]" />
                        <span>{t.formNotes}</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => handleFieldChange('notes', e.target.value)}
                        placeholder={lang === 'ar' ? 'اكتب أي تفاصيل أخرى أو استفسار هنا...' : 'Describe any specifications or special requests here...'}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#111111]/40 focus:outline-none focus:border-[#0A84FF] transition-all text-sm font-medium resize-none text-white"
                      />
                    </div>

                    {/* Field 7: Design File Upload */}
                    <div className="border border-dashed border-white/15 hover:border-[#0A84FF]/40 rounded-xl p-4 bg-[#111111]/40 transition-all relative group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1 cursor-pointer">
                        <Upload size={13} className="text-[#0A84FF]" />
                        <span>{lang === 'ar' ? 'إرفاق ملف التصميم (اختياري)' : 'Upload Design File (Optional)'}</span>
                      </label>
                      
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            const dummyEvent = { target: { files: [file] } } as any;
                            handleFileUpload(dummyEvent);
                          }
                        }}
                        className="flex flex-col items-center justify-center py-3 cursor-pointer"
                      >
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".ai,.cdr,.dst,.emb,.pdf,.png,.jpg,.jpeg,image/*"
                        />
                        
                        {selectedFile ? (
                          <div className="flex items-center gap-3 bg-[#0A84FF]/10 border border-[#0A84FF]/30 px-3 py-2 rounded-xl text-xs text-white max-w-full">
                            <FileCheck size={16} className="text-[#25D366] flex-shrink-0" />
                            <div className="overflow-hidden text-start">
                              <p className="font-bold truncate max-w-[150px] sm:max-w-xs">{selectedFile.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{form.designFileSize}</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                                setForm(prev => ({ ...prev, designFileName: undefined, designFileSize: undefined }));
                              }}
                              className="p-1 hover:bg-white/10 rounded-full text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title={lang === 'ar' ? 'حذف الملف' : 'Remove file'}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <FileUp className="w-8 h-8 text-gray-500 group-hover:text-[#0A84FF] transition-colors mb-2" />
                            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors text-center font-medium">
                              {lang === 'ar' 
                                ? 'اضغط هنا أو اسحب الملف للإرفاق' 
                                : 'Click here or drag & drop file to upload'}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1 text-center font-mono">
                              AI, CDR, DST, EMB, PDF, PNG, JPG, JPEG (Max 20MB)
                            </p>
                          </>
                        )}
                      </div>

                      {fileError && (
                        <div className="mt-2 text-[10px] text-red-400 font-semibold text-center bg-red-500/10 border border-red-500/20 py-1.5 px-2.5 rounded-lg">
                          {fileError}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-6 py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:shadow-lg hover:shadow-[#25D366]/20"
                    >
                      {/* Ripple effect mockup or loading */}
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{t.loadingText}</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5" />
                          <span>{t.formSubmit}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}

            </AnimatePresence>
          } />
        </Routes>
      </main>

      {/* 3. Sticky Action Buttons (Bottom Corners) */}
      <div className="fixed bottom-6 left-6 z-30 flex flex-col gap-3">
        {/* Call Now Button */}
        <motion.a
          href={`tel:${SETTINGS.phone}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative group w-14 h-14 rounded-full bg-gradient-to-r from-[#0A84FF] to-[#0055B3] text-white flex items-center justify-center shadow-lg shadow-[#0A84FF]/20 cursor-pointer border border-[#0A84FF]/30 hover:shadow-[#0A84FF]/40 transition-shadow"
          title={t.stickyCallTooltip}
        >
          <Phone className="w-6 h-6 animate-pulse" />
          
          {/* Tooltip */}
          <span className={`absolute ${lang === 'ar' ? 'left-16' : 'right-16'} hidden group-hover:block bg-[#0b0c10] border border-white/10 text-white text-xs py-1 px-2.5 rounded-lg whitespace-nowrap font-medium shadow-md`}>
            {t.stickyCallTooltip} ({SETTINGS.phone})
          </span>
        </motion.a>
      </div>

      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* WhatsApp Chat Button */}
        <motion.a
          href={`https://wa.me/${SETTINGS.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative group w-14 h-14 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/20 cursor-pointer border border-[#25D366]/30 hover:shadow-[#25D366]/40 transition-shadow"
          title={t.stickyWhatsAppTooltip}
        >
          <MessageCircle className="w-6 h-6 animate-pulse" />
          
          {/* Tooltip */}
          <span className={`absolute ${lang === 'ar' ? 'right-16' : 'left-16'} hidden group-hover:block bg-[#0b0c10] border border-white/10 text-white text-xs py-1 px-2.5 rounded-lg whitespace-nowrap font-medium shadow-md`}>
            {t.stickyWhatsAppTooltip}
          </span>
        </motion.a>
      </div>

      {/* 4. Professional Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#0b0c10]/90 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-start">
            <span className="text-xl font-extrabold text-white font-sans">{SETTINGS.company}</span>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              {t.footerDesc}
            </p>
          </div>

          {/* Links Col */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono">
              {lang === 'ar' ? 'أقسام المركز' : 'Departments'}
            </span>
            <div className="flex flex-wrap md:flex-col gap-2 justify-center text-xs text-gray-400">
              <button onClick={() => handleServiceClick('design')} className="hover:text-[#0A84FF] transition-colors">{lang === 'ar' ? 'التصميم' : 'Design'}</button>
              <span className="md:hidden text-gray-600">•</span>
              <button onClick={() => handleServiceClick('maintenance')} className="hover:text-[#0A84FF] transition-colors">{lang === 'ar' ? 'الصيانة' : 'Maintenance'}</button>
              <span className="md:hidden text-gray-600">•</span>
              <button onClick={() => handleServiceClick('courses')} className="hover:text-[#0A84FF] transition-colors">{lang === 'ar' ? 'الكورسات' : 'Courses'}</button>
              <span className="md:hidden text-gray-600">•</span>
              <button onClick={() => handleServiceClick('dtf')} className="hover:text-[#0A84FF] transition-colors">{lang === 'ar' ? 'طباعة DTF' : 'DTF designs'}</button>
            </div>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono">
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </span>
            <div className="text-xs text-gray-400 flex flex-col gap-2 items-center md:items-start">
              <span>{lang === 'ar' ? `الهاتف: ${SETTINGS.phone}` : `Phone: ${SETTINGS.phone}`}</span>
              <span>{lang === 'ar' ? `الواتساب: ${SETTINGS.whatsapp}` : `WhatsApp: ${SETTINGS.whatsapp}`}</span>
              <div className="flex flex-wrap gap-3 items-center mt-2 justify-center md:justify-start">
                <a href={`https://wa.me/${SETTINGS.whatsapp}`} className="hover:text-[#25D366] text-lg transition-colors" title="WhatsApp" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
                <a href={`tel:${SETTINGS.phone}`} className="hover:text-[#0A84FF] text-lg transition-colors" title="Phone Call"><i className="fa-solid fa-phone"></i></a>
                {(config.settings.socialLinks || []).filter(sl => sl.active && sl.url).map(sl => {
                  let faClass = `fa-brands fa-${sl.platform}`;
                  let colorClass = "hover:text-[#0A84FF]";
                  if (sl.platform === 'facebook') colorClass = "hover:text-[#1877F2]";
                  else if (sl.platform === 'instagram') colorClass = "hover:text-[#E4405F]";
                  else if (sl.platform === 'tiktok') colorClass = "hover:text-white";
                  else if (sl.platform === 'youtube') colorClass = "hover:text-[#FF0000]";
                  else if (sl.platform === 'snapchat') { faClass = "fa-brands fa-snapchat"; colorClass = "hover:text-[#FFFC00]"; }
                  else if (sl.platform === 'x') { faClass = "fa-brands fa-x-twitter"; colorClass = "hover:text-white"; }
                  else if (sl.platform === 'telegram') { faClass = "fa-brands fa-telegram"; colorClass = "hover:text-[#0088cc]"; }
                  else if (sl.platform === 'linkedin') { faClass = "fa-brands fa-linkedin"; colorClass = "hover:text-[#0a66c2]"; }
                  else if (sl.platform === 'whatsapp') { faClass = "fa-brands fa-whatsapp"; colorClass = "hover:text-[#25D366]"; }
                  
                  return (
                    <a
                      key={sl.id}
                      href={sl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-lg transition-colors ${colorClass}`}
                      title={sl.platform}
                    >
                      <i className={faClass}></i>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Copyright strip */}
        <div className="border-t border-white/5 py-6 px-6 bg-black/30">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <span>{SETTINGS.copyrightText?.[lang] || t.footerCopyright}</span>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
              <span>{t.footerMadeBy}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
              <span className="font-sans font-bold text-gray-500">{SETTINGS.company}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
