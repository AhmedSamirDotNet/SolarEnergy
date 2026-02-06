"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Shield, Leaf, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"

export function HeroSection() {
  const { t, dir } = useI18n()

  return (
    <section className="relative overflow-hidden bg-background pt-16" dir={dir}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-solar/10 blur-3xl opacity-50" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-solar/5 blur-2xl" />
      </div>

      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-solar/10 px-4 py-2 text-sm font-medium text-solar">
              <Sun className="h-4 w-4" />
              <span>{dir === "rtl" ? "حلول الطاقة المتجددة" : "Renewable Energy Solutions"}</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-7xl text-balance">
              {t("hero.title")}
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty max-w-xl">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="bg-solar text-solar-foreground hover:bg-solar/90 shadow-xl shadow-solar/20 h-14 px-8 text-lg font-bold rounded-xl transition-all hover:scale-105 active:scale-95">
                <Link href="/products" className="flex items-center gap-2">
                  {t("hero.cta")}
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-muted/50 h-14 px-8 text-lg font-medium rounded-xl transition-all">
                <Link href="/contact">{t("hero.secondary")}</Link>
              </Button>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6">
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar/10 text-solar shadow-inner">
                  <Zap className="h-5 w-5" />
                </div>
                <span>{dir === "rtl" ? "كفاءة عالية" : "High Efficiency"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar/10 text-solar shadow-inner">
                  <Shield className="h-5 w-5" />
                </div>
                <span>{dir === "rtl" ? "ضمان 25 سنة" : "25 Year Warranty"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar/10 text-solar shadow-inner">
                  <Leaf className="h-5 w-5" />
                </div>
                <span>{dir === "rtl" ? "صديق للبيئة" : "Eco Friendly"}</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="relative mx-auto aspect-square max-w-lg lg:max-w-xl">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-solar/10 animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-solar/5 animate-pulse delay-75" />

              {/* Sun illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-gradient-to-br from-solar via-solar/80 to-solar/60 shadow-[0_0_100px_rgba(112,255,160,0.3)] lg:h-96 lg:w-96 flex items-center justify-center transition-transform hover:scale-105 duration-700">
                  <div className="relative">
                    <Sun className="h-32 w-32 text-solar-foreground lg:h-48 lg:w-48 drop-shadow-2xl" />
                    {/* Interior glow */}
                    <div className="absolute inset-0 blur-2xl bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "25s" }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-12 rounded-2xl bg-card shadow-2xl flex items-center justify-center border border-border rotate-45">
                  <Zap className="h-6 w-6 text-solar -rotate-45" />
                </div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "35s", animationDirection: "reverse" }}>
                <div className="absolute bottom-12 right-0 h-14 w-14 rounded-full bg-card shadow-2xl flex items-center justify-center border border-border">
                  <Shield className="h-7 w-7 text-solar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
