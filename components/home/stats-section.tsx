"use client"

import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

export function StatsSection() {
  const { language, dir } = useI18n()

  return (
    <section className="bg-gradient-to-r from-background via-solar/5 to-background backdrop-blur-md py-10 sm:py-12 md:py-16 border-y border-white/5 relative overflow-hidden" dir={dir}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-solar/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {staticContent.stats.map((stat, index) => (
            <div key={index} className="text-center group hover:bg-white/5 p-4 rounded-2xl transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-foreground md:text-5xl group-hover:scale-110 transition-transform duration-300 text-transparent bg-clip-text bg-gradient-to-r from-solar to-emerald-400">
                {stat.value}
              </div>
              <div className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.label[language]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
