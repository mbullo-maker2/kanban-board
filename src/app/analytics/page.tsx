'use client'

import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { STORAGE_KEY, deserializeTasks } from '@/lib/storage'
import { Task } from '@/types/kanban'
import { mockTasks } from '@/lib/mock-data'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme-context'

export default function AnalyticsPage() {
  const [storedTasks] = useLocalStorage<Task[]>(
    STORAGE_KEY,
    mockTasks,
    {
      deserializer: deserializeTasks,
    }
  )
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Board
            </Button>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Theme: {theme}
            </span>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-7xl">
        <AnalyticsDashboard tasks={storedTasks} />
      </main>
    </div>
  )
}