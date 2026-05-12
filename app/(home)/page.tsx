'use client'

import { HorizontalDatePicker } from "@/components/horizontal-date-picker";
import { useState } from "react";
import dayjs from 'dayjs'
import { HabitCard } from "@/components/habit-card";
import { cn } from "@/lib/utils";
import { DailyProgressBanner } from "@/components/daily-progress-banner";
import { useHabits } from "@/hooks/use-habits";
import { useHabitLogsByDate } from "@/hooks/use-habit-logs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Sparkles } from "lucide-react";
import { CreateProjectDialog } from "@/components/create-project-dialog";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [createProjectOpen, setCreateProjectOpen] = useState<boolean>(false)
  const { habits } = useHabits()

  const activeHabits = habits.filter(h => !h.isArchived)

  const { getValueForHabit, setValueForHabit } = useHabitLogsByDate(selectedDate)

  // done = sum of all logged values today; total = sum of all goals
  const done = activeHabits.reduce((sum, h) => sum + getValueForHabit(h.id), 0)
  const total = activeHabits.reduce((sum, h) => sum + h.goal, 0)
  const habitsDone = activeHabits.filter(h => getValueForHabit(h.id) >= h.goal).length

  return (
    <div className="space-y-root-2xl stagger-container">
      {/* Daily Progress */}
      {dayjs(selectedDate).isSame(dayjs(), 'day') && (
        <div className="stagger-item-1 will-change-transform ease-default">
          <DailyProgressBanner done={done} total={total} habitsDone={habitsDone} habitsTotal={activeHabits.length} />
        </div>
      )}

      {/* Date Picker */}
      <div className="stagger-item-2 will-change-transform ease-default">
        <HorizontalDatePicker
          selected={selectedDate}
          onSelect={setSelectedDate}
          dateRange={{
            end: new Date(),
            start: dayjs().subtract(15, 'days').toDate()
          }}
        />
      </div>

      {/* Habits */}
      <div className="w-full space-y-root-md pb-root-xl relative stagger-item-3 will-change-transform ease-default">
        {activeHabits.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/20 bg-transparent shadow-none! stagger-scale-1">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 stagger-scale-2">
                <Target className="size-8 text-primary" />
              </div>
              <CardTitle className="mb-2 text-lg stagger-scale-2">No habits yet</CardTitle>
              <CardDescription className="mb-6 max-w-sm stagger-scale-2">
                Start building better habits by creating your first one. Track your progress and achieve your goals!
              </CardDescription>
              <Button size="lg" className="gap-2 stagger-scale-3" onClick={() => setCreateProjectOpen(true)}>
                <Plus className="size-4" />
                Create your first habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          activeHabits.map((habit, i) => (
            <div
              key={habit.id}
              className={cn(`stagger-item-${Math.min(i + 4, 10)}`, {
                'stagger-item-fallback': i >= 7,
              })}
            >
              <HabitCard
                done={getValueForHabit(habit.id)}
                habit={habit}
                animationClassName="opacity-100"
                onCommit={(value) => setValueForHabit(habit.id, value)}
              />
            </div>
          ))
        )}
      </div>

      {/* Create Habit Dialog */}
      <CreateProjectDialog isOpen={createProjectOpen} setOpen={setCreateProjectOpen} />
    </div>
  );
}