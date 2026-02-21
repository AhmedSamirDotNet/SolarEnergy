"use client"

import React from "react"
import { usePathname } from "next/navigation"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TopNotificationBanner } from "@/components/layout/top-notification-banner"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { I18nProvider } from "@/lib/i18n-context"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isProductsPage = pathname?.startsWith("/products")

  return (
    <I18nProvider>
      <div className={`flex min-h-screen flex-col ${isProductsPage ? "" : "bg-gradient-to-b from-emerald-900/20 via-slate-900/20 to-emerald-900/20"}`}>
        <TopNotificationBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </I18nProvider>
  )
}
