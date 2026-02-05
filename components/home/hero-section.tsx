"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Shield, Leaf, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"

export function HeroSection() {
  const { t, dir } = useI18n()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0d1f0d] to-background" dir={dir}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-solar/20 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-solar/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-96 bg-solar/5 blur-3xl" />
      </div>
      
      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-solar/10 px-4 py-2 text-sm font-medium text-solar">
              <Sun className="h-4 w-4" />
              <span>{dir === "rtl" ? "حلول الطاقة المتجددة" : "Renewable Energy Solutions"}</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl text-balance">
              {t("hero.title")}
            </h1>
            
            <p className="text-lg leading-relaxed text-gray-300 md:text-xl text-pretty">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-solar text-solar-foreground hover:bg-solar/90">
                <Link href="/products" className="flex items-center gap-2">
                  {t("hero.cta")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-solar text-solar hover:bg-solar/10 bg-transparent">
                <Link href="/contact">{t("hero.secondary")}</Link>
              </Button>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solar/20 text-solar">
                  <Zap className="h-4 w-4" />
                </div>
                <span>{dir === "rtl" ? "كفاءة عالية" : "High Efficiency"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solar/20 text-solar">
                  <Shield className="h-4 w-4" />
                </div>
                <span>{dir === "rtl" ? "ضمان 25 سنة" : "25 Year Warranty"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solar/20 text-solar">
                  <Leaf className="h-4 w-4" />
                </div>
                <span>{dir === "rtl" ? "صديق للبيئة" : "Eco Friendly"}</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-lg">
              {/* Sun illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-gradient-to-br from-solar via-solar/80 to-solar/60 shadow-2xl shadow-solar/30 lg:h-80 lg:w-80">
                  <div className="flex h-full w-full items-center justify-center">
                    <Sun className="h-32 w-32 text-solar-foreground lg:h-40 lg:w-40" />
                  </div>
                </div>
              </div>
              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "20s" }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-card shadow-lg flex items-center justify-center border border-border">
                  <div className="h-4 w-4 rounded bg-solar/80" />
                </div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }}>
                <div className="absolute bottom-8 right-0 h-10 w-10 rounded-full bg-card shadow-lg flex items-center justify-center border border-border">
                  <div className="h-5 w-5 rounded bg-solar/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
