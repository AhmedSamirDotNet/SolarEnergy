"use client"

import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

export function TestimonialsSection() {
  const { language, dir } = useI18n()

  return (
    <section className="bg-gradient-to-b from-background via-emerald-950/10 to-background backdrop-blur-lg py-12 sm:py-16 md:py-20 lg:py-24 border-y border-white/10" dir={dir}>      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 sm:mb-10 md:mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl text-balance">
          {language === "en" ? "What Our Customers Say" : "ماذا يقول عملاؤنا"}
        </h2>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-pretty px-4">
          {language === "en"
            ? "Trusted by hundreds of satisfied customers"
            : "موثوق به من قبل مئات العملاء الراضين"}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {staticContent.testimonials.map((testimonial, index) => (
          <Card key={index} className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-solar/60 hover:shadow-xl hover:shadow-solar/20">
            <CardContent className="pt-4 sm:pt-6">
              <Quote className="mb-3 sm:mb-4 h-6 w-6 sm:h-8 sm:w-8 text-solar/55" />
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                {testimonial.text[language]}
              </p>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-white/25 via-solar/25 to-accent/20 text-solar font-semibold text-sm sm:text-base shadow-inner shadow-white/10">
                  {testimonial.name[language].charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name[language]}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role[language]}</div>
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
