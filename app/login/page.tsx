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
import { Brain, Mail, Lock, AlertCircle, Loader2 } from "lucide-react"

declare global {
  interface Window {
    google: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: false,
        })

        // Render Google Sign-In button
        window.google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
        })

        // Show account chooser
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("Google Sign-In prompt not displayed")
          }
        })
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleGoogleSignIn = async (response: any) => {
    try {
      setIsLoading(true)

      const result = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      })

      const data = await result.json()

      if (result.ok) {
        // Store user data
        localStorage.setItem("currentUser", JSON.stringify(data.user))

        if (data.isNewUser) {
          // Redirect to profile creation for new users
          router.push("/profile/create")
        } else {
          // Redirect to dashboard for existing users
          router.push("/dashboard")
        }
      } else {
        setErrors({ submit: data.error || "Google sign-in failed" })
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Basic validation
    if (!formData.email || !formData.password) {
      setErrors({ submit: "Please fill in all fields" })
      setIsLoading(false)
      return
    }

    try {
      // Simulate login (replace with actual authentication)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, accept any email/password
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.email.split("@")[0],
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("currentUser", JSON.stringify(userData))
      router.push("/dashboard")
    } catch (error) {
      setErrors({ submit: "Invalid email or password" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">The Research Hub</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your research account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access your research workspace and connect with the global research community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign-In */}
            <div className="space-y-4">
              <div id="google-signin-button" className="w-full"></div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="researcher@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Secure & Private</h3>
                <p className="text-sm text-blue-700">
                  Your research data is protected with enterprise-grade security. All data is encrypted and stored
                  securely in our Neon database.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
