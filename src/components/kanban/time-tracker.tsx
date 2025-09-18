'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square, Clock } from 'lucide-react'
import { useTimeTracking } from '@/contexts/time-tracking-context'
import { useSound } from '@/hooks/use-sound'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface TimeTrackerProps {
  taskId: string
  currentTimeSpent: number // in minutes
  onTimeUpdate: (minutes: number) => void
  className?: string
  compact?: boolean
}

export function TimeTracker({ 
  taskId, 
  currentTimeSpent, 
  onTimeUpdate,
  className,
  compact = false
}: TimeTrackerProps) {
  const { 
    activeTaskId, 
    elapsedTime, 
    isTracking, 
    startTracking, 
    stopTracking,
    pauseTracking,
    resumeTracking,
    getFormattedTime
  } = useTimeTracking()
  const { playSound } = useSound()

  const isActiveTask = activeTaskId === taskId
  const totalSeconds = currentTimeSpent * 60 + (isActiveTask ? elapsedTime : 0)

  const handleStart = () => {
    startTracking(taskId)
    playSound('timerStart')
  }

  const handleStop = () => {
    if (isActiveTask) {
      const totalElapsed = stopTracking()
      // Convert seconds to minutes and update
      onTimeUpdate(currentTimeSpent + Math.floor(totalElapsed / 60))
      playSound('timerStop')
    }
  }

  const handlePauseResume = () => {
    if (isTracking) {
      pauseTracking()
    } else {
      resumeTracking()
    }
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="font-mono">
            {getFormattedTime(totalSeconds)}
          </span>
        </div>
        {!isActiveTask && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleStart}
            className="h-6 w-6 p-0"
          >
            <Play className="h-3 w-3" />
          </Button>
        )}
        {isActiveTask && (
          <AnimatePresence mode="wait">
            {isTracking ? (
              <motion.div
                key="tracking"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePauseResume}
                  className="h-6 w-6 p-0"
                >
                  <Pause className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStop}
                  className="h-6 w-6 p-0"
                >
                  <Square className="h-3 w-3" />
                </Button>
                <motion.div
                  className="h-2 w-2 bg-red-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePauseResume}
                  className="h-6 w-6 p-0"
                >
                  <Play className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStop}
                  className="h-6 w-6 p-0"
                >
                  <Square className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time Tracking</span>
        </div>
        <span className="text-sm font-mono text-muted-foreground">
          {getFormattedTime(totalSeconds)}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {!isActiveTask && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStart}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Timer
          </Button>
        )}
        
        {isActiveTask && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePauseResume}
              className="flex-1"
            >
              {isTracking ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleStop}
            >
              <Square className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {isActiveTask && isTracking && (
        <motion.div
          className="flex items-center gap-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-2 w-2 bg-red-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>Timer is running...</span>
        </motion.div>
      )}
    </div>
  )
}