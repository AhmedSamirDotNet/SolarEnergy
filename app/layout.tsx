import React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic, Tajawal } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

// تحسين الخطوط العربية
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
  preload: true,
});

// Viewport settings
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffb347",
  colorScheme: "light",
};

// قاعدة URL للموقع
const baseUrl = "https://afkar-co.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  // العنوان الرئيسي المحسن
  title: {
    default: "أفكار سولار | أفضل حلول الطاقة الشمسية في السعودية - AFKAR Solar",
    template: "%s | أفكار سولار - AFKAR Solar",
  },

  // الوصف المحسن
  description:
    "أفكار سولار (AFKAR Solar) - الرائدة في حلول الطاقة الشمسية بالمملكة. نوفر ألواح شمسية عالية الكفاءة، أنظمة تخزين، بطاريات، انفرترات، وتركيب محطات طاقة شمسية للمنازل والمصانع والشركات. وفر حتى 80% من فاتورة الكهرباء مع ضمان حقيقي وأسعار تنافسية.",

  generator: "AFKAR Solar - حلول الطاقة المتجددة",
  applicationName: "أفكار سولار للطاقة الشمسية",
  referrer: "origin-when-cross-origin",

  // كلمات مفتاحية شاملة باللغتين
  keywords: [
    // كلمات رئيسية عربية (الأكثر بحثاً)
    "طاقة شمسية",
    "الطاقة الشمسية في السعودية",
    "ألواح طاقة شمسية",
    "الواح شمسية",
    "سعر الطاقة الشمسية في السعودية",
    "تكلفة الطاقة الشمسية للمنازل",
    "تركيب الطاقة الشمسية للمنازل",
    "تركيب الواح شمسية",
    "شركات الطاقة الشمسية في الرياض",
    "شركات الطاقة الشمسية في السعودية",
    "اسعار الواح الطاقة الشمسية",
    "اسعار بطاريات الطاقة الشمسية",
    "انفرتر طاقة شمسية",
    "منظم شحن طاقة شمسية",
    "مكونات النظام الشمسي",
    "انظمة طاقة شمسية للمنازل",
    "انظمة طاقة شمسية للمصانع",
    "محطات طاقة شمسية",
    "تخزين الطاقة الشمسية",
    "بطاريات شمسية",
    "سولار بانل",
    "الواح طاقة شمسية للبيع",
    "عروض الطاقة الشمسية",
    "تركيب طاقة شمسية",
    "صيانة انظمة الطاقة الشمسية",
    "تنظيف الالواح الشمسية",
    "كفاءة الالواح الشمسية",
    "افضل الواح شمسية في السعودية",
    "طاقة متجددة السعودية",
    "رؤية 2030 الطاقة المتجددة",
    "كهرباء شمسية",
    "توفير فاتورة الكهرباء",
    "بديل الكهرباء الحكومية",
    "طاقة شمسية للمزارع",
    "طاقة شمسية للآبار",
    "طاقة شمسية للاستراحات",
    "طاقة شمسية للمساجد",
    "طاقة شمسية للمدارس",
    "طاقة شمسية للمستشفيات",
    "طاقة شمسية للمجمعات التجارية",

    // English keywords
    "Solar energy Saudi Arabia",
    "Solar panels KSA",
    "Solar power systems Riyadh",
    "Solar panel installation Saudi Arabia",
    "Best solar companies in Saudi Arabia",
    "Solar panel prices KSA",
    "Solar battery storage Saudi",
    "Solar inverter Saudi Arabia",
    "Photovoltaic systems KSA",
    "Renewable energy Saudi Arabia",
    "Solar energy cost in Saudi Arabia",
    "Residential solar systems",
    "Commercial solar panels",
    "Industrial solar solutions",
    "Solar water pumping systems",
    "Off-grid solar systems",
    "On-grid solar systems",
    "Hybrid solar systems",
    "Solar panel cleaning services",
    "Solar maintenance KSA",
    "AFKAR Solar",
    "AFKAR Solar company",
    "Solar energy solutions Riyadh",
    "Solar panel suppliers Saudi",
    "Solar installation companies",
    "Solar power plant KSA",
    "Solar farm Saudi Arabia",
    "Solar energy storage solutions",
    "Lithium batteries solar",
    "Solar charge controllers",
  ],

  authors: [
    { name: "AFKAR Solar Team", url: baseUrl },
    { name: "أفكار سولار", url: baseUrl },
  ],

  creator: "AFKAR Solar - حلول الطاقة الشمسية",
  publisher: "AFKAR Solar Company",

  // تحسينات الفافيكون
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.png", type: "image/png", sizes: "192x192" },
      { url: "/images/logo-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/images/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#ffb347" },
    ],
  },

  // الروابط البديلة واللغات
  alternates: {
    canonical: baseUrl,
    languages: {
      "ar-SA": baseUrl,
      "en-US": `${baseUrl}/en`,
      "x-default": baseUrl,
    },
  },

  // Open Graph المحسن - للواتساب وفيسبوك وجميع التطبيقات
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US", "ar_AE"],
    url: baseUrl,
    siteName: "أفكار سولار | AFKAR Solar",
    title: "أفكار سولار - حلول الطاقة الشمسية المبتكرة في السعودية",
    description:
      "شركة أفكار سولار السعودية: نوفر أفضل منتجات وأنظمة الطاقة الشمسية بأعلى جودة وأقل الأسعار. ألواح شمسية، بطاريات، انفرترات، وتركيب احترافي مع ضمان حقيقي. وفر فاتورة الكهرباء حتى 80%.",
    images: [
      {
        url: "/images/og-image-optimized.jpg",
        width: 1200,
        height: 630,
        alt: "أفكار سولار - منتجات الطاقة الشمسية في السعودية",
        type: "image/jpeg",
        secureUrl: `${baseUrl}/images/og-image-optimized.jpg`,
      },
      {
        url: "/images/og-image-square.jpg",
        width: 1080,
        height: 1080,
        alt: "أفكار سولار - حلول الطاقة المتجددة",
        type: "image/jpeg",
      },
      {
        url: "/images/logo-wide.png",
        width: 800,
        height: 400,
        alt: "شعار أفكار سولار",
        type: "image/png",
      },
    ],
    videos: [
      {
        url: "/videos/solar-installation-preview.mp4",
        width: 1280,
        height: 720,
        type: "video/mp4",
      },
    ],
  },

  // تحسينات تويتر (X)
  twitter: {
    card: "summary_large_image",
    site: "@afkarsolar",
    siteId: "61565472987313",
    creator: "@afkarsolar",
    creatorId: "61565472987313",
    title: "أفكار سولار | الطاقة الشمسية في السعودية",
    description:
      "حلول طاقة شمسية متكاملة في السعودية. ألواح، بطاريات، انفرترات، تركيب وصيانة. وفر حتى 80% من فاتورة الكهرباء.",
    images: {
      url: "/images/twitter-card-optimized.jpg",
      alt: "أفكار سولار - حلول الطاقة الشمسية",
    },
  },

  // إعدادات الروبوتات
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ربط الحسابات الاجتماعية
  verification: {
    google: "يتم_وضع_كود_التحقق_من_جوجل_هنا",
    yandex: "يتم_وضع_كود_التحقق_من_ياندكس_هنا",
    yahoo: "يتم_وضع_كود_التحقق_من_ياهو_هنا",
    other: {
      "facebook-domain-verification": ["يتم_وضع_كود_التحقق_من_فيسبوك_هنا"],
    },
  },

  // معلومات إضافية
  category: "business",
  classification: "شركة طاقة شمسية | Solar Energy Company",

  // ملف البيان لتطبيقات الويب
  manifest: "/manifest.json",

  // روابط أخرى
  other: {
    // بيانات جغرافية
    "geo.region": "SA-01",
    "geo.placename": "Riyadh, Saudi Arabia",
    "geo.position": "24.7136;46.6753",
    ICBM: "24.7136, 46.6753",

    // معلومات التواصل - الروابط الاجتماعية
    "facebook:profile_id": "61565472987313",
    "facebook:username": "afkarsolar",
    "instagram:username": "afkarsolar",
    "tiktok:username": "afkar.co..renewab",
    "twitter:username": "afkarsolar",

    // معلومات التواصل - البريد والهاتف
    "contact:email": "sales@afkar-co.com",
    "contact:phone": "+966568729639",
    "contact:phone:technical": "+966542010146",
    "contact:whatsapp": "+966568729639",

    // معلومات الشركة
    "business:type": "Solar Energy Company",
    "business:founded": "2024",
    "business:service_area": "Saudi Arabia",
    "business:languages": "Arabic, English",

    // تأكيد حقوق النشر
    copyright: "© 2024 AFKAR Solar. جميع الحقوق محفوظة",
    "copyright:year": "2024",

    // تحسينات إضافية للسوشيال ميديا
    "og:country-name": "السعودية",
    "og:region": "الرياض",
    "og:phone_number": "+966568729639",
    "og:email": "sales@afkar-co.com",

    // بيانات منظمة
    "organization:type": "Corporation",
    "organization:legal_name": "أفكار سولار للطاقة المتجددة",
    "organization:name:en": "AFKAR Solar for Renewable Energy",

    // أيقونات إضافية
    "msapplication-TileColor": "#ffb347",
    "msapplication-TileImage": "/images/ms-icon-144x144.png",
    "msapplication-config": "/browserconfig.xml",

    // تحسينات الظهور في واتساب وتليجرام
    "whatsapp:preview": "true",
    "telegram:preview": "true",
    "messenger:preview": "true",
    "viber:preview": "true",

    // تحسينات لمحركات البحث العربية
    "arabic:search": "طاقة شمسية,ألواح شمسية,سولار",
    "arabic:description": "شركة رائدة في مجال الطاقة الشمسية بالسعودية",
  },

  // إضافة Apple Web App
  appleWebApp: {
    capable: true,
    title: "أفكار سولار",
    statusBarStyle: "default",
    startupImage: [
      {
        url: "/images/apple-splash-2048-2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  // تنسيق الاقتباس عند المشاركة
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },

  // الأرشفة
  archives: [],
  assets: [],

  // الكتابة بلغات متعددة
  bookmarks: [baseUrl],

  // روابط مختصرة
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${notoArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* إضافة البيانات المهيكلة المتقدمة */}
        <StructuredData />

        {/* إضافة الفافيكون المباشر */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* إضافة رابط الصورة الرئيسية للظهور في جميع التطبيقات */}
        <link rel="image_src" href="/images/og-image-optimized.jpg" />

        {/* إضافة رابط القصير */}
        <link rel="shortlink" href={baseUrl} />

        {/* إضافة رابط التطبيقات */}
        <link rel="alternate" href="ios-app://123456789" />
        <link rel="alternate" href="android-app://com.afkarsolar.app" />

        {/* إضافة رابط الـ RSS للمدونة */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="مدونة أفكار سولار"
          href="/blog/rss.xml"
        />

        {/* إضافة رابط الصور للواتساب */}
        <meta
          property="og:image:secure_url"
          content={`${baseUrl}/images/og-image-optimized.jpg`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* إضافة البيانات الإضافية للواتساب */}
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:locale:alternate" content="en_US" />

        {/* إضافة بيانات التواصل */}
        <meta name="contact" content="sales@afkar-co.com" />
        <meta name="contact:phone" content="+966568729639" />
        <meta name="contact:whatsapp" content="+966568729639" />

        {/* إضافة بيانات الشركة */}
        <meta name="company" content="أفكار سولار - AFKAR Solar" />
        <meta name="company:type" content="Solar Energy Solutions" />
        <meta name="company:founded" content="2024" />

        {/* إضافة بيانات خدمة العملاء */}
        <meta name="customer-service" content="sales@afkar-co.com" />
        <meta name="customer-service:phone" content="+966568729639" />
        <meta name="technical-support" content="+966542010146" />

        {/* إضافة بيانات السوشيال ميديا */}
        <meta
          name="facebook:profile"
          content="https://www.facebook.com/profile.php?id=61565472987313"
        />
        <meta
          name="instagram:profile"
          content="https://www.instagram.com/afkarsolar/"
        />
        <meta name="twitter:profile" content="https://x.com/afkarsolar" />
        <meta
          name="tiktok:profile"
          content="https://www.tiktok.com/@afkar.co..renewab"
        />

        {/* إضافة بيانات الموقع الجغرافي */}
        <meta name="geo.region" content="SA-01" />
        <meta name="geo.placename" content="Riyadh" />
        <meta name="geo.position" content="24.7136;46.6753" />
        <meta name="ICBM" content="24.7136, 46.6753" />

        {/* إضافة بيانات رؤية 2030 */}
        <meta name="saudi-vision-2030" content="renewable-energy" />
        <meta name="saudi-green-initiative" content="solar-energy" />

        {/* إضافة بيانات الشهادات والجودة */}
        <meta name="certification" content="ISO 9001:2015" />
        <meta name="certification" content="SASO" />

        {/* إضافة بيانات الضمان */}
        <meta name="warranty" content="10-25 years warranty on solar panels" />
        <meta
          name="warranty:description"
          content="ضمان حقيقي على المنتجات والتركيب"
        />

        {/* إضافة بيانات التمويل */}
        <meta name="financing" content="تمويل متاح من البنوك السعودية" />
        <meta
          name="financing:partners"
          content="بنك الرياض, البنك الأهلي, بنك الراجحي"
        />

        {/* تحسينات إضافية للصفحة */}
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />

        {/* إضافة بيانات الروبوتات المتقدمة */}
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        />

        {/* إضافة بيانات الأمان */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="format-detection"
          content="telephone=yes, email=yes, address=yes"
        />

        {/* إضافة بيانات خاصة بمتصفح سفاري */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="أفكار سولار" />

        {/* إضافة بيانات متصفح كروم */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffb347" />
        <meta name="msapplication-navbutton-color" content="#ffb347" />
        <meta name="msapplication-starturl" content="/" />

        {/* إضافة رابط الـ Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* إضافة رابط الـ DNS-Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className="font-tajawal antialiased min-h-screen bg-white"
        suppressHydrationWarning
      >
        {children}
        <Analytics />

        {/* إضافة سكريبت التحليلات */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // تحسينات لمشاركة الروابط في واتساب
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  // إضافة meta tags ديناميكياً للصور
                  var metaImage = document.querySelector('meta[property="og:image"]');
                  if (metaImage && !metaImage.content.startsWith('http')) {
                    metaImage.content = '${baseUrl}' + metaImage.content;
                  }
                  
                  var twitterImage = document.querySelector('meta[name="twitter:image"]');
                  if (twitterImage && !twitterImage.content.startsWith('http')) {
                    twitterImage.content = '${baseUrl}' + twitterImage.content;
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
