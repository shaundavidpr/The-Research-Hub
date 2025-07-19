"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                The Research Hub
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Your all-in-one platform for academic research, collaboration, and discovery.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                asChild
                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="px-8 py-3 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 bg-transparent"
              >
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-600">0</span>
                <span className="text-sm text-gray-500">Active Researchers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-purple-600">0</span>
                <span className="text-sm text-gray-500">Research Papers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-green-600">0</span>
                <span className="text-sm text-gray-500">Active Collaborations</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-orange-600">0</span>
                <span className="text-sm text-gray-500">Citations Generated</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/placeholder.svg?width=550&height=550"
              width="550"
              height="550"
              alt="Hero Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
