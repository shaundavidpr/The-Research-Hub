"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Target,
  Users,
  FileText,
  Edit,
  Trash2
} from "lucide-react"
import { useTimeline } from '@/hooks/use-timeline'
import { Timeline } from '@/lib/database'

interface ResearchTimelineProps {
  projectId?: string
}

export function ResearchTimeline({ projectId }: ResearchTimelineProps) {
  const { timelines, loading, createTimelineItem, getUpcomingDeadlines, getOverdueItems } = useTimeline('demo-user', { project_id: projectId })
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'upcoming' | 'overdue'>('all')
  const [newItem, setNewItem] = useState<Partial<Timeline>>({
    title: '',
    description: '',
    type: 'milestone',
    date: '',
    priority: 'medium',
    completed: false
  })

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.date) return

    try {
      await createTimelineItem({
        title: newItem.title,
        description: newItem.description || '',
        type: newItem.type as 'milestone' | 'deadline' | 'meeting' | 'task',
        date: newItem.date,
        priority: newItem.priority as 'low' | 'medium' | 'high',
        completed: false,
        project_id: projectId
      })

      setNewItem({
        title: '',
        description: '',
        type: 'milestone',
        date: '',
        priority: 'medium',
        completed: false
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add timeline item:', error)
    }
  }

  const getDisplayItems = () => {
    switch (viewMode) {
      case 'upcoming':
        return getUpcomingDeadlines()
      case 'overdue':
        return getOverdueItems()
      default:
        return timelines
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Target className="h-4 w-4" />
      case 'deadline':
        return <AlertCircle className="h-4 w-4" />
      case 'meeting':
        return <Users className="h-4 w-4" />
      case 'task':
        return <FileText className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 0) return `In ${diffDays} days`
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`

    return date.toLocaleDateString()
  }

  const displayItems = getDisplayItems()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('all')}
          >
            All ({timelines.length})
          </Button>
          <Button
            variant={viewMode === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('upcoming')}
          >
            Upcoming ({getUpcomingDeadlines().length})
          </Button>
          <Button
            variant={viewMode === 'overdue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overdue')}
          >
            Overdue ({getOverdueItems().length})
          </Button>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Timeline Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select 
                  value={newItem.type} 
                  onValueChange={(value) => setNewItem({...newItem, type: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newItem.priority} 
                  onValueChange={(value) => setNewItem({...newItem, priority: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                placeholder="Enter item title..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="datetime-local"
                value={newItem.date}
                onChange={(e) => setNewItem({...newItem, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Enter description (optional)..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Items */}
      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <Card key={item.id} className={`${item.completed ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox 
                    checked={item.completed}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(item.type)}
                      <h3 className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                        {item.title}
                      </h3>
                      <Badge variant={getPriorityColor(item.priority) as any} className="text-xs">
                        {item.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(item.date)}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">
            {viewMode === 'upcoming' ? 'No upcoming items' : 
             viewMode === 'overdue' ? 'No overdue items' : 
             'No timeline items yet'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {viewMode === 'all' ? 'Add your first timeline item to get started' : 
             'Great! You\'re all caught up.'}
          </p>
        </div>
      )}
    </div>
  )
}
