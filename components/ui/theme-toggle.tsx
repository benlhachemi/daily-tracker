'use client'

// ============================================
// Imports
// ============================================
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion, type Transition } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

// ============================================
// Params
// ============================================
const TRANSITION: Transition = {
  type: 'spring',
  visualDuration: 0.35,
  bounce: 0.6,
}

// ============================================
// Motion Components (outside component to prevent recreation)
// ============================================
const MotionMoon = motion.create(Moon)
const MotionSun = motion.create(Sun)

// ============================================
// Types
// ============================================
interface ThemeToggleProps extends React.ComponentProps<typeof Button> { }

// ============================================
// Main Component
// ============================================
function ThemeToggle({
  size = "icon",
  variant = "ghost",
  className,
  ...props
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <Button variant={variant} size={size} {...props}></Button>
  )

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={className}
    >
      <AnimatePresence initial={false} mode='wait'>
        {theme === 'dark' ? (
          <MotionSun
            key="sun"
            initial={{ rotate: 45 }}
            animate={{ rotate: 0 }}
            transition={TRANSITION}
          />
        ) : (
          <MotionMoon
            key="moon"
            initial={{ rotate: 90 }}
            animate={{ rotate: 0 }}
            transition={TRANSITION}
          />
        )}
      </AnimatePresence>
    </Button>
  )
}

// ============================================
// Exports
// ============================================
export {
  ThemeToggle,
  type ThemeToggleProps,
}