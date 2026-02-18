"use client"

import React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/lib/i18n-context"
import staticContent from "@/data/static-content.json"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.225-.149-4.771-1.664-4.919-4.919-.058-1.266-.07-1.644-.07-4.85 0-3.204.012-3.583.07-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0 5.838a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6.406-1.155a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.2c2.76 0 5 2.24 5 5v2.08c0 .63.2 1.24.57 1.74.25.33.54.63.86.89.58.48 1.05.86 1.05 1.35 0 .7-.86 1.16-2.08 1.35-.3.05-.49.35-.39.64l.55 1.67c.1.3-.07.62-.37.71l-1.72.52c-.28.08-.58-.03-.72-.28l-.66-1.16a.55.55 0 0 0-.52-.27c-.44.04-.88.06-1.32.06-.44 0-.88-.02-1.32-.06a.55.55 0 0 0-.52.27l-.66 1.16c-.14.25-.44.36-.72.28l-1.72-.52a.53.53 0 0 1-.37-.71l.55-1.67c.1-.29-.09-.59-.39-.64C5.86 14.06 5 13.6 5 12.9c0-.49.47-.87 1.05-1.35.32-.26.61-.56.86-.89.37-.5.57-1.1.57-1.74V7.2c0-2.76 2.24-5 5-5Z" />
    </svg>
  )
}

export default function ContactPage() {
  const { t, language, dir } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const socialLinks = [
    { href: staticContent.social.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: staticContent.social.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
    { href: staticContent.social.twitter, icon: XIcon, label: "X (Twitter)" },
    { href: staticContent.social.tiktok, icon: TikTokIcon, label: "TikTok" },
    { href: staticContent.social.snapchat, icon: SnapchatIcon, label: "Snapchat" },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const whatsappNumber = "966568729639"
      const message = `مرحباً، وصلتك رسالة جديدة من الموقع:

الاسم: ${formData.name}
البريد الإلكتروني: ${formData.email}
رقم الهاتف: ${formData.phone}
الرسالة: ${formData.message}`

      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

      // Redirect to WhatsApp
      window.open(whatsappUrl, "_blank")

      setSubmitted(true)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div dir={dir}>
      {/* Hero Section */}
      <section className="relative bg-[var(--gradient-deep)] py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Contact-us.webp')",
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold text-foreground md:text-5xl lg:text-6xl text-balance tracking-tight">
              {t("contact.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-b from-background via-solar/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info Cards */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-solar/55 hover:shadow-xl hover:shadow-solar/20">
                <CardHeader className="pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-gradient-to-br from-white/20 via-solar/30 to-white/10 text-solar shadow-inner shadow-white/10">
                    <Mail className="h-7 w-7" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold text-card-foreground">{t("contact.sales")}</CardTitle>
                  <CardDescription className="mt-3 space-y-2">
                    <a href={`mailto:${staticContent.contact.sales.email}`} className="block text-lg font-medium text-solar hover:underline decoration-2 underline-offset-4">
                      {staticContent.contact.sales.email}
                    </a>
                    <a href={`tel:${staticContent.contact.sales.phone}`} className="block text-muted-foreground hover:text-foreground transition-colors font-mono">
                      {staticContent.contact.sales.phone}
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-solar/55 hover:shadow-xl hover:shadow-solar/20">
                <CardHeader className="pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-gradient-to-br from-white/20 via-solar/30 to-white/10 text-solar shadow-inner shadow-white/10">
                    <Phone className="h-7 w-7" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold text-card-foreground">{t("contact.support")}</CardTitle>
                  <CardDescription className="mt-3">
                    <a href={`tel:${staticContent.contact.support.phone}`} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors font-mono">
                      {staticContent.contact.support.phone}
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-solar/55 hover:shadow-xl hover:shadow-solar/20">
                <CardHeader className="pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-gradient-to-br from-white/20 via-solar/30 to-white/10 text-solar shadow-inner shadow-white/10">
                    <MapPin className="h-7 w-7" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold text-card-foreground">
                    {language === "en" ? "Location" : "الموقع"}
                  </CardTitle>
                  <CardDescription className="mt-3 text-lg font-medium text-muted-foreground">
                    {language === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-solar/55 hover:shadow-xl hover:shadow-solar/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-card-foreground">
                    {language === "en" ? "Follow Us" : "تابعنا"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Stay connected with AFKAR Solar on social platforms"
                      : "ابقَ على تواصل مع أفكار سولار عبر المنصات الاجتماعية"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-white/20 via-solar/20 to-white/10 text-foreground/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-solar/60 hover:text-solar hover:shadow-lg hover:shadow-solar/20"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-white/20 bg-gradient-to-br from-white/10 via-solar/10 to-white/5 backdrop-blur-xl lg:col-span-2 shadow-2xl shadow-solar/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-white/10 via-solar/10 to-white/5 pb-8 border-b border-white/15">
                <CardTitle className="text-3xl font-black text-card-foreground">
                  {language === "en" ? "Send us a Message" : "أرسل لنا رسالة"}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  {language === "en"
                    ? "Fill out the form below and we'll get back to you as soon as possible."
                    : "املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-solar/10 text-solar">
                      <Send className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {language === "en" ? "Message Sent!" : "تم إرسال الرسالة!"}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {language === "en"
                        ? "Thank you for contacting us. We'll get back to you soon."
                        : "شكراً لتواصلك معنا. سنرد عليك قريباً."}
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 bg-solar text-solar-foreground hover:bg-solar/90"
                    >
                      {language === "en" ? "Send Another Message" : "إرسال رسالة أخرى"}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("contact.name")}</Label>
                        <Input
                          id="name"
                          required
                          placeholder={t("contact.name")}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("contact.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder={t("contact.email")}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("contact.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t("contact.phone")}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t("contact.message")}</Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        placeholder={t("contact.message")}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-solar text-solar-foreground hover:bg-solar/90 sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />
                          {language === "en" ? "Sending..." : "جارٍ الإرسال..."}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                          {t("contact.send")}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
