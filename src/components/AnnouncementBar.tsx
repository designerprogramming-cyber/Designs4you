import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Sparkles, Megaphone, Bell, Info } from 'lucide-react';
import { Language } from '../types';
import { stateStore } from '../lib/stateStore';

interface AnnouncementBarProps {
  lang: Language;
}

export default function AnnouncementBar({ lang }: AnnouncementBarProps) {
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
  
  // Find active announcements from configurations
  const activeAnnouncements = (config.announcements || []).filter(a => a.active === true);
  
  let announcementsList = activeAnnouncements.map(a => a.text[lang] || a.text['ar'] || '');
  const topBarText = (SETTINGS as any).topBarText?.[lang] || (SETTINGS as any).topBarText?.['ar'] || '';
  if (topBarText) {
    announcementsList = [topBarText];
  } else if (announcementsList.length === 0) {
    announcementsList = [
      lang === 'ar' ? "مرحبًا بك في مركز خدمات Designs4you لخدمات ماكينات التطريز والدعم الفني المعتمد" : "Welcome to Designs4you Service Center for embroidery machines services and certified support"
    ];
  }

  // Duplicate list if short to prevent visual gaps on wider desktop displays
  let displayList = [...announcementsList];
  if (displayList.length === 1) {
    displayList = [displayList[0], displayList[0], displayList[0], displayList[0]];
  } else if (displayList.length === 2) {
    displayList = [displayList[0], displayList[1], displayList[0], displayList[1]];
  }

  // Compute overall character length for a unified scrolling velocity
  const totalChars = displayList.reduce((sum, text) => sum + text.length, 0);
  const speedSetting = SETTINGS.announcementSpeed || 3; // default is 3 (Medium)
  const speedFactor = speedSetting === 1 ? 0.35 : speedSetting === 2 ? 0.65 : speedSetting === 3 ? 1.0 : speedSetting === 4 ? 1.5 : 2.2;
  
  // Calculate duration proportional to character count to maintain uniform visual speed
  const duration = Math.max(8, (totalChars * 0.22) / speedFactor);

  // We enforce 'ltr' rendering on the scrolling flex track to guarantee consistent animation vector direction
  // regardless of active user locale, while preserving the actual language text layout direction.
  const keyframesStyle = `
    @keyframes marquee-scroll {
      0% {
        transform: translate3d(0, 0, 0);
      }
      100% {
        transform: translate3d(-50%, 0, 0);
      }
    }
    .animate-marquee-custom {
      display: flex;
      width: max-content;
      animation: marquee-scroll ${duration}s linear infinite;
    }
  `;

  return (
    <div 
      className="relative w-full min-h-[40px] py-2 bg-gradient-to-r from-[#0A84FF] to-[#0066FF] text-white flex items-center justify-between px-4 md:px-8 border-b border-white/15 shadow-md select-none z-50 font-semibold text-xs md:text-sm transition-all"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Quick Action phone text/icon on desktop */}
      <div className="hidden sm:flex items-center gap-2 text-white/95 shrink-0 z-10 bg-gradient-to-r from-[#0A84FF] to-[#0A84FF]/90 pr-2">
        <Phone size={13} className="animate-bounce text-yellow-300" />
        <a 
          href={`tel:${SETTINGS.phone}`}
          className="hover:underline transition-all tracking-wider text-[11px]"
        >
          {SETTINGS.phone}
        </a>
      </div>

      {/* Scrolling dynamic announcement marquee */}
      <div className="flex-1 overflow-hidden relative mx-2 sm:mx-4 flex items-center" dir="ltr">
        <style>{keyframesStyle}</style>
        <div className="animate-marquee-custom">
          {/* First loop track */}
          <div className="flex items-center gap-12 shrink-0 pr-12">
            {displayList.map((text, i) => (
              <div 
                key={`b1-${i}`}
                onClick={() => {
                  window.open(`https://wa.me/${SETTINGS.whatsapp}`, '_blank');
                }}
                className="flex items-center gap-2.5 cursor-pointer hover:text-yellow-200 transition-all text-[11px] sm:text-xs md:text-sm font-bold"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                <Sparkles size={13} className="shrink-0 text-yellow-300 animate-pulse" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Second identical loop track for seamless scrolling junction */}
          <div className="flex items-center gap-12 shrink-0 pr-12" aria-hidden="true">
            {displayList.map((text, i) => (
              <div 
                key={`b2-${i}`}
                onClick={() => {
                  window.open(`https://wa.me/${SETTINGS.whatsapp}`, '_blank');
                }}
                className="flex items-center gap-2.5 cursor-pointer hover:text-yellow-200 transition-all text-[11px] sm:text-xs md:text-sm font-bold"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                <Sparkles size={13} className="shrink-0 text-yellow-300 animate-pulse" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action WhatsApp direct chat on desktop */}
      <div className="hidden sm:flex items-center gap-2 text-white/95 shrink-0 z-10 bg-gradient-to-l from-[#0066FF] to-[#0066FF]/90 pl-2">
        <MessageCircle size={14} className="animate-pulse text-yellow-300" />
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
