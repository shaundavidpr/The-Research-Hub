"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Quote, Users, Award, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Professor of Computer Science",
    institution: "MIT",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "The Research Hub has completely transformed how I approach literature reviews. What used to take weeks now takes days, and the AI insights have led to breakthrough discoveries in my field.",
    category: "AI Research",
    verified: true,
  },
  {
    id: 2,
    name: "Prof. Michael Rodriguez",
    title: "Head of Neuroscience Department",
    institution: "Stanford University",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "The collaboration features are outstanding. I've connected with researchers from 15 countries and co-authored 3 papers through connections made on this platform.",
    category: "Neuroscience",
    verified: true,
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    title: "Research Director",
    institution: "Google DeepMind",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "The citation management system is a game-changer. It's saved our team hundreds of hours and eliminated citation errors completely.",
    category: "Industry Research",
    verified: true,
  },
  {
    id: 4,
    name: "Dr. James Liu",
    title: "Associate Professor",
    institution: "University of Cambridge",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "As someone who works across multiple disciplines, the cross-referencing and semantic search capabilities have been invaluable for discovering unexpected connections.",
    category: "Interdisciplinary",
    verified: true,
  },
  {
    id: 5,
    name: "Prof. Maria Gonzalez",
    title: "Director of Research",
    institution: "Barcelona Institute of Science",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "The platform's analytics helped me identify emerging trends in my field 6 months before they became mainstream. It's like having a crystal ball for research.",
    category: "Life Sciences",
    verified: true,
  },
  {
    id: 6,
    name: "Dr. Ahmed Hassan",
    title: "Senior Research Scientist",
    institution: "CERN",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "Managing our large-scale physics collaboration has never been easier. The project management tools keep our 200+ researcher team perfectly coordinated.",
    category: "Physics",
    verified: true,
  },
  {
    id: 7,
    name: "Dr. Lisa Park",
    title: "Principal Investigator",
    institution: "Johns Hopkins University",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "The AI research assistant has become my most trusted collaborator. It's helped me identify research gaps that led to two major grant awards.",
    category: "Medical Research",
    verified: true,
  },
  {
    id: 8,
    name: "Prof. David Kim",
    title: "Chair of Engineering",
    institution: "Seoul National University",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "The global reach of this platform is incredible. I've found collaborators and funding opportunities I never would have discovered otherwise.",
    category: "Engineering",
    verified: true,
  },
  {
    id: 9,
    name: "Dr. Anna Kowalski",
    title: "Research Fellow",
    institution: "Max Planck Institute",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote:
      "The note-taking system with AI-powered organization has revolutionized how I process and synthesize information from hundreds of papers.",
    category: "Quantum Physics",
    verified: true,
  },
]

const stats = [
  { label: "Researchers Worldwide", value: "50,000+", icon: Users },
  { label: "Papers Published", value: "25,000+", icon: Award },
  { label: "Citations Generated", value: "1M+", icon: TrendingUp },
  { label: "Average Rating", value: "4.9/5", icon: Star },
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trusted by Leading
            <br />
            <span className="text-yellow-300">Researchers Worldwide</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            See what top researchers, professors, and institutions are saying about The Research Hub and how it's
            transforming their research workflows.
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
              4.9/5 Average Rating from 10,000+ Reviews
            </Badge>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Quote className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-6">
                  "The Research Hub has fundamentally changed how we approach collaborative research. It's not just a
                  tool—it's become the backbone of our entire research ecosystem."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-lg">Dr. Sarah Chen</div>
                    <div className="text-muted-foreground">Professor of Computer Science, MIT</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Researchers Are Saying</h2>
            <p className="text-muted-foreground text-lg">
              Real feedback from researchers across different fields and institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-muted-foreground mb-6 line-clamp-4">"{testimonial.quote}"</blockquote>

                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {testimonial.name}
                        {testimonial.verified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.institution}</div>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {testimonial.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Testimonials Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Testimonials</h2>
            <p className="text-muted-foreground text-lg">Hear directly from our research community</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Button size="lg" className="rounded-full">
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Button>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Dr. Michael Rodriguez - Stanford University</h3>
                <p className="text-sm text-muted-foreground">
                  "How The Research Hub transformed our neuroscience research collaboration"
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                <Button size="lg" className="rounded-full">
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Button>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Prof. Maria Gonzalez - Barcelona Institute</h3>
                <p className="text-sm text-muted-foreground">
                  "Discovering research trends before they become mainstream"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Case Studies */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground text-lg">Real research breakthroughs enabled by our platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <Badge className="mb-4">Case Study</Badge>
                <h3 className="text-xl font-bold mb-4">MIT AI Lab: 300% Faster Literature Reviews</h3>
                <p className="text-muted-foreground mb-6">
                  Dr. Sarah Chen's team reduced literature review time from 6 weeks to 2 weeks using our AI research
                  assistant, leading to faster hypothesis generation and 2 additional publications per year.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">300%</div>
                    <div className="text-muted-foreground">Faster Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">2x</div>
                    <div className="text-muted-foreground">More Publications</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">$2M</div>
                    <div className="text-muted-foreground">Grant Funding</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <Badge className="mb-4">Case Study</Badge>
                <h3 className="text-xl font-bold mb-4">CERN: Managing 200+ Researcher Collaboration</h3>
                <p className="text-muted-foreground mb-6">
                  Dr. Ahmed Hassan's physics team streamlined their large-scale collaboration, reducing coordination
                  overhead by 60% and accelerating discovery timelines by 4 months.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">200+</div>
                    <div className="text-muted-foreground">Researchers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">60%</div>
                    <div className="text-muted-foreground">Less Overhead</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">4 Months</div>
                    <div className="text-muted-foreground">Faster Discovery</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Join Thousands of Satisfied Researchers</h2>
              <p className="text-xl mb-8 text-blue-100">
                Start your free trial today and see why researchers worldwide trust The Research Hub for their most
                important work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
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
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
