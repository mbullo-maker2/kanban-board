'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Trophy, Sparkles, Star, Zap, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompletionCelebrationProps {
  show: boolean
  onComplete?: () => void
  message?: string
}

const celebrationIcons = [Trophy, Sparkles, Star, Zap, Heart]
const motivationalMessages = [
  "Great job! 🎉",
  "Task completed! 🚀",
  "You're crushing it! 💪",
  "Another one done! ✨",
  "Keep it up! 🌟",
  "Fantastic work! 🎯",
  "You're on fire! 🔥",
  "Mission accomplished! ✅"
]

export function CompletionCelebration({ 
  show, 
  onComplete,
  message 
}: CompletionCelebrationProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [randomMessage] = useState(() => 
    message || motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  )
  const [IconComponent] = useState(() => 
    celebrationIcons[Math.floor(Math.random() * celebrationIcons.length)]
  )

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none z-[100]">
            <Confetti
              width={dimensions.width}
              height={dimensions.height}
              recycle={false}
              numberOfPieces={150}
              gravity={0.2}
              colors={['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6']}
            />
          </div>

          {/* Celebration Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]"
          >
            <div className="bg-card/95 backdrop-blur-lg border-2 border-primary/20 rounded-2xl p-8 shadow-2xl">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 0.8,
                    rotate: { duration: 1, ease: "easeInOut" }
                  }}
                  className="relative"
                >
                  <IconComponent className="h-16 w-16 text-primary" />
                  <motion.div
                    animate={{ scale: [0, 1.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {randomMessage}
                </motion.h2>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: Math.random() * 200 - 100,
                        y: 100,
                        opacity: 0
                      }}
                      animate={{ 
                        y: -100,
                        opacity: [0, 1, 0],
                        x: Math.random() * 200 - 100
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="absolute top-1/2 left-1/2"
                    >
                      <Sparkles className={cn(
                        "h-4 w-4",
                        i % 2 === 0 ? "text-primary" : "text-secondary"
                      )} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}