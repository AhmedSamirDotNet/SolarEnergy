"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Layers } from "lucide-react"
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
  getSections,
  createSection,
  updateSection,
  deleteSection,
  type Section,
  type SectionTranslation
} from "@/lib/api"

interface SectionFormData {
  id?: number
  nameEn: string
  nameAr: string
  translations?: SectionTranslation[]
}

export default function SectionsPage() {
  const { t, language, dir } = useI18n()
  const { token } = useAuth()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<SectionFormData | null>(null)
  const [deletingSection, setDeletingSection] = useState<Section | null>(null)
  const [formData, setFormData] = useState<SectionFormData>({
    nameEn: "",
    nameAr: "",
  })

  const fetchSections = async () => {
    setLoading(true)
    try {
      // Fetch sections with full translations by getting both languages
      const [sectionsEn, sectionsAr] = await Promise.all([
        getSections("en"),
        getSections("ar")
      ])

      // Merge translations
      const mergedSections = (sectionsEn || []).map((sectionEn: Section) => {
        const sectionAr = (sectionsAr || []).find((s: Section) => s.id === sectionEn.id)
        return {
          ...sectionEn,
          nameAr: sectionAr?.name || "",
          nameEn: sectionEn.name || "",
        }
      })

      setSections(mergedSections)
    } catch (error) {
      console.log("[v0] Error fetching sections:", error)
      setSections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const handleAdd = () => {
    setEditingSection(null)
    setFormData({ nameEn: "", nameAr: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (section: Section & { nameEn?: string; nameAr?: string }) => {
    setEditingSection({
      id: section.id,
      nameEn: section.nameEn || section.name || "",
      nameAr: section.nameAr || "",
      translations: section.translations,
    })
    setFormData({
      id: section.id,
      nameEn: section.nameEn || section.name || "",
      nameAr: section.nameAr || "",
      translations: section.translations,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (section: Section) => {
    setDeletingSection(section)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingSection || !token) return

    setSaving(true)
    try {
      await deleteSection(deletingSection.id, token)
      await fetchSections()
      setIsDeleteDialogOpen(false)
      setDeletingSection(null)
    } catch (error: any) {
      console.error("[v0] Error deleting section:", error.message || error)
      alert(language === "en" ? `Failed to delete section: ${error.message}` : `فشل حذف القسم: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSaving(true)
    try {
      if (editingSection?.id) {
        // Update existing section
        const updateData = {
          id: editingSection.id,
          nameEn: formData.nameEn,
          nameAr: formData.nameAr,
        }
        await updateSection(updateData, token)
      } else {

        // Create new section
        const createPayload = {
          nameEn: formData.nameEn,
          nameAr: formData.nameAr,
        }
        await createSection(createPayload, token)
      }

      await fetchSections()
      setIsDialogOpen(false)
      setFormData({ nameEn: "", nameAr: "" })
      setEditingSection(null)
    } catch (error) {
      console.log("[v0] Error saving section:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div dir={dir}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("dashboard.sections")}</h1>
          <p className="mt-1 text-muted-foreground">
            {language === "en"
              ? "Manage product sections and categories"
              : "إدارة أقسام وفئات المنتجات"}
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-solar text-solar-foreground hover:bg-solar/90">
          <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          {t("dashboard.add")}
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            {language === "en" ? "All Sections" : "جميع الأقسام"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-solar" />
            </div>
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Layers className="h-12 w-12 text-muted-foreground/50" />
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
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>{t("dashboard.nameEn")}</TableHead>
                    <TableHead>{t("dashboard.nameAr")}</TableHead>
                    <TableHead className="text-right rtl:text-left">{t("dashboard.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section: Section & { nameEn?: string; nameAr?: string }) => (
                    <TableRow key={section.id}>
                      <TableCell className="font-medium">{section.id}</TableCell>
                      <TableCell>{section.nameEn || section.name}</TableCell>
                      <TableCell>{section.nameAr || "-"}</TableCell>
                      <TableCell className="text-right rtl:text-left">
                        <div className="flex items-center justify-end gap-2 rtl:justify-start">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(section)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(section)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent dir={dir}>
          <DialogHeader>
            <DialogTitle>
              {editingSection
                ? (language === "en" ? "Edit Section" : "تعديل القسم")
                : (language === "en" ? "Add New Section" : "إضافة قسم جديد")}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Enter the section name in both English and Arabic"
                : "أدخل اسم القسم باللغتين الإنجليزية والعربية"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">{t("dashboard.nameEn")}</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Solar Panels"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">{t("dashboard.nameAr")}</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="الألواح الشمسية"
                  dir="rtl"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("dashboard.cancel")}
              </Button>
              <Button type="submit" disabled={saving} className="bg-solar text-solar-foreground hover:bg-solar/90">
                {saving && <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />}
                {t("dashboard.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete Section" : "حذف القسم"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.confirmDelete")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("dashboard.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={saving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />}
              {t("dashboard.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
