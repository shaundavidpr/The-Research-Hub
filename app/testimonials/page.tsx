"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Quote,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
} from "lucide-react"

const testimonials = {
  featured: [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "Senior Research Scientist",
      institution: "MIT AI Lab",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      quote:
        "The Research Hub has completely transformed how I approach literature reviews. What used to take weeks now takes days, and the AI assistant provides insights I would have missed. It's like having a research partner who never sleeps.",
      impact: "Reduced research time by 60%",
      field: "Computer Science",
      verified: true,
      featured: true,
    },
    {
      id: 2,
      name: "Prof. Michael Rodriguez",
      title: "Professor of Neuroscience",
      institution: "Stanford University",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      quote:
        "The collaboration features are outstanding. My international research team can work seamlessly together, sharing data and insights in real-time. The platform has made global collaboration effortless.",
      impact: "Increased collaboration efficiency by 75%",
      field: "Neuroscience",
      verified: true,
      featured: true,
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      title: "Research Director",
      institution: "Google DeepMind",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      quote:
        "Aethon's AI capabilities are remarkable. It doesn't just find papers; it understands context, identifies research gaps, and suggests novel approaches. It's revolutionized how we conduct systematic reviews.",
      impact: "Discovered 40% more relevant papers",
      field: "Artificial Intelligence",
      verified: true,
      featured: true,
    },
  ],
  byCategory: {
    academic: [
      {
        name: "Dr. James Liu",
        title: "Associate Professor",
        institution: "Harvard Medical School",
        rating: 5,
        quote:
          "The citation management system is flawless. It handles multiple formats perfectly and integrates seamlessly with my writing workflow.",
        field: "Medicine",
      },
      {
        name: "Prof. Anna Kowalski",
        title: "Department Head",
        institution: "Oxford University",
        rating: 5,
        quote:
          "Our entire department now uses The Research Hub. The collaborative features have transformed how we work together on multi-investigator studies.",
        field: "Physics",
      },
      {
        name: "Dr. Robert Chang",
        title: "Principal Investigator",
        institution: "Johns Hopkins",
        rating: 5,
        quote:
          "The data analysis guidance from Aethon has been invaluable. It's like having a statistics consultant available 24/7.",
        field: "Public Health",
      },
    ],
    industry: [
      {
        name: "Lisa Thompson",
        title: "R&D Manager",
        institution: "Pfizer",
        rating: 5,
        quote:
          "The platform bridges the gap between academic research and industry applications. We've accelerated our drug discovery process significantly.",
        field: "Pharmaceuticals",
      },
      {
        name: "David Kim",
        title: "Chief Scientist",
        institution: "Tesla",
        rating: 5,
        quote:
          "The AI assistant helps us stay current with the latest research in battery technology. It's become an essential tool for our innovation pipeline.",
        field: "Technology",
      },
    ],
    students: [
      {
        name: "Maria Gonzalez",
        title: "PhD Candidate",
        institution: "UC Berkeley",
        rating: 5,
        quote:
          "As a graduate student, this platform has been a game-changer. The writing assistance and methodology guidance have improved my research quality dramatically.",
        field: "Environmental Science",
      },
      {
        name: "Alex Johnson",
        title: "Master's Student",
        institution: "Carnegie Mellon",
        rating: 5,
        quote:
          "The learning curve was minimal, and the support team is incredibly helpful. It's made my thesis research so much more manageable.",
        field: "Computer Science",
      },
    ],
  },
}

const stats = {
  satisfaction: 98,
  retention: 94,
  recommendation: 96,
  timesSaved: 65,
}

const caseStudies = [
  {
    title: "MIT AI Lab: Accelerating Machine Learning Research",
    institution: "Massachusetts Institute of Technology",
    challenge: "Managing vast amounts of literature across multiple AI subfields",
    solution: "Implemented The Research Hub for systematic literature reviews and collaboration",
    results: [
      "60% reduction in literature review time",
      "40% increase in paper discovery",
      "25% improvement in research quality scores",
    ],
    testimonial: "The platform has become indispensable to our research workflow.",
    author: "Dr. Sarah Chen, Senior Research Scientist",
  },
  {
    title: "Stanford Neuroscience: Global Collaboration Success",
    institution: "Stanford University",
    challenge: "Coordinating research across 15 international institutions",
    solution: "Used collaboration tools for real-time project management and data sharing",
    results: [
      "75% faster project completion",
      "90% reduction in communication overhead",
      "50% increase in cross-institutional publications",
    ],
    testimonial: "Our global research network has never been more connected.",
    author: "Prof. Michael Rodriguez",
  },
]

export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState("academic")
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Trusted by Researchers
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            What Researchers Say About
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              The Research Hub
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join thousands of researchers from top institutions worldwide who trust The Research Hub to accelerate their
            discoveries and enhance collaboration.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.satisfaction}%</div>
              <div className="text-sm text-white/80">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.retention}%</div>
              <div className="text-sm text-white/80">User Retention</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.recommendation}%</div>
              <div className="text-sm text-white/80">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.timesSaved}%</div>
              <div className="text-sm text-white/80">Time Saved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Featured Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Success Stories</h2>
            <p className="text-muted-foreground text-lg">
              Hear from leading researchers about their experience with our platform
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.featured.map((testimonial) => (
              <Card key={testimonial.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          {testimonial.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.institution}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                    <p className="text-muted-foreground italic pl-6">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {testimonial.impact}
                    </Badge>
                    <Badge variant="outline">{testimonial.field}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Testimonials */}
        <div className="mb-20">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
              <p className="text-xl mb-8 text-white/90">
                Watch researchers share their success stories and demonstrate key features
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90" onClick={() => setShowVideo(true)}>
                <Play className="mr-2 h-5 w-5" />
                Watch Video Testimonials
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials by Category */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Testimonials by User Type</h2>
            <p className="text-muted-foreground text-lg">
              Discover how different types of researchers benefit from our platform
            </p>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="academic">Academic Researchers</TabsTrigger>
              <TabsTrigger value="industry">Industry Professionals</TabsTrigger>
              <TabsTrigger value="students">Graduate Students</TabsTrigger>
            </TabsList>

            {Object.entries(testimonials.byCategory).map(([category, categoryTestimonials]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTestimonials.map((testimonial, index) => (
                    <Card key={index} className="shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.institution}</p>
                          <Badge variant="outline" className="mt-2">
                            {testimonial.field}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Case Studies */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Detailed Case Studies</h2>
            <p className="text-muted-foreground text-lg">
              In-depth analysis of how leading institutions use our platform
            </p>
          </div>

          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <Badge variant="secondary" className="mb-4">
                        {study.institution}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-4">{study.title}</h3>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">Challenge</h4>
                          <p className="text-muted-foreground">{study.challenge}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-blue-600 mb-2">Solution</h4>
                          <p className="text-muted-foreground">{study.solution}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-600 mb-4">Results</h4>
                      <div className="space-y-3 mb-6">
                        {study.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{result}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <Quote className="h-6 w-6 text-primary/40 mb-2" />
                        <p className="text-muted-foreground italic mb-2">"{study.testimonial}"</p>
                        <p className="text-sm font-medium">— {study.author}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Satisfaction Metrics */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">User Satisfaction Metrics</h2>
            <p className="text-muted-foreground text-lg">Real data from our user feedback and analytics</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stats.satisfaction}%</div>
                  <div className="text-sm text-muted-foreground">Overall Satisfaction</div>
                  <Progress value={stats.satisfaction} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stats.retention}%</div>
                  <div className="text-sm text-muted-foreground">User Retention</div>
                  <Progress value={stats.retention} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stats.recommendation}%</div>
                  <div className="text-sm text-muted-foreground">Would Recommend</div>
                  <Progress value={stats.recommendation} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stats.timesSaved}%</div>
                  <div className="text-sm text-muted-foreground">Time Saved</div>
                  <Progress value={stats.timesSaved} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Awards and Recognition */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-muted-foreground text-lg">Industry recognition for innovation in research technology</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Best Research Tool 2024</h3>
                <p className="text-sm text-muted-foreground">Academic Technology Awards</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Innovation Excellence</h3>
                <p className="text-sm text-muted-foreground">EdTech Innovation Summit</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Global Impact Award</h3>
                <p className="text-sm text-muted-foreground">International Research Council</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <Sparkles className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Join the Research Revolution</h2>
            <p className="text-xl mb-8 text-white/90">
              Experience why thousands of researchers trust The Research Hub to accelerate their discoveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Schedule a Demo
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
