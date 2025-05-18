import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Star, MoreHorizontal, Tag } from "lucide-react"

interface NotesListProps {
  filter?: string
}

export function NotesList({ filter }: NotesListProps) {
  // This would normally fetch notes from an API or state management
  const notes = [
    {
      id: 1,
      title: "Literature Review: Machine Learning in Healthcare",
      excerpt: "Key papers and findings on the application of machine learning algorithms in healthcare diagnostics...",
      date: "May 17, 2025",
      tags: ["literature-review", "machine-learning", "healthcare"],
      isFavorite: true,
    },
    {
      id: 2,
      title: "Research Methodology Notes",
      excerpt:
        "Outline of research methodology including data collection methods, analysis approach, and validation techniques...",
      date: "May 15, 2025",
      tags: ["methodology", "research-design"],
      isFavorite: false,
    },
    {
      id: 3,
      title: "Data Analysis Results",
      excerpt:
        "Preliminary results from the data analysis showing correlations between variables and potential insights...",
      date: "May 12, 2025",
      tags: ["data-analysis", "results"],
      isFavorite: true,
    },
    {
      id: 4,
      title: "Meeting Notes: Research Supervisor",
      excerpt:
        "Discussion points from meeting with research supervisor including feedback on research direction and next steps...",
      date: "May 10, 2025",
      tags: ["meeting", "feedback"],
      isFavorite: false,
    },
  ]

  // Filter notes based on the filter prop
  const filteredNotes =
    filter === "favorites" ? notes.filter((note) => note.isFavorite) : filter === "recent" ? notes.slice(0, 2) : notes

  return (
    <div className="grid gap-4">
      {filteredNotes.map((note) => (
        <Card key={note.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {note.isFavorite ? (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                  <span className="sr-only">Favorite</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{note.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {note.date}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
