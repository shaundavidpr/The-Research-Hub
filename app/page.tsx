"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard instead of showing landing page
    router.push("/dashboard")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Loading Research Hub...</h1>
        <p className="text-muted-foreground mt-2">Redirecting to your dashboard</p>
      </div>
    </div>
  )
}