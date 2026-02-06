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
    <div dir={dir} className="relative min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "url('/ProductsBackground.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0a0a0a]/60 py-24 border-b border-white/5">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-solar/10 blur-3xl" />
            <div className="absolute top-1/2 right-1/4 h-60 w-60 rounded-full bg-solar/5 blur-3xl opacity-50" />
          </div>
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-solar/20 text-solar border-solar/30 px-4 py-1.5 text-sm rounded-full">
                {language === "en" ? "Premium Solar Equipment" : "معدات شمسية عالية الجودة"}
              </Badge>
              <h1 className="text-4xl font-black text-[#f9fafb] md:text-5xl lg:text-7xl text-balance tracking-tight">
                {t("products.title")}
              </h1>
              <p className="mt-6 text-xl text-[#cbd5e0] text-pretty max-w-2xl mx-auto leading-relaxed">
                {t("products.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-[#0a0a0a]/80 backdrop-blur-md py-20">
          <div className="container mx-auto px-4">
            {/* Section Filter */}
            {sections.length > 0 && (
              <div className="mb-16 flex flex-wrap justify-center gap-4">
                <Button
                  variant={selectedSection === null ? "default" : "outline"}
                  onClick={() => setSelectedSection(null)}
                  className={selectedSection === null
                    ? "bg-solar text-solar-foreground hover:bg-solar/90 shadow-xl shadow-solar/20 rounded-2xl h-12 px-8 text-base font-bold transition-all hover:scale-105"
                    : "border-white/10 bg-white/5 text-[#cbd5e0] hover:bg-white/10 hover:text-[#f9fafb] rounded-2xl h-12 px-8 text-base font-medium transition-all backdrop-blur-sm"
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
                      ? "bg-solar text-solar-foreground hover:bg-solar/90 shadow-xl shadow-solar/20 rounded-2xl h-12 px-8 text-base font-bold transition-all hover:scale-105"
                      : "border-white/10 bg-white/5 text-[#cbd5e0] hover:bg-white/10 hover:text-[#f9fafb] rounded-2xl h-12 px-8 text-base font-medium transition-all backdrop-blur-sm"
                    }
                  >
                    {section.name}
                  </Button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="h-12 w-12 animate-spin text-solar" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <Package className="h-16 w-16 text-white/20" />
                </div>
                <p className="mt-8 text-xl font-medium text-[#cbd5e0]">{t("dashboard.noData")}</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-[2rem] bg-white/[0.03] backdrop-blur-md border border-white/10 transition-all duration-500 hover:border-solar/40 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden p-8">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={getImageUrl(product.images[0].url)}
                          alt={product.name}
                          fill
                          className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-20 w-20 text-white/10" />
                        </div>
                      )}

                      {/* Section Badge */}
                      {product.sectionName && (
                        <Badge className="absolute top-6 left-6 bg-solar text-solar-foreground border-0 shadow-lg px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider z-10">
                          {product.sectionName}
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="relative p-8 flex-1 flex flex-col border-t border-white/5">
                      <h3 className="line-clamp-2 text-xl font-black text-[#f9fafb] group-hover:text-solar transition-colors min-h-[3.5rem] leading-tight">
                        {product.name}
                      </h3>

                      {product.mainDesc && (
                        <p className="mt-4 line-clamp-2 text-sm text-[#cbd5e0] flex-1 leading-relaxed opacity-70">
                          {product.mainDesc}
                        </p>
                      )}

                      <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-3xl font-black text-solar">
                            {product.price.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-[#cbd5e0] uppercase opacity-50 tracking-widest ltr:ml-1 rtl:mr-1">
                            {t("products.sar")}
                          </span>
                        </div>

                        <Button asChild className="w-full h-12 bg-solar/10 border border-solar/20 text-solar hover:bg-solar hover:text-solar-foreground transition-all duration-300 group/btn rounded-2xl font-bold">
                          <Link href={`/products/${product.id}`} className="flex items-center justify-center gap-2">
                            <span>{t("products.viewDetails")}</span>
                            <ChevronRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Outer Glow Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]" />
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
