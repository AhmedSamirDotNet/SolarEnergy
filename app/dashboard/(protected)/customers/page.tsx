"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react"
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
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    type Customer,
} from "@/lib/api"

interface CustomerFormData {
    id?: number
    nameEn: string
    nameAr: string
    jobEn: string
    jobAr: string
}

export default function CustomersPage() {
    const { t, language, dir } = useI18n()
    const { token } = useAuth()
    const [customers, setCustomers] = useState<(Customer & { nameEn?: string; nameAr?: string; jobEn?: string; jobAr?: string })[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<CustomerFormData | null>(null)
    const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null)
    const [formData, setFormData] = useState<CustomerFormData>({
        nameEn: "",
        nameAr: "",
        jobEn: "",
        jobAr: "",
    })

    const fetchCustomers = async () => {
        setLoading(true)
        try {
            const [customersEn, customersAr] = await Promise.all([
                getCustomers("en"),
                getCustomers("ar"),
            ])

            const merged = (customersEn || []).map((cEn: Customer) => {
                const cAr = (customersAr || []).find((c: Customer) => c.id === cEn.id)
                return {
                    ...cEn,
                    nameEn: cEn.customerName || "",
                    nameAr: cAr?.customerName || "",
                    jobEn: cEn.customerJob || "",
                    jobAr: cAr?.customerJob || "",
                }
            })

            setCustomers(merged)
        } catch (error) {
            console.error("[Customers] Error fetching:", error)
            setCustomers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    const handleAdd = () => {
        setEditingCustomer(null)
        setFormData({ nameEn: "", nameAr: "", jobEn: "", jobAr: "" })
        setIsDialogOpen(true)
    }

    const handleEdit = (customer: Customer & { nameEn?: string; nameAr?: string; jobEn?: string; jobAr?: string }) => {
        setEditingCustomer({
            id: customer.id,
            nameEn: customer.nameEn || "",
            nameAr: customer.nameAr || "",
            jobEn: customer.jobEn || "",
            jobAr: customer.jobAr || "",
        })
        setFormData({
            id: customer.id,
            nameEn: customer.nameEn || "",
            nameAr: customer.nameAr || "",
            jobEn: customer.jobEn || "",
            jobAr: customer.jobAr || "",
        })
        setIsDialogOpen(true)
    }

    const handleDelete = (customer: Customer) => {
        setDeletingCustomer(customer)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingCustomer || !token) return

        setSaving(true)
        try {
            await deleteCustomer(deletingCustomer.id, token)
            await fetchCustomers()
            setIsDeleteDialogOpen(false)
            setDeletingCustomer(null)
        } catch (error: any) {
            console.error("[Customers] Error deleting:", error.message || error)
            alert(
                language === "en"
                    ? `Failed to delete: ${error.message}`
                    : `فشل الحذف: ${error.message}`
            )
        } finally {
            setSaving(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setSaving(true)
        try {
            if (editingCustomer?.id) {
                await updateCustomer(
                    {
                        id: editingCustomer.id,
                        nameEn: formData.nameEn,
                        nameAr: formData.nameAr,
                        jobEn: formData.jobEn || undefined,
                        jobAr: formData.jobAr || undefined,
                    },
                    token
                )
            } else {
                await createCustomer(
                    {
                        nameEn: formData.nameEn,
                        nameAr: formData.nameAr,
                        jobEn: formData.jobEn || undefined,
                        jobAr: formData.jobAr || undefined,
                    },
                    token
                )
            }

            await fetchCustomers()
            setIsDialogOpen(false)
            setFormData({ nameEn: "", nameAr: "", jobEn: "", jobAr: "" })
            setEditingCustomer(null)
        } catch (error: any) {
            console.error("[Customers] Error saving:", error.message || error)
            alert(
                language === "en"
                    ? `Failed to save: ${error.message}`
                    : `فشل الحفظ: ${error.message}`
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div dir={dir}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("dashboard.customers")}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {language === "en"
                            ? "Manage customers and their information"
                            : "إدارة العملاء ومعلوماتهم"}
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
                <CardHeader>
                    <CardTitle className="text-card-foreground">
                        {language === "en" ? "All Customers" : "جميع العملاء"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-solar" />
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Users className="h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-4 text-muted-foreground">
                                {t("dashboard.noData")}
                            </p>
                            <Button
                                onClick={handleAdd}
                                className="mt-4 bg-solar text-solar-foreground hover:bg-solar/90"
                            >
                                <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                {t("dashboard.add")}
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">#</TableHead>
                                        <TableHead>{t("dashboard.customerNameEn")}</TableHead>
                                        <TableHead>{t("dashboard.customerNameAr")}</TableHead>
                                        <TableHead>{t("dashboard.customerJobEn")}</TableHead>
                                        <TableHead>{t("dashboard.customerJobAr")}</TableHead>
                                        <TableHead className="text-right rtl:text-left">
                                            {t("dashboard.actions")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer, index) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{customer.nameEn || "-"}</TableCell>
                                            <TableCell dir="rtl">{customer.nameAr || "-"}</TableCell>
                                            <TableCell>{customer.jobEn || "-"}</TableCell>
                                            <TableCell dir="rtl">{customer.jobAr || "-"}</TableCell>
                                            <TableCell className="text-right rtl:text-left">
                                                <div className="flex items-center justify-end gap-2 rtl:justify-start">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(customer)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                        title={t("dashboard.edit")}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(customer)}
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
                            {editingCustomer
                                ? language === "en"
                                    ? "Edit Customer"
                                    : "تعديل العميل"
                                : language === "en"
                                    ? "Add New Customer"
                                    : "إضافة عميل جديد"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "en"
                                ? "Enter the customer details in both English and Arabic"
                                : "أدخل بيانات العميل باللغتين الإنجليزية والعربية"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nameEn">
                                    {t("dashboard.customerNameEn")}
                                </Label>
                                <Input
                                    id="nameEn"
                                    value={formData.nameEn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nameEn: e.target.value })
                                    }
                                    placeholder="Ahmed Al-Rashid"
                                    required
                                    minLength={1}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameAr">
                                    {t("dashboard.customerNameAr")}
                                </Label>
                                <Input
                                    id="nameAr"
                                    value={formData.nameAr}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nameAr: e.target.value })
                                    }
                                    placeholder="أحمد الراشد"
                                    dir="rtl"
                                    required
                                    minLength={1}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobEn">{t("dashboard.customerJobEn")}</Label>
                                <Input
                                    id="jobEn"
                                    value={formData.jobEn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, jobEn: e.target.value })
                                    }
                                    placeholder="Business Owner"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobAr">{t("dashboard.customerJobAr")}</Label>
                                <Input
                                    id="jobAr"
                                    value={formData.jobAr}
                                    onChange={(e) =>
                                        setFormData({ ...formData, jobAr: e.target.value })
                                    }
                                    placeholder="صاحب عمل"
                                    dir="rtl"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                {t("dashboard.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-solar text-solar-foreground hover:bg-solar/90"
                            >
                                {saving && (
                                    <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />
                                )}
                                {t("dashboard.save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent dir={dir}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {language === "en" ? "Delete Customer" : "حذف العميل"}
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
                            {saving && (
                                <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />
                            )}
                            {t("dashboard.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
