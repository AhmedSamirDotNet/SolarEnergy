"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ar"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.products": "Products",
    "nav.contact": "Contact Us",

    // Hero Section
    "hero.title": "Powering Tomorrow with Solar Energy",
    "hero.subtitle": "AFKAR Solar provides cutting-edge solar solutions for a sustainable future. We deliver high-quality solar panels and systems for residential and commercial use.",
    "hero.cta": "Explore Products",
    "hero.secondary": "Contact Us",

    // About Section
    "about.title": "About AFKAR Solar",
    "about.subtitle": "Leading the Way in Renewable Energy",
    "about.description": "AFKAR Solar is a leading provider of solar energy solutions in Saudi Arabia. We are committed to delivering innovative and sustainable energy solutions that help reduce carbon footprint and energy costs.",
    "about.mission.title": "Our Mission",
    "about.mission.text": "To accelerate the transition to sustainable energy by providing high-quality, affordable solar solutions.",
    "about.vision.title": "Our Vision",
    "about.vision.text": "To be the leading solar energy provider in the Middle East, powering a cleaner and greener future.",
    "about.values.title": "Our Values",
    "about.values.text": "Innovation, Sustainability, Quality, and Customer Satisfaction are at the core of everything we do.",

    // Products Section
    "products.title": "Our Products",
    "products.subtitle": "High-Quality Solar Solutions",
    "products.viewAll": "View All Products",
    "products.viewDetails": "View Details",
    "products.price": "Price",
    "products.sar": "SAR",

    // Contact Section
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in Touch",
    "contact.name": "Your Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.message": "Your Message",
    "contact.send": "Send Message",
    "contact.sales": "Sales",
    "contact.support": "Technical Support",

    // Footer
    "footer.rights": "All Rights Reserved",
    "footer.followUs": "Follow Us",
    "footer.quickLinks": "Quick Links",
    "footer.contactInfo": "Contact Information",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.sections": "Sections",
    "dashboard.products": "Products",
    "dashboard.logout": "Logout",
    "dashboard.add": "Add New",
    "dashboard.edit": "Edit",
    "dashboard.delete": "Delete",
    "dashboard.save": "Save",
    "dashboard.cancel": "Cancel",
    "dashboard.actions": "Actions",
    "dashboard.name": "Name",
    "dashboard.nameAr": "Name (Arabic)",
    "dashboard.nameEn": "Name (English)",
    "dashboard.description": "Description",
    "dashboard.descriptionAr": "Description (Arabic)",
    "dashboard.descriptionEn": "Description (English)",
    "dashboard.price": "Price",
    "dashboard.section": "Section",
    "dashboard.images": "Images",
    "dashboard.mainDesc": "Main Description",
    "dashboard.subDesc": "Sub Description",
    "dashboard.mainDescAr": "Main Description (Arabic)",
    "dashboard.mainDescEn": "Main Description (English)",
    "dashboard.subDescAr": "Sub Description (Arabic)",
    "dashboard.subDescEn": "Sub Description (English)",
    "dashboard.noData": "No data available",
    "dashboard.confirmDelete": "Are you sure you want to delete this item?",

    // Admin Management
    "dashboard.admins": "Admins",
    "dashboard.username": "Username",
    "dashboard.role": "Role",
    "dashboard.registerAdmin": "Register Admin",
    "dashboard.updateRole": "Update Role",
    "dashboard.password": "Password",
    "dashboard.projects": "Projects",
    "dashboard.titleAr": "Title (Arabic)",
    "dashboard.titleEn": "Title (English)",
    "dashboard.locationAr": "Location (Arabic)",
    "dashboard.locationEn": "Location (English)",
    "dashboard.location": "Location",

    // Login
    "login.title": "Admin Login",
    "login.username": "Username",
    "login.password": "Password",
    "login.submit": "Login",
    "login.error": "Invalid username or password",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.products": "المنتجات",
    "nav.contact": "اتصل بنا",

    // Hero Section
    "hero.title": "نمد الغد بالطاقة الشمسية",
    "hero.subtitle": "أفكار سولار تقدم حلول طاقة شمسية متطورة لمستقبل مستدام. نقدم ألواح وأنظمة شمسية عالية الجودة للاستخدام السكني والتجاري.",
    "hero.cta": "استكشف المنتجات",
    "hero.secondary": "اتصل بنا",

    // About Section
    "about.title": "عن أفكار سولار",
    "about.subtitle": "نقود الطريق في الطاقة المتجددة",
    "about.description": "أفكار سولار هي شركة رائدة في تقديم حلول الطاقة الشمسية في المملكة العربية السعودية. نحن ملتزمون بتقديم حلول طاقة مبتكرة ومستدامة تساعد في تقليل البصمة الكربونية وتكاليف الطاقة.",
    "about.mission.title": "مهمتنا",
    "about.mission.text": "تسريع التحول إلى الطاقة المستدامة من خلال توفير حلول شمسية عالية الجودة وبأسعار معقولة.",
    "about.vision.title": "رؤيتنا",
    "about.vision.text": "أن نكون المزود الرائد للطاقة الشمسية في الشرق الأوسط، ونمد مستقبلاً أنظف وأخضر.",
    "about.values.title": "قيمنا",
    "about.values.text": "الابتكار والاستدامة والجودة ورضا العملاء هي جوهر كل ما نقوم به.",

    // Products Section
    "products.title": "منتجاتنا",
    "products.subtitle": "حلول شمسية عالية الجودة",
    "products.viewAll": "عرض جميع المنتجات",
    "products.viewDetails": "عرض التفاصيل",
    "products.price": "السعر",
    "products.sar": "ريال",

    // Contact Section
    "contact.title": "اتصل بنا",
    "contact.subtitle": "تواصل معنا",
    "contact.name": "اسمك",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "رقم الهاتف",
    "contact.message": "رسالتك",
    "contact.send": "إرسال الرسالة",
    "contact.sales": "المبيعات",
    "contact.support": "الدعم الفني",

    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.followUs": "تابعنا",
    "footer.quickLinks": "روابط سريعة",
    "footer.contactInfo": "معلومات الاتصال",

    // Dashboard
    "dashboard.title": "لوحة التحكم",
    "dashboard.sections": "الأقسام",
    "dashboard.products": "المنتجات",
    "dashboard.logout": "تسجيل الخروج",
    "dashboard.add": "إضافة جديد",
    "dashboard.edit": "تعديل",
    "dashboard.delete": "حذف",
    "dashboard.save": "حفظ",
    "dashboard.cancel": "إلغاء",
    "dashboard.actions": "الإجراءات",
    "dashboard.name": "الاسم",
    "dashboard.nameAr": "الاسم (عربي)",
    "dashboard.nameEn": "الاسم (إنجليزي)",
    "dashboard.description": "الوصف",
    "dashboard.descriptionAr": "الوصف (عربي)",
    "dashboard.descriptionEn": "الوصف (إنجليزي)",
    "dashboard.price": "السعر",
    "dashboard.section": "القسم",
    "dashboard.images": "الصور",
    "dashboard.mainDesc": "الوصف الرئيسي",
    "dashboard.subDesc": "الوصف الفرعي",
    "dashboard.mainDescAr": "الوصف الرئيسي (عربي)",
    "dashboard.mainDescEn": "الوصف الرئيسي (إنجليزي)",
    "dashboard.subDescAr": "الوصف الفرعي (عربي)",
    "dashboard.subDescEn": "الوصف الفرعي (إنجليزي)",
    "dashboard.noData": "لا توجد بيانات",
    "dashboard.confirmDelete": "هل أنت متأكد من حذف هذا العنصر؟",

    // Admin Management
    "dashboard.admins": "المسؤولين",
    "dashboard.username": "اسم المستخدم",
    "dashboard.role": "الدور",
    "dashboard.registerAdmin": "تسجيل مسؤول",
    "dashboard.updateRole": "تحديث الدور",
    "dashboard.password": "كلمة المرور",
    "dashboard.projects": "المشاريع",
    "dashboard.titleAr": "العنوان (عربي)",
    "dashboard.titleEn": "العنوان (إنجليزي)",
    "dashboard.locationAr": "الموقع (عربي)",
    "dashboard.locationEn": "الموقع (إنجليزي)",
    "dashboard.location": "الموقع",

    // Login
    "login.title": "تسجيل دخول المسؤول",
    "login.username": "اسم المستخدم",
    "login.password": "كلمة المرور",
    "login.submit": "تسجيل الدخول",
    "login.error": "اسم المستخدم أو كلمة المرور غير صحيحة",
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
