import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Save, 
  Settings, 
  Palette, 
  FolderOpen, 
  Video, 
  Star, 
  Trash2, 
  Plus, 
  Edit, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Check, 
  Upload, 
  Wrench, 
  Smartphone,
  Eye,
  Info
} from 'lucide-react';
import { Language } from '../types';
import { stateStore, DEFAULT_CONFIG, DynamicAppConfig } from '../lib/stateStore';

interface AdminDashboardProps {
  lang: Language;
}

export default function AdminDashboard({ lang }: AdminDashboardProps) {
  // Config States
  const [config, setConfig] = useState<DynamicAppConfig>(() => stateStore.getConfig());
  const [activeTab, setActiveTab] = useState<'branding' | 'services' | 'prices' | 'portfolio' | 'videos' | 'reviews' | 'social'>('branding');
  const [toast, setToast] = useState<string | null>(null);

  // File Refs for uploads
  const logoInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const reviewImgInputRef = useRef<HTMLInputElement>(null);

  // Service Edit helper state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceNameAr, setNewServiceNameAr] = useState('');
  const [newServiceNameEn, setNewServiceNameEn] = useState('');
  const [newServiceDescAr, setNewServiceDescAr] = useState('');
  const [newServiceDescEn, setNewServiceDescEn] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState('Palette');
  const [newServiceOptions, setNewServiceOptions] = useState<Array<{ ar: string; en: string }>>([]);
  const [currentOptionAr, setCurrentOptionAr] = useState('');
  const [currentOptionEn, setCurrentOptionEn] = useState('');

  // Review Edit helper state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCountry, setReviewerCountry] = useState('EG');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewCommentAr, setReviewCommentAr] = useState('');
  const [reviewCommentEn, setReviewCommentEn] = useState('');
  const [reviewTypeAr, setReviewTypeAr] = useState('شريك معتمد');
  const [reviewTypeEn, setReviewTypeEn] = useState('Verified Partner');
  const [reviewBase64Image, setReviewBase64Image] = useState('');

  // Portfolio helper state
  const [newPortfolioTitleAr, setNewPortfolioTitleAr] = useState('');
  const [newPortfolioTitleEn, setNewPortfolioTitleEn] = useState('');
  const [newPortfolioCategory, setNewPortfolioCategory] = useState('embroidery');
  const [portfolioBase64, setPortfolioBase64] = useState('');

  // Video helper state
  const [newVideoTitleAr, setNewVideoTitleAr] = useState('');
  const [newVideoTitleEn, setNewVideoTitleEn] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('02:30');
  const [newVideoThumbnail, setNewVideoThumbnail] = useState('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Save changes to localStorage database
  const handleSaveAll = () => {
    stateStore.saveConfig(config);
    showToast(lang === 'ar' ? 'تم حفظ التعديلات بنجاح وتطبيقها على الموقع!' : 'Changes successfully saved and applied!');
  };

  // Reset to default settings
  const handleReset = () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في إعادة تعيين جميع البيانات للمصنع الأصلي؟' : 'Are you sure you want to reset all data to default values?')) {
      const fresh = stateStore.resetConfig();
      setConfig(fresh);
      showToast(lang === 'ar' ? 'تمت إعادة ضبط المصنع الافتراضي!' : 'Successfully reset to system defaults!');
    }
  };

  // File Upload Handlers (Logo to Base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم اللوجو يتعدى الحد المسموح (2 ميجابايت)' : 'Logo file size exceeds the 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setConfig(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          logoUrl: base64
        }
      }));
      showToast(lang === 'ar' ? 'تم رفع شعار الشركة!' : 'Company logo successfully uploaded!');
    };
    reader.readAsDataURL(file);
  };

  // Add Portfolio Image
  const handleAddPortfolio = () => {
    if (!portfolioBase64) {
      alert(lang === 'ar' ? 'يرجى تحديد أو رفع صورة أولاً.' : 'Please upload or provide an image URL first.');
      return;
    }
    const newItem = {
      id: 'port-' + Date.now(),
      url: portfolioBase64,
      filename: 'custom-file.png',
      category: newPortfolioCategory,
      title: {
        ar: newPortfolioTitleAr || 'عمل متميز',
        en: newPortfolioTitleEn || 'Premium Artwork'
      }
    };
    setConfig(prev => ({
      ...prev,
      portfolio: [newItem, ...prev.portfolio]
    }));
    setPortfolioBase64('');
    setNewPortfolioTitleAr('');
    setNewPortfolioTitleEn('');
    showToast(lang === 'ar' ? 'تم إضافة التصميم لمعرض الأعمال!' : 'Added item to portfolio gallery!');
  };

  // Portfolio image local upload to Base64
  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم الصورة كبير جداً (الأقصى 3 ميجابايت) لحفظ الأداء.' : 'Image exceeds 3MB. Please optimize for faster load.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPortfolioBase64(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Video Actions
  const handleAddVideo = () => {
    if (!newVideoUrl) {
      alert(lang === 'ar' ? 'يرجى إضافة رابط للفيديو (يوتيوب أو رابط مباشر).' : 'Please enter a video stream URL.');
      return;
    }
    const newVideo = {
      id: 'vid-' + Date.now(),
      url: newVideoUrl,
      title: {
        ar: newVideoTitleAr || 'فيديو شرح وميكانيكا',
        en: newVideoTitleEn || 'Technical Tutorial Video'
      },
      duration: newVideoDuration || '02:30',
      thumbnail: newVideoThumbnail || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80'
    };
    setConfig(prev => ({
      ...prev,
      videos: [...prev.videos, newVideo]
    }));
    setNewVideoUrl('');
    setNewVideoTitleAr('');
    setNewVideoTitleEn('');
    showToast(lang === 'ar' ? 'تم إضافة الفيديو الجديد!' : 'Video successfully added to the vault!');
  };

  // Review Images upload helper
  const handleReviewImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setReviewBase64Image(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Add Review
  const handleAddReview = () => {
    if (!reviewerName) {
      alert(lang === 'ar' ? 'يرجى كتابة اسم العميل' : 'Please provide a reviewer name.');
      return;
    }
    const newReview = {
      id: editingReviewId || 'review-' + Date.now(),
      name: reviewerName,
      country: reviewerCountry,
      rating: reviewRating,
      comment: {
        ar: reviewCommentAr || 'تعامل راقي جداً وخدمة سريعة',
        en: reviewCommentEn || 'Excellent speed and highly cooperative department!'
      },
      type: {
        ar: reviewTypeAr || 'شريك معتمد',
        en: reviewTypeEn || 'Verified Partner'
      },
      image: reviewBase64Image || undefined
    };

    if (editingReviewId) {
      setConfig(prev => ({
        ...prev,
        reviews: prev.reviews.map(r => r.id === editingReviewId ? newReview : r)
      }));
      setEditingReviewId(null);
      showToast(lang === 'ar' ? 'تم تحديث التقييم!' : 'Review successfully updated!');
    } else {
      setConfig(prev => ({
        ...prev,
        reviews: [...prev.reviews, newReview]
      }));
      showToast(lang === 'ar' ? 'تم إضافة التقييم الجديد!' : 'Review successfully created!');
    }

    setReviewerName('');
    setReviewCommentAr('');
    setReviewCommentEn('');
    setReviewBase64Image('');
  };

  // Service options manager helper
  const addServiceOption = () => {
    if (!currentOptionAr || !currentOptionEn) {
      alert('Fill option in both Arabic and English');
      return;
    }
    setNewServiceOptions([...newServiceOptions, { ar: currentOptionAr, en: currentOptionEn }]);
    setCurrentOptionAr('');
    setCurrentOptionEn('');
  };

  const removeServiceOption = (idx: number) => {
    setNewServiceOptions(newServiceOptions.filter((_, i) => i !== idx));
  };

  const handleAddService = () => {
    if (!newServiceNameAr || !newServiceNameEn) {
      alert('Please fill Service Name in both Arabic and English');
      return;
    }

    const mappedOptions = newServiceOptions.map((opt, index) => ({
      id: 'opt-' + index + '-' + Date.now(),
      title: { ar: opt.ar, en: opt.en }
    }));

    const newService = {
      id: editingServiceId || 'service-' + Date.now(),
      icon: newServiceIcon,
      faIcon: 'fa-solid fa-palette',
      title: { ar: newServiceNameAr, en: newServiceNameEn },
      description: { ar: newServiceDescAr, en: newServiceDescEn },
      options: mappedOptions
    };

    if (editingServiceId) {
      setConfig(prev => ({
        ...prev,
        services: prev.services.map(s => s.id === editingServiceId ? newService : s)
      }));
      setEditingServiceId(null);
      showToast(lang === 'ar' ? 'تم تعديل الخدمة!' : 'Service updated successfully!');
    } else {
      setConfig(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      showToast(lang === 'ar' ? 'تم إضافة الخدمة الجديدة!' : 'New service created!');
    }

    // Reset fields
    setNewServiceNameAr('');
    setNewServiceNameEn('');
    setNewServiceDescAr('');
    setNewServiceDescEn('');
    setNewServiceIcon('Palette');
    setNewServiceOptions([]);
  };

  const startEditService = (service: any) => {
    setEditingServiceId(service.id);
    setNewServiceNameAr(service.title.ar);
    setNewServiceNameEn(service.title.en);
    setNewServiceDescAr(service.description.ar);
    setNewServiceDescEn(service.description.en);
    setNewServiceIcon(service.icon);
    setNewServiceOptions(service.options.map((o: any) => ({ ar: o.title.ar, en: o.title.en })));
    setActiveTab('services');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Export/Download JSON file utility
  const downloadJSON = (data: any, fileName: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#0b0c10] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#25D366] text-black font-extrabold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-xs sm:text-sm animate-bounce">
          <Check size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0A84FF]/20 bg-[#0A84FF]/10 text-xs text-[#0A84FF] font-medium mb-3">
            <Settings size={13} className="animate-spin" />
            <span>{lang === 'ar' ? 'لوحة تحكم المدير الاحترافية' : 'Executive Management Dashboard'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {lang === 'ar' ? 'إعدادات المنصة الرقمية' : 'Platform Configuration Console'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {lang === 'ar' ? 'تعديل جميع محتويات الموقع وأرقام التواصل والألوان فوراً بدون تعديل الكود البرمجي.' : 'Adjust numbers, working hours, colors, portfolio assets, and customer comments instantly.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleSaveAll}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0A84FF] to-blue-600 hover:shadow-lg hover:shadow-[#0A84FF]/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>{lang === 'ar' ? 'حفظ وتفعيل التعديلات' : 'Save & Publish Live'}</span>
          </button>
          
          <button 
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
            title={lang === 'ar' ? 'إعادة ضبط الافتراضي' : 'Restore Defaults'}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Admin Operations Sub-bar / Exporters */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-[#0A84FF] shrink-0" />
          <p className="text-[11px] sm:text-xs text-gray-400">
            {lang === 'ar' 
              ? 'تنويه: الحفظ السريع يقوم بتحديث المعاينة الفورية وجلسة العمل. لحفظ التغييرات بشكل نهائي، يمكنك تنزيل ملفات الـ JSON ووضعها في المشروع.' 
              : 'Notice: Click Save to update preview. You can download the production JSON configs to keep forever.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => downloadJSON(config.settings, 'settings.json')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[10px] sm:text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <Download size={12} />
            <span>{lang === 'ar' ? 'تحميل settings.json' : 'Download settings.json'}</span>
          </button>
          <button
            onClick={() => downloadJSON({ portfolio: config.portfolio, videos: config.videos, reviews: config.reviews }, 'content.json')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[10px] sm:text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <Download size={12} />
            <span>{lang === 'ar' ? 'تحميل content.json' : 'Download content.json'}</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-4 mb-8">
        {([
          { id: 'branding', label: lang === 'ar' ? 'الهوية والمعلومات' : 'Branding & Info', icon: <Settings size={14} /> },
          { id: 'services', label: lang === 'ar' ? 'الخدمات والأقسام' : 'Services & Options', icon: <Wrench size={14} /> },
          { id: 'prices', label: lang === 'ar' ? 'قائمة الأسعار التقديرية' : 'Estimated Rates', icon: <Palette size={14} /> },
          { id: 'portfolio', label: lang === 'ar' ? 'معرض الصور' : 'Portfolio Assets', icon: <FolderOpen size={14} /> },
          { id: 'videos', label: lang === 'ar' ? 'الدروس المرئية' : 'Video Tutorial Vault', icon: <Video size={14} /> },
          { id: 'reviews', label: lang === 'ar' ? 'تقييمات العملاء' : 'Customer Feedback', icon: <Star size={14} /> },
          { id: 'social', label: lang === 'ar' ? 'شبكات التواصل الاجتماعي' : 'Social Channels', icon: <Smartphone size={14} /> },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-[#0A84FF]/10 border-[#0A84FF] text-[#0A84FF]'
                : 'bg-white/[0.01] border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-8">
        
        {/* PANEL 1: BRANDING & GENERAL */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            
            {/* Visual Branding Group */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <Palette className="text-[#0A84FF]" size={18} />
                <span>{lang === 'ar' ? 'الهوية البصرية والألوان الأساسية' : 'Visual Identity & Custom Color scheme'}</span>
              </h3>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'شعار الشركة المخصص (Logo)' : 'Corporate Logo Image'}</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-white/10 bg-[#111111] flex items-center justify-center overflow-hidden">
                    {config.settings.logoUrl ? (
                      <img src={config.settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono">No Logo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="file" 
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-white cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>{lang === 'ar' ? 'رفع لوجو جديد' : 'Upload custom logo'}</span>
                    </button>
                    {config.settings.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, settings: { ...prev.settings, logoUrl: "" } }))}
                        className="block text-[10px] text-red-400 hover:underline cursor-pointer"
                      >
                        {lang === 'ar' ? 'حذف الشعار والعودة للاسم النصي' : 'Reset to textual logo name'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'اللون الأساسي (Primary)' : 'Primary Color'}</label>
                  <div className="flex items-center gap-2 bg-[#111111] border border-white/10 rounded-xl p-2.5">
                    <input 
                      type="color" 
                      value={config.settings.primaryColor} 
                      onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, primaryColor: e.target.value } }))}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-white">{config.settings.primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'اللون الثانوي (Secondary)' : 'Secondary Color'}</label>
                  <div className="flex items-center gap-2 bg-[#111111] border border-white/10 rounded-xl p-2.5">
                    <input 
                      type="color" 
                      value={config.settings.secondaryColor} 
                      onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, secondaryColor: e.target.value } }))}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-white">{config.settings.secondaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Hero Settings */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-sm font-bold text-gray-300">{lang === 'ar' ? 'نص ترحيب الواجهة الرئيسية (Hero)' : 'Landing Screen Hero Text'}</h4>
                
                <div className="space-y-2">
                  <label className="block text-[11px] text-gray-400">{lang === 'ar' ? 'العنوان الترحيبي (عربي)' : 'Hero Title (Arabic)'}</label>
                  <input 
                    type="text" 
                    value={config.settings.heroTitle.ar}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, heroTitle: { ...prev.settings.heroTitle, ar: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] text-gray-400">{lang === 'ar' ? 'العنوان الترحيبي (إنجليزي)' : 'Hero Title (English)'}</label>
                  <input 
                    type="text" 
                    value={config.settings.heroTitle.en}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, heroTitle: { ...prev.settings.heroTitle, en: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] text-gray-400">{lang === 'ar' ? 'الوصف الترحيبي (عربي)' : 'Hero Subtitle (Arabic)'}</label>
                  <textarea 
                    value={config.settings.heroDesc.ar}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, heroDesc: { ...prev.settings.heroDesc, ar: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white h-20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] text-gray-400">{lang === 'ar' ? 'الوصف الترحيبي (إنجليزي)' : 'Hero Subtitle (English)'}</label>
                  <textarea 
                    value={config.settings.heroDesc.en}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, heroDesc: { ...prev.settings.heroDesc, en: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white h-20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* General Info Group */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
                {lang === 'ar' ? 'بيانات الاتصال والعناوين الأساسية' : 'Corporate Contact & Navigation Addresses'}
              </h3>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
                <input 
                  type="text" 
                  value={config.settings.company}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, company: e.target.value } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'رقم الواتساب المباشر' : 'WhatsApp Hotline'}</label>
                <input 
                  type="text" 
                  value={config.settings.whatsapp}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, whatsapp: e.target.value } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="e.g. +201000000000"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'رقم الهاتف للاتصال الهاتفي' : 'Phone Line for Calls'}</label>
                <input 
                  type="text" 
                  value={config.settings.phone}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, phone: e.target.value } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="e.g. 01000000000"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'البريد الإلكتروني' : 'Official Email address'}</label>
                <input 
                  type="email" 
                  value={config.settings.email}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, email: e.target.value } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'ساعات العمل (عربي)' : 'Hours (Ar)'}</label>
                  <input 
                    type="text" 
                    value={config.settings.workingHours.ar}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, workingHours: { ...prev.settings.workingHours, ar: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'ساعات العمل (إنجليزي)' : 'Hours (En)'}</label>
                  <input 
                    type="text" 
                    value={config.settings.workingHours.en}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, workingHours: { ...prev.settings.workingHours, en: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              {/* Physical Addresses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'العنوان الجغرافي (عربي)' : 'Address (Ar)'}</label>
                  <input 
                    type="text" 
                    value={config.settings.address.ar}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, address: { ...prev.settings.address, ar: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'العنوان الجغرافي (إنجليزي)' : 'Address (En)'}</label>
                  <input 
                    type="text" 
                    value={config.settings.address.en}
                    onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, address: { ...prev.settings.address, en: e.target.value } } }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              {/* Maps URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">{lang === 'ar' ? 'رابط خرائط جوجل (Google Maps)' : 'Google Maps Location Link'}</label>
                <input 
                  type="text" 
                  value={config.settings.mapsUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, mapsUrl: e.target.value } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  placeholder="https://maps.google.com/..."
                />
              </div>

            </div>
          </div>
        )}

        {/* PANEL 2: SERVICES & DEPARTMENTS */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* List Existing Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.services.map((service) => (
                <div key={service.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.01] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{service.icon === 'Palette' ? '🎨' : service.icon === 'Wrench' ? '🔧' : service.icon === 'GraduationCap' ? '🎓' : service.icon === 'Shirt' ? '👕' : '⚙️'}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => startEditService(service)}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-gray-300 hover:text-[#0A84FF] cursor-pointer"
                        >
                          <Edit size={13} />
                        </button>
                        <button 
                          onClick={() => setConfig(prev => ({ ...prev, services: prev.services.filter(s => s.id !== service.id) }))}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-gray-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white">{service.title[lang]}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{service.description[lang]}</p>
                    
                    {/* Sub services tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {service.options.map((opt) => (
                        <span key={opt.id} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300">
                          {opt.title[lang]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add / Edit Form */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-[#0A84FF]" />
                <span>{editingServiceId ? (lang === 'ar' ? 'تعديل بيانات القسم' : 'Edit Section Details') : (lang === 'ar' ? 'إضافة قسم أو خدمة جديدة' : 'Add New Service Section')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'اسم القسم (عربي)' : 'Department Name (Arabic)'}</label>
                  <input 
                    type="text"
                    value={newServiceNameAr}
                    onChange={(e) => setNewServiceNameAr(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'اسم القسم (إنجليزي)' : 'Department Name (English)'}</label>
                  <input 
                    type="text"
                    value={newServiceNameEn}
                    onChange={(e) => setNewServiceNameEn(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                  <textarea 
                    value={newServiceDescAr}
                    onChange={(e) => setNewServiceDescAr(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white h-20 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
                  <textarea 
                    value={newServiceDescEn}
                    onChange={(e) => setNewServiceDescEn(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white h-20 resize-none"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-300">{lang === 'ar' ? 'الأيقونة التعبيرية للقسم' : 'Section Representational Icon'}</label>
                <select 
                  value={newServiceIcon} 
                  onChange={(e) => setNewServiceIcon(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white cursor-pointer"
                >
                  <option value="Palette">🎨 Palette / Design</option>
                  <option value="Wrench">🔧 Wrench / Maintenance</option>
                  <option value="GraduationCap">🎓 Cap / Training & Courses</option>
                  <option value="Shirt">👕 Shirt / Printing & DTF</option>
                </select>
              </div>

              {/* Service Sub Options Manager */}
              <div className="p-4 rounded-xl border border-white/5 bg-[#111111]/30 space-y-3">
                <label className="block text-xs font-bold text-white">{lang === 'ar' ? 'الخيارات الفرعية (Sub-Services)' : 'Sub-Services & Action Offerings'}</label>
                
                {/* Options List */}
                <div className="space-y-2">
                  {newServiceOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                      <span className="text-white font-mono">{opt.ar} | {opt.en}</span>
                      <button 
                        type="button" 
                        onClick={() => removeServiceOption(idx)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Option fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder={lang === 'ar' ? 'الخيار الفرعي (عربي)' : 'Sub-service (Arabic)'}
                    value={currentOptionAr}
                    onChange={(e) => setCurrentOptionAr(e.target.value)}
                    className="bg-[#111111] border border-white/10 rounded-lg p-2 text-xs text-white"
                  />
                  <input 
                    type="text" 
                    placeholder={lang === 'ar' ? 'الخيار الفرعي (إنجليزي)' : 'Sub-service (English)'}
                    value={currentOptionEn}
                    onChange={(e) => setCurrentOptionEn(e.target.value)}
                    className="bg-[#111111] border border-white/10 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={addServiceOption}
                  className="w-full py-2 rounded-lg bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{lang === 'ar' ? 'إضافة الخيار الفرعي للقائمة' : 'Append Sub-service to list'}</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddService}
                  className="flex-1 py-3 rounded-xl bg-[#25D366] text-black font-extrabold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#25D366]/10 cursor-pointer"
                >
                  {editingServiceId ? (lang === 'ar' ? 'تحديث وتعديل القسم' : 'Save Section changes') : (lang === 'ar' ? 'إنشاء وإضافة القسم الجديد' : 'Save & Create Section')}
                </button>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingServiceId(null);
                      setNewServiceNameAr('');
                      setNewServiceNameEn('');
                      setNewServiceDescAr('');
                      setNewServiceDescEn('');
                      setNewServiceIcon('Palette');
                      setNewServiceOptions([]);
                    }}
                    className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* PANEL 3: ESTIMATED starting RATES */}
        {activeTab === 'prices' && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
              {lang === 'ar' ? 'تعديل الأسعار التقديرية المبدئية للخدمات الكبرى' : 'Update Starting Estimates for Prime offerings'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Emb */}
              <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <label className="block text-xs font-semibold text-[#0A84FF]">{lang === 'ar' ? 'تصميم تطريز (عربي)' : 'Embroidery (Arabic)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.embroidery.ar}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, embroidery: { ...prev.settings.prices.embroidery, ar: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
                <label className="block text-[10px] text-gray-500 mt-1">{lang === 'ar' ? 'تصميم تطريز (إنجليزي)' : 'Embroidery (English)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.embroidery.en}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, embroidery: { ...prev.settings.prices.embroidery, en: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Dtf */}
              <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <label className="block text-xs font-semibold text-[#25D366]">{lang === 'ar' ? 'تصاميم وطباعة DTF (عربي)' : 'DTF designs (Arabic)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.dtf.ar}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, dtf: { ...prev.settings.prices.dtf, ar: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
                <label className="block text-[10px] text-gray-500 mt-1">{lang === 'ar' ? 'تصاميم وطباعة DTF (إنجليزي)' : 'DTF designs (English)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.dtf.en}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, dtf: { ...prev.settings.prices.dtf, en: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Maintenance */}
              <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <label className="block text-xs font-semibold text-blue-400">{lang === 'ar' ? 'زيارة الصيانة والدعم (عربي)' : 'Machine diagnostics (Arabic)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.maintenance.ar}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, maintenance: { ...prev.settings.prices.maintenance, ar: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
                <label className="block text-[10px] text-gray-500 mt-1">{lang === 'ar' ? 'زيارة الصيانة والدعم (إنجليزي)' : 'Machine diagnostics (English)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.maintenance.en}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, maintenance: { ...prev.settings.prices.maintenance, en: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Course */}
              <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <label className="block text-xs font-semibold text-amber-400">{lang === 'ar' ? 'كورس برنامج ويلكوم (عربي)' : 'Comprehensive Wilcom Course (Arabic)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.course.ar}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, course: { ...prev.settings.prices.course, ar: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
                <label className="block text-[10px] text-gray-500 mt-1">{lang === 'ar' ? 'كورس برنامج ويلكوم (إنجليزي)' : 'Comprehensive Wilcom Course (English)'}</label>
                <input 
                  type="text" 
                  value={config.settings.prices.course.en}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, prices: { ...prev.settings.prices, course: { ...prev.settings.prices.course, en: e.target.value } } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

            </div>
          </div>
        )}

        {/* PANEL 4: PORTFOLIO GALLERY ITEMS */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Form to add item */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-[#0A84FF]" />
                <span>{lang === 'ar' ? 'إضافة صورة أو تصميم جديد لمعرض الأعمال' : 'Add Creative Output Asset to Gallery'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'عنوان التصميم (عربي)' : 'Asset Title (Arabic)'}</label>
                  <input 
                    type="text" 
                    value={newPortfolioTitleAr}
                    onChange={(e) => setNewPortfolioTitleAr(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                    placeholder="مثال: شعار تطريز متميز على تيشيرت"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'عنوان التصميم (إنجليزي)' : 'Asset Title (English)'}</label>
                  <input 
                    type="text" 
                    value={newPortfolioTitleEn}
                    onChange={(e) => setNewPortfolioTitleEn(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                    placeholder="e.g. Elegant chest embroidery design on polo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'قسم التصميم (التصنيف)' : 'Category / Portfolio Section'}</label>
                  <select 
                    value={newPortfolioCategory}
                    onChange={(e) => setNewPortfolioCategory(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white cursor-pointer"
                  >
                    <option value="embroidery">{lang === 'ar' ? 'تطريز' : 'Embroidery'}</option>
                    <option value="dtf">DTF</option>
                    <option value="logo">{lang === 'ar' ? 'شعارات' : 'Logos'}</option>
                    <option value="maintenance">{lang === 'ar' ? 'الصيانة' : 'Maintenance'}</option>
                    <option value="course">{lang === 'ar' ? 'كورسات ودورات' : 'Courses'}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'رابط مباشر للصورة أو رفع صورة محلية' : 'Direct Image Link or local Upload'}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/..."
                      value={portfolioBase64}
                      onChange={(e) => setPortfolioBase64(e.target.value)}
                      className="flex-1 bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                    />
                    <input 
                      type="file" 
                      ref={portfolioInputRef}
                      onChange={handlePortfolioUpload}
                      accept="image/*"
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => portfolioInputRef.current?.click()}
                      className="px-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 flex items-center justify-center shrink-0 cursor-pointer"
                      title={lang === 'ar' ? 'رفع ملف' : 'Upload file'}
                    >
                      <Upload size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {portfolioBase64 && (
                <div className="mt-4 p-2.5 rounded-xl border border-white/5 bg-[#111111] flex items-center gap-3">
                  <img src={portfolioBase64} alt="Pre-upload validation" className="w-12 h-12 rounded object-cover" referrerPolicy="no-referrer" />
                  <span className="text-[10px] text-gray-500 font-mono truncate max-w-xs">{portfolioBase64.substring(0, 100)}...</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddPortfolio}
                className="w-full py-3 rounded-xl bg-[#0A84FF] text-white font-extrabold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#0A84FF]/10 cursor-pointer"
              >
                {lang === 'ar' ? 'إضافة الصورة لمعرض المخرجات الفنية' : 'Append Creative Output to Gallery'}
              </button>
            </div>

            {/* List and manage images */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400">{lang === 'ar' ? 'الصور الحالية بالمعرض' : 'Assets currently live in Gallery'}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {config.portfolio.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[#111111] group">
                    <img src={item.url} alt={item.title[lang]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-3 transition-opacity">
                      <p className="text-[9px] text-white font-bold leading-tight line-clamp-2">{item.title[lang]}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] px-1 py-0.5 rounded bg-[#0A84FF]/20 text-[#0A84FF] font-mono">{item.category}</span>
                        <button
                          type="button"
                          onClick={() => setConfig(prev => ({ ...prev, portfolio: prev.portfolio.filter(p => p.id !== item.id) }))}
                          className="p-1 rounded bg-red-600/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PANEL 5: VIDEOS */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Add video form */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-[#0A84FF]" />
                <span>{lang === 'ar' ? 'إضافة فيديو وشرح ميكانيكي جديد' : 'Publish Technical Video tutorial'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'عنوان الفيديو (عربي)' : 'Video Title (Arabic)'}</label>
                  <input 
                    type="text" 
                    value={newVideoTitleAr}
                    onChange={(e) => setNewVideoTitleAr(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                    placeholder="مثال: كيفية ضبط تزييت ماكينة التاجيما"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'عنوان الفيديو (إنجليزي)' : 'Video Title (English)'}</label>
                  <input 
                    type="text" 
                    value={newVideoTitleEn}
                    onChange={(e) => setNewVideoTitleEn(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                    placeholder="e.g. Correct oil lubrication for Tajima head"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'رابط ملف الفيديو المباشر أو اليوتيوب' : 'Stream Link (Direct MP4 or Youtube)'}</label>
                  <input 
                    type="text" 
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'مدة الفيديو الزمنية' : 'Duration'}</label>
                  <input 
                    type="text" 
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                    placeholder="05:15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-300">{lang === 'ar' ? 'رابط صورة الغلاف المصغرة (Thumbnail)' : 'Thumbnail Cover URL'}</label>
                <input 
                  type="text" 
                  value={newVideoThumbnail}
                  onChange={(e) => setNewVideoThumbnail(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleAddVideo}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-black font-extrabold text-xs sm:text-sm hover:shadow-lg cursor-pointer"
              >
                {lang === 'ar' ? 'إضافة الفيديو الجديد للمعرض' : 'Add Video to Vault'}
              </button>
            </div>

            {/* List and manage videos */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400">{lang === 'ar' ? 'الفيديوهات المتوفرة حالياً' : 'Videos active in Library'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {config.videos.map((video) => (
                  <div key={video.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.01] flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded overflow-hidden bg-black flex-shrink-0 relative">
                        <img src={video.thumbnail} alt={video.title[lang]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-0 right-0 text-[7px] bg-black/80 px-1 py-0.5 text-white font-mono">{video.duration}</span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-white font-bold truncate">{video.title[lang]}</p>
                        <p className="text-[9px] text-gray-500 font-mono truncate">{video.url}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== video.id) }))}
                      className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 text-gray-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PANEL 6: REVIEWS / COMMENTS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Form to add review */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-[#0A84FF]" />
                <span>{editingReviewId ? (lang === 'ar' ? 'تعديل تقييم العميل' : 'Edit Review') : (lang === 'ar' ? 'إضافة تقييم أو تعليق عميل جديد' : 'Add Corporate Customer Endorsement')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'اسم العميل الكامل' : 'Reviewer / Customer Full Name'}</label>
                  <input 
                    type="text" 
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-300">{lang === 'ar' ? 'البلد' : 'Country flag'}</label>
                    <select 
                      value={reviewerCountry}
                      onChange={(e) => setReviewerCountry(e.target.value)}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white cursor-pointer"
                    >
                      <option value="EG"> Egypt 🇪🇬</option>
                      <option value="SA">Saudi Arabia 🇸🇦</option>
                      <option value="AE">United Arab Emirates 🇦🇪</option>
                      <option value="OTH">Other / International 🌐</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs text-gray-300">{lang === 'ar' ? 'التقييم بالنجوم (1-5)' : 'Stars Rating'}</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'تصنيف الشريك (عربي)' : 'Corporate description (Ar)'}</label>
                  <input 
                    type="text" 
                    value={reviewTypeAr}
                    onChange={(e) => setReviewTypeAr(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                    placeholder="مثال: مصنع معتمد"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'تصنيف الشريك (إنجليزي)' : 'Corporate description (En)'}</label>
                  <input 
                    type="text" 
                    value={reviewTypeEn}
                    onChange={(e) => setReviewTypeEn(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white"
                    placeholder="e.g. Verified Factory"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'التعليق (عربي)' : 'Feedback text (Ar)'}</label>
                  <textarea 
                    value={reviewCommentAr}
                    onChange={(e) => setReviewCommentAr(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white h-20 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300">{lang === 'ar' ? 'التعليق (إنجليزي)' : 'Feedback text (En)'}</label>
                  <textarea 
                    value={reviewCommentEn}
                    onChange={(e) => setReviewCommentEn(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white h-20 resize-none"
                  />
                </div>
              </div>

              {/* Review Avatar Image */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-300">{lang === 'ar' ? 'صورة العميل الرمزية (اختياري)' : 'Customer Avatar Photo (Optional)'}</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-[#111111] flex items-center justify-center overflow-hidden shrink-0">
                    {reviewBase64Image ? (
                      <img src={reviewBase64Image} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[8px] text-gray-500">{lang === 'ar' ? 'تلقائي' : 'Grad'}</span>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={reviewImgInputRef}
                    onChange={handleReviewImgUpload}
                    accept="image/*"
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => reviewImgInputRef.current?.click()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-white cursor-pointer"
                  >
                    <Upload size={12} />
                    <span>{lang === 'ar' ? 'رفع صورة العميل' : 'Upload photo'}</span>
                  </button>
                  {reviewBase64Image && (
                    <button
                      type="button"
                      onClick={() => setReviewBase64Image('')}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddReview}
                  className="flex-1 py-3 rounded-xl bg-[#25D366] text-black font-extrabold text-xs sm:text-sm cursor-pointer"
                >
                  {editingReviewId ? (lang === 'ar' ? 'حفظ تعديلات العميل' : 'Apply changes') : (lang === 'ar' ? 'إضافة التقييم للقائمة' : 'Publish feedback')}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReviewId(null);
                      setReviewerName('');
                      setReviewCommentAr('');
                      setReviewCommentEn('');
                      setReviewBase64Image('');
                    }}
                    className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>

            {/* List and manage reviews */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400">{lang === 'ar' ? 'الآراء والمراجعات الحالية' : 'Endorsements live on platform'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{rev.name}</span>
                          <span className="text-xs">{rev.country === 'EG' ? '🇪🇬' : rev.country === 'SA' ? '🇸🇦' : rev.country === 'AE' ? '🇦🇪' : '🌐'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2 italic">" {rev.comment[lang]} "</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[9px] text-gray-500">{rev.type?.[lang]}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReviewId(rev.id);
                            setReviewerName(rev.name);
                            setReviewerCountry(rev.country);
                            setReviewRating(rev.rating);
                            setReviewCommentAr(rev.comment.ar);
                            setReviewCommentEn(rev.comment.en);
                            setReviewTypeAr(rev.type?.ar || 'شريك معتمد');
                            setReviewTypeEn(rev.type?.en || 'Verified Partner');
                            setReviewBase64Image(rev.image || '');
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="p-1 rounded bg-[#0A84FF]/10 text-[#0A84FF] hover:bg-[#0A84FF]/20 cursor-pointer text-[10px]"
                        >
                          <Edit size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfig(prev => ({ ...prev, reviews: prev.reviews.filter(r => r.id !== rev.id) }))}
                          className="p-1 rounded bg-red-600/10 text-red-400 hover:text-red-300 cursor-pointer text-[10px]"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PANEL 7: SOCIAL MEDIA CHANNELS */}
        {activeTab === 'social' && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
              {lang === 'ar' ? 'روابط شبكات ومواقع التواصل الاجتماعي' : 'Configure Social Channel Hotlinks'}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-blue-400">Facebook Page URL</label>
                <input 
                  type="text" 
                  value={config.settings.social.facebook || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, social: { ...prev.settings.social, facebook: e.target.value } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-pink-400">Instagram Handle URL</label>
                <input 
                  type="text" 
                  value={config.settings.social.instagram || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, social: { ...prev.settings.social, instagram: e.target.value } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">TikTok Account URL</label>
                <input 
                  type="text" 
                  value={config.settings.social.tiktok || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, social: { ...prev.settings.social, tiktok: e.target.value } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="https://tiktok.com/@..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-red-500">YouTube Channel URL</label>
                <input 
                  type="text" 
                  value={config.settings.social.youtube || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, settings: { ...prev.settings, social: { ...prev.settings.social, youtube: e.target.value } } }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="https://youtube.com/c/..."
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
