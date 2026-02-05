"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n-context"
import { getSections, getProducts, type Section, type Product } from "@/lib/api"
import { getImageUrl } from "@/lib/utils"

export default function ProductsPage() {
  const { t, language, dir } = useI18n()
  const [sections, setSections] = useState<Section[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [sectionsData, productsData] = await Promise.all([
          getSections(language),
          getProducts({ lang: language, pageSize: 100 })
        ])

        // Debug logging
        // console.log("Sections Data:", sectionsData);
        // console.log("Products Data:", productsData);
        // if (productsData?.items?.length > 0) {
        //   console.log("First Product Images:", productsData.items[0].images);
        //   if (productsData.items[0].images && productsData.items[0].images.length > 0) {
        //     console.log("First Image URL:", productsData.items[0].images[0].url);
        //     console.log("Processed URL:", getImageUrl(productsData.items[0].images[0].url));
        //   }
        // }

        setSections(sectionsData || [])
        setProducts(productsData?.items || [])
      } catch (error) {
        console.log("[v0] Error fetching products:", error)
        setSections([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [language])

  const filteredProducts = selectedSection
    ? products.filter(p => p.sectionId === selectedSection)
    : products

  return (
    <div dir={dir}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0d1f0d] py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-solar/20 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-60 w-60 rounded-full bg-solar/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-solar/20 text-solar border-solar/30">
              {language === "en" ? "Premium Solar Equipment" : "معدات شمسية عالية الجودة"}
            </Badge>
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl text-balance">
              {t("products.title")}
            </h1>
            <p className="mt-4 text-lg text-gray-400 text-pretty">
              {t("products.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gradient-to-b from-[#0d1f0d] via-[#0a0a0a] to-background py-16">
        <div className="container mx-auto px-4">
          {/* Section Filter */}
          {sections.length > 0 && (
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedSection === null ? "default" : "outline"}
                onClick={() => setSelectedSection(null)}
                className={selectedSection === null
                  ? "bg-solar text-white hover:bg-solar/90 border-0"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
                }
              >
                {language === "en" ? "All Products" : "جميع المنتجات"}
              </Button>
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? "default" : "outline"}
                  onClick={() => setSelectedSection(section.id)}
                  className={selectedSection === section.id
                    ? "bg-solar text-white hover:bg-solar/90 border-0"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
                  }
                >
                  {section.name}
                </Button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-solar" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800/50">
                <Package className="h-12 w-12 text-gray-600" />
              </div>
              <p className="mt-6 text-lg text-gray-400">{t("dashboard.noData")}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-[#0a0a0a] border border-gray-800 transition-all duration-300 hover:border-solar/50 hover:shadow-[0_0_30px_rgba(120,184,86,0.15)] flex flex-col"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-3/4 bg-solar/20 blur-3xl" />
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-gray-800/50 to-transparent p-4">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={getImageUrl(product.images[0].url)}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110 p-4"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-20 w-20 text-gray-700" />
                      </div>
                    )}

                    {/* Section Badge */}
                    {product.sectionName && (
                      <Badge className="absolute top-4 left-4 bg-solar/90 text-white border-0 backdrop-blur-sm">
                        {product.sectionName}
                      </Badge>
                    )}

                    {/* Image Count Indicator */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                        <Package className="h-3 w-3" />
                        <span>{product.images.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="relative p-5 flex-1 flex flex-col">
                    {/* Green accent line */}
                    <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-solar/50 to-transparent" />

                    <h3 className="line-clamp-2 text-lg font-semibold text-white group-hover:text-solar transition-colors min-h-[3.5rem]">
                      {product.name}
                    </h3>

                    {product.mainDesc && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400 flex-1">
                        {product.mainDesc}
                      </p>
                    )}

                    <div className="mt-4 space-y-3">
                      <div className="text-2xl font-bold text-solar">
                        {product.price.toLocaleString()} <span className="text-base text-gray-400">{t("products.sar")}</span>
                      </div>

                      <Button asChild className="w-full bg-solar/10 border border-solar/30 text-solar hover:bg-solar hover:text-white transition-all duration-300 group/btn">
                        <Link href={`/products/${product.id}`} className="flex items-center justify-center gap-2">
                          <span>{t("products.viewDetails")}</span>
                          <ChevronRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
