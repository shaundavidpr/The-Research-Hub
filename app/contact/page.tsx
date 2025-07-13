"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, Headphones, Globe, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          type: "general",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions about The Research Hub? We're here to help you accelerate your research journey.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">support@researchhub.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">
                      123 Research Ave
                      <br />
                      Innovation District
                      <br />
                      San Francisco, CA 94105
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <div className="font-medium">Business Hours</div>
                    <div className="text-sm text-muted-foreground">
                      Mon - Fri: 9:00 AM - 6:00 PM PST
                      <br />
                      Weekend: Emergency support only
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Support Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 Email Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Live Chat (Business Hours)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Video Call Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Community Forum</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="/support">
                    <Headphones className="h-4 w-4 mr-2" />
                    Visit Support Center
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Join Our Community</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with researchers worldwide and get instant help from our community.
                  </p>
                  <Button size="sm" asChild>
                    <a href="/community">
                      <Globe className="h-4 w-4 mr-2" />
                      Join Community
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">How do I get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply sign up for a free account, complete your researcher profile, and start exploring our
                  AI-powered tools and global research community.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Is my research data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we use enterprise-grade security with end-to-end encryption, secure cloud storage, and comply
                  with international data protection standards.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Can I collaborate with other researchers?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our platform is designed for collaboration. You can share projects, co-author papers, and connect with
                  researchers worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">What pricing plans are available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer free accounts for individual researchers, plus premium plans for teams and institutions.
                  Check our pricing page for detailed information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
