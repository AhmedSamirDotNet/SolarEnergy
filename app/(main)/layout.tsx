"use client"

import React from "react"

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
  return (
    <I18nProvider>
      <div className="flex min-h-screen flex-col">
        <TopNotificationBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </I18nProvider>
  )
}
