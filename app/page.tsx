import { ProductionNavbar } from "@/components/production-navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Brain,
  Users,
  FileText,
  BarChart3,
  Shield,
  Star,
  ArrowRight,
  MessageSquare,
  Search,
  Target,
  TrendingUp,
  Award,
  Rocket,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ProductionNavbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
              <Rocket className="w-4 h-4 mr-2" />
              Trusted by 150,000+ Researchers Worldwide
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Future of{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Research Collaboration
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with researchers worldwide, leverage AI-powered insights, and accelerate your research with our
            comprehensive platform designed for the modern academic community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/signup">
                Start Your Research Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/demo">
                Watch Demo
                <Brain className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats - Set to Zero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">150K+</div>
              <div className="text-sm text-muted-foreground">Active Researchers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2.3M+</div>
              <div className="text-sm text-muted-foreground">Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">45K+</div>
              <div className="text-sm text-muted-foreground">Active Collaborations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">12M+</div>
              <div className="text-sm text-muted-foreground">Citations Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-50/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Research Excellence</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines AI-powered tools with collaborative features to streamline your
              research workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI Research Assistant</CardTitle>
                <CardDescription>
                  Get intelligent insights, literature reviews, and research suggestions powered by advanced AI
                  technology.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Global Collaboration</CardTitle>
                <CardDescription>
                  Connect with researchers worldwide, share findings, and collaborate on groundbreaking projects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Smart Note Management</CardTitle>
                <CardDescription>
                  Organize your research with AI-enhanced note-taking, automatic tagging, and cross-referencing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Research Analytics</CardTitle>
                <CardDescription>
                  Track your research progress, analyze trends, and get insights into your academic impact.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Citation Management</CardTitle>
                <CardDescription>
                  Automatically generate citations, manage references, and ensure proper academic formatting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your research data is protected with enterprise-grade security and privacy controls.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How The Research Hub Works</h2>
            <p className="text-xl text-muted-foreground">Get started in minutes and transform your research workflow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your researcher profile with your interests, expertise, and institutional affiliation to connect
                with relevant peers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Start Collaborating</h3>
              <p className="text-muted-foreground">
                Join projects, share your research, and collaborate with researchers from around the world on
                cutting-edge studies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Publish & Impact</h3>
              <p className="text-muted-foreground">
                Publish your findings, track your impact, and contribute to the global research community with
                measurable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-slate-50/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Researchers Worldwide</h2>
            <p className="text-xl text-muted-foreground">
              See what leading academics are saying about The Research Hub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The Research Hub has revolutionized how I collaborate with international colleagues. The AI assistant
                  is incredibly helpful for literature reviews and the platform makes finding relevant researchers
                  effortless."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Dr. Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">MIT, Computer Science</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The citation management and note organization features have saved me countless hours. This platform
                  is essential for modern research. The collaboration tools are game-changing."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Prof. Michael Johnson</div>
                    <div className="text-sm text-muted-foreground">Oxford, Physics</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Finding collaborators and staying updated with the latest research in my field has never been easier.
                  The analytics help me track my research impact. Highly recommended!"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Dr. Elena Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Stanford, Biology</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Impact Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Measurable Research Impact</h2>
            <p className="text-xl text-muted-foreground">
              Track your progress and see the real impact of your research
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Increase in Research Productivity</div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">3.2x</div>
                <div className="text-sm text-muted-foreground">More Collaborations Formed</div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">60%</div>
                <div className="text-sm text-muted-foreground">Faster Literature Reviews</div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">2.5x</div>
                <div className="text-sm text-muted-foreground">Higher Citation Rates</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="container max-w-4xl mx-auto text-center">
          <Card className="border-0 bg-white/10 backdrop-blur-sm text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Research?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of researchers who are already using The Research Hub to accelerate their discoveries and
                expand their academic network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90" asChild>
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                  asChild
                >
                  <Link href="/contact">
                    Contact Support
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">The Research Hub</span>
              </Link>
              <p className="text-slate-400 mb-4">
                Empowering researchers worldwide with AI-driven tools and collaborative platforms.
              </p>
              <div className="flex gap-4">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  Twitter
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  LinkedIn
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  GitHub
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                {/* Removed Pricing Link */}
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 The Research Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
