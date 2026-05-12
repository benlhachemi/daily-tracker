'use client'

import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "./ui/card";
import { useEffect, useRef, useState } from "react";
import NumberFlow from '@number-flow/react'
import Confetti from 'react-confetti'
import { Input } from "./ui/input";
import { useHotkeys } from 'react-hotkeys-hook'
import { Habit, HABIT_COLOR_BACKGROUNDS } from "@/db/schemas/habit.schema";
import { useIsMobile } from "@/hooks/use-mobile";

interface HabitCardProps {
  className?: string;
  /** The persisted value for the selected date */
  done: number;
  habit: Habit;
  /** Called whenever the user commits a new value (+ / - / manual input) */
  onCommit?: (value: number) => void;
  /** Custom animation classes to override default animations */
  animationClassName?: string;
}

export function HabitCard({
  className,
  done,
  habit,
  onCommit,
  animationClassName,
}: HabitCardProps) {
  const mappedColor = HABIT_COLOR_BACKGROUNDS[habit.color]
  const [currentNumber, setCurrentNumber] = useState<number>(done)
  const [showInput, setShowInput] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<number | null>(null)
  const isMobile = useIsMobile()

  const inputRef = useRef<HTMLInputElement>(null)

  // Sync when the selected date changes (done prop changes from outside)
  useEffect(() => {
    setCurrentNumber(done)
  }, [done])

  useHotkeys('esc', () => setShowInput(false), { enableOnFormTags: true })
  useHotkeys('enter', () => {
    if (inputValue !== null) {
      commitValue(inputValue)
    }
    setShowInput(false)
  }, { enableOnFormTags: true })

  // Click outside handler
  useEffect(() => {
    if (!showInput) return
    const handleMouseDown = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowInput(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [showInput])

  const getStepValue = (): number => {
    if (habit.goal > 10) return Number((habit.goal / 10).toFixed(0))
    return 1
  }

  function commitValue(raw: number) {
    const clamped = Math.min(Math.max(raw, 0), habit.goal)
    setCurrentNumber(clamped)
    onCommit?.(clamped)
  }

  const handlePlus = () => commitValue(currentNumber + getStepValue())
  const handleMinus = () => commitValue(currentNumber - getStepValue())

  return (
    <Card className={cn("w-full will-change-transform cursor-pointer select-none relative py-root-md!", animationClassName || "animate-in fade-in blur-in-xs fill-mode-backwards slide-in-from-bottom-10 duration-default ease-2000", className)}>
      <CardContent className="flex items-center justify-between z-10 px-root-md!">
        <div className="flex flex-row gap-root-sm md:gap-root-md items-center flex-wrap">
          {/* Icon */}
          <div className={cn("rounded-2xl size-12 md:size-16 flex items-center justify-center text-xl md:text-3xl", mappedColor)} data-icon>{habit.emoji}</div>

          {/* Name */}
          <h3 className="text-base md:text-lg font-medium md:font-semibold capitalize">{habit.name}</h3>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-root-lg">
          <Button
            size='icon-xs'
            variant='outline'
            onClick={handleMinus}
            disabled={currentNumber === 0}
          >
            <Minus />
          </Button>

          <div className="flex flex-col items-center justify-center w-12 md:w-20" onDoubleClick={() => setShowInput(true)}>
            {showInput ? (
              <Input
                autoFocus
                max={habit.goal}
                min={0}
                ref={inputRef}
                defaultValue={currentNumber}
                type="number"
                onChange={e => setInputValue(Number(e.target.value))}
              />
            ) : (
              <div className="text-lg md:text-2xl font-bold">
                <NumberFlow
                  value={currentNumber}
                  className="will-change-transform"
                  transformTiming={{ duration: 750, easing: 'ease-out' }}
                />
              </div>
            )}

            <div className="flex items-center gap-root-xs">
              <span className="text-xs md:text-sm text-muted-foreground tracking-tight font-medium"> /{habit.goal}</span>
              <div className="text-xs md:text-sm text-muted-foreground tracking-tight font-medium">{habit.unit}</div>
            </div>
          </div>

          <Button
            size='icon-xs'
            variant='outline'
            onClick={handlePlus}
            disabled={currentNumber >= habit.goal}
          >
            <Plus />
          </Button>
        </div>

        {/* Confetti */}
        {currentNumber >= habit.goal && (
          <Confetti width={1400} height={200} />
        )}
      </CardContent>

      {/* Progress Background */}
      <div
        className={cn("absolute top-0 left-0 h-full pointer-events-none z-0 duration-default transition-all ease-default will-change-transform", mappedColor)}
        style={{ width: isMobile ? `${(currentNumber / habit.goal) * 100}%` : `calc(${(currentNumber / habit.goal) * 100}% - 20px)` }}
      >
        <div className="relative w-full h-full hidden sm:block">
          <svg className="absolute right-2 h-full top-0 w-fit translate-x-full" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="visual" viewBox="0 0 261 600" version="1.1">
            <path d="M252 0L239.7 20C227.3 40 202.7 80 206.7 120C210.7 160 243.3 200 255 240C266.7 280 257.3 320 240.5 360C223.7 400 199.3 440 187.2 480C175 520 175 560 175 580V600H0V580C0 560 0 520 0 480C0 440 0 400 0 360C0 320 0 280 0 240C0 200 0 160 0 120C0 80 0 40 0 20V0H252Z" className={mappedColor} />
          </svg>
        </div>
      </div>
    </Card>
  )
}