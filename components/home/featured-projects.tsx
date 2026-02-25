"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n-context"
import { getProjectCards, type ProjectCard } from "@/lib/api"
import { BACKEND_URL } from "@/lib/constants"
import { ArrowUpRight, Loader2, MapPin } from "lucide-react"

export function FeaturedProjects() {
    const { t, language } = useI18n()
    const [projects, setProjects] = useState<ProjectCard[]>([])
    const [loading, setLoading] = useState(true)
    const isRtl = language === "ar"

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjectCards(language)
                setProjects(data || [])
            } catch (error) {
                console.error("Error fetching projects:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [language])

    return (
        <section id="projects" className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 backdrop-blur-xl border-t border-white/10">
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

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-solar" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        {language === "en" ? "No projects found." : "لا توجد مشاريع."}
                    </div>
                ) : (
                    <div className="space-y-8 sm:space-y-10 md:space-y-12">
                        {projects.map((project, index) => {
                            const isOdd = index % 2 === 1
                            const shouldFlipDesktop = isRtl ? !isOdd : isOdd

                            return (
                                <article
                                    key={project.id}
                                    className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-r from-white/5 via-white/[0.03] to-white/5"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-12">
                                        <div
                                            className={`relative min-h-[250px] sm:min-h-[300px] md:min-h-[340px] md:col-span-7 ${shouldFlipDesktop ? "md:order-2" : "md:order-1"}`}
                                        >
                                            <Image
                                                src={project.imageRelativePath ? `${BACKEND_URL}${project.imageRelativePath}` : "/placeholder-image.jpg"}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/45 md:via-transparent md:to-transparent" />

                                            <div className="absolute top-4 sm:top-5 ltr:left-4 ltr:sm:left-5 rtl:right-4 rtl:sm:right-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-xs font-medium text-white/95 backdrop-blur-md">
                                                <span className="h-2 w-2 rounded-full bg-solar shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
                                                {language === "en" ? "Completed Project" : "مشروع مُنجز"}
                                            </div>
                                        </div>

                                        <div
                                            className={`relative md:col-span-5 flex flex-col justify-center p-5 sm:p-7 md:p-8 lg:p-10 ${shouldFlipDesktop ? "md:order-1" : "md:order-2"}`}
                                        >
                                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(34,197,94,0.12),transparent_38%)]" />

                                            <div className="relative">
                                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-muted-foreground mb-4">
                                                    {language === "en" ? `Project ${index + 1}` : `المشروع ${index + 1}`}
                                                </span>

                                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-4 text-balance">
                                                    {project.title}
                                                </h3>

                                                {project.location && (
                                                    <div className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground mb-6">
                                                        <MapPin className="h-4 w-4 text-solar" />
                                                        <span>{project.location}</span>
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
