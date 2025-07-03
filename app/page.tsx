import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  FileText,
  BarChart3,
  BookOpen,
  Search,
  Zap,
  ArrowRight,
  Star,
  Globe,
  Sparkles,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI Research Assistant",
      description: "Advanced Python-powered AI that understands research methodology and provides expert guidance",
      badge: "Python Enhanced",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Literature Reviews",
      description: "Systematic literature review tools with automated search strategies and citation management",
      badge: "Smart Analysis",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Data Analysis",
      description: "Statistical analysis guidance with Python, R, and SPSS recommendations for your research data",
      badge: "Statistical Power",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Research Community",
      description: "Connect with researchers worldwide, share findings, and collaborate on groundbreaking projects",
      badge: "Social Network",
    },
    {
      icon: <FileText className="h-8 w-8 text-red-600" />,
      title: "Academic Writing",
      description: "AI-powered writing assistance for papers, grants, and proposals with publication guidance",
      badge: "Writing Support",
    },
    {
      icon: <Search className="h-8 w-8 text-teal-600" />,
      title: "Research Discovery",
      description: "Discover research gaps, trending topics, and collaboration opportunities in your field",
      badge: "Gap Analysis",
    },
  ]

  const stats = [
    { label: "Active Researchers", value: "0", icon: <Users className="h-5 w-5" /> },
    { label: "Research Papers", value: "0", icon: <FileText className="h-5 w-5" /> },
    { label: "AI Interactions", value: "0", icon: <Brain className="h-5 w-5" /> },
    { label: "Citations Managed", value: "0", icon: <BookOpen className="h-5 w-5" /> },
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Research Scientist, MIT",
      content:
        "The Python-enhanced AI provides incredibly accurate research methodology guidance. It's like having a research mentor available 24/7.",
      rating: 5,
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "Professor, Stanford University",
      content:
        "The literature review tools saved me weeks of work. The AI understands academic context better than any other platform.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "Data Scientist, Harvard",
      content:
        "Outstanding statistical analysis guidance. The Python backend provides more sophisticated recommendations than standard AI tools.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">The Research Hub</span>
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Python Enhanced
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Now with Python-Enhanced AI Backend
            </Badge>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Future of Research Collaboration
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Connect with researchers worldwide, leverage Python-powered AI for superior research guidance, and
            accelerate your academic journey with our comprehensive research platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8 py-3">
                Start Your Research Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/aethon">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                Try Aethon AI Assistant
                <Brain className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-blue-600">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Research Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for successful research, powered by advanced Python AI and designed for the modern
              researcher.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {feature.icon}
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Researchers Worldwide</h2>
            <p className="text-xl text-muted-foreground">See what leading researchers say about our platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Research?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the next generation of researchers using AI-powered tools to accelerate discovery and
                collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="px-8 py-3">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                    Explore Community
                    <Globe className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">The Research Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering researchers with AI-enhanced tools and global collaboration opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/aethon" className="hover:text-foreground">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-foreground">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/notes" className="hover:text-foreground">
                    Notes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-foreground">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Research Blog
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="hover:text-foreground">
                    Tutorials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 The Research Hub. All rights reserved. Powered by Python and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
