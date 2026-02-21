"use client"

import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

export function TestimonialsSection() {
  const { language, dir } = useI18n()

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background to-white border-y border-solar/15 overflow-hidden" dir={dir}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/3 w-80 h-80 bg-solar/6 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="mb-12 sm:mb-16 md:mb-20 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance mb-4">
            {language === "en" ? "What Our Customers Say" : "ماذا يقول عملاؤنا"}
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-solar to-accent rounded-full mx-auto mb-6" />
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            {language === "en"
              ? "Trusted by hundreds of satisfied customers"
              : "موثوق به من قبل مئات العملاء الراضين"}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {staticContent.testimonials.map((testimonial, index) => (
            <Card key={index} className="group relative overflow-hidden rounded-2xl border border-solar/15 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-solar/40 hover:shadow-lg hover:shadow-solar/15 flex flex-col">
              <CardContent className="pt-6 flex flex-col h-full">
                <Quote className="mb-4 h-6 w-6 text-solar/50" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground flex-grow group-hover:text-foreground transition-colors duration-300">
                  {testimonial.text[language]}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-solar/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-solar/15 text-solar font-semibold border border-solar/25 text-sm group-hover:bg-solar group-hover:text-white transition-all duration-300">
                    {testimonial.name[language].charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name[language]}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role[language]}</div>
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
