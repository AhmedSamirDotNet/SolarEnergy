"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"
import {
    getCustomers,
    getCustomerFeedbacks,
    createCustomerFeedback,
    updateCustomerFeedback,
    deleteCustomerFeedback,
    type Customer,
    type CustomerFeedback,
} from "@/lib/api"

interface FeedbackFormData {
    id?: number
    customerId: number
    feedbackEn: string
    feedbackAr: string
}

interface MergedFeedback {
    id: number
    customerId: number
    customerName: string
    feedbackEn: string
    feedbackAr: string
}

export default function CustomerFeedbackPage() {
    const { t, language, dir } = useI18n()
    const { token } = useAuth()
    const [feedbacks, setFeedbacks] = useState<MergedFeedback[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingFeedback, setEditingFeedback] = useState<FeedbackFormData | null>(null)
    const [deletingFeedback, setDeletingFeedback] = useState<MergedFeedback | null>(null)
    const [formData, setFormData] = useState<FeedbackFormData>({
        customerId: 0,
        feedbackEn: "",
        feedbackAr: "",
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [customersData, feedbacksEn, feedbacksAr] = await Promise.all([
                getCustomers("en"),
                getCustomerFeedbacks("en"),
                getCustomerFeedbacks("ar"),
            ])

            setCustomers(customersData || [])

            // Merge EN and AR feedbacks
            const merged: MergedFeedback[] = (feedbacksEn || []).map((fbEn: CustomerFeedback) => {
                const fbAr = (feedbacksAr || []).find((f: CustomerFeedback) => f.id === fbEn.id)
                const customer = (customersData || []).find((c: Customer) => c.id === fbEn.customerId)
                return {
                    id: fbEn.id,
                    customerId: fbEn.customerId,
                    customerName: fbEn.customerName || customer?.customerName || "-",
                    feedbackEn: fbEn.feedBack || "",
                    feedbackAr: fbAr?.feedBack || "",
                }
            })

            setFeedbacks(merged)
        } catch (error) {
            console.error("[Feedback] Error fetching:", error)
            setFeedbacks([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAdd = () => {
        setEditingFeedback(null)
        setFormData({ customerId: 0, feedbackEn: "", feedbackAr: "" })
        setIsDialogOpen(true)
    }

    const handleEdit = (fb: MergedFeedback) => {
        setEditingFeedback({
            id: fb.id,
            customerId: fb.customerId,
            feedbackEn: fb.feedbackEn,
            feedbackAr: fb.feedbackAr,
        })
        setFormData({
            id: fb.id,
            customerId: fb.customerId,
            feedbackEn: fb.feedbackEn,
            feedbackAr: fb.feedbackAr,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = (fb: MergedFeedback) => {
        setDeletingFeedback(fb)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingFeedback || !token) return

        setSaving(true)
        try {
            await deleteCustomerFeedback(deletingFeedback.id, token)
            await fetchData()
            setIsDeleteDialogOpen(false)
            setDeletingFeedback(null)
        } catch (error: any) {
            console.error("[Feedback] Error deleting:", error.message || error)
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

        if (!formData.customerId || formData.customerId === 0) {
            alert(
                language === "en"
                    ? "Please select a customer"
                    : "الرجاء اختيار عميل"
            )
            return
        }

        setSaving(true)
        try {
            if (editingFeedback?.id) {
                await updateCustomerFeedback(
                    {
                        id: editingFeedback.id,
                        customerId: formData.customerId,
                        feedbackEn: formData.feedbackEn,
                        feedbackAr: formData.feedbackAr,
                    },
                    token
                )
            } else {
                await createCustomerFeedback(
                    {
                        customerId: formData.customerId,
                        feedbackEn: formData.feedbackEn,
                        feedbackAr: formData.feedbackAr,
                    },
                    token
                )
            }

            await fetchData()
            setIsDialogOpen(false)
            setFormData({ customerId: 0, feedbackEn: "", feedbackAr: "" })
            setEditingFeedback(null)
        } catch (error: any) {
            console.error("[Feedback] Error saving:", error.message || error)
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
                        {t("dashboard.customerFeedback")}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {language === "en"
                            ? "Manage customer feedback and testimonials"
                            : "إدارة تقييمات وشهادات العملاء"}
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
                        {language === "en" ? "All Feedback" : "جميع التقييمات"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-solar" />
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
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
                                        <TableHead>{t("dashboard.customer")}</TableHead>
                                        <TableHead>{t("dashboard.feedbackEn")}</TableHead>
                                        <TableHead>{t("dashboard.feedbackAr")}</TableHead>
                                        <TableHead className="text-right rtl:text-left">
                                            {t("dashboard.actions")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feedbacks.map((fb, index) => (
                                        <TableRow key={fb.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-solar/10 px-2 py-1 text-xs font-medium text-solar">
                                                    {fb.customerName}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="block max-w-[200px] truncate" title={fb.feedbackEn}>
                                                    {fb.feedbackEn || "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell dir="rtl">
                                                <span className="block max-w-[200px] truncate" title={fb.feedbackAr}>
                                                    {fb.feedbackAr || "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right rtl:text-left">
                                                <div className="flex items-center justify-end gap-2 rtl:justify-start">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(fb)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                        title={t("dashboard.edit")}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(fb)}
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
                <DialogContent dir={dir} className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingFeedback
                                ? language === "en"
                                    ? "Edit Feedback"
                                    : "تعديل التقييم"
                                : language === "en"
                                    ? "Add New Feedback"
                                    : "إضافة تقييم جديد"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "en"
                                ? "Enter the feedback in both English and Arabic"
                                : "أدخل التقييم باللغتين الإنجليزية والعربية"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerId">{t("dashboard.customer")}</Label>
                                <Select
                                    value={formData.customerId ? formData.customerId.toString() : ""}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, customerId: parseInt(value, 10) })
                                    }
                                >
                                    <SelectTrigger id="customerId" className="w-full">
                                        <SelectValue
                                            placeholder={t("dashboard.selectCustomer")}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                {c.customerName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="feedbackEn">{t("dashboard.feedbackEn")}</Label>
                                <Textarea
                                    id="feedbackEn"
                                    value={formData.feedbackEn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, feedbackEn: e.target.value })
                                    }
                                    placeholder="Great service and product quality..."
                                    required
                                    minLength={1}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="feedbackAr">{t("dashboard.feedbackAr")}</Label>
                                <Textarea
                                    id="feedbackAr"
                                    value={formData.feedbackAr}
                                    onChange={(e) =>
                                        setFormData({ ...formData, feedbackAr: e.target.value })
                                    }
                                    placeholder="خدمة ممتازة وجودة منتجات رائعة..."
                                    dir="rtl"
                                    required
                                    minLength={1}
                                    rows={3}
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
                            {language === "en" ? "Delete Feedback" : "حذف التقييم"}
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
