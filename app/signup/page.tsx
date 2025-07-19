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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

declare global {
  interface Window {
    google: any
  }
}

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
  })
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const supabase = createClient()

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!googleClientId) {
      setError(
        "Google Client ID is not set. Please ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is configured in your environment variables.",
      )
      return
    }

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Explicitly disable FedCM
      })
      // Render button if prompt is not displayed or skipped
      window.google.accounts.id.renderButton(document.getElementById("google-signup-button"), {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signup_with",
      })
    } else {
      setError("Google Identity Services script not loaded. Please check your network or script tag.")
    }
  }, [googleClientId])

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions")
      setIsLoading(false)
      return
    }

    if (passwordStrength < 3) {
      setError("Please choose a stronger password")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
      } else if (data.user) {
        toast({
          title: "Welcome to The Research Hub!",
          description: "Your account has been created successfully. Please check your email to verify your account.",
        })
        router.push("/profile/create") // Redirect to profile creation after signup
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleCallback = async (response: any) => {
    setIsLoading(true)
    setError("")

    try {
      const { data, error: signInError } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      })

      if (signInError) {
        setError(signInError.message)
      } else if (data.session) {
        toast({
          title: "Welcome to The Research Hub!",
          description: "You've been signed in successfully.",
        })
        // Check if it's a new user or existing
        // For simplicity, we'll always redirect to dashboard for now,
        // but in a real app, you'd check if profile exists.
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")

    if (field === "password" && typeof value === "string") {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500"
    if (passwordStrength < 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 2) return "Weak"
    if (passwordStrength < 4) return "Medium"
    return "Strong"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      {/* Google Sign-In Script */}
      <script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => {
          if (typeof window !== "undefined" && window.google && googleClientId) {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleCallback,
              use_fedcm_for_prompt: false, // Explicitly disable FedCM
            })
          }
        }}
      />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">The Research Hub</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Join The Research Hub</h1>
          <p className="text-muted-foreground">Start your research journey with AI-powered tools</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Join thousands of researchers worldwide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign Up */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50"
                onClick={() => {
                  if (googleClientId) {
                    window.google.accounts.id.prompt()
                  } else {
                    setError("Google Client ID is not configured.")
                  }
                }}
                disabled={isLoading || !googleClientId}
              >
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
                Continue with Google
              </Button>
              <div id="google-signup-button" className="w-full"></div>
            </div>

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
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Password strength: {getPasswordStrengthText()}</span>
                  <div className={`w-1/2 h-2 rounded-full ${getPasswordStrengthColor()}`}></div>
                </div>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                />
                <Label htmlFor="acceptTerms" className="ml-2">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    terms and conditions
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing up...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign up
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
