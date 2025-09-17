import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, X } from 'lucide-react'
import { Task, TaskPriority, TaskStatus } from '@/types/kanban'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['new', 'learning', 'completed']),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  open: boolean
  onClose: () => void
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'timeSpent' | 'completedAt'>) => void
  task?: Task | null
  mode: 'create' | 'edit'
}

export function TaskForm({ open, onClose, onSave, task, mode }: TaskFormProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'new',
      dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      tags: task?.tags?.join(', ') || '',
      notes: task?.notes || '',
    },
  })

  React.useEffect(() => {
    if (task && mode === 'edit') {
      form.reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
        tags: task.tags.join(', '),
        notes: task.notes || '',
      })
    } else if (mode === 'create') {
      form.reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'new',
        dueDate: '',
        tags: '',
        notes: '',
      })
    }
  }, [task, mode, form])

  const onSubmit = (data: TaskFormData) => {
    const tags = data.tags 
      ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : []
    
    const taskData = {
      title: data.title,
      description: data.description,
      priority: data.priority as TaskPriority,
      status: data.status as TaskStatus,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      tags,
      notes: data.notes || undefined,
    }
    
    onSave(taskData)
    onClose()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new task to your kanban board.' 
              : 'Make changes to your task here.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              {...form.register('title')}
              className={cn(
                form.formState.errors.title && "border-destructive"
              )}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              className="min-h-[80px]"
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...form.register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...form.register('status')}
              >
                <option value="new">New</option>
                <option value="learning">Learning</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              {...form.register('dueDate')}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="react, typescript, learning (comma separated)"
              {...form.register('tags')}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>

          {/* Notes - only show in edit mode for learning/completed tasks */}
          {mode === 'edit' && task && ['learning', 'completed'].includes(task.status) && (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add your notes here..."
                className="min-h-[80px]"
                {...form.register('notes')}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
            >
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}