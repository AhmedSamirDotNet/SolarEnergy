"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

const CLOSE_ANIMATION_DURATION_MS = 260

export function TopNotificationBanner() {
    const pathname = usePathname()
    const [isRendered, setIsRendered] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const isProductsPage = pathname === "/products" || pathname?.startsWith("/products/")

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setIsVisible(true)
        })

        return () => cancelAnimationFrame(frame)
    }, [])

    const dismissBanner = () => {
        setIsVisible(false)

        window.setTimeout(() => {
            setIsRendered(false)
        }, CLOSE_ANIMATION_DURATION_MS)
    }

    if (!isRendered) return null

    return (
        <div
            className={[
                "relative isolate z-40 w-full overflow-hidden border-b border-emerald-200/25 text-white",
                "bg-gradient-to-r from-emerald-500/85 via-emerald-400/75 to-teal-500/80",
                "shadow-[0_8px_20px_rgba(16,185,129,0.18)]",
                "transition-all duration-300 ease-out",
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            ].join(" ")}
            role="status"
            aria-live="polite"
        >
            {/* Soft moving visual layers */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(220,252,231,0.22),transparent_42%),radial-gradient(circle_at_80%_100%,rgba(236,253,245,0.16),transparent_48%)]" />
            <div className="pointer-events-none absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-emerald-50/10 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute -right-12 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-emerald-200/20 blur-2xl animate-pulse" />

            <div className="container relative z-10 mx-auto flex min-h-12 items-center justify-between gap-3 px-4 py-2">
                <p className="text-center text-sm font-semibold tracking-wide sm:text-left sm:text-base">
                    Browse Today&apos;s Offers
                </p>

                <div className="flex items-center gap-2">
                    {!isProductsPage && (
                        <Button
                            asChild
                            size="sm"
                            className="h-8 rounded-full bg-white/90 px-3 text-xs font-semibold text-emerald-700 hover:bg-white"
                        >
                            <Link href="/products">Go to Products</Link>
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={dismissBanner}
                        aria-label="Dismiss notification banner"
                        className="h-8 w-8 shrink-0 rounded-full text-white/90 hover:bg-white/20 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}