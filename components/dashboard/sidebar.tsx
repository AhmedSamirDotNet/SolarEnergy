"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sun, LayoutDashboard, Layers, Package, LogOut, Globe, Menu, X, UserCog, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n-context"
import { useState } from "react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { t, language, setLanguage, dir } = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard.title") },
    { href: "/dashboard/sections", icon: Layers, label: t("dashboard.sections") },
    { href: "/dashboard/products", icon: Package, label: t("dashboard.products") },
    { href: "/dashboard/projects", icon: Sun, label: t("dashboard.projects") },
    { href: "/dashboard/customers", icon: Users, label: t("dashboard.customers") },
    { href: "/dashboard/customer-feedback", icon: MessageSquare, label: t("dashboard.customerFeedback") },
    { href: "/dashboard/admins", icon: UserCog, label: t("dashboard.admins") },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/dashboard/login"
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-solar text-solar-foreground">
          <Sun className="h-6 w-6" />
        </div>
        <span className="text-lg font-bold text-foreground">
          {language === "en" ? "AFKAR Admin" : "أفكار - المسؤول"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                ? "bg-solar text-solar-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-5 w-5" />
          {language === "en" ? "العربية" : "English"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          {t("dashboard.logout")}
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden" dir={dir}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solar text-solar-foreground">
            <Sun className="h-4 w-4" />
          </div>
          <span className="font-bold text-foreground">
            {language === "en" ? "AFKAR Admin" : "أفكار - المسؤول"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 z-50 h-full w-64 transform border-r border-border bg-background transition-transform duration-200 lg:hidden ${isMobileMenuOpen
          ? (dir === "rtl" ? "right-0 translate-x-0" : "left-0 translate-x-0")
          : (dir === "rtl" ? "right-0 translate-x-full" : "left-0 -translate-x-full")
          }`}
        dir={dir}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed top-0 hidden h-full w-64 border-r border-border bg-background lg:flex lg:flex-col ltr:left-0 rtl:right-0" dir={dir}>
        <SidebarContent />
      </aside>
    </>
  )
}
