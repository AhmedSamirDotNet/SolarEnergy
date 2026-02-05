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
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {staticContent.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sun
            return (
              <Card key={index} className="group border-border bg-card transition-all hover:border-solar/30 hover:shadow-lg hover:shadow-solar/5">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-solar/10 text-solar transition-colors group-hover:bg-solar group-hover:text-solar-foreground">
                    <Icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{service.title[language]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
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
