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
    <div dir={dir} className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[var(--gradient-deep)] py-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/About.jpg')",
          }}
        />
        {/* Soft layered overlays for readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.16),transparent_45%),radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.12),transparent_38%)]" />
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute -right-20 bottom-8 h-48 w-48 rounded-full bg-solar/10 blur-3xl sm:h-64 sm:w-64" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1.6px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-5xl text-balance">
              {t("about.title")}
            </h1>
            <p className="mt-4 text-xl text-solar font-medium">
              {t("about.subtitle")}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              {t("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-gradient-to-b from-background via-solar/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((item, index) => (
              <Card key={index} className="group border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl text-center transition-all duration-300 hover:-translate-y-1 hover:border-solar/55 hover:shadow-xl hover:shadow-solar/20">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-white/20 via-solar/30 to-white/10 text-solar group-hover:from-solar group-hover:to-emerald-300 group-hover:text-solar-foreground transition-all">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-background via-solar/5 to-background py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
              {language === "en" ? "Why Choose AFKAR Solar?" : "لماذا تختار أفكار سولار؟"}
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group flex flex-col items-center text-center rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-solar/55 hover:shadow-xl hover:shadow-solar/20">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/25 bg-gradient-to-br from-white/20 via-solar/30 to-white/10 text-solar shadow-inner shadow-white/10">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-background via-solar/10 to-background py-16 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            {language === "en" ? "Ready to Go Solar?" : "هل أنت مستعد للتحول إلى الطاقة الشمسية؟"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {language === "en"
              ? "Contact us today for a free consultation and quote."
              : "تواصل معنا اليوم للحصول على استشارة مجانية وعرض سعر."}
          </p>
        </div>
      </section>
    </div>
  )
}
