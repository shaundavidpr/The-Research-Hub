"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  BookOpen,
  Zap,
  CheckCircle,
  Globe,
  Shield,
  Loader2,
} from "lucide-react"

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
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-blue-600" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-blue-600" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    disabled={isLoading || googleLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>Global Network</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Trusted by 50k+</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
