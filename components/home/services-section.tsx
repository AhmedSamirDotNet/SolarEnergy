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
    <section className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background to-white border-t border-solar/15" dir={dir}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 right-1/4 w-80 h-80 bg-solar/6 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="mb-12 sm:mb-16 md:mb-20 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance mb-4">
            {language === "en" ? "Our Services" : "خدماتنا"}
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-solar to-accent rounded-full mx-auto mb-6" />
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            {language === "en"
              ? "Comprehensive solar solutions tailored to your needs"
              : "حلول شمسية شاملة مصممة لتلبية احتياجاتك"}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {staticContent.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sun
            return (
              <Card key={index} className="group relative overflow-hidden rounded-2xl border border-solar/15 bg-white shadow-sm hover:border-solar/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-solar/15 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-solar/15 text-solar border border-solar/25 group-hover:bg-solar group-hover:text-white transition-all duration-500 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground leading-tight">{service.title[language]}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
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
