"use client"

import Image from "next/image"
import projectsData from "@/data/projectsData.json"
import { useI18n } from "@/lib/i18n-context"

export function FeaturedProjects() {
    const { t } = useI18n()

    return (
        <section className="py-24 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#f9fafb] mb-4">
                        {t("projects.title") || "Featured Projects"}
                    </h2>
                    <div className="h-1.5 w-20 bg-solar mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {projectsData.map((project) => (
                        <div
                            key={project.id}
                            className="group relative overflow-hidden rounded-2xl bg-[#111827] border border-[#1f2937] transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-solar"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={project.imagePath || "/placeholder-image.jpg"}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[#f9fafb] mb-2">{project.title}</h3>
                                <div className="flex flex-col gap-1 text-sm text-[#cbd5e0]">
                                    <p className="flex items-center gap-2">
                                        <span className="text-solar">📍</span> {project.location}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-solar">⚡</span> {project.capacity}
                                    </p>
                                </div>
                            </div>

                            {/* Emerald Glow on Hover */}
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute -inset-px rounded-2xl border border-solar/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
