import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers2 } from "lucide-react";

type Streak = {
  startDate: string;
  endDate: string;
  duration: number;
}

interface PreviousStreaksProps {
  streaks: Streak[]
}

export function PreviousStreaks({ streaks }: PreviousStreaksProps) {
  return (
    <Card className="min-h-80 max-h-80 h-80 overflow-y-scroll no-scrollbar" >
      <CardHeader>
        <CardTitle>Previous Streaks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-root-md h-full">
        {streaks.length === 0 ? (
          <div className="flex flex-col gap-root-md items-center justify-center h-full w-full">
            <div className="text-5xl text-muted-foreground"><Layers2 /></div>
            <div className="text-muted-foreground">No streaks history yet!</div>
          </div>
        ) : streaks.map((streak, i) => (
          <div key={i} className="flex items-center gap-root-sm justify-between h-5 text-[10px] uppercase tracking-tighter font-medium">
            <div aria-label="streak-start-date" className="text-muted-foreground w-[20%] text-center">{streak.startDate}</div>

            <div className="h-full w-[60%] bg-primary flex-1 rounded-full flex items-center justify-center text-white text-[10px]">
              {streak.duration}
            </div>

            <div aria-label="streak-start-date" className="text-muted-foreground w-[20%] text-center">{streak.endDate}</div>
          </div>
        ))}
      </CardContent>
    </Card >
  )
}