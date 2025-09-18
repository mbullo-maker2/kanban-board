import React from 'react'
import { Search, Plus, Settings, User, BarChart2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ThemeSelector } from '@/components/ui/theme-selector'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/theme-context'

interface FloatingNavbarProps {
  onAddTask?: () => void
  onSearch?: (query: string) => void
  searchQuery?: string
  className?: string
  onExportImport?: () => void
  onSoundSettings?: () => void
}

export function FloatingNavbar({ 
  onAddTask, 
  onSearch, 
  searchQuery, 
  className,
  onExportImport,
  onSoundSettings 
}: FloatingNavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const { theme } = useTheme()

  return (
    <>
      {/* Floating Navigation Bar */}
      <div className={cn(
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
        "hidden md:flex bg-card/95 backdrop-blur-sm border rounded-full shadow-lg",
        "px-6 py-3 items-center gap-4",
        "transition-all duration-200 hover:shadow-xl",
        className
      )}>
        {/* Search Button */}
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" data-search-trigger>
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Tasks</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks, descriptions, tags..."
                value={searchQuery || ''}
                onChange={(e) => onSearch?.(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Task Button - Primary CTA */}
        <Button 
          onClick={onAddTask}
          className="rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>

        {/* Analytics Link */}
        <Link href="/analytics">
          <Button variant="ghost" size="icon" className="rounded-full">
            <BarChart2 className="h-4 w-4" />
          </Button>
        </Link>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuItem asChild>
              <Link href="/analytics" className="cursor-pointer">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportImport}>
              Export/Import
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSoundSettings}>Sound Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full p-0 h-9 w-9">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.png" alt="User" />
                <AvatarFallback className="text-xs">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-card/95 backdrop-blur-sm border rounded-2xl shadow-lg px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Search */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-sm">
                <DialogHeader>
                  <DialogTitle>Search Tasks</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery || ''}
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="pl-9"
                    autoFocus
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Task - Primary CTA */}
            <Button 
              onClick={onAddTask}
              className="rounded-full px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuItem asChild>
                  <Link href="/analytics" className="cursor-pointer">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSoundSettings}>Sound Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={onExportImport}>Export/Import</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

    </>
  )
}