import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-400/10 to-yellow-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                The Research Hub: AI-Powered Research Platform
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl mx-auto lg:mx-0">
                Revolutionize your research workflow with intelligent tools for discovery, collaboration, and
                publication.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-950 disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="rounded-lg bg-white/80 p-4 text-center shadow-md backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-600">0</div>
                <p className="text-sm text-gray-500">Active Researchers</p>
              </div>
              <div className="rounded-lg bg-white/80 p-4 text-center shadow-md backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <p className="text-sm text-gray-500">Research Papers</p>
              </div>
              <div className="rounded-lg bg-white/80 p-4 text-center shadow-md backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-600">0</div>
                <p className="text-sm text-gray-500">Active Collaborations</p>
              </div>
              <div className="rounded-lg bg-white/80 p-4 text-center shadow-md backdrop-blur-sm">
                <div className="text-3xl font-bold text-orange-600">0</div>
                <p className="text-sm text-gray-500">Citations Generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
