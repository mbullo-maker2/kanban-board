import React from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  AlertCircle, 
  Minus,
  CheckCircle,
  MessageSquare
} from 'lucide-react'
import { Task, TaskPriority } from '@/types/kanban'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
}

const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="h-3 w-3" />
    case 'medium':
      return <Clock className="h-3 w-3" />
    case 'low':
      return <Minus className="h-3 w-3" />
  }
}

const getPriorityVariant = (priority: TaskPriority): "default" | "secondary" | "destructive" => {
  switch (priority) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
      return 'secondary'
  }
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const formatTimeSpent = (minutes: number) => {
    if (minutes === 0) return '0 min'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const getProgress = () => {
    if (task.status === 'completed') return 100
    if (task.status === 'learning') return task.timeSpent > 0 ? Math.min((task.timeSpent / 240) * 100, 95) : 10
    return 0
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 400, damping: 17 }
      }}
    >
      <Card className={cn(
        "task-card cursor-pointer overflow-hidden",
        task.status === 'completed' && "opacity-75"
      )}>
        <motion.div
          initial={false}
          animate={{
            borderTopColor: task.status === 'completed' ? 'var(--chart-3)' : 
                           task.status === 'learning' ? 'var(--chart-2)' : 'var(--chart-1)',
          }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent"
        />
        <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className={cn(
            "text-sm font-medium leading-4",
            task.status === 'completed' && "line-through"
          )}>
            {task.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                Edit Task
              </DropdownMenuItem>
              {task.status !== 'learning' && (
                <DropdownMenuItem onClick={() => onStatusChange?.(task.id, 'learning')}>
                  Move to Learning
                </DropdownMenuItem>
              )}
              {task.status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusChange?.(task.id, 'completed')}>
                  Mark Complete
                </DropdownMenuItem>
              )}
              {task.status !== 'new' && (
                <DropdownMenuItem onClick={() => onStatusChange?.(task.id, 'new')}>
                  Move to New
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete?.(task.id)}
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <CardDescription className="text-xs">
              {task.description}
            </CardDescription>
          </motion.div>
        )}
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="space-y-2">
          {/* Priority Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
              {getPriorityIcon(task.priority)}
              {task.priority}
            </Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Progress Bar for Learning */}
          {task.status === 'learning' && (
            <motion.div 
              className="space-y-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Progress value={getProgress()} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-3 w-3" />
                </motion.div>
                {formatTimeSpent(task.timeSpent)}
              </div>
            </motion.div>
          )}

          {/* Time tracking for completed tasks */}
          {task.status === 'completed' && task.timeSpent > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3" />
              Total: {formatTimeSpent(task.timeSpent)}
            </div>
          )}

          {/* Notes indicator */}
          {task.notes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              Has notes
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(task.dueDate, 'MMM dd')}
            </div>
          )}
          {task.completedAt && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {format(task.completedAt, 'MMM dd')}
            </div>
          )}
          <div className="ml-auto">
            {format(task.createdAt, 'MMM dd')}
          </div>
        </div>
      </CardFooter>
    </Card>
    </motion.div>
  )
}