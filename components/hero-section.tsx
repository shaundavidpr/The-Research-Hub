import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 via-background to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Introducing The Research Hub
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your AI-Powered Research Companion
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Organize your research, analyze papers, and accelerate discoveries with Aethon, your personal AI
                research assistant.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Features
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-gradient-to-br from-primary/20 via-muted/20 to-muted/10 p-4 shadow-xl">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Aethon</h3>
                    <p className="text-sm text-muted-foreground">AI Research Assistant</p>
                  </div>
                </div>
                <div className="rounded-lg bg-card p-4 shadow-sm border">
                  <p className="text-sm">
                    I've identified three key research gaps in the literature you've uploaded. Would you like me to
                    suggest potential research questions based on these findings?
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-4 shadow-sm border ml-8">
                  <p className="text-sm">Yes, please generate some research questions and a brief outline.</p>
                </div>
                <div className="rounded-lg bg-card p-4 shadow-sm border">
                  <p className="text-sm">
                    Based on my analysis, here are three promising research questions and a preliminary outline for your
                    study...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
