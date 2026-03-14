"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import {
  getProjectCards,
  getProjectCardFull,
  createProjectCard,
  updateProjectCard,
  deleteProjectCard,
  type ProjectCard,
} from "@/lib/api";
import Image from "next/image";
import { BACKEND_URL } from "@/lib/constants";

export default function ProjectsPage() {
  const { t, language, dir } = useI18n();
  const { token } = useAuth();
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<ProjectCard | null>(
    null,
  );
  const [editingProject, setEditingProject] = useState<ProjectCard | null>(
    null,
  );

  const [formData, setFormData] = useState({
    titleEn: "",
    titleAr: "",
    locationEn: "Egypt",
    locationAr: "مصر",
    file: null as File | null,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjectCards(language);
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [language]);

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      titleEn: "",
      titleAr: "",
      locationEn: "Egypt",
      locationAr: "مصر",
      file: null,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = async (project: ProjectCard) => {
    setLoading(true);
    try {
      // جلب البيانات كاملة (بما فيها الترجمات لكل اللغات)
      const fullData = await getProjectCardFull(project.id, token || undefined);
      if (fullData) {
        setEditingProject(project);
        const enTrans = fullData.translations.find(
          (t: any) => t.languageCode === "en",
        );
        const arTrans = fullData.translations.find(
          (t: any) => t.languageCode === "ar",
        );

        setFormData({
          titleEn: enTrans?.title || "",
          titleAr: arTrans?.title || "",
          locationEn: enTrans?.locationText || "Egypt", // التأكد من مسمى الحقل في الباك اند
          locationAr: arTrans?.locationText || "مصر",
          file: null,
        });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching full project data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (project: ProjectCard) => {
    setDeletingProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProject || !token) return;
    setSaving(true);
    try {
      await deleteProjectCard(deletingProject.id, token);
      await fetchProjects();
      setIsDeleteDialogOpen(false);
      setDeletingProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      const fd = new FormData();

      // تجهيز مصفوفة الترجمات لتتوافق مع موديل ProjectCardTranslation في C#
      const translations = [
        {
          languageCode: "en",
          title: formData.titleEn,
          locationText: formData.locationEn,
        },
        {
          languageCode: "ar",
          title: formData.titleAr,
          locationText: formData.locationAr,
        },
      ];

      // إرسال الترجمات كـ string JSON كما يتوقع الكنترولر الجديد
      fd.append("TranslationsJson", JSON.stringify(translations));

      // إرسال الصورة كملف
      if (formData.file) {
        fd.append("file", formData.file);
      }

      if (editingProject) {
        await updateProjectCard(editingProject.id, fd, token);
      } else {
        await createProjectCard(fd, token);
      }

      await fetchProjects();
      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      alert(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir={dir}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("dashboard.projects")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {language === "en"
              ? "Manage featured project cards"
              : "إدارة بطاقات المشاريع"}
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-solar text-solar-foreground hover:bg-solar/90"
        >
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
              <p className="mt-4 text-muted-foreground">
                {t("dashboard.noData")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      {t("dashboard.images")}
                    </TableHead>
                    <TableHead>{t("dashboard.name")}</TableHead>
                    <TableHead>
                      {language === "en" ? "Location" : "الموقع"}
                    </TableHead>
                    <TableHead className="text-right rtl:text-left">
                      {t("dashboard.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="relative h-12 w-20 overflow-hidden rounded-md border border-border">
                          <Image
                            src={
                              project.imageRelativePath ||
                              "/placeholder-image.jpg"
                            }
                            alt={project.title || "Project"}
                            fill
                            className="object-cover"
                            unoptimized // لأن الرابط أصبح Absolute من الباك اند
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell>
                        {project.locationText || project.location}
                      </TableCell>
                      <TableCell className="text-right rtl:text-left">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(project)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(project)}
                            className="text-destructive"
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

      {/* Dialog Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border" dir={dir}>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? t("dashboard.edit") : t("dashboard.add")}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Fill project details."
                : "املأ تفاصيل المشروع."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="titleEn">{t("dashboard.titleEn")}</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleAr">{t("dashboard.titleAr")}</Label>
                <Input
                  id="titleAr"
                  value={formData.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, titleAr: e.target.value })
                  }
                  required
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="locationEn">Location (EN)</Label>
                <Input
                  id="locationEn"
                  value={formData.locationEn}
                  onChange={(e) =>
                    setFormData({ ...formData, locationEn: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationAr">الموقع (عربي)</Label>
                <Input
                  id="locationAr"
                  value={formData.locationAr}
                  onChange={(e) =>
                    setFormData({ ...formData, locationAr: e.target.value })
                  }
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">{t("dashboard.images")}</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files?.[0] || null,
                  })
                }
                accept="image/*"
                required={!editingProject}
                className="cursor-pointer"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t("dashboard.cancel")}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("dashboard.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboard.confirmDelete")}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProject(null)}>
              {t("dashboard.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("dashboard.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
