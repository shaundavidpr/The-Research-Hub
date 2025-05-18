import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText, FolderOpen, Brain, Sparkles } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg">The Research Hub</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium">
              Pricing
            </Link>
          </nav>
          <div className="ml-4 flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section className="container py-12 md:py-16">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Streamline Your Research Process
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl max-w-[800px]">
              The Research Hub provides all the tools you need to organize, analyze, and accelerate your research.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-primary" />}
              title="Smart Notes"
              description="Organize your thoughts with AI-powered suggestions and automatic categorization."
              link="/features/notes"
            />

            <FeatureCard
              icon={<FolderOpen className="h-8 w-8 text-primary" />}
              title="File Management"
              description="Store, organize, and search through all your research materials in one place."
              link="/features/files"
            />

            <FeatureCard
              icon={<Brain className="h-8 w-8 text-primary" />}
              title="Meet Aethon"
              description="Your AI research assistant that helps analyze papers and generate insights."
              link="/features/aethon"
            />

            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-primary" />}
              title="Literature Analysis"
              description="Automatically extract key findings and connections from research papers."
              link="/features/literature"
            />

            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="Citation Management"
              description="Generate and organize citations in any format with a single click."
              link="/features/citations"
            />

            <FeatureCard
              icon={<ArrowRight className="h-8 w-8 text-primary" />}
              title="Research Timeline"
              description="Plan your research journey with customizable milestones and deadlines."
              link="/features/timeline"
            />
          </div>
        </section>

        <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join Thousands of Researchers
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                From PhD candidates to seasoned professors, researchers around the world trust The Research Hub to
                organize their work and accelerate discoveries.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Meet Aethon, Your Research Assistant</h2>
              <p className="mt-4 text-muted-foreground">
                Aethon is an advanced AI assistant designed specifically for researchers. It can help you analyze
                papers, generate literature reviews, suggest research questions, and much more.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Analyze research papers and extract key findings</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Generate literature review outlines and summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Suggest research questions based on current literature</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Help organize and structure your research methodology</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/features/aethon">Learn More About Aethon</Link>
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 border">
              <div className="bg-card rounded-md p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Aethon</h3>
                    <p className="text-sm text-muted-foreground">AI Research Assistant</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      I've analyzed your recent uploads and found three key themes emerging in the literature. Would you
                      like me to generate a conceptual framework based on these findings?
                    </p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-md ml-8">
                    <p className="text-sm">Yes, please create a framework and suggest some research questions.</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      Here's a conceptual framework based on the literature. I've identified potential research gaps and
                      formulated three research questions that could drive your investigation forward.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8 bg-muted/50">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold">The Research Hub</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 The Research Hub. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
