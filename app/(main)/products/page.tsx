"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, ChevronRight, Loader2, Zap } from "lucide-react"
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
    <div dir={dir} className="relative min-h-screen bg-transparent overflow-x-hidden">
      {/* Background Image Layer (Subtle Texture) */}
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/ProductsBackground.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 w-full mb-20">
        {/* Compact Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-8 sm:pt-20 sm:pb-12 border-b border-border/50">
          {/* Decorative Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-primary/20 blur-[100px] -z-10" />

          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-3 px-3 py-1 text-xs border-primary/30 text-primary bg-primary/10 rounded-full tracking-wider uppercase">
                {language === "en" ? "Solar Store" : "متجر الطاقة"}
              </Badge>
              <h1 className="text-3xl font-black text-foreground md:text-5xl text-balance tracking-tight">
                {t("products.title")}
              </h1>
              <p className="mt-2 text-base text-muted-foreground text-pretty max-w-xl mx-auto">
                {t("products.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            {/* Filter Buttons */}
            {sections.length > 0 && (
              <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                <Button
                  variant={selectedSection === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSection(null)}
                  className={selectedSection === null
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 h-9 text-sm font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all"
                    : "border-border bg-card/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-full px-5 h-9 text-sm font-medium backdrop-blur-sm transition-all"
                  }
                >
                  {language === "en" ? "All" : "الكل"}
                </Button>
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSection(section.id)}
                    className={selectedSection === section.id
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 h-9 text-sm font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all"
                      : "border-border bg-card/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-full px-5 h-9 text-sm font-medium backdrop-blur-sm transition-all"
                    }
                  >
                    {section.name}
                  </Button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-70">
                <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground">{t("dashboard.noData")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 h-auto"
                  >
                    {/* Amber Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Image Container */}
                    <div className="relative w-full aspect-[4/3] bg-muted/20 flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={getImageUrl(product.images[0].url)}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                      )}

                      {/* Badge */}
                      {product.sectionName && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-black/50 backdrop-blur text-white border-0 text-[10px] px-2 h-5">
                            {product.sectionName}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors text-center sm:text-left">
                          {product.name}
                        </h3>
                        {/* Description - Hidden on very small screens, visible on sm+ */}
                        {product.mainDesc && (
                          <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2 mt-2">
                            {product.mainDesc}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex items-center justify-center sm:justify-between w-full">
                          <div className="flex flex-col items-center sm:items-start">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("products.sar")}</span>
                            <span className="text-xl font-black text-primary leading-none">
                              {product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <Button asChild size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold h-9">
                          <Link href={`/products/${product.id}`} className="flex items-center justify-center gap-2">
                            <span>{t("products.viewDetails")}</span>
                            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
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
    </div>
  )
}
