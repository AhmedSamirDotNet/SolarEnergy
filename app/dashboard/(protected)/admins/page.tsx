"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, UserCog } from "lucide-react"
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
    getAdmins,
    registerAdmin,
    updateAdminRole,
    deleteAdmin,
    type Admin,
} from "@/lib/api"

interface AdminFormData {
    username: string
    password: string
}

interface RoleFormData {
    id: number
    role: string
}

export default function AdminsPage() {
    const { t, language, dir } = useI18n()
    const { token } = useAuth()
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null)
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
    const [formData, setFormData] = useState<AdminFormData>({
        username: "",
        password: "",
    })
    const [roleFormData, setRoleFormData] = useState<RoleFormData>({
        id: 0,
        role: "",
    })

    const fetchAdmins = async () => {
        if (!token) return
        setLoading(true)
        try {
            console.log("[v0] Fetching admins with token:", token?.substring(0, 10) + "...");
            const data = await getAdmins(token)
            setAdmins(data || [])
        } catch (error: any) {
            console.error("[v0] Error fetching admins:", error.message || error);
            setAdmins([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchAdmins()
        }
    }, [token])

    const handleAdd = () => {
        setFormData({ username: "", password: "" })
        setIsAddDialogOpen(true)
    }

    const handleEditRole = (admin: Admin) => {
        setEditingAdmin(admin)
        setRoleFormData({
            id: admin.id,
            role: admin.role || "",
        })
        setIsRoleDialogOpen(true)
    }

    const handleDelete = (admin: Admin) => {
        setDeletingAdmin(admin)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingAdmin || !token) return

        setSaving(true)
        try {
            await deleteAdmin(deletingAdmin.id, token)
            await fetchAdmins()
            setIsDeleteDialogOpen(false)
            setDeletingAdmin(null)
        } catch (error: any) {
            console.error("[v0] Error deleting admin:", error.message || error);
            alert(language === "en" ? `Failed to delete: ${error.message}` : `فشل الحذف: ${error.message}`);
        } finally {
            setSaving(false)
        }
    }

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setSaving(true)
        try {
            await registerAdmin({
                username: formData.username,
                password: formData.password,
            }, token)

            await fetchAdmins()
            setIsAddDialogOpen(false)
            setFormData({ username: "", password: "" })
        } catch (error) {
            console.log("[v0] Error registering admin:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleRoleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token || !editingAdmin) return

        setSaving(true)
        try {
            await updateAdminRole({
                id: roleFormData.id,
                role: roleFormData.role,
            }, token)

            await fetchAdmins()
            setIsRoleDialogOpen(false)
            setEditingAdmin(null)
            setRoleFormData({ id: 0, role: "" })
        } catch (error) {
            console.log("[v0] Error updating admin role:", error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div dir={dir}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{t("dashboard.admins")}</h1>
                    <p className="mt-1 text-muted-foreground">
                        {language === "en"
                            ? "Manage admin users and their roles"
                            : "إدارة المسؤولين وأدوارهم"}
                    </p>
                </div>
                <Button onClick={handleAdd} className="bg-solar text-solar-foreground hover:bg-solar/90">
                    <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t("dashboard.registerAdmin")}
                </Button>
            </div>

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-card-foreground">
                        {language === "en" ? "All Admins" : "جميع المسؤولين"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-solar" />
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <UserCog className="h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-4 text-muted-foreground">{t("dashboard.noData")}</p>
                            <Button onClick={handleAdd} className="mt-4 bg-solar text-solar-foreground hover:bg-solar/90">
                                <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                {t("dashboard.registerAdmin")}
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">ID</TableHead>
                                        <TableHead>{t("dashboard.username")}</TableHead>
                                        <TableHead>{t("dashboard.role")}</TableHead>
                                        <TableHead className="text-right rtl:text-left">{t("dashboard.actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <TableRow key={admin.id}>
                                            <TableCell className="font-medium">{admin.id}</TableCell>
                                            <TableCell>{admin.username}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-solar/10 px-2 py-1 text-xs font-medium text-solar">
                                                    {admin.role || "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right rtl:text-left">
                                                <div className="flex items-center justify-end gap-2 rtl:justify-start">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditRole(admin)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                        title={t("dashboard.updateRole")}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(admin)}
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

            {/* Register Admin Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent dir={dir}>
                    <DialogHeader>
                        <DialogTitle>
                            {language === "en" ? "Register New Admin" : "تسجيل مسؤول جديد"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "en"
                                ? "Enter the username and password for the new admin"
                                : "أدخل اسم المستخدم وكلمة المرور للمسؤول الجديد"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">{t("dashboard.username")}</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder={language === "en" ? "Enter username" : "أدخل اسم المستخدم"}
                                    required
                                    minLength={1}
                                    maxLength={100}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t("dashboard.password")}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={language === "en" ? "Enter password" : "أدخل كلمة المرور"}
                                    required
                                    minLength={6}
                                    maxLength={100}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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

            {/* Update Role Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent dir={dir}>
                    <DialogHeader>
                        <DialogTitle>
                            {language === "en" ? "Update Admin Role" : "تحديث دور المسؤول"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "en"
                                ? `Update the role for ${editingAdmin?.username || "admin"}`
                                : `تحديث دور ${editingAdmin?.username || "المسؤول"}`}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRoleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">{t("dashboard.role")}</Label>
                                <Input
                                    id="role"
                                    value={roleFormData.role}
                                    onChange={(e) => setRoleFormData({ ...roleFormData, role: e.target.value })}
                                    placeholder={language === "en" ? "e.g., SuperAdmin, Admin, Editor" : "مثال: مسؤول أعلى، مسؤول، محرر"}
                                    required
                                    maxLength={50}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                                {t("dashboard.cancel")}
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-solar text-solar-foreground hover:bg-solar/90">
                                {saving && <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />}
                                {t("dashboard.updateRole")}
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
                            {language === "en" ? "Delete Admin" : "حذف المسؤول"}
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
