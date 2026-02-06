"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n-context"
import { getProductById, type Product } from "@/lib/api"
import { getImageUrl } from "@/lib/utils"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { t, language, dir } = useI18n()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const data = await getProductById(parseInt(resolvedParams.id), language)
        setProduct(data)
      } catch (error) {
        console.log("[v0] Error fetching product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [resolvedParams.id, language])

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length)
    }
  }

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-solar" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-lg text-muted-foreground">
          {language === "en" ? "Product not found" : "المنتج غير موجود"}
        </p>
        <Button asChild className="mt-4 bg-solar text-solar-foreground hover:bg-solar/90">
          <Link href="/products">{language === "en" ? "Back to Products" : "العودة إلى المنتجات"}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div dir={dir} className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Link href="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            <span className="font-medium">{language === "en" ? "Back to Products" : "العودة إلى المنتجات"}</span>
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-[#0a0a0a] border border-gray-800 shadow-2xl">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-solar/5 to-transparent pointer-events-none" />

              {product.images && product.images.length > 0 ? (
                <>
                  <Image
                    src={getImageUrl(product.images[currentImageIndex].url)}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-all duration-300"
                    priority
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white shadow-lg transition-all hover:bg-solar hover:scale-110"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white shadow-lg transition-all hover:bg-solar hover:scale-110"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white">
                        <span className="font-medium">{currentImageIndex + 1}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-400">{product.images.length}</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-32 w-32 text-gray-700" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${index === currentImageIndex
                      ? "border-solar shadow-lg shadow-solar/30 ring-2 ring-solar/20"
                      : "border-gray-800 hover:border-gray-600"
                      }`}
                  >
                    <Image
                      src={getImageUrl(image.url)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2 bg-gradient-to-b from-gray-900 to-[#0a0a0a]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.sectionName && (
              <Badge className="bg-solar/20 text-solar border-solar/40 px-4 py-1.5 text-sm">
                {product.sectionName}
              </Badge>
            )}

            {/* Product Title */}
            <h1 className="text-4xl font-extrabold text-foreground md:text-5xl lg:text-6xl text-balance leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-6xl font-black text-solar drop-shadow-[0_0_30px_rgba(112,255,160,0.2)]">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xl font-bold text-muted-foreground uppercase tracking-widest opacity-60 font-mono ltr:ml-2 rtl:mr-2">{t("products.sar")}</span>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border/50" />

            {/* Main Description */}
            {product.mainDesc && (
              <div className="space-y-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-solar" />
                  {language === "en" ? "Description" : "الوصف"}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {product.mainDesc}
                </p>
              </div>
            )}

            {/* Additional Information */}
            {product.subDesc && (
              <div className="space-y-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-solar" />
                  {language === "en" ? "Additional Information" : "معلومات إضافية"}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {product.subDesc}
                </p>
              </div>
            )}

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <Button asChild size="lg" className="flex-[2] bg-solar text-solar-foreground hover:bg-solar/90 shadow-2xl shadow-solar/20 h-16 px-10 text-xl font-black rounded-2xl transition-all hover:scale-105 active:scale-95">
                <Link href="/contact" className="flex items-center justify-center gap-3">
                  <span>{t("hero.secondary")}</span>
                  <ChevronRight className="h-6 w-6 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1 border-border text-foreground hover:bg-muted/50 h-16 px-8 text-lg font-bold rounded-2xl transition-all">
                <Link href="/products" className="flex items-center justify-center gap-2">
                  {language === "en" ? "Browse More" : "تصفح المزيد"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
