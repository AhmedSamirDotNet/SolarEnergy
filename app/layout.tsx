import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: 'AFKAR Solar | #1 Solar Energy Solutions in Saudi Arabia',
  description: 'AFKAR Solar (أفكار سولار) provides premium renewable energy solutions including high-efficiency solar panels, energy storage, and professional installation for residential and commercial projects across Saudi Arabia.',
  generator: 'AFKAR Solar',
  keywords: ['AFKAR Solar', 'أفكار سولار', 'solar energy KSA', 'solar panels Saudi Arabia', 'renewable energy Riyadh', 'energy storage solutions', 'solar installation'],
  icons: {
    icon: [
      {
        url: '/images/logo.jpeg',
        type: 'image/jpeg',
      }
    ],
    apple: '/images/logo.jpeg',
  },
  openGraph: {
    title: 'AFKAR Solar | Renewable Energy Excellence',
    description: 'Leading the way in sustainable energy across Saudi Arabia with premium solar solutions.',
    images: ['/images/logo.jpeg'],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
