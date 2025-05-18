import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MoreHorizontal, Users } from "lucide-react"
import Link from "next/link"

export function ProjectsGrid() {
  // This would normally fetch projects from an API
  const projects = [
    {
      id: "project-1",
      title: "Machine Learning in Healthcare",
      description: "Investigating applications of ML algorithms for early disease detection",
      progress: 65,
      deadline: "June 15, 2025",
      members: 3,
      status: "active",
    },
    {
      id: "project-2",
      title: "Climate Data Analysis",
      description: "Analyzing historical climate data to identify patterns and trends",
      progress: 40,
      deadline: "July 30, 2025",
      members: 2,
      status: "active",
    },
    {
      id: "project-3",
      title: "Quantum Computing Research",
      description: "Exploring quantum algorithms for optimization problems",
      progress: 25,
      deadline: "August 22, 2025",
      members: 4,
      status: "active",
    },
    {
      id: "project-4",
      title: "Sustainable Energy Study",
      description: "Comparative analysis of renewable energy technologies",
      progress: 80,
      deadline: "May 28, 2025",
      members: 2,
      status: "active",
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                <Link href={`/projects/${project.id}`} className="hover:underline">
                  {project.title}
                </Link>
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {project.status}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Due {project.deadline}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="mt-auto pt-4 flex justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(project.members, 3) }).map((_, i) => (
                  <Avatar key={i} className="h-7 w-7 border-2 border-background">
                    <AvatarImage src={`/placeholder.svg?height=28&width=28&text=${i + 1}`} alt={`Member ${i + 1}`} />
                    <AvatarFallback className="text-xs">{String.fromCharCode(65 + i)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.members > 3 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{project.members - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                <Users className="inline h-3 w-3 mr-1" />
                {project.members}
              </span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${project.id}`}>View Project</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
