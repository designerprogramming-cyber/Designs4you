import { ServiceItem } from './types';

export const TRANSLATIONS = {
  ar: {
    title: "مركز خدمات Designs4you",
    subtitle: "تطريز • طباعة DTF • تدريب وكورسات • صيانة ماكينات",
    heroTitle: "مرحباً بكم في مركز خدمات Designs4you",
    heroDesc: "اختر الخدمة التي تحتاجها وسنقوم بتوصيلك بالقسم الصحيح فوراً.",
    back: "رجوع",
    quickQuoteTitle: "طلب تسعير سريع",
    quoteFormDesc: "يرجى ملء النموذج أدناه وسنقوم بتحويلك مباشرة إلى القسم المختص عبر واتساب لمتابعة طلبك.",
    formName: "الاسم الكامل",
    formPhone: "رقم الهاتف (الواتساب)",
    formGov: "المحافظة",
    formDept: "القسم المختص",
    formService: "الخدمة المطلوبة",
    formNotes: "ملاحظات إضافية (اختياري)",
    formSubmit: "إرسال الطلب عبر واتساب",
    selectDeptPlaceholder: "اختر القسم أولاً",
    selectServicePlaceholder: "اختر الخدمة",
    validationError: "يرجى ملء جميع الحقول المطلوبة بشكل صحيح.",
    loadingText: "جاري تحميل وتجهيز طلبك...",
    stickyCallTooltip: "اتصل بنا",
    stickyWhatsAppTooltip: "مراسلة واتساب",
    footerDesc: "المركز الاحترافي الأول المعتمد لخدمات تصميمات التطريز والطباعة الرقمية DTF وصيانة الماكينات والتدريب المتخصص.",
    footerCopyright: "جميع الحقوق محفوظة لـ Designs4you © 2026",
    footerMadeBy: "تم التطوير باحترافية عالية",
    
    // Portfolio Gallery Translation keys
    portfolioTitle: "معرض أعمالنا المتميزة",
    portfolioSubtitle: "اكتشف تشكيلة واسعة من أحدث تصميمات التطريز الاحترافية، طباعة DTF، الشعارات، وتطبيقات الدعم الفني.",
    filterAll: "الكل",
    filterEmbroidery: "تطريز",
    filterDTF: "DTF",
    filterLogos: "شعارات",
    filterMaintenance: "الصيانة",
    filterCourses: "كورسات ودورات",
    lightboxPrev: "السابق",
    lightboxNext: "التالي",
    lightboxClose: "إغلاق",
    
    // Departments
    deptDesign: "تصميم تطريز ولوجو",
    deptMaintenance: "الصيانة والدعم الفني",
    deptCourses: "التدريب والكورسات",
    deptDtf: "تصاميم DTF ومطبوعات",
    deptQuote: "تسعير سريع واستفسارات",

    // Governorates list for Arab market (Egypt focus based on phone number format)
    govs: [
      "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", 
      "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", 
      "المنيا", "القليوبية", "الوادي الجديد", "الشرقية", "السويس", 
      "اسوان", "اسيوط", "بني سويف", "بورسعيد", "دمياط", 
      "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", 
      "شمال سيناء", "سوهاج"
    ],

    // Why Choose Us
    whyTitle: "لماذا تختار Designs4you؟",
    whySubtitle: "نحن ملتزمون بتقديم أعلى مستويات الدقة والاحترافية والسرعة في السوق العربي.",
    whyItem1Title: "خبرة معتمدة واحترافية",
    whyItem1Desc: "نمتلك خبرة تزيد عن 10 سنوات في صيانة وتطوير وتصميم ماكينات التطريز والطباعة الرقمية.",
    whyItem2Title: "دعم فني على مدار الساعة",
    whyItem2Desc: "مهندسون متخصصون لمساعدتك فوراً في حل أي عطل فني لضمان استمرار إنتاجيتك دون توقف.",
    whyItem3Title: "جودة تصميم فائقة الدقة",
    whyItem3Desc: "تصميمات تطريز مطابقة للمقاييس العالمية خالية من الأخطاء والعيوب ومجربة على الماكينات.",
    whyItem4Title: "كورسات تعليمية تطبيقية",
    whyItem4Desc: "دورات تدريبية تضمن احترافك لبرامج التصميم وصيانة ماكينات التطريز من الصفر حتى الاحتراف.",

    // Reviews
    reviewsTitle: "ماذا يقول عملاؤنا؟",
    reviewsSubtitle: "آراء شركاء النجاح من أصحاب المصانع والمصممين في كفاءة خدماتنا.",
    review1Author: "م. أحمد الشاذلي (صاحب مصنع تطريز)",
    review1Text: "تعاملت مع مركز Designs4you في صيانة الماكينات وشراء التصاميم. دقة متناهية وسرعة لم أجدها في أي مكان آخر.",
    review2Author: "أ/ سارة المهدي (مصممة مستقلة)",
    review2Text: "الكورس التعليمي لبرنامج ويلكوم كان رائعاً وشاملاً لكل التفاصيل، والآن أعمل بشكل مستقل وأصمم باحترافية.",
    review3Author: "أ/ محمد الدوسري (مدير إنتاج - الرياض)",
    review3Text: "خدمة العملاء ممتازة وسرعة الاستجابة لطلبات تصاميم DTF مذهلة. جودة الطباعة والألوان تفوق التوقعات.",

    // Video Gallery
    videosTitle: "معرض الشروحات والفيديوهات",
    videosSubtitle: "شاهد شروحات عملية، مراجعات للماكينات، وتطبيقات عملية لخدماتنا المتميزة.",

    // Contact Form Country and Fields
    countrySelect: "الدولة والبلد",
    regionSelect: "المنطقة / المحافظة / الإمارة",
    citySelect: "المدينة",
    egFlag: "مصر 🇪🇬",
    saFlag: "السعودية 🇸🇦",
    aeFlag: "الإمارات 🇦🇪",
    othFlag: "دولة أخرى 🌐",
    invalidPhoneError: "يرجى إدخال رقم هاتف صحيح لـ WhatsApp لتلقي رد فوري.",
    requestIdLabel: "معرف الطلب التلقائي:"
  },
  en: {
    title: "Designs4you Service Center",
    subtitle: "Embroidery • DTF • Training • Maintenance",
    heroTitle: "Welcome to Designs4you Service Center",
    heroDesc: "Choose the service you need and we will connect you to the right department.",
    back: "Back",
    quickQuoteTitle: "Quick Quote Request",
    quoteFormDesc: "Please fill out the form below, and you will be automatically redirected to the respective department on WhatsApp to process your request.",
    formName: "Full Name",
    formPhone: "Phone Number (WhatsApp)",
    formGov: "Governorate",
    formDept: "Department",
    formService: "Selected Service",
    formNotes: "Additional Notes (Optional)",
    formSubmit: "Submit Quote via WhatsApp",
    selectDeptPlaceholder: "Select department first",
    selectServicePlaceholder: "Select service",
    validationError: "Please fill in all required fields correctly.",
    loadingText: "Preparing your request...",
    stickyCallTooltip: "Call Us",
    stickyWhatsAppTooltip: "WhatsApp Chat",
    footerDesc: "The premier professional certified center for embroidery designs, digital DTF printing, machine maintenance, and specialized industry training.",
    footerCopyright: "All rights reserved to Designs4you © 2026",
    footerMadeBy: "Professionally Developed",
    
    // Portfolio Gallery Translation keys
    portfolioTitle: "Our Work Gallery",
    portfolioSubtitle: "Discover our premium collection of embroidery designs, custom digital DTF decals, modern logos, and precision mechanics.",
    filterAll: "All",
    filterEmbroidery: "Embroidery",
    filterDTF: "DTF",
    filterLogos: "Logos",
    filterMaintenance: "Maintenance",
    filterCourses: "Courses",
    lightboxPrev: "Previous",
    lightboxNext: "Next",
    lightboxClose: "Close",
    
    // Departments
    deptDesign: "Embroidery & Logo Design",
    deptMaintenance: "Technical Support & Maintenance",
    deptCourses: "Training & Courses",
    deptDtf: "DTF Printing & Designs",
    deptQuote: "Quick Pricing & Quotes",

    // Governorates translated (Egyptian governorates as default for regional match)
    govs: [
      "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", 
      "Beheira", "Fayoum", "Gharbia", "Ismailia", "Monufia", 
      "Minya", "Qalyubia", "New Valley", "Sharqia", "Suez", 
      "Aswan", "Asyut", "Beni Suef", "Port Said", "Damietta", 
      "South Sinai", "Kafr El-Sheikh", "Matrouh", "Luxor", "Qena", 
      "North Sinai", "Sohag"
    ],

    // Why Choose Us
    whyTitle: "Why Choose Designs4you?",
    whySubtitle: "We are committed to delivering the highest precision, professional expertise, and rapid speed in the Arab market.",
    whyItem1Title: "Certified Professional Expertise",
    whyItem1Desc: "Over 10 years of trusted industry experience in embroidery and digital DTF design, maintenance, and training.",
    whyItem2Title: "24/7 Premium Technical Support",
    whyItem2Desc: "Dedicated certified engineers standing by to resolve any machinery issues to keep your production running non-stop.",
    whyItem3Title: "Ultra-High Precision Designs",
    whyItem3Desc: "Our designs are stitch-perfect, calibrated, fully optimized for modern machines, and run-tested.",
    whyItem4Title: "Practical Applied Training",
    whyItem4Desc: "Hands-on intensive courses ensuring your path from zero to professional master in Wilcom software.",

    // Reviews
    reviewsTitle: "What Our Customers Say",
    reviewsSubtitle: "Honest feedback from factory owners, designers, and business owners across the region.",
    review1Author: "Eng. Ahmed El-Shazly (Factory Owner)",
    review1Text: "I worked with Designs4you for machine repairs and custom design templates. Unmatched precision and turnaround speed.",
    review2Author: "Sarah Al-Mahdi (Freelance Designer)",
    review2Text: "The Wilcom masterclass was absolutely transformative. I am now creating professional embroidery patterns and freelancing.",
    review3Author: "Mohammed Al-Dossari (Production Mgr - Riyadh)",
    review3Text: "Extraordinary customer support and amazing DTF transfers. Colors are brilliant, durable and highly vibrant.",

    // Video Gallery
    videosTitle: "Video Explanations & Showcases",
    videosSubtitle: "Watch actual maintenance walkthroughs, embroidery previews, and design tutorials.",

    // Contact Form Country and Fields
    countrySelect: "Country & Region",
    regionSelect: "Region / Governorate / Emirate",
    citySelect: "City Name",
    egFlag: "Egypt 🇪🇬",
    saFlag: "Saudi Arabia 🇸🇦",
    aeFlag: "UAE 🇦🇪",
    othFlag: "Other Country 🌐",
    invalidPhoneError: "Please enter a valid WhatsApp phone number for an instant response.",
    requestIdLabel: "Automatic Request ID:"
  }
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "design",
    icon: "Palette",
    faIcon: "fa-solid fa-palette",
    title: {
      ar: "🎨 قسم التصميم",
      en: "🎨 Design Department"
    },
    description: {
      ar: "تصاميم تطريز احترافية وتحويل الصور إلى تطريز بأعلى دقة، مع تصميم الشعارات والهوية البصرية.",
      en: "Professional embroidery designs, logo identity design, and high-precision image-to-embroidery conversion."
    },
    options: [
      {
        id: "embroidery_design",
        title: {
          ar: "تصميم تطريز (Embroidery Design)",
          en: "Embroidery Design"
        }
      },
      {
        id: "dtf_design",
        title: {
          ar: "تصميم دي تي إف (DTF Design)",
          en: "DTF Design"
        }
      },
      {
        id: "logo_design",
        title: {
          ar: "تصميم لوجو وشعار (Logo Design)",
          en: "Logo Design"
        }
      },
      {
        id: "image_to_embroidery",
        title: {
          ar: "تحويل صورة إلى تصميم تطريز جاهز",
          en: "Convert Image to Embroidery Design"
        }
      }
    ]
  },
  {
    id: "maintenance",
    icon: "Wrench",
    faIcon: "fa-solid fa-wrench",
    title: {
      ar: "🔧 قسم الصيانة",
      en: "🔧 Maintenance Department"
    },
    description: {
      ar: "صيانة ماكينات التطريز المنزلية والصناعية بجميع أنواعها، مع توفير قطع الغيار الأصلية والدعم الفني.",
      en: "Maintenance of domestic and industrial embroidery machines, providing genuine spare parts and support."
    },
    options: [
      {
        id: "machine_maintenance",
        title: {
          ar: "صيانة ماكينة تطريز",
          en: "Embroidery Machine Maintenance"
        }
      },
      {
        id: "maintenance_followup",
        title: {
          ar: "متابعة طلب صيانة سابق",
          en: "Maintenance Follow-up"
        }
      },
      {
        id: "book_visit",
        title: {
          ar: "حجز زيارة صيانة منزلية / موقع عمل",
          en: "Book Maintenance Visit"
        }
      }
    ]
  },
  {
    id: "courses",
    icon: "GraduationCap",
    faIcon: "fa-solid fa-graduation-cap",
    title: {
      ar: "🎓 قسم الكورسات والتدريب",
      en: "🎓 Courses & Training"
    },
    description: {
      ar: "كورسات احترافية مكثفة لبرامج التصميم ويلكوم، ودورات صيانة وتشغيل ماكينات التطريز لتبدأ مشروعك بنجاح.",
      en: "Intensive professional design courses for Wilcom, and embroidery machine maintenance to start your business."
    },
    options: [
      {
        id: "wilcom_course",
        title: {
          ar: "كورس تصميم التطريز ببرنامج ويلكوم (Wilcom Course)",
          en: "Wilcom Course"
        }
      },
      {
        id: "maintenance_course",
        title: {
          ar: "كورس صيانة ماكينات التطريز الشامل",
          en: "Embroidery Machine Maintenance Course"
        }
      }
    ]
  },
  {
    id: "dtf",
    icon: "Shirt",
    faIcon: "fa-solid fa-shirt",
    title: {
      ar: "👕 قسم تصاميم DTF",
      en: "👕 DTF Designs Department"
    },
    description: {
      ar: "احصل على أفضل التصاميم الجاهزة لطباعة الـ DTF المباشرة على الملابس، مع إمكانية التعديل وطلب تصاميم مخصصة.",
      en: "Get premium ready-to-print DTF designs for garments, custom request modification, and exclusive design creation."
    },
    options: [
      {
        id: "buy_ready_designs",
        title: {
          ar: "شراء تصميمات جاهزة ومطبوعة",
          en: "Buy Ready Designs"
        }
      },
      {
        id: "custom_dtf_design",
        title: {
          ar: "طلب تصميم DTF خاص ومبتكر",
          en: "Custom DTF Design"
        }
      },
      {
        id: "modify_design",
        title: {
          ar: "تعديل على تصميم موجود أو دمج صور",
          en: "Modify Existing Design"
        }
      }
    ]
  }
];
