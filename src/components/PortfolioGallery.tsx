import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  FolderOpen, 
  Palette, 
  Wrench, 
  GraduationCap, 
  Shirt, 
  Grid,
  Sparkles,
  Info
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { stateStore } from '../lib/stateStore';

interface PortfolioGalleryProps {
  lang: Language;
}

interface GalleryItem {
  id: string;
  url: string;
  filename: string;
  category: 'embroidery' | 'dtf' | 'logo' | 'maintenance' | 'course';
  title: {
    ar: string;
    en: string;
  };
}

export default function PortfolioGallery({ lang }: PortfolioGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'embroidery' | 'dtf' | 'logo' | 'maintenance' | 'course'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
  // Real-time state listening to local state modifications
  const [config, setConfig] = useState(() => stateStore.getConfig());

  useEffect(() => {
    const handleConfigChange = () => {
      setConfig(stateStore.getConfig());
    };
    window.addEventListener('designs4you_config_changed', handleConfigChange);
    return () => window.removeEventListener('designs4you_config_changed', handleConfigChange);
  }, []);

  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  // Read items dynamically from stateStore
  const galleryItems = useMemo<GalleryItem[]>(() => {
    return (config.portfolio || []) as GalleryItem[];
  }, [config.portfolio]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return galleryItems;
    return galleryItems.filter(item => item.category === activeFilter);
  }, [galleryItems, activeFilter]);

  // Handle Keyboard Shortcuts for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowRight') {
        if (lang === 'ar') handlePrev();
        else handleNext();
      }
      if (e.key === 'ArrowLeft') {
        if (lang === 'ar') handleNext();
        else handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length, lang]);

  // Lightbox navigation
  const handleOpenLightbox = (itemId: string) => {
    const idx = filteredItems.findIndex(item => item.id === itemId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  // Mobile Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped Left
        if (lang === 'ar') handlePrev();
        else handleNext();
      } else {
        // Swiped Right
        if (lang === 'ar') handleNext();
        else handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <section className="py-16 border-t border-white/5 relative bg-[#111111]/40 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#0A84FF]/20 bg-[#0A84FF]/10 text-xs text-[#0A84FF] font-medium mb-3"
          >
            <FolderOpen size={12} />
            <span>{lang === 'ar' ? 'معرض المخرجات الفنية' : 'Premium Creative Output'}</span>
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            {t.portfolioTitle}
          </h2>
          <p className="text-sm text-gray-400">
            {t.portfolioSubtitle}
          </p>
        </div>

        {/* Dynamic Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {([
            { id: 'all', label: t.filterAll, icon: <Grid size={13} /> },
            { id: 'embroidery', label: t.filterEmbroidery, icon: <Sparkles size={13} /> },
            { id: 'dtf', label: t.filterDTF, icon: <Shirt size={13} /> },
            { id: 'logo', label: t.filterLogos, icon: <Palette size={13} /> },
            { id: 'maintenance', label: t.filterMaintenance, icon: <Wrench size={13} /> },
            { id: 'course', label: t.filterCourses, icon: <GraduationCap size={13} /> }
          ] as const).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer border transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/25 scale-105'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Masonry Columns Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="break-inside-avoid relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm group cursor-pointer shadow-xl"
                onClick={() => handleOpenLightbox(item.id)}
              >
                {/* Premium Image with lazy load */}
                <img
                  src={item.url}
                  alt={item.title[lang]}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Glassmorphic Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#0A84FF] px-2 py-0.5 rounded bg-[#0A84FF]/10 border border-[#0A84FF]/20">
                        {item.category === 'embroidery' && t.filterEmbroidery}
                        {item.category === 'dtf' && t.filterDTF}
                        {item.category === 'logo' && t.filterLogos}
                        {item.category === 'maintenance' && t.filterMaintenance}
                        {item.category === 'course' && t.filterCourses}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">
                        {item.title[lang]}
                      </h4>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/90">
                      <Maximize2 size={13} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>



      </div>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Lightbox Header bar */}
            <div className="flex items-center justify-between py-2 border-b border-white/5 text-gray-300 select-none">
              <span className="text-xs font-mono">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
              <span className="text-sm font-bold text-white max-w-xs truncate">
                {filteredItems[lightboxIndex].title[lang]}
              </span>
              <button
                onClick={handleCloseLightbox}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white cursor-pointer transition-all border border-white/10"
                title={t.lightboxClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Stage Image with transitions */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden my-4">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all border border-white/10 z-10"
                title={t.lightboxPrev}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Center Image */}
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={filteredItems[lightboxIndex].url}
                alt={filteredItems[lightboxIndex].title[lang]}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl select-none pointer-events-none"
              />

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all border border-white/10 z-10"
                title={t.lightboxNext}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Lightbox Footer bar with category info */}
            <div className="py-3 border-t border-white/5 text-center text-xs text-gray-400 select-none flex flex-col gap-1 items-center justify-center">
              <span className="text-[10px] font-mono tracking-widest text-[#0A84FF] uppercase font-bold">
                {filteredItems[lightboxIndex].category}
              </span>
              <span>
                {lang === 'ar' ? 'اسحب لليمين/اليسار أو استخدم الأسهم للتنقل' : 'Swipe left/right or use keyboard arrows to navigate'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
