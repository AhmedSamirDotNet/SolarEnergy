"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sun, Loader2, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n-context"

export default function LoginPage() {
  const router = useRouter()
  const { login: setAuth } = useAuth()
  const { t, language, dir } = useI18n()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await login(username, password)
      if (response.token) {
        setAuth(response.token)
        router.push("/dashboard")
      } else {
        setError(t("login.error"))
      }
    } catch (err) {
      console.log("[v0] Login error:", err)
      setError(t("login.error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4" dir={dir}>
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-solar text-solar-foreground">
            <Sun className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-card-foreground">
            {t("login.title")}
          </CardTitle>
          <CardDescription>
            {language === "en" 
              ? "Enter your credentials to access the dashboard"
              : "أدخل بيانات الاعتماد للوصول إلى لوحة التحكم"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">{t("login.username")}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t("login.username")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t("login.password")}
                  className="ltr:pr-10 rtl:pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ltr:right-3 rtl:left-3"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-solar text-solar-foreground hover:bg-solar/90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />
                  {language === "en" ? "Signing in..." : "جارٍ تسجيل الدخول..."}
                </>
              ) : (
                t("login.submit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
