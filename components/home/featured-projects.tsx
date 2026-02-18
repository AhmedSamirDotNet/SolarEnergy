"use client"

import Image from "next/image"
import projectsData from "@/data/projectsData.json"
import { useI18n } from "@/lib/i18n-context"

export function FeaturedProjects() {
    const { t } = useI18n()

    return (
        <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 bg-background/80 backdrop-blur-xl border-t border-white/5">
            {/* Subtle ambient layers */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_85%_72%,rgba(34,197,94,0.08),transparent_34%)]" />
            <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1.8px)",
                    backgroundSize: "56px 56px",
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                        {t("projects.title") || "Featured Projects"}
                    </h2>
                    <div className="h-1.5 w-16 sm:w-20 bg-solar mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {projectsData.map((project) => (
                        <div
                            key={project.id}
                            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-solar"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={project.imagePath || "/placeholder-image.jpg"}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                            </div>

                            <div className="p-4 sm:p-5 md:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-1.5 sm:mb-2">{project.title}</h3>
                                <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
                                    <p className="flex items-center gap-1.5 sm:gap-2">
                                        <span className="text-solar">⚡</span> {project.capacity}
                                    </p>
                                </div>
                            </div>

                            {/* Emerald Glow on Hover */}
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute -inset-px rounded-xl sm:rounded-2xl border border-solar/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
