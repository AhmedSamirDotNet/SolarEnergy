"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ChevronRight,
  Loader2,
  Search,
  ChevronLeft,
  ArrowUpRight,
  ChevronsUpDown,
  Filter,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n-context";
import {
  getSections,
  getProducts,
  type Section,
  type Product,
} from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export default function ProductsPage() {
  const { t, language, dir } = useI18n();
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [sectionsData, productsData] = await Promise.all([
          getSections(language),
          getProducts({ lang: language, pageSize: 1000 }),
        ]);
        setSections(sectionsData || []);
        setProducts(productsData?.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [language]);

  // منطق الفلترة المجمع (البحث + الأقسام المحددة)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSection =
        selectedSections.length === 0 || selectedSections.includes(p.sectionId);
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSection && matchesSearch;
    });
  }, [products, selectedSections, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredProducts.slice(firstIndex, lastIndex);
  }, [filteredProducts, currentPage]);

  // التمرير فقط عند تغيير الصفحة يدوياً
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSection = (id: number) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
    setCurrentPage(1);
  };

  return (
    <div
      dir={dir}
      className="relative min-h-screen bg-transparent overflow-x-hidden"
    >
      {/* الخلفية الأصلية */}
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/ProductsBackground.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 w-full mb-20">
        {/* الهيرو سيكشن - نحيف وعصري */}
        <section className="relative pt-6 pb-2 md:pt-12 md:pb-6 border-b border-border/40 bg-card/5 backdrop-blur-[2px]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-black text-foreground md:text-5xl tracking-tight mb-4 italic">
                {t("products.title")}
              </h1>

              <div className="flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto mb-4">
                {/* البحث */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      language === "en"
                        ? "What are you looking for?"
                        : "عن ماذا تبحث؟"
                    }
                    className="pl-10 h-11 rounded-xl bg-card/60 backdrop-blur-md border-border"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* دروب داون الأقسام المتعدد */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 w-full md:w-auto px-4 rounded-xl bg-card/60 backdrop-blur-md border-primary/20 flex items-center justify-between gap-3 shrink-0"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">
                          {language === "en" ? "Filter" : "تصفية"}
                        </span>
                        {selectedSections.length > 0 && (
                          <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px] rounded-full">
                            {selectedSections.length}
                          </Badge>
                        )}
                      </div>
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 rounded-xl backdrop-blur-xl bg-card/95 shadow-2xl"
                    align="end"
                  >
                    <DropdownMenuLabel className="flex items-center justify-between text-xs">
                      {language === "en" ? "Choose Sections" : "اختر الأقسام"}
                      {selectedSections.length > 0 && (
                        <button
                          onClick={() => setSelectedSections([])}
                          className="text-primary hover:underline font-bold"
                        >
                          {language === "en" ? "Clear" : "إعادة ضبط"}
                        </button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[250px] overflow-y-auto">
                      {sections.map((section) => (
                        <DropdownMenuCheckboxItem
                          key={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={() => toggleSection(section.id)}
                        >
                          {section.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* عداد المنتجات المطور */}
              <div className="flex items-center justify-center gap-2 mb-2 animate-in fade-in slide-in-from-top-1">
                <Layers className="w-3 h-3 text-primary/60" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {language === "en"
                    ? `Found ${filteredProducts.length} Products`
                    : `تم العثور على ${filteredProducts.length} منتج`}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div ref={resultsRef} className="scroll-mt-20" />

        <section className="py-6">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                  {currentItems.map((product) => (
                    <div
                      key={product.id}
                      className="group relative flex flex-col bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="relative w-full aspect-square bg-muted/5">
                        {product.images?.[0] ? (
                          <Image
                            src={getImageUrl(product.images[0].url)}
                            alt={product.name}
                            fill
                            className="object-contain p-2 sm:p-4 transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center opacity-10">
                            <Package className="h-8 w-8" />
                          </div>
                        )}
                        {product.sectionName && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] sm:text-[9px] px-2 backdrop-blur-md">
                              {product.sectionName}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-2 sm:p-3 flex flex-col flex-1 gap-1">
                        <h3 className="text-[11px] sm:text-sm font-bold text-foreground line-clamp-2 h-7 sm:h-10 leading-tight">
                          {product.name}
                        </h3>

                        <div className="mt-auto pt-2 border-t border-border/20 flex flex-col gap-2">
                          <span className="text-sm sm:text-lg font-black text-primary">
                            {product.price.toLocaleString()}
                            <span className="text-[8px] sm:text-[10px] ml-1 font-normal opacity-60 uppercase">
                              {t("products.sar")}
                            </span>
                          </span>
                          <Button
                            asChild
                            size="sm"
                            className="w-full h-7 sm:h-8 text-[10px] sm:text-xs bg-primary text-white hover:bg-primary/90 rounded-lg"
                          >
                            <Link
                              href={`/products/${product.id}`}
                              className="flex items-center justify-center gap-1"
                            >
                              <span>{t("products.viewDetails")}</span>
                              <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* الترقيم (Pagination) */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1 bg-card/60 backdrop-blur-md p-1 rounded-2xl border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-xl h-9 w-9"
                      >
                        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                      </Button>

                      <div className="flex gap-1 px-2">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => {
                          // إظهار الصفحات القريبة فقط في الموبايل لعدم كسر التصميم
                          if (
                            totalPages > 5 &&
                            Math.abs(page - currentPage) > 1 &&
                            page !== 1 &&
                            page !== totalPages
                          ) {
                            if (page === 2 || page === totalPages - 1)
                              return (
                                <span
                                  key={page}
                                  className="text-muted-foreground px-1"
                                >
                                  ..
                                </span>
                              );
                            return null;
                          }
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "ghost"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className={`w-9 h-9 rounded-xl font-bold ${currentPage === page ? "shadow-lg shadow-primary/20" : "text-muted-foreground"}`}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-xl h-9 w-9"
                      >
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
