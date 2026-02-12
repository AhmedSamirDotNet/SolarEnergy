"use client"

import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

export function StatsSection() {
  const { language, dir } = useI18n()

  return (
    <section className="bg-[#064e3b]/80 backdrop-blur-md py-10 sm:py-12 md:py-16 border-y border-white/5" dir={dir}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {staticContent.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#f9fafb] md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-[#cbd5e0]">
                {stat.label[language]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
