'use client'

import { Card, CardContent } from "@/components/ui/card";
import Lottie from "lottie-react";
import flameAnimation from '@/assets/flame.json'

interface CurrentStreakProps {
  streak: number;
}

export function CurrentStreak({ streak }: CurrentStreakProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center flex-col gap-root-xl">
        <div className="text-9xl relative h-28 w-full">
          <Lottie animationData={flameAnimation} loop={true} className="h-full" />
          <div className="absolute bottom-0 translate-y-1/3 left-2/4 -translate-x-2/4 text-6xl text-orange-500 font-bold tracking-normal rounded-full w-fit h-fit py-root-sm px-root-md bg-card/70 backdrop-blur-sm flex items-center justify-center text-center overflow-visible select-none" style={{ fontFamily: `var(--font-poppins)` }}>{streak}</div>
        </div>

        <div className="text-lg">day streak</div>
      </CardContent>
    </Card>
  )
}