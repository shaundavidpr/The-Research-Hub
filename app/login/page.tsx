"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Brain, Eye, EyeOff, ArrowRight, Users, BookOpen, Zap, Loader2 } from "lucide-react"

declare global {
  interface Window {
    google: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    { icon: Brain, text: "AI-Powered Research Assistant", color: "text-blue-600" },
    { icon: Users, text: "Global Research Network", color: "text-purple-600" },
    { icon: BookOpen, text: "Smart Citation Management", color: "text-green-600" },
    { icon: Zap, text: "Instant Collaboration Tools", color: "text-orange-600" },
  ]

  const stats = [
    { number: "50,000+", label: "Active Researchers" },
    { number: "2.5M+", label: "Research Papers" },
    { number: "150+", label: "Universities" },
    { number: "40+", label: "Countries" },
  ]

  useEffect(() => {
    setMounted(true)

    // Rotate features every 3 seconds
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load Google Sign-In
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // Explicitly disable FedCM
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Welcome back! 🎉",
          description: "You've been signed in successfully.",
        })

        // Smooth transition
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setError(data.error || "Failed to sign in")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setGoogleLoading(true)
    setError("")

    if (window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGoogleLoading(false)
          setError("Google Sign-In was cancelled or failed to load")
        }
      })
    } else {
      setGoogleLoading(false)
      setError("Google Sign-In is not available")
    }
  }

  const handleGoogleCallback = async (response: any) => {
    setGoogleLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: data.isNewUser ? "Welcome to The Research Hub! 🚀" : "Welcome back! 👋",
          description: data.message || "You've been signed in successfully.",
        })

        setTimeout(() => {
          if (data.isNewUser) {
            router.push("/profile/create")
          } else {
            router.push("/dashboard")
          }
        }, 1000)
      } else {
        setError(data.error || "Google sign-in failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features Showcase */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-blue-600/5 to-purple-600/5 backdrop-blur-sm">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  The Research Hub
                </span>
              </Link>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome back to your research journey</h1>
              <p className="text-lg text-gray-600 mb-8">
                Continue exploring, collaborating, and discovering with the world's most advanced research platform.
              </p>
            </div>

            {/* Animated Feature Showcase */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                      currentFeature === index
                        ? "bg-white shadow-lg scale-105 border border-blue-100"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        currentFeature === index ? "bg-gradient-to-br from-blue-500 to-purple-500" : "bg-gray-100"
                      } transition-all duration-500`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          currentFeature === index ? "text-white" : feature.color
                        } transition-all duration-500`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.text}</h3>
                      <div
                        className={`h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
                          currentFeature === index ? "w-full" : "w-0"
                        }`}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">The Research Hub</span>
              </Link>
            </div>

            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your research workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || isLoading}
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.29c0-.75-.06-1.48-.19-2.21H12v4.59h4.73c-.21 1.16-1.01 2.06-2.29 2.25V19h4.59c1.58 0 2.83-.59 3.72-1.59l3.02 3.02C21.44 23.35 24 21.21 24 18.24z M12 23.65c2.93 0 5.26-1.32 6.59-3.51l-3.02-3.02c-.97.33-2.01.51-3.06.51-3.69 0-6.69-2.49-6.69-5.64s3.01-5.64 6.69-5.64c1.05 0 1.99-.18 2.84-.51l3.02 3.02C17.32 12.33 15 13.65 12 13.65c-2.67 0-4.92-1.32-6.59-3.51L5.41 9.1C6.19 11.1 8.13 12.44 10.82 12.44c1.69 0 3.14-.55 4.27-1.41l2.13 2.13C14.5 16.91 13.4 19 12 19z M12 5.35c-2.93 0-5.26 1.32-6.59 3.51L16.59 19c1.58 0 2.83-.59 3.72-1.59l3.02 3.02C21.44 23.35 24 21.21 24 18.24z M12 23.65c2.93 0 5.26-1.32 6.59-3.51l-3.02-3.02c-.97.33-2.01.51-3.06.51-3.69 0-6.69-2.49-6.69-5.64s3.01-5.64 6.69-5.64c1.05 0 1.99-.18 2.84-.51l3.02 3.02C17.32 12.33 15 13.65 12 13.65c-2.67 0-4.92-1.32-6.59-3.51L5.41 9.1C6.19 11.1 8.13 12.44 10.82 12.44c1.69 0 3.14-.55 4.27-1.41l2.13 2.13C14.5 16.91 13.4 19 12 19z M12 5.35c-2.93 0-5.26 1.32-6.59 3.51L16.59 19c1.58 0 2.83-.59 3.72-1.59l3.02 3.02C21.44 23.35 24 21.21 24 18.24z"
                      />
                    </svg>
                  )}
                  Google Sign-In
                </Button>

                {/* Email Input */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showPassword ? "Hide" : "Show"} Password
                  </Button>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <Label htmlFor="rememberMe">Remember me</Label>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5 mr-2" />
                  )}
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
