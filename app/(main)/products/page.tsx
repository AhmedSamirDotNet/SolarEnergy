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
      <section className="relative overflow-hidden bg-muted/20 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-solar/10 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-60 w-60 rounded-full bg-solar/5 blur-3xl opacity-50" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-solar/20 text-solar border-solar/30">
              {language === "en" ? "Premium Solar Equipment" : "معدات شمسية عالية الجودة"}
            </Badge>
            <h1 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl text-balance">
              {t("products.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {t("products.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          {/* Section Filter */}
          {sections.length > 0 && (
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedSection === null ? "default" : "outline"}
                onClick={() => setSelectedSection(null)}
                className={selectedSection === null
                  ? "bg-solar text-solar-foreground hover:bg-solar/90 shadow-lg shadow-solar/20"
                  : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
                    ? "bg-solar text-solar-foreground hover:bg-solar/90 shadow-lg shadow-solar/20"
                    : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/30">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="mt-6 text-lg text-muted-foreground">{t("dashboard.noData")}</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-solar/30 hover:shadow-2xl hover:shadow-solar/5 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="product-image-container p-6 bg-gradient-to-b from-muted/50 to-transparent">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={getImageUrl(product.images[0].url)}
                        alt={product.name}
                        fill
                        className="p-4"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-16 w-16 text-muted/30" />
                      </div>
                    )}

                    {/* Section Badge */}
                    {product.sectionName && (
                      <Badge className="absolute top-4 left-4 bg-solar/90 text-solar-foreground border-0 backdrop-blur-sm z-10 shadow-lg">
                        {product.sectionName}
                      </Badge>
                    )}

                    {/* Image Count Indicator */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white z-10">
                        <Package className="h-3 w-3" />
                        <span>{product.images.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="relative p-6 flex-1 flex flex-col">
                    <h3 className="line-clamp-2 text-lg font-bold text-foreground group-hover:text-solar transition-colors min-h-[3.5rem] leading-snug">
                      {product.name}
                    </h3>

                    {product.mainDesc && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground flex-1">
                        {product.mainDesc}
                      </p>
                    )}

                    <div className="mt-6 space-y-4">
                      <div className="text-2xl font-black text-solar">
                        {product.price.toLocaleString()} <span className="text-sm font-medium text-muted-foreground uppercase opacity-70 tracking-wider ltr:ml-1 rtl:mr-1">{t("products.sar")}</span>
                      </div>

                      <Button asChild className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn rounded-xl">
                        <Link href={`/products/${product.id}`} className="flex items-center justify-center gap-2">
                          <span className="font-semibold">{t("products.viewDetails")}</span>
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
