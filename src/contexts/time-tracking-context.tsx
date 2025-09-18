'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface TimeTrackingContextType {
  activeTaskId: string | null
  elapsedTime: number // in seconds
  isTracking: boolean
  startTracking: (taskId: string) => void
  stopTracking: () => number // returns total elapsed time
  pauseTracking: () => void
  resumeTracking: () => void
  getFormattedTime: (seconds: number) => string
}

const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined)

export function TimeTrackingProvider({ children }: { children: React.ReactNode }) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Update elapsed time every second when tracking
  useEffect(() => {
    if (!isTracking || !startTime) return

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const startTracking = useCallback((taskId: string) => {
    // Stop current tracking if any
    if (activeTaskId && activeTaskId !== taskId) {
      stopTracking()
    }

    setActiveTaskId(taskId)
    setElapsedTime(0)
    setStartTime(Date.now())
    setIsTracking(true)
  }, [activeTaskId])

  const stopTracking = useCallback(() => {
    const totalTime = elapsedTime
    setActiveTaskId(null)
    setElapsedTime(0)
    setStartTime(null)
    setIsTracking(false)
    return totalTime
  }, [elapsedTime])

  const pauseTracking = useCallback(() => {
    if (!isTracking) return
    setIsTracking(false)
    // Save the elapsed time up to this point
    if (startTime) {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }
  }, [isTracking, startTime])

  const resumeTracking = useCallback(() => {
    if (!activeTaskId || isTracking) return
    // Adjust start time to account for elapsed time
    setStartTime(Date.now() - (elapsedTime * 1000))
    setIsTracking(true)
  }, [activeTaskId, isTracking, elapsedTime])

  const getFormattedTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }, [])

  const value: TimeTrackingContextType = {
    activeTaskId,
    elapsedTime,
    isTracking,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    getFormattedTime,
  }

  return (
    <TimeTrackingContext.Provider value={value}>
      {children}
    </TimeTrackingContext.Provider>
  )
}

export function useTimeTracking() {
  const context = useContext(TimeTrackingContext)
  if (context === undefined) {
    throw new Error('useTimeTracking must be used within a TimeTrackingProvider')
  }
  return context
}