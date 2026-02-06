"use client"

import React from "react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Loader2, Package, X, Upload, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { getImageUrl } from "@/lib/utils"
import {
  getSections,
  getProducts,
  getProductFull,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  type Section,
  type Product,
  type ProductFull,
  type ProductImage
} from "@/lib/api"

interface ProductFormData {
  id?: number
  price: number
  sectionId: number
  nameEn: string
  nameAr: string
  mainDescEn: string
  mainDescAr: string
  subDescEn: string
  subDescAr: string
  existingImages: ProductImage[]
  newImages: File[]
}

const defaultFormData: ProductFormData = {
  price: 0,
  sectionId: 0,
  nameEn: "",
  nameAr: "",
  mainDescEn: "",
  mainDescAr: "",
  subDescEn: "",
  subDescAr: "",
  existingImages: [],
  newImages: [],
}

export default function ProductsPage() {
  const { t, language, dir } = useI18n()
  const { token } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFetchingFull, setIsFetchingFull] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Selection States
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingProduct, setEditingProduct] = useState<ProductFull | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsData, sectionsData] = await Promise.all([
        getProducts({ lang: language, pageSize: 100 }),
        getSections(language)
      ])
      setProducts(productsData?.items || [])
      setSections(sectionsData || [])
    } catch (error) {
      console.error("[Products] Fetch error:", error)
      setProducts([])
      setSections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [language])

  const handleAdd = () => {
    setEditingId(null)
    setEditingProduct(null)
    setFetchError(null)
    setFormData({
      ...defaultFormData,
      sectionId: sections[0]?.id || 0,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = async (product: Product) => {
    setEditingId(product.id)
    setIsDialogOpen(true)
    setIsFetchingFull(true)
    setFetchError(null)
    setEditingProduct(null)

    try {
      const fullProduct = await getProductFull(product.id, token || undefined)
      if (!fullProduct) throw new Error("Product details not found")

      setEditingProduct(fullProduct)

      const en = fullProduct.translations?.find(t => t.languageCode === "en")
      const ar = fullProduct.translations?.find(t => t.languageCode === "ar")

      setFormData({
        id: fullProduct.id,
        price: fullProduct.price,
        sectionId: fullProduct.sectionId,
        nameEn: en?.name || "",
        nameAr: ar?.name || "",
        mainDescEn: en?.mainDesc || "",
        mainDescAr: ar?.mainDesc || "",
        subDescEn: en?.subDesc || "",
        subDescAr: ar?.subDesc || "",
        existingImages: fullProduct.images || [],
        newImages: [],
      })
    } catch (error) {
      console.error("[Products] Edit error:", error)
      setFetchError(language === "en" ? "Failed to load product details" : "فشل تحميل تفاصيل المنتج")
    } finally {
      setIsFetchingFull(false)
    }
  }

  const handleDelete = (product: Product) => {
    setDeletingProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingProduct || !token) return
    setSaving(true)
    try {
      await deleteProduct(deletingProduct.id, token)
      await fetchData()
      setIsDeleteDialogOpen(false)
      setDeletingProduct(null)
    } catch (error: any) {
      console.error("[Products] Delete error:", error)
      alert(language === "en" ? `Failed to delete product: ${error.message}` : `فشل حذف المنتج: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveExistingImage = async (imageId: number) => {
    if (!token) return
    try {
      await deleteProductImage(imageId, token)
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter(img => img.id !== imageId)
      }))
    } catch (error) {
      console.error("[Products] Remove image error:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...files]
    }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSaving(true)
    try {
      const translations = JSON.stringify([
        {
          Id: editingProduct?.translations?.find(t => t.languageCode === "en")?.id || 0,
          LanguageCode: "en",
          Name: formData.nameEn,
          MainDesc: formData.mainDescEn,
          SubDesc: formData.subDescEn,
        },
        {
          Id: editingProduct?.translations?.find(t => t.languageCode === "ar")?.id || 0,
          LanguageCode: "ar",
          Name: formData.nameAr,
          MainDesc: formData.mainDescAr,
          SubDesc: formData.subDescAr,
        },
      ])

      const dto = new FormData()

      // Match backend parameter names exactly
      dto.append("TranslationsJson", translations)
      dto.append("Price", formData.price.toString())
      dto.append("SectionId", formData.sectionId.toString())

      if (editingId) {
        dto.append("Id", editingId.toString())
      }

      // Backend expects 'files' list
      formData.newImages.forEach(file => {
        dto.append("files", file)
      })

      if (editingId) {
        await updateProduct(dto, token)
      } else {
        await createProduct(dto, token)
      }

      await fetchData()
      setIsDialogOpen(false)
      setFormData(defaultFormData)
    } catch (error) {
      console.error("[Products] Submit error:", error)
      alert(language === "en" ? "Error saving product" : "خطأ في حفظ المنتج")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div dir={dir} className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard.products")}</h1>
          <p className="text-muted-foreground">{language === "en" ? "Manage your products catalog" : "إدارة كتالوج المنتجات"}</p>
        </div>
        <Button onClick={handleAdd} className="bg-solar text-white hover:bg-solar/90 h-11 px-6">
          <Plus className="ltr:mr-2 rtl:ml-2 h-5 w-5" />
          {t("dashboard.add")}
        </Button>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm border-border overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-solar" />
              <p className="text-muted-foreground">{t("dashboard.loading")}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/20">
              <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">{t("dashboard.noData")}</p>
              <Button onClick={handleAdd} variant="outline" className="mt-4">
                {language === "en" ? "Create First Product" : "إنشاء أول منتج"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[100px]">{t("dashboard.images")}</TableHead>
                    <TableHead className="min-w-[200px]">{t("dashboard.name")}</TableHead>
                    <TableHead>{t("dashboard.section")}</TableHead>
                    <TableHead>{t("dashboard.price")}</TableHead>
                    <TableHead className="text-right w-[120px]">{t("dashboard.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs">{product.id}</TableCell>
                      <TableCell>
                        <div className="h-12 w-12 rounded-lg border bg-muted overflow-hidden relative">
                          {product.images?.[0] ? (
                            <Image
                              src={getImageUrl(product.images[0].url)}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 absolute inset-0 m-auto text-muted-foreground/40" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {sections.find(s => s.id === product.sectionId)?.name || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-bold text-solar">
                        {product.price.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">{t("products.sar")}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
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

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !saving && setIsDialogOpen(open)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl">
              {editingId ? (language === "en" ? "Edit Product" : "تعديل المنتج") : (language === "en" ? "New Product" : "منتج جديد")}
            </DialogTitle>
            <DialogDescription>
              {language === "en" ? "Provide product information in English and Arabic" : "أدخل معلومات المنتج باللغتين الإنجليزية والعربية"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 pt-2">
            {isFetchingFull ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-solar" />
                <p className="text-muted-foreground">{t("dashboard.loading")}</p>
              </div>
            ) : fetchError ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-destructive">
                <AlertCircle className="h-12 w-12" />
                <p className="font-medium">{fetchError}</p>
                <Button onClick={() => editingId && handleEdit({ id: editingId } as any)} variant="outline">
                  {language === "en" ? "Try Again" : "إعادة المحاولة"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("dashboard.section")}</Label>
                    <Select
                      value={formData.sectionId.toString()}
                      onValueChange={(v) => setFormData({ ...formData, sectionId: parseInt(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dashboard.price")} ({t("products.sar")})</Label>
                    <Input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("dashboard.nameEn")}</Label>
                    <Input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dashboard.nameAr")}</Label>
                    <Input value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} dir="rtl" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("dashboard.mainDescEn")}</Label>
                    <Textarea value={formData.mainDescEn} onChange={(e) => setFormData({ ...formData, mainDescEn: e.target.value })} className="h-24" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dashboard.mainDescAr")}</Label>
                    <Textarea value={formData.mainDescAr} onChange={(e) => setFormData({ ...formData, mainDescAr: e.target.value })} dir="rtl" className="h-24" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("dashboard.subDescEn")}</Label>
                    <Textarea value={formData.subDescEn} onChange={(e) => setFormData({ ...formData, subDescEn: e.target.value })} className="h-24" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dashboard.subDescAr")}</Label>
                    <Textarea value={formData.subDescAr} onChange={(e) => setFormData({ ...formData, subDescAr: e.target.value })} dir="rtl" className="h-24" />
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t">
                  <Label className="text-lg font-bold">{t("dashboard.images")}</Label>

                  {/* Current Images */}
                  <div className="flex flex-wrap gap-4">
                    {formData.existingImages.map(img => (
                      <div key={img.id} className="relative group">
                        <div className="h-20 w-20 rounded-md border overflow-hidden">
                          <Image src={getImageUrl(img.url)} alt="Existing" fill className="object-cover" />
                        </div>
                        <button type="button" onClick={() => handleRemoveExistingImage(img.id)} className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {/* New Previews */}
                    {formData.newImages.map((file, i) => (
                      <div key={i} className="relative group">
                        <div className="h-20 w-20 rounded-md border bg-muted overflow-hidden">
                          <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, newImages: p.newImages.filter((_, idx) => idx !== i) }))} className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <button type="button" onClick={() => fileInputRef.current?.click()} className="h-20 w-20 rounded-md border border-dashed flex flex-col items-center justify-center gap-1 hover:bg-muted/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Add</span>
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                </div>
              </div>
            )}

            <DialogFooter className="p-6 border-t mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                {t("dashboard.cancel")}
              </Button>
              <Button type="submit" className="bg-solar text-white hover:bg-solar/90 min-w-24" disabled={saving || isFetchingFull || !!fetchError}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("dashboard.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{language === "en" ? "Delete Product" : "حذف المنتج"}</AlertDialogTitle>
            <AlertDialogDescription>{t("dashboard.confirmDelete")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={saving}>{t("dashboard.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("dashboard.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
