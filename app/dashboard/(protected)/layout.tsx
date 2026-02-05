"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n-context"

export default function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { dir } = useI18n()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-solar"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30" dir={dir}>
      <DashboardSidebar />
      <main className="lg:ltr:pl-64 lg:rtl:pr-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
