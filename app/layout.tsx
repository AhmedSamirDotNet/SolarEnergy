import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StructuredData } from '@/components/seo/structured-data'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  // Basic Metadata
  title: 'AFKAR Solar | أفكار سولار - #1 Solar Energy Solutions in Saudi Arabia | حلول الطاقة الشمسية',
  description: 'AFKAR Solar (أفكار سولار) - Leading provider of premium solar energy solutions in Saudi Arabia. High-efficiency solar panels, energy storage systems, and professional installation for homes and businesses. أفضل حلول الطاقة الشمسية في السعودية، ألواح شمسية عالية الكفاءة، أنظمة تخزين الطاقة',

  generator: 'AFKAR Solar',
  applicationName: 'AFKAR Solar',

  // Comprehensive Keywords - Arabic & English
  keywords: [
    // English Keywords - Solar Energy
    'AFKAR Solar', 'solar energy Saudi Arabia', 'solar panels KSA', 'solar power Riyadh',
    'solar installation Saudi Arabia', 'renewable energy solutions', 'solar energy systems',
    'photovoltaic panels', 'solar panel installation', 'solar power systems',
    'residential solar panels', 'commercial solar solutions', 'industrial solar power',

    // English Keywords - Services
    'solar panel price Saudi Arabia', 'solar energy cost KSA', 'solar battery storage',
    'energy storage solutions', 'solar inverters', 'solar mounting systems',
    'solar panel maintenance', 'solar energy consultation', 'solar system design',
    'net metering Saudi Arabia', 'solar financing options', 'solar energy savings',

    // English Keywords - Location-based
    'solar panels Riyadh', 'solar energy Jeddah', 'solar power Dammam',
    'solar installation Mecca', 'solar panels Medina', 'solar energy Eastern Province',

    // Arabic Keywords - الطاقة الشمسية
    'أفكار سولار', 'طاقة شمسية السعودية', 'ألواح شمسية', 'الطاقة المتجددة',
    'أنظمة الطاقة الشمسية', 'حلول الطاقة الشمسية', 'طاقة نظيفة',
    'كهرباء شمسية', 'خلايا شمسية', 'لوح شمسي', 'الواح الطاقة الشمسية',

    // Arabic Keywords - Services
    'تركيب ألواح شمسية السعودية', 'اسعار الطاقة الشمسية', 'بطاريات شمسية',
    'تخزين الطاقة الشمسية', 'انفرتر شمسي', 'صيانة الطاقة الشمسية',
    'استشارات الطاقة الشمسية', 'تصميم نظام شمسي', 'توفير الطاقة',
    'تمويل الطاقة الشمسية', 'العد الصافي', 'طاقة منزلية',

    // Arabic Keywords - Location-based
    'طاقة شمسية الرياض', 'ألواح شمسية جدة', 'طاقة شمسية الدمام',
    'ألواح شمسية مكة', 'طاقة شمسية المدينة', 'طاقة شمسية المنطقة الشرقية',

    // Arabic Keywords - Quality & Features
    'ألواح شمسية عالية الكفاءة', 'ضمان الطاقة الشمسية', 'طاقة شمسية موثوقة',
    'افضل شركة طاقة شمسية', 'حلول طاقة متجددة', 'طاقة نظيفة للمنازل',
  ],

  // Authors & Creator
  authors: [{ name: 'AFKAR Solar' }],
  creator: 'AFKAR Solar',
  publisher: 'AFKAR Solar',

  // Viewport Configuration
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },

  // Icons & Favicons
  icons: {
    icon: [
      {
        url: '/images/logo.png',
        type: 'image/png',
      }
    ],
    apple: '/images/logo.png',
  },

  // Open Graph for Social Sharing
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US', 'en_SA'],
    url: 'https://afkarsolar.com',
    siteName: 'AFKAR Solar | أفكار سولار',
    title: 'AFKAR Solar | Premium Solar Energy Solutions in Saudi Arabia | أفكار سولار',
    description: 'Leading renewable energy company in Saudi Arabia. Premium solar panels, energy storage, and professional installation. أفضل شركة طاقة شمسية في السعودية - ألواح شمسية وحلول طاقة متجددة',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AFKAR Solar - Solar Energy Solutions | أفكار سولار',
      },
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'AFKAR Solar Logo | شعار أفكار سولار',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'AFKAR Solar | Premium Solar Energy Solutions | أفكار سولار',
    description: 'Leading solar energy provider in Saudi Arabia. High-efficiency panels & professional installation. حلول الطاقة الشمسية المتميزة في السعودية',
    images: ['/images/twitter-card.jpg'],
    creator: '@AFKARSolar',
    site: '@AFKARSolar',
  },

  // Robots & Crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification Codes (Add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // Alternate Languages
  alternates: {
    canonical: 'https://afkarsolar.com',
    languages: {
      'en-US': '/en',
      'ar-SA': '/ar',
    },
  },

  // Geographic & Regional
  other: {
    'geo.region': 'SA',
    'geo.placename': 'Saudi Arabia',
    'geo.position': '24.7136;46.6753', // Riyadh coordinates
    'ICBM': '24.7136, 46.6753',
    'DC.title': 'AFKAR Solar - Solar Energy Solutions',
    'rating': 'general',
    'target': 'all',
    'audience': 'all',
    'coverage': 'Worldwide',
    'distribution': 'Global',
    'classification': 'Business, Energy, Solar Power, Renewable Energy',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
