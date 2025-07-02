"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { 
  Users, 
  Search, 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen,
  Star,
  Eye,
  Download,
  Plus,
  Filter
} from "lucide-react"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")

  const trendingPapers = [
    {
      id: 1,
      title: "Advances in Quantum Computing for Machine Learning Applications",
      author: "Dr. Sarah Chen",
      institution: "MIT",
      field: "Computer Science",
      likes: 234,
      comments: 45,
      views: 1200,
      downloads: 89,
      publishedAt: "2 days ago",
      abstract: "This paper explores the intersection of quantum computing and machine learning, presenting novel algorithms that leverage quantum superposition for enhanced pattern recognition...",
      tags: ["quantum-computing", "machine-learning", "algorithms"]
    },
    {
      id: 2,
      title: "Climate Change Impact on Marine Biodiversity: A 20-Year Study",
      author: "Prof. Michael Rodriguez",
      institution: "Stanford University",
      field: "Environmental Science",
      likes: 189,
      comments: 32,
      views: 890,
      downloads: 67,
      publishedAt: "1 week ago",
      abstract: "Our comprehensive 20-year longitudinal study examines the effects of rising ocean temperatures on marine ecosystems across the Pacific...",
      tags: ["climate-change", "marine-biology", "biodiversity"]
    },
    {
      id: 3,
      title: "CRISPR-Cas9 Applications in Treating Genetic Disorders",
      author: "Dr. Emily Watson",
      institution: "Harvard Medical School",
      field: "Biotechnology",
      likes: 156,
      comments: 28,
      views: 756,
      downloads: 45,
      publishedAt: "3 days ago",
      abstract: "We present breakthrough applications of CRISPR-Cas9 technology in treating previously incurable genetic disorders, with promising clinical trial results...",
      tags: ["crispr", "gene-therapy", "genetics"]
    }
  ]

  const topResearchers = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      institution: "MIT",
      field: "Computer Science",
      followers: 2340,
      papers: 45,
      citations: 12500,
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 2,
      name: "Prof. Michael Rodriguez",
      institution: "Stanford University",
      field: "Environmental Science",
      followers: 1890,
      papers: 67,
      citations: 8900,
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      institution: "Harvard Medical School",
      field: "Biotechnology",
      followers: 1567,
      papers: 34,
      citations: 7800,
      avatar: "/placeholder.svg?height=40&width=40"
    }
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Community"
        text="Connect with researchers worldwide, discover trending papers, and share your work."
        icon={<Users className="h-5 w-5 text-primary" />}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Publish Paper
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search researchers, papers..." className="w-full pl-8" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Top Researchers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topResearchers.map((researcher) => (
                <div key={researcher.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={researcher.avatar} alt={researcher.name} />
                      <AvatarFallback>{researcher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{researcher.name}</p>
                      <p className="text-xs text-muted-foreground">{researcher.institution}</p>
                      <p className="text-xs text-muted-foreground">{researcher.followers} followers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Follow</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Research Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Computer Science", "Biology", "Physics", "Chemistry", "Medicine", "Environmental Science"].map((field) => (
                  <Badge key={field} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    {field}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="feed">
                <BookOpen className="mr-2 h-4 w-4" />
                Research Feed
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="following">
                <Users className="mr-2 h-4 w-4" />
                Following
              </TabsTrigger>
            </TabsList>

            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value="feed" className="mt-0 space-y-6">
              {trendingPapers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg hover:text-primary cursor-pointer">
                          {paper.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">{paper.author}</span>
                            <span>{paper.institution}</span>
                            <Badge variant="outline">{paper.field}</Badge>
                            <span>{paper.publishedAt}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {paper.abstract}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{paper.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{paper.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{paper.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{paper.downloads}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              <div className="space-y-6">
                {trendingPapers.slice(0, 2).map((paper) => (
                  <Card key={paper.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <Badge variant="default">Trending</Badge>
                      </div>
                      <CardTitle className="text-lg hover:text-primary cursor-pointer">
                        {paper.title}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium">{paper.author}</span>
                          <span>{paper.institution}</span>
                          <Badge variant="outline">{paper.field}</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {paper.abstract}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{paper.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{paper.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{paper.views}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="following" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/60 mb-4" />
                <h3 className="text-lg font-medium">No followed researchers yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Follow researchers to see their latest publications and updates in your feed.
                </p>
                <Button className="mt-4">
                  Discover Researchers
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}