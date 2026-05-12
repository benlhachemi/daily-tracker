'use client'

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import coffeeAnimation from '@/assets/hot-beverage.json'
import trophyAnimation from '@/assets/trophy.json'
import clapAnimation from '@/assets/clap.json'
import birdAnimation from '@/assets/bird.json'
import canoeAnimation from '@/assets/canoe.json'
import gemAnimation from '@/assets/gem-stone.json'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile";

const chartData = [
  { browser: "safari", visitors: 50, fill: "var(--primary)" },
]
const chartConfig = {
  visitors: { label: "Visitors" },
  safari: { label: "Safari", color: "var(--chart-2)" },
} satisfies ChartConfig

interface DailyProgressBannerProps {
  /** Sum of all logged values today across active habits */
  done: number;
  /** Sum of all active habit goals */
  total: number;
  /** Number of habits that have hit their goal today */
  habitsDone: number;
  /** Total number of active habits */
  habitsTotal: number;
}

function getMessage(percentage: number): string {
  if (percentage >= 100) return 'Amazing work!'
  if (percentage >= 80) return 'Almost there!'
  if (percentage >= 60) return 'Keep going!'
  if (percentage >= 40) return 'Great progress!'
  if (percentage >= 20) return 'Nice start!'
  return "Let's get started!"
}

function getAnimation(percentage: number): unknown {
  if (percentage >= 100) return trophyAnimation
  if (percentage >= 80) return canoeAnimation
  if (percentage >= 60) return clapAnimation
  if (percentage >= 40) return gemAnimation
  if (percentage >= 20) return birdAnimation
  return coffeeAnimation
}

export function DailyProgressBanner({ total, done, habitsDone, habitsTotal }: DailyProgressBannerProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isMobile = useIsMobile()

  useEffect(() => {
    lottieRef.current?.setSpeed(0.7)
  }, []);

  const percentage = total > 0 ? Math.min((done / total) * 100, 100) : 0
  const displayPct = Math.round(percentage)
  const endAngle = 360 * (percentage / 100)

  return (
    <Card className="h-fit px-root-md md:px-root-xl py-0 md:py-root-md select-none pointer-events-none shadow-none! bg-primary/5 dark:bg-primary/10 relative overflow-hidden">
      <CardContent className="flex items-center gap-root-md justify-between z-10">
        {/* Illustration & Message */}
        <div className="flex flex-col md:flex-row items-center gap-root-sm md:gap-root-xl justify-between">
          <div className="stagger-scale-1">
            <Lottie lottieRef={lottieRef} loop animationData={getAnimation(percentage)} className="h-16 md:h-28" />
          </div>
          <div className="space-y-root-xs md:space-y-root-sm text-center md:text-start stagger-scale-2">
            <div className="text-lg md:text-4xl font-bold text-foreground/80 tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>
              {getMessage(percentage)}
            </div>
            <div className="text-muted-foreground font-medium tracking-tight text-xs md:text-base">
              {habitsDone} of {habitsTotal} habits completed
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-fit h-40 stagger-scale-3">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={endAngle}
              outerRadius={isMobile ? 50 : 70}
              innerRadius={isMobile ? 40 : 60}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-primary/10 last:fill-transparent"
                polarRadius={[isMobile ? 50 : 70, isMobile ? 40 : 60]}
              />
              <RadialBar dataKey="visitors" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy + 6}
                            className="fill-foreground text-xl md:text-4xl font-bold tracking-tighter"
                          >
                            {displayPct}%
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}