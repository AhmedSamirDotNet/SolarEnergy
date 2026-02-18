"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage, t, dir } = useI18n()

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/products", label: t("nav.products") },
    { href: "/contact", label: t("nav.contact") },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white" dir={dir}>      <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-2 group">
        <Image
          src="/images/logo.png"
          alt="AFKAR CO. Logo"
          width={180}
          height={70}
          className="h-14 w-auto object-contain md:h-16 transition-all duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-7 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-base font-bold tracking-[0.02em] text-slate-900 transition-colors duration-300 hover:text-green-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {/* Language Switcher - Always Visible on Top */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 md:gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-semibold md:text-sm">
            {language === "en" ? "AR" : "EN"}
          </span>
        </Button>

        {/* Desktop Auth/CTA - Hidden on Mobile */}
        <div className="hidden items-center gap-4 md:flex">
          <Button asChild className="bg-green-600 text-white hover:bg-green-700">
            <Link href="/contact">{t("hero.secondary")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden" dir={dir}>
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-bold tracking-[0.015em] text-white transition-colors duration-300 hover:text-solar"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="w-fit bg-solar text-solar-foreground hover:bg-solar/90">
              <Link href="/contact">{t("hero.secondary")}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
