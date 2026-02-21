"use client"

import Link from "next/link"
import { ArrowRight, Zap, Shield, Leaf, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"

export function HeroSection() {
  const { t, dir } = useI18n()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-white to-solar/3 border-b border-solar/15" dir={dir}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-solar/8 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/6 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="grid items-start gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-2 w-full lg:items-center">
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-solar/10 px-4 py-2 text-sm font-medium text-solar border border-solar/30">
              <Sun className="h-4 w-4" />
              <span>{dir === "rtl" ? "حلول الطاقة المتجددة" : "Renewable Energy Solutions"}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground text-balance">
                {t("hero.title")}
              </h1>
              <div className="h-1.5 w-20 bg-gradient-to-r from-solar to-accent rounded-full" />
            </div>

            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground text-pretty max-w-2xl">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-solar hover:bg-solar/90 text-solar-foreground shadow-lg shadow-solar/30 px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105 active:scale-95">
                <Link href="/products" className="flex items-center justify-center gap-2">
                  {t("hero.cta")}
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-foreground/20 text-foreground hover:border-solar hover:bg-solar/5 px-8 py-6 text-base font-semibold rounded-full transition-all">
                <Link href="/contact">{t("hero.secondary")}</Link>
              </Button>
            </div>

            {/* Feature badges */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-solar/20 text-solar border border-solar/30">
                  <Zap className="h-5 w-5" />
                </div>
                <span>{dir === "rtl" ? "كفاءة عالية" : "High Efficiency"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent border border-accent/30">
                  <Shield className="h-5 w-5" />
                </div>
                <span>{dir === "rtl" ? "ضمان 25 سنة" : "25 Year Warranty"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-solar/20 text-solar border border-solar/30">
                  <Leaf className="h-5 w-5" />
                </div>
                <span>{dir === "rtl" ? "صديق للبيئة" : "Eco Friendly"}</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="relative mx-auto aspect-square">
              {/* Main circle with gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-solar/15 to-solar/5 border border-solar/30" />
              
              {/* Center sun */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-40 w-40 rounded-full bg-gradient-to-br from-solar to-emerald-400 shadow-[0_0_50px_rgba(34,197,94,0.3)]" />
                  <Sun className="h-24 w-24 text-white relative z-10 drop-shadow-lg" />
                </div>
              </div>

              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-solar/15" />
              <div className="absolute inset-8 rounded-full border border-solar/8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
