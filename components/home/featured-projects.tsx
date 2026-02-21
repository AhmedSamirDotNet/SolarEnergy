"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n-context"
import { getProjectCards, type ProjectCard } from "@/lib/api"
import { BACKEND_URL } from "@/lib/constants"
import { Loader2 } from "lucide-react"

export function FeaturedProjects() {
    const { t, language } = useI18n()
    const [projects, setProjects] = useState<ProjectCard[]>([])
    const [loading, setLoading] = useState(true)

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
        <section id="projects" className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background to-white border-t border-solar/15 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-solar/6 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-40" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div className="mb-12 sm:mb-16 md:mb-20 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance mb-4">
                        {t("projects.title") || "Featured Projects"}
                    </h2>
                    <div className="h-1.5 w-16 bg-gradient-to-r from-solar to-accent rounded-full mx-auto"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-solar" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground text-lg">
                        {language === "en" ? "No projects found." : "لا توجد مشاريع."}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group relative overflow-hidden rounded-2xl border border-solar/15 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-solar/40 hover:shadow-lg hover:shadow-solar/15 flex flex-col"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
                                    <Image
                                        src={project.imageRelativePath ? `${BACKEND_URL}${project.imageRelativePath}` : "/placeholder-image.jpg"}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
                                </div>

                                <div className="p-5 sm:p-6 flex-grow flex flex-col">
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 line-clamp-2">{project.title}</h3>
                                    <div className="flex flex-col gap-2 text-sm text-muted-foreground flex-grow">
                                        <p className="flex items-center gap-2">
                                            <span className="text-solar">📍</span>
                                            <span className="group-hover:text-foreground transition-colors">{project.location}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
