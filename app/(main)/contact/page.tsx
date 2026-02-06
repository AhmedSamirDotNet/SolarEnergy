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
      <section className="bg-[var(--gradient-deep)] py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold text-[#f9fafb] md:text-5xl lg:text-6xl text-balance tracking-tight">
              {t("contact.title")}
            </h1>
            <p className="mt-4 text-lg text-[#cbd5e0] text-pretty max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[var(--gradient-slate)] py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info Cards */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-[#1f2937] bg-[#111827] backdrop-blur-sm transition-all hover:border-solar/30 hover:shadow-2xl hover:shadow-solar/5">
                <CardHeader className="pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-solar/10 text-solar shadow-inner">
                    <Mail className="h-7 w-7" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold text-[#f9fafb]">{t("contact.sales")}</CardTitle>
                  <CardDescription className="mt-3 space-y-2">
                    <a href={`mailto:${staticContent.contact.sales.email}`} className="block text-lg font-medium text-solar hover:underline decoration-2 underline-offset-4">
                      {staticContent.contact.sales.email}
                    </a>
                    <a href={`tel:${staticContent.contact.sales.phone}`} className="block text-[#cbd5e0] hover:text-[#f9fafb] transition-colors font-mono">
                      {staticContent.contact.sales.phone}
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-[#1f2937] bg-[#111827] backdrop-blur-sm transition-all hover:border-solar/30">
                <CardHeader className="pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-solar/10 text-solar shadow-inner">
                    <Phone className="h-7 w-7" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold text-[#f9fafb]">{t("contact.support")}</CardTitle>
                  <CardDescription className="mt-3">
                    <a href={`tel:${staticContent.contact.support.phone}`} className="text-lg font-medium text-[#cbd5e0] hover:text-[#f9fafb] transition-colors font-mono">
                      {staticContent.contact.support.phone}
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-[#1f2937] bg-[#111827] backdrop-blur-sm transition-all hover:border-solar/30">
                <CardHeader className="pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-solar/10 text-solar shadow-inner">
                    <MapPin className="h-7 w-7" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold text-[#f9fafb]">
                    {language === "en" ? "Location" : "الموقع"}
                  </CardTitle>
                  <CardDescription className="mt-3 text-lg font-medium text-[#cbd5e0]">
                    {language === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-[#1f2937] bg-[#111827] lg:col-span-2 shadow-2xl overflow-hidden">
              <CardHeader className="bg-[#1f2937]/30 pb-8 border-b border-[#1f2937]">
                <CardTitle className="text-3xl font-black text-[#f9fafb]">
                  {language === "en" ? "Send us a Message" : "أرسل لنا رسالة"}
                </CardTitle>
                <CardDescription className="text-lg text-[#cbd5e0]">
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
