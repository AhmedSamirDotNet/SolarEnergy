"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Quote, Loader2, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import {
  getCustomers,
  getCustomerFeedbacks,
  type Customer,
  type CustomerFeedback,
} from "@/lib/api"

interface GroupedCustomer {
  customer: Customer
  feedbacks: CustomerFeedback[]
}

export function TestimonialsSection() {
  const { language, dir, t } = useI18n()
  const [grouped, setGrouped] = useState<GroupedCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const isRtl = language === "ar"

  // Fetch data from API using the current language
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const [customers, feedbacks] = await Promise.all([
        getCustomers(language),
        getCustomerFeedbacks(language),
      ])

      // Group feedbacks by customer
      const customerMap = new Map<number, GroupedCustomer>()
        ; (customers || []).forEach((c) => {
          customerMap.set(c.id, { customer: c, feedbacks: [] })
        })
        ; (feedbacks || []).forEach((fb) => {
          const group = customerMap.get(fb.customerId)
          if (group) {
            group.feedbacks.push(fb)
          }
        })

      // Filter out customers with no feedback
      const result = Array.from(customerMap.values()).filter(
        (g) => g.feedbacks.length > 0
      )
      setGrouped(result)
    } catch (err) {
      console.error("[Testimonials] Error fetching data:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-scroll carousel
  const scrollByAmount = useCallback(
    (amount: number) => {
      if (!scrollRef.current) return
      scrollRef.current.scrollBy({
        left: isRtl ? -amount : amount,
        behavior: "smooth",
      })
    },
    [isRtl]
  )

  // Auto-scroll by card (smoother + less jitter than pixel-by-pixel motion)
  const handleAutoScroll = useCallback(() => {
    if (!scrollRef.current || isPaused) return
    const el = scrollRef.current
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) return

    const current = Math.abs(el.scrollLeft)
    const reachedEnd = current >= maxScroll - 4

    if (reachedEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" })
      return
    }

    scrollByAmount(340)
  }, [isPaused, scrollByAmount])

  useEffect(() => {
    if (grouped.length <= 1) return

    autoPlayRef.current = setInterval(handleAutoScroll, 4200)
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [grouped, handleAutoScroll])

  // Pause auto-scroll on interaction
  const handleInteractionStart = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
    setIsPaused(true)
  }

  const handleInteractionEnd = () => {
    // Resume a bit after user interaction
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 2600)
  }

  const scrollPrev = () => {
    handleInteractionStart()
    scrollByAmount(-340)
    handleInteractionEnd()
  }

  const scrollNext = () => {
    handleInteractionStart()
    scrollByAmount(340)
    handleInteractionEnd()
  }

  // Get first letter of customer name for avatar
  const getAvatarLetter = (name: string) => {
    if (!name) return "?"
    return name.charAt(0).toUpperCase()
  }

  // Generate gradient colors based on customer id
  const getAvatarGradient = (id: number) => {
    const gradients = [
      "from-emerald-400 to-green-600",
      "from-amber-400 to-orange-600",
      "from-sky-400 to-blue-600",
      "from-violet-400 to-purple-600",
      "from-rose-400 to-pink-600",
      "from-teal-400 to-cyan-600",
    ]
    return gradients[id % gradients.length]
  }

  const getCardTheme = (id: number) => {
    const themes = [
      "from-white/95 via-emerald-50/90 to-cyan-50/85 border-white/90",
      "from-white/95 via-amber-50/85 to-orange-50/80 border-white/90",
      "from-white/95 via-violet-50/85 to-indigo-50/80 border-white/90",
      "from-white/95 via-teal-50/90 to-emerald-50/80 border-white/90",
      "from-white/95 via-rose-50/85 to-pink-50/80 border-white/90",
      "from-white/95 via-sky-50/85 to-blue-50/80 border-white/90",
    ]
    return themes[id % themes.length]
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 backdrop-blur-xl py-12 sm:py-16 md:py-20 lg:py-24 border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-solar" />
          </div>
        </div>
      </section>
    )
  }

  if (error || grouped.length === 0) {
    return null // Don't render if no data
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 backdrop-blur-xl py-12 sm:py-16 md:py-20 lg:py-24 border-y border-white/10"
      dir={dir}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_85%_78%,rgba(16,185,129,0.10),transparent_35%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t("testimonials.title")}
          </h2>
          <div className="h-1.5 w-20 bg-solar mx-auto rounded-full mt-4" />
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-pretty px-4">
            {t("testimonials.subtitle")}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-emerald-900/50 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-emerald-900/50 to-transparent" />

          {/* Navigation Arrows */}
          {grouped.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/85 backdrop-blur-md border border-white/30 flex items-center justify-center text-foreground hover:text-solar hover:bg-white hover:border-solar/50 transition-all duration-300 opacity-0 group-hover:opacity-100 ltr:-left-3 ltr:sm:-left-5 rtl:-right-3 rtl:sm:-right-5 shadow-lg shadow-emerald-900/30"
                aria-label="Previous"
              >
                {isRtl ? (
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
              <button
                onClick={scrollNext}
                className="absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/85 backdrop-blur-md border border-white/30 flex items-center justify-center text-foreground hover:text-solar hover:bg-white hover:border-solar/50 transition-all duration-300 opacity-0 group-hover:opacity-100 ltr:-right-3 ltr:sm:-right-5 rtl:-left-3 rtl:sm:-left-5 shadow-lg shadow-emerald-900/30"
                aria-label="Next"
              >
                {isRtl ? (
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </>
          )}

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-5 pt-2 px-2"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
          >
            {grouped.map((group) => (
              <div
                key={group.customer.id}
                className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[390px] snap-start"
              >
                <div
                  className={`relative h-full min-h-[235px] rounded-2xl border bg-gradient-to-br ${getCardTheme(
                    group.customer.id
                  )} backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-solar/20 overflow-hidden`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.95),rgba(255,255,255,0.45)_42%,transparent_72%)]" />
                  <div className="pointer-events-none absolute -bottom-7 left-8 right-8 h-7 rounded-full bg-solar/20 blur-xl" />

                  <div className="absolute top-4 ltr:right-4 rtl:left-4 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span className="text-[10px] font-semibold text-amber-700">
                      {language === "en" ? "Top Rated" : "موصى به"}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="relative p-5 sm:p-6 flex flex-col h-full backdrop-blur-[2px]">
                    {/* Avatar + Customer Info */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(
                          group.customer.id
                        )} text-white font-bold text-lg sm:text-xl shadow-lg shadow-slate-300/40 ring-2 ring-white/70`}
                      >
                        {getAvatarLetter(group.customer.customerName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                          {group.customer.customerName}
                        </div>
                        {group.customer.customerJob && (
                          <div className="text-xs sm:text-sm text-slate-600 truncate">
                            {group.customer.customerJob}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Decorative separator */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent mb-4" />

                    {/* Feedback(s) */}
                    <div className="flex-1 space-y-3">
                      {group.feedbacks.map((fb, idx) => (
                        <div key={fb.id} className="relative">
                          {/* Only show numbering if multiple feedbacks */}
                          {group.feedbacks.length > 1 && (
                            <div className="flex items-start gap-2.5">
                              <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-solar/15 border border-solar/30 mt-0.5">
                                <span className="text-[10px] font-semibold text-slate-700">
                                  {idx + 1}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <Quote className="mb-1.5 h-4 w-4 text-solar/80 flex-shrink-0" />
                                <p
                                  className="text-sm text-slate-700 leading-relaxed break-words"
                                  style={{
                                    fontSize:
                                      fb.feedBack && fb.feedBack.length > 200
                                        ? "0.8rem"
                                        : undefined,
                                    lineHeight:
                                      fb.feedBack && fb.feedBack.length > 200
                                        ? "1.45"
                                        : undefined,
                                  }}
                                >
                                  {fb.feedBack}
                                </p>
                              </div>
                            </div>
                          )}

                          {group.feedbacks.length === 1 && (
                            <div>
                              <Quote className="mb-2 h-5 w-5 sm:h-6 sm:w-6 text-solar/80" />
                              <p
                                className="text-sm sm:text-base text-slate-700 leading-relaxed break-words"
                                style={{
                                  fontSize:
                                    fb.feedBack && fb.feedBack.length > 250
                                      ? "0.82rem"
                                      : undefined,
                                  lineHeight:
                                    fb.feedBack && fb.feedBack.length > 250
                                      ? "1.5"
                                      : undefined,
                                }}
                              >
                                {fb.feedBack}
                              </p>
                            </div>
                          )}

                          {/* Separator between feedbacks */}
                          {group.feedbacks.length > 1 &&
                            idx < group.feedbacks.length - 1 && (
                              <div className="mt-3 w-2/3 mx-auto h-px bg-slate-300/70" />
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicators */}
          {grouped.length > 2 && (
            <div className="flex justify-center gap-1.5 mt-5">
              {grouped.map((_, idx) => (
                <div
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full bg-white/35 transition-all duration-300"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
