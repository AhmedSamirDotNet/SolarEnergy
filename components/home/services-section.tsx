"use client"

import React from "react"

import { Sun, Battery, Wrench, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun,
  battery: Battery,
  wrench: Wrench,
  lightbulb: Lightbulb,
}

export function ServicesSection() {
  const { language, dir } = useI18n()

  return (
    <section className="bg-gradient-to-b from-background via-emerald-950/10 to-background backdrop-blur-md py-12 sm:py-16 md:py-20 border-t border-white/5" dir={dir}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl text-balance">
            {language === "en" ? "Our Services" : "خدماتنا"}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-pretty px-4">
            {language === "en"
              ? "Comprehensive solar solutions tailored to your needs"
              : "حلول شمسية شاملة مصممة لتلبية احتياجاتك"}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {staticContent.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sun
            return (
              <Card key={index} className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-solar/60 hover:shadow-2xl hover:shadow-solar/25">
                <CardHeader>
                  <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl border border-white/25 bg-gradient-to-br from-white/20 via-solar/30 to-accent/20 text-solar transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:from-solar group-hover:to-emerald-300 group-hover:text-solar-foreground shadow-inner shadow-white/10">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground leading-tight">{service.title[language]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/90 transition-colors duration-300">
                    {service.description[language]}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
