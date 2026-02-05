"use client"

import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

export function TestimonialsSection() {
  const { language, dir } = useI18n()

  return (
    <section className="bg-muted/30 py-20" dir={dir}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            {language === "en" ? "What Our Customers Say" : "ماذا يقول عملاؤنا"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {language === "en" 
              ? "Trusted by hundreds of satisfied customers" 
              : "موثوق به من قبل مئات العملاء الراضين"}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {staticContent.testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="pt-6">
                <Quote className="mb-4 h-8 w-8 text-solar/40" />
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  {testimonial.text[language]}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-solar/10 text-solar font-semibold">
                    {testimonial.name[language].charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.name[language]}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role[language]}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
