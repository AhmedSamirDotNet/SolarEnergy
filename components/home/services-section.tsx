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
    <section className="bg-background py-20" dir={dir}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            {language === "en" ? "Our Services" : "خدماتنا"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {language === "en"
              ? "Comprehensive solar solutions tailored to your needs"
              : "حلول شمسية شاملة مصممة لتلبية احتياجاتك"}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {staticContent.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sun
            return (
              <Card key={index} className="group border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-solar/30 hover:shadow-2xl hover:shadow-solar/10">
                <CardHeader>
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-solar/10 text-solar transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-solar group-hover:text-solar-foreground shadow-inner">
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground leading-tight">{service.title[language]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed text-sm">
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
