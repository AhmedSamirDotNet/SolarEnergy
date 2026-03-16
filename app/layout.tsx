import React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-arabic",
});

// إعدادات الـ Viewport لوحدها في نسخة Next.js الحديثة
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  // 1. العناوين والوصف (للسيرش)
  title: "أفكار سولار | منتجات وحلول الطاقة الشمسية في السعودية - AFKAR Solar",
  description:
    "شركة أفكار سولار (AFKAR Solar) الرائدة في حلول الطاقة الشمسية بالسعودية. نوفر أفضل منتجات السولار، ألواح شمسية عالية الجودة، أنظمة تخزين الطاقة، وتركيب محطات طاقة للمنازل والمصانع. وفر فاتورة الكهرباء الآن!",

  generator: "AFKAR Solar",
  applicationName: "AFKAR Solar",

  // 2. الكلمات المفتاحية (Keywords) - ركزتلك على اللي الناس بتكتبه في جوجل
  keywords: [
    // كلمات بالعربي (الأكثر بحثاً)
    "سولار",
    "منتجات سولار",
    "منتجات طاقة شمسية",
    "طاقة شمسية السعودية",
    "الواح شمسية",
    "شركة طاقة شمسية بالرياض",
    "تركيب طاقة شمسية للمنازل",
    "اسعار الطاقة الشمسية السعودية",
    "انظمة طاقة شمسية متكاملة",
    "توفير فاتورة الكهرباء",
    "بطاريات طاقة شمسية",
    "انفرتر شمسي",
    "طاقة متجددة السعودية",
    "عروض طاقة شمسية",
    "الواح طاقة شمسية للبيع",
    "أفكار سولار",

    // English Keywords
    "AFKAR Solar",
    "solar products Saudi Arabia",
    "solar energy KSA",
    "solar panels Riyadh",
    "affordable solar systems",
    "solar energy installation",
    "renewable energy KSA",
  ],

  authors: [{ name: "AFKAR Solar" }],
  creator: "AFKAR Solar",
  publisher: "AFKAR Solar",

  // 3. الأيقونات (Favicon)
  icons: {
    icon: [
      { url: "/favicon.ico" }, // تأكد أن الملف موجود في public
      { url: "/images/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/images/logo.png", sizes: "180x180", type: "image/png" }],
  },

  // 4. الروابط الأساسية (Canonical)
  alternates: {
    canonical: "https://afkar-co.com",
    languages: {
      "en-US": "https://afkar-co.com/en",
      "ar-SA": "https://afkar-co.com/ar",
    },
  },

  // 5. السوشيال ميديا (Open Graph) - عشان لما تبعت اللينك في واتساب
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://afkar-co.com",
    siteName: "AFKAR Solar | أفكار سولار",
    title:
      "أفكار سولار | منتجات طاقة شمسية وألواح شمسية عالية الكفاءة بالسعودية",
    description:
      "اكتشف أفضل حلول ومنتجات الطاقة الشمسية في السعودية مع أفكار سولار. جودة عالمية وضمان حقيقي.",
    images: [
      {
        url: "/images/og-image.jpg", // صورة عرض للموقع
        width: 1200,
        height: 630,
        alt: "AFKAR Solar - منتجات الطاقة الشمسية",
      },
    ],
  },

  // 6. تويتر (X)
  twitter: {
    card: "summary_large_image",
    title: "AFKAR Solar | أفكار سولار السعودية",
    images: ["/images/twitter-card.jpg"],
    creator: "@AFKARSolar",
  },

  // 7. الروبوتات (Robots)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  // 8. كود التحقق (Google Search Console)
  verification: {
    google: "حط_هنا_الكود_الخاص_بك", // استبدله بالكود الحقيقي من جوجل
  },

  // 9. بيانات جغرافية للسعودية
  other: {
    "geo.region": "SA",
    "geo.placename": "Saudi Arabia",
    "geo.position": "24.7136;46.6753",
    ICBM: "24.7136, 46.6753",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${_notoArabic.variable}`}>
      <head>
        <StructuredData />
        {/* Favicon fallback */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-noto antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
