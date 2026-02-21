"use client"

import { HeroSection } from "@/components/home/hero-section"
import { ServicesSection } from "@/components/home/services-section"
import { StatsSection } from "@/components/home/stats-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { useI18n } from "@/lib/i18n-context"

export default function HomePage() {
  const { dir } = useI18n()

  return (
    <div dir={dir} className="relative min-h-screen bg-gradient-to-b from-emerald-900/20 via-slate-900/20 to-emerald-900/20 overflow-x-hidden">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "url('/images/home-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <TestimonialsSection />
        <FeaturedProjects />
      </div>
    </div>
  )
}
