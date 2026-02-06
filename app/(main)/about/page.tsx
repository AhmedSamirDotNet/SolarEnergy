"use client"

import { Target, Eye, Heart, Users, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"

export default function AboutPage() {
  const { t, language, dir } = useI18n()

  const values = [
    {
      icon: Target,
      title: t("about.mission.title"),
      description: t("about.mission.text"),
    },
    {
      icon: Eye,
      title: t("about.vision.title"),
      description: t("about.vision.text"),
    },
    {
      icon: Heart,
      title: t("about.values.title"),
      description: t("about.values.text"),
    },
  ]

  const features = [
    {
      icon: Users,
      title: language === "en" ? "Expert Team" : "فريق خبراء",
      description: language === "en"
        ? "Our team consists of certified solar energy professionals with years of experience."
        : "يتكون فريقنا من متخصصين معتمدين في الطاقة الشمسية ذوي خبرة سنوات.",
    },
    {
      icon: Award,
      title: language === "en" ? "Quality Assurance" : "ضمان الجودة",
      description: language === "en"
        ? "We use only the highest quality solar panels and equipment from trusted manufacturers."
        : "نستخدم فقط أعلى جودة من الألواح الشمسية والمعدات من الشركات المصنعة الموثوقة.",
    },
    {
      icon: TrendingUp,
      title: language === "en" ? "Continuous Support" : "دعم مستمر",
      description: language === "en"
        ? "We provide ongoing maintenance and support to ensure optimal system performance."
        : "نقدم صيانة ودعم مستمر لضمان الأداء الأمثل للنظام.",
    },
  ]

  return (
    <div dir={dir}>
      {/* Hero Section */}
      <section className="bg-[var(--gradient-deep)] py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-[#f9fafb] md:text-5xl text-balance">
              {t("about.title")}
            </h1>
            <p className="mt-4 text-xl text-solar font-medium">
              {t("about.subtitle")}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-[#cbd5e0] text-pretty">
              {t("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-[var(--gradient-slate)] py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((item, index) => (
              <Card key={index} className="group border-[#1f2937] bg-[#111827] text-center transition-all hover:border-solar/30">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-solar/10 text-solar group-hover:bg-solar group-hover:text-solar-foreground transition-all">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl text-[#f9fafb]">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#cbd5e0] leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[var(--gradient-slate)] py-20 border-t border-[#1f2937]">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[#f9fafb] md:text-4xl text-balance">
              {language === "en" ? "Why Choose AFKAR Solar?" : "لماذا تختار أفكار سولار؟"}
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-solar text-solar-foreground">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[#f9fafb]">{feature.title}</h3>
                <p className="text-[#cbd5e0] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--gradient-emerald)] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#f9fafb] md:text-4xl text-balance">
            {language === "en" ? "Ready to Go Solar?" : "هل أنت مستعد للتحول إلى الطاقة الشمسية؟"}
          </h2>
          <p className="mt-4 text-lg text-[#cbd5e0] text-pretty">
            {language === "en"
              ? "Contact us today for a free consultation and quote."
              : "تواصل معنا اليوم للحصول على استشارة مجانية وعرض سعر."}
          </p>
        </div>
      </section>
    </div>
  )
}
