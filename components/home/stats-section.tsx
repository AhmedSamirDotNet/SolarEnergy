"use client"

import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

export function StatsSection() {
  const { language, dir } = useI18n()

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-r from-background via-solar/5 to-background border-y border-solar/20 overflow-hidden" dir={dir}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-96 h-96 bg-solar/15 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-96 h-96 bg-accent/12 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
          {staticContent.stats.map((stat, index) => (
            <div key={index} className="text-center group p-6 sm:p-8 rounded-2xl border border-solar/25 bg-gradient-to-br from-solar/10 to-white/5 backdrop-blur-sm hover:border-solar/60 hover:shadow-xl hover:shadow-solar/25 transition-all duration-500 hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300 text-transparent bg-clip-text bg-gradient-to-r from-solar to-emerald-400">
                {stat.value}
              </div>
              <div className="mt-3 text-sm sm:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {stat.label[language]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
