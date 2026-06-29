import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { stateStore } from '../lib/stateStore';

interface AnnouncementBarProps {
  lang: Language;
}

const ARABIC_MESSAGES = [
  "⭐ مرحبًا بك في Designs4you",
  "🎨 تصميمات احترافية للتطريز و DTF",
  "🔧 خدمات صيانة متخصصة لماكينات التطريز",
  "🎓 كورسات احترافية لتعلم Wilcom وصيانة الماكينات",
  "⚡ سرعة في الرد وخدمة عملاء مميزة",
  "📱 تواصل معنا مباشرة عبر واتساب"
];

const ENGLISH_MESSAGES = [
  "⭐ Welcome to Designs4you",
  "🎨 Professional Embroidery & DTF Designs",
  "🔧 Expert Embroidery Machine Maintenance",
  "🎓 Professional Wilcom & Maintenance Courses",
  "⚡ Fast Response & Excellent Customer Support",
  "📱 Contact us instantly via WhatsApp"
];

const ROTATION_TIME = 4000; // 4 seconds

export default function AnnouncementBar({ lang }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Dynamic configuration state
  const [config, setConfig] = useState(() => stateStore.getConfig());

  useEffect(() => {
    const handleConfigChange = () => {
      setConfig(stateStore.getConfig());
    };
    window.addEventListener('designs4you_config_changed', handleConfigChange);
    return () => window.removeEventListener('designs4you_config_changed', handleConfigChange);
  }, []);

  const SETTINGS = config.settings;
  
  const messages = lang === 'ar' ? ARABIC_MESSAGES : ENGLISH_MESSAGES;
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    // Reset index when language switches to avoid out of bounds (though both have length 6)
    setIndex(0);
    setProgress(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [lang]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedTimeRef.current;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (isHovered) {
        // Just record how much elapsed time we have so we can resume
        pausedTimeRef.current = elapsed;
        requestRef.current = requestAnimationFrame(tick);
        return;
      }

      // Calculate progress percentage
      const newProgress = Math.min((elapsed / ROTATION_TIME) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= ROTATION_TIME) {
        setIndex((prev) => (prev + 1) % messages.length);
        startTimeRef.current = timestamp;
        setProgress(0);
        pausedTimeRef.current = 0;
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isHovered, messages.length]);

  // Handle manual tab hover pause
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Resume animation from where it was paused
    startTimeRef.current = null; 
  };

  return (
    <div 
      className="relative w-full h-[42px] bg-gradient-to-r from-[#0A84FF] to-[#0066FF] text-white overflow-hidden flex items-center justify-between px-4 md:px-8 border-b border-white/15 shadow-md select-none z-50 font-semibold text-xs md:text-sm"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Dynamic Progress indicator (bottom border) */}
      <div 
        className="absolute bottom-0 left-0 h-[2.5px] bg-white/45 transition-all duration-100 ease-linear"
        style={{ 
          width: `${progress}%`,
          right: lang === 'ar' ? 0 : 'auto',
          left: lang === 'en' ? 0 : 'auto',
        }}
      />

      {/* Quick Action left text/icon on desktop */}
      <div className="hidden sm:flex items-center gap-2 text-white/95">
        <Phone size={13} className="animate-bounce" />
        <a 
          href={`tel:${SETTINGS.phone}`}
          className="hover:underline transition-all tracking-wider text-[11px]"
        >
          {SETTINGS.phone}
        </a>
      </div>

      {/* Animated Sliding Message */}
      <div className="flex-1 flex items-center justify-center text-center overflow-hidden h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index + '-' + lang}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex items-center gap-2 cursor-pointer font-semibold text-[11px] sm:text-xs md:text-sm"
            onClick={() => {
              // Open WhatsApp on click as standard shortcut
              window.open(`https://wa.me/${SETTINGS.whatsapp}`, '_blank');
            }}
          >
            <span>{messages[index]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Action right text/icon on desktop */}
      <div className="hidden sm:flex items-center gap-2 text-white/95">
        <MessageCircle size={14} className="animate-pulse" />
        <a 
          href={`https://wa.me/${SETTINGS.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline transition-all tracking-wider text-[11px]"
        >
          {lang === 'ar' ? 'واتساب مباشر' : 'Live Chat'}
        </a>
      </div>
    </div>
  );
}
