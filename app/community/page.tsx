"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Download,
  Users,
  TrendingUp,
  Filter,
  UserPlus,
  UserCheck,
  Star,
  Calendar,
  MapPin,
} from "lucide-react"

interface Researcher {
  id: string
  name: string
  avatar: string
  title: string
  institution: string
  followers: number
  following: number
  papers: number
  citations: number
  isFollowing: boolean
  expertise: string[]
  location: string
  joinDate: string
}

interface Paper {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  abstract: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  downloads: number
  isLiked: boolean
  isBookmarked: boolean
  authorAvatars: string[]
}

const mockResearchers: Researcher[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    avatar: "/placeholder-user.jpg",
    title: "Senior Research Scientist",
    institution: "MIT AI Lab",
    followers: 2847,
    following: 156,
    papers: 47,
    citations: 3421,
    isFollowing: false,
    expertise: ["Machine Learning", "Computer Vision", "AI Ethics"],
    location: "Cambridge, MA",
    joinDate: "2019",
  },
  {
    id: "2",
    name: "Prof. Michael Rodriguez",
    avatar: "/placeholder-user.jpg",
    title: "Professor of Neuroscience",
    institution: "Stanford University",
    followers: 1923,
    following: 203,
    papers: 89,
    citations: 5672,
    isFollowing: true,
    expertise: ["Neuroscience", "Brain Imaging", "Cognitive Science"],
    location: "Stanford, CA",
    joinDate: "2017",
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    avatar: "/placeholder-user.jpg",
    title: "Research Director",
    institution: "Google DeepMind",
    followers: 4521,
    following: 89,
    papers: 34,
    citations: 2890,
    isFollowing: false,
    expertise: ["Deep Learning", "NLP", "Reinforcement Learning"],
    location: "London, UK",
    joinDate: "2020",
  },
]

const mockPapers: Paper[] = [
  {
    id: "1",
    title: "Attention Is All You Need: A Comprehensive Analysis of Transformer Architecture",
    authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez", "Dr. James Liu"],
    journal: "Nature Machine Intelligence",
    year: 2024,
    abstract:
      "This paper presents a comprehensive analysis of the Transformer architecture and its applications in various domains of artificial intelligence...",
    tags: ["Transformers", "Deep Learning", "NLP", "Attention Mechanism"],
    likes: 342,
    comments: 67,
    shares: 89,
    downloads: 1247,
    isLiked: false,
    isBookmarked: true,
    authorAvatars: ["/placeholder-user.jpg", "/placeholder-user.jpg", "/placeholder-user.jpg"],
  },
  {
    id: "2",
    title: "Ethical Considerations in AI-Driven Healthcare: A Multi-Stakeholder Perspective",
    authors: ["Dr. Emily Watson", "Prof. David Kim"],
    journal: "Journal of Medical AI",
    year: 2024,
    abstract:
      "As artificial intelligence becomes increasingly integrated into healthcare systems, it is crucial to address the ethical implications...",
    tags: ["AI Ethics", "Healthcare", "Medical AI", "Policy"],
    likes: 198,
    comments: 43,
    shares: 56,
    downloads: 892,
    isLiked: true,
    isBookmarked: false,
    authorAvatars: ["/placeholder-user.jpg", "/placeholder-user.jpg"],
  },
  {
    id: "3",
    title: "Quantum Machine Learning: Bridging Classical and Quantum Computing Paradigms",
    authors: ["Prof. Michael Rodriguez", "Dr. Anna Kowalski", "Dr. Robert Chang"],
    journal: "Quantum Science and Technology",
    year: 2024,
    abstract:
      "This work explores the intersection of quantum computing and machine learning, presenting novel algorithms that leverage quantum properties...",
    tags: ["Quantum Computing", "Machine Learning", "Quantum Algorithms", "NISQ"],
    likes: 276,
    comments: 52,
    shares: 71,
    downloads: 634,
    isLiked: false,
    isBookmarked: true,
    authorAvatars: ["/placeholder-user.jpg", "/placeholder-user.jpg", "/placeholder-user.jpg"],
  },
]

export default function CommunityPage() {
  const [researchers, setResearchers] = useState<Researcher[]>(mockResearchers)
  const [papers, setPapers] = useState<Paper[]>(mockPapers)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("feed")

  const handleFollowToggle = (researcherId: string) => {
    setResearchers((prev) =>
      prev.map((researcher) =>
        researcher.id === researcherId
          ? {
              ...researcher,
              isFollowing: !researcher.isFollowing,
              followers: researcher.isFollowing ? researcher.followers - 1 : researcher.followers + 1,
            }
          : researcher,
      ),
    )

    const researcher = researchers.find((r) => r.id === researcherId)
    if (researcher) {
      toast.success(researcher.isFollowing ? `Unfollowed ${researcher.name}` : `Now following ${researcher.name}`)
    }
  }

  const handlePaperLike = (paperId: string) => {
    setPapers((prev) =>
      prev.map((paper) =>
        paper.id === paperId
          ? {
              ...paper,
              isLiked: !paper.isLiked,
              likes: paper.isLiked ? paper.likes - 1 : paper.likes + 1,
            }
          : paper,
      ),
    )
  }

  const handlePaperBookmark = (paperId: string) => {
    setPapers((prev) =>
      prev.map((paper) => (paper.id === paperId ? { ...paper, isBookmarked: !paper.isBookmarked } : paper)),
    )

    const paper = papers.find((p) => p.id === paperId)
    if (paper) {
      toast.success(paper.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks")
    }
  }

  const filteredResearchers = researchers.filter(
    (researcher) =>
      researcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      researcher.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      researcher.expertise.some((exp) => exp.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      paper.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Research Community</h1>
        <p className="text-muted-foreground">Connect with researchers, discover papers, and build your network</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search researchers, papers, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Research Feed</TabsTrigger>
          <TabsTrigger value="researchers">Researchers</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 hover:text-blue-600 cursor-pointer">{paper.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {paper.authorAvatars.slice(0, 3).map((avatar, index) => (
                              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {paper.authors[index]
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span>{paper.authors.join(", ")}</span>
                        </div>
                        <span>•</span>
                        <span>{paper.journal}</span>
                        <span>•</span>
                        <span>{paper.year}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{paper.abstract}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePaperLike(paper.id)}
                        className={`flex items-center space-x-2 ${paper.isLiked ? "text-red-500" : ""}`}
                      >
                        <Heart className={`h-4 w-4 ${paper.isLiked ? "fill-current" : ""}`} />
                        <span>{paper.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{paper.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4" />
                        <span>{paper.shares}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>{paper.downloads}</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePaperBookmark(paper.id)}
                      className={paper.isBookmarked ? "text-blue-600" : ""}
                    >
                      <Bookmark className={`h-4 w-4 ${paper.isBookmarked ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="researchers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResearchers.map((researcher) => (
              <Card key={researcher.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={researcher.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {researcher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{researcher.name}</h3>
                      <p className="text-sm text-muted-foreground">{researcher.title}</p>
                      <p className="text-sm text-muted-foreground">{researcher.institution}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{researcher.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Since {researcher.joinDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="font-semibold">{researcher.followers.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                      <div>
                        <div className="font-semibold">{researcher.papers}</div>
                        <div className="text-xs text-muted-foreground">Papers</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {researcher.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleFollowToggle(researcher.id)}
                      variant={researcher.isFollowing ? "outline" : "default"}
                      className="w-full"
                    >
                      {researcher.isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Trending Papers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {papers.slice(0, 3).map((paper, index) => (
                      <div key={paper.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm hover:text-blue-600 cursor-pointer line-clamp-2">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {paper.likes} likes • {paper.downloads} downloads
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Top Researchers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {researchers.slice(0, 3).map((researcher, index) => (
                      <div key={researcher.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={researcher.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {researcher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{researcher.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {researcher.citations.toLocaleString()} citations
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Machine Learning",
                      "AI Ethics",
                      "Quantum Computing",
                      "Computer Vision",
                      "NLP",
                      "Deep Learning",
                    ].map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Follow researchers to see their updates</h3>
            <p className="text-muted-foreground mb-4">Stay updated with the latest research from people you follow</p>
            <Button onClick={() => setActiveTab("researchers")}>Discover Researchers</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
