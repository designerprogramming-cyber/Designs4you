import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Video, Info, Sparkles, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { stateStore } from '../lib/stateStore';

interface VideoGalleryProps {
  lang: Language;
}

interface VideoItem {
  id: string;
  url: string;
  title: {
    ar: string;
    en: string;
  };
  duration: string;
  thumbnail: string;
}

export default function VideoGallery({ lang }: VideoGalleryProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  
  // Dynamic config listening to stateStore changes
  const [config, setConfig] = useState(() => stateStore.getConfig());

  useEffect(() => {
    const handleConfigChange = () => {
      setConfig(stateStore.getConfig());
    };
    window.addEventListener('designs4you_config_changed', handleConfigChange);
    return () => window.removeEventListener('designs4you_config_changed', handleConfigChange);
  }, []);

  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  // Read video items dynamically from stateStore
  const videoItems = useMemo<VideoItem[]>(() => {
    return (config.videos || []) as VideoItem[];
  }, [config.videos]);

  return (
    <section className="py-16 border-t border-white/5 relative bg-[#111111]/30 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-xs text-green-400 font-medium mb-3"
          >
            <Video size={12} />
            <span>{lang === 'ar' ? 'دروس ميكانيكية وشروحات مصورة' : 'Premium Video Insights'}</span>
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            {t.videosTitle}
          </h2>
          <p className="text-sm text-gray-400">
            {t.videosSubtitle}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videoItems.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col justify-between"
              onClick={() => setActiveVideoUrl(video.url)}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <img
                  src={video.thumbnail}
                  alt={video.title[lang]}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out brightness-75"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Glassmorphic Play button wrapper */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/40 group-hover:bg-gradient-to-r group-hover:from-[#0A84FF] group-hover:to-[#0066FF] group-hover:border-transparent">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 border border-white/10 text-[10px] font-mono px-2 py-0.5 rounded text-white font-bold">
                  {video.duration}
                </div>
              </div>

              {/* Title & metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-white leading-relaxed line-clamp-2">
                  {video.title[lang]}
                </h3>
                
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Sparkles size={11} className="text-[#0A84FF]" />
                    {lang === 'ar' ? 'دقة HD فائقة' : 'Full HD Source'}
                  </span>
                  <span>{lang === 'ar' ? 'عرض فوري' : 'Click to Play'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sync Status Banner */}
        <div className="mt-12 flex items-center justify-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 max-w-xl mx-auto text-center">
          <Info size={14} className="text-green-400 shrink-0" />
          <p className="text-[11px] text-gray-500 font-medium">
            {lang === 'ar'
              ? 'يتم تحديث معرض الفيديوهات تلقائياً عند إضافة ملفات جديدة داخل المجلد /assets/videos/'
              : 'The Video gallery is synchronized automatically with files placed inside /assets/videos/.'}
          </p>
        </div>

      </div>

      {/* --- LIGHTBOX VIDEO PLAYER MODAL --- */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveVideoUrl(null)}
          >
            <div 
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X size={18} />
              </button>

              {/* Native HTML5 Video Player */}
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
