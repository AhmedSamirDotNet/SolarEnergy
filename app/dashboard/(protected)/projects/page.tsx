"use client"

import React, { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"
import {
    getProjectCards,
    getProjectCardFull,
    createProjectCard,
    updateProjectCard,
    deleteProjectCard,
    type ProjectCard,
} from "@/lib/api"
import Image from "next/image"
import { BACKEND_URL } from "@/lib/constants"

export default function ProjectsPage() {
    const { t, language, dir } = useI18n()
    const { token } = useAuth()
    const [projects, setProjects] = useState<ProjectCard[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deletingProject, setDeletingProject] = useState<ProjectCard | null>(null)
    const [editingProject, setEditingProject] = useState<ProjectCard | null>(null)

    const [formData, setFormData] = useState({
        titleEn: "",
        titleAr: "",
        locationEn: "",
        locationAr: "",
        file: null as File | null,
    })

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const data = await getProjectCards(language)
            setProjects(data || [])
        } catch (error) {
            console.error("Error fetching projects:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [language])

    const handleAdd = () => {
        setEditingProject(null)
        setFormData({
            titleEn: "",
            titleAr: "",
            locationEn: "",
            locationAr: "",
            file: null,
        })
        setIsDialogOpen(true)
    }

    const handleEdit = async (project: ProjectCard) => {
        setEditingProject(project)
        setLoading(true)
        try {
            const fullData = await getProjectCardFull(project.id, token || undefined)
            if (fullData) {
                const enTrans = fullData.translations.find(t => t.languageCode === "en")
                const arTrans = fullData.translations.find(t => t.languageCode === "ar")

                setFormData({
                    titleEn: enTrans?.title || "",
                    titleAr: arTrans?.title || "",
                    locationEn: enTrans?.location || "",
                    locationAr: arTrans?.location || "",
                    file: null,
                })
            }
            setIsDialogOpen(true)
        } catch (error) {
            console.error("Error fetching full project data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (project: ProjectCard) => {
        setDeletingProject(project)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingProject || !token) return
        setSaving(true)
        try {
            await deleteProjectCard(deletingProject.id, token)
            await fetchProjects()
            setIsDeleteDialogOpen(false)
        } catch (error) {
            console.error("Error deleting project:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setSaving(true)
        try {
            const fd = new FormData()
            if (editingProject) {
                fd.append("Id", editingProject.id.toString())
            }

            const translations = [
                { languageCode: "en", title: formData.titleEn, location: formData.locationEn },
                { languageCode: "ar", title: formData.titleAr, location: formData.locationAr },
            ]

            fd.append("TranslationsJson", JSON.stringify(translations))
            if (formData.file) {
                fd.append("file", formData.file)
            }
            fd.append("ImageRelativePath", editingProject?.imageRelativePath || "")

            if (editingProject) {
                await updateProjectCard(fd, token)
            } else {
                await createProjectCard(fd, token)
            }

            await fetchProjects()
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Error saving project:", error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div dir={dir}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{t("dashboard.projects")}</h1>
                    <p className="mt-1 text-muted-foreground">
                        {language === "en" ? "Manage your featured project cards" : "إدارة بطاقات المشاريع المميزة"}
                    </p>
                </div>
                <Button onClick={handleAdd} className="bg-solar text-solar-foreground hover:bg-solar/90">
                    <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t("dashboard.add")}
                </Button>
            </div>

            <Card className="border-border bg-card">
                <CardContent className="p-0">
                    {loading && !isDialogOpen ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-solar" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-4 text-muted-foreground">{t("dashboard.noData")}</p>
                            <Button onClick={handleAdd} className="mt-4 bg-solar text-solar-foreground hover:bg-solar/90">
                                <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                {t("dashboard.add")}
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">{t("dashboard.images")}</TableHead>
                                        <TableHead>{t("dashboard.name")}</TableHead>
                                        <TableHead>{t("dashboard.location")}</TableHead>
                                        <TableHead className="text-right rtl:text-left">{t("dashboard.actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <div className="relative h-12 w-20 overflow-hidden rounded-md border border-border">
                                                    <Image
                                                        src={project.imageRelativePath
                                                            ? `${BACKEND_URL}${project.imageRelativePath}`
                                                            : "/placeholder-image.jpg"}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">{project.title}</TableCell>
                                            <TableCell className="text-muted-foreground">{project.location}</TableCell>
                                            <TableCell className="text-right rtl:text-left">
                                                <div className="flex items-center justify-end gap-2 rtl:justify-start">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(project)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(project)}
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl bg-card border-border" dir={dir}>
                    <DialogHeader>
                        <DialogTitle className="text-card-foreground">
                            {editingProject ? t("dashboard.edit") : t("dashboard.add")}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {language === "en"
                                ? "Fill in the details for the project card. Images will be optimized automatically."
                                : "املأ تفاصيل بطاقة المشروع. سيتم تحسين الصور تلقائياً."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="titleEn" className="text-card-foreground">{t("dashboard.titleEn")}</Label>
                                <Input
                                    id="titleEn"
                                    value={formData.titleEn}
                                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                    required
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="titleAr" className="text-card-foreground">{t("dashboard.titleAr")}</Label>
                                <Input
                                    id="titleAr"
                                    value={formData.titleAr}
                                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                    required
                                    dir="rtl"
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="locationEn" className="text-card-foreground">{t("dashboard.locationEn")}</Label>
                                <Input
                                    id="locationEn"
                                    value={formData.locationEn}
                                    onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                                    required
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="locationAr" className="text-card-foreground">{t("dashboard.locationAr")}</Label>
                                <Input
                                    id="locationAr"
                                    value={formData.locationAr}
                                    onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                                    required
                                    dir="rtl"
                                    className="bg-background border-border"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-card-foreground">{t("dashboard.images")}</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                accept="image/*"
                                required={!editingProject}
                                className="bg-background border-border cursor-pointer file:bg-solar file:text-solar-foreground file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2"
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-foreground hover:bg-muted">
                                {t("dashboard.cancel")}
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-solar text-solar-foreground hover:bg-solar/90">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("dashboard.save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-card border-border" dir={dir}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-card-foreground">{t("dashboard.confirmDelete")}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            {language === "en"
                                ? "This action cannot be undone. This will permanently delete the project card."
                                : "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف بطاقة المشروع نهائياً."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel className="border-border text-foreground hover:bg-muted">{t("dashboard.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={saving}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("dashboard.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
