"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Layers, Package, ArrowRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"
import { getSections, getProducts, type Section, type Product } from "@/lib/api"

export default function DashboardPage() {
  const { t, language, dir } = useI18n()
  const [sections, setSections] = useState<Section[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [sectionsData, productsData] = await Promise.all([
          getSections(language),
          getProducts({ lang: language, pageSize: 100 })
        ])
        setSections(sectionsData || [])
        setProducts(productsData?.items || [])
      } catch (error) {
        console.log("[v0] Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [language])

  const stats = [
    {
      title: t("dashboard.sections"),
      value: sections.length,
      icon: Layers,
      href: "/dashboard/sections",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: t("dashboard.products"),
      value: products.length,
      icon: Package,
      href: "/dashboard/products",
      color: "bg-solar/10 text-solar",
    },
  ]

  return (
    <div dir={dir}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {language === "en" 
            ? "Welcome to the AFKAR Solar admin dashboard"
            : "مرحباً بك في لوحة تحكم أفكار سولار"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-solar" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.title} className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
                  <Button asChild variant="link" className="mt-2 h-auto p-0 text-solar">
                    <Link href={stat.href} className="flex items-center gap-1">
                      {language === "en" ? "View all" : "عرض الكل"}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {language === "en" ? "Quick Actions" : "إجراءات سريعة"}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">
                    {language === "en" ? "Add New Section" : "إضافة قسم جديد"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" 
                      ? "Create a new product section to organize your products"
                      : "إنشاء قسم منتجات جديد لتنظيم منتجاتك"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="bg-solar text-solar-foreground hover:bg-solar/90">
                    <Link href="/dashboard/sections">{t("dashboard.add")}</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">
                    {language === "en" ? "Add New Product" : "إضافة منتج جديد"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" 
                      ? "Add a new solar product to your catalog"
                      : "أضف منتج طاقة شمسية جديد إلى الكتالوج"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="bg-solar text-solar-foreground hover:bg-solar/90">
                    <Link href="/dashboard/products">{t("dashboard.add")}</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
