'use client'

import { ActiveHabitCard } from "@/components/active-habit-card";
import { ArchivedHabitCard } from "@/components/archived-habit-card";
import { CreateHabitCard } from "@/components/create-habit-card";
import { useHabits } from "@/hooks/use-habits";
import dayjs from "dayjs";
import { Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { habits, removeHabit, updateHabit, resetHabitData } = useHabits()

  return (
    <div className="space-y-root-3xl">
      {/* Active Habits */}
      <div className="space-y-root-lg">
          <h2 className="text-xl font-semibold flex items-center gap-root-sm">
            <div className="size-3 bg-green-600 rounded-full relative">
              <div className="absolute top-2/4 left-2/4 -translate-2/4 size-2.5 bg-green-600 rounded-full animate-ping" />
            </div>
            Active Habits
          </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-root-md">
          {/* New Habit */}
          <div className="animate-in will-change-transform fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-backwards delay-75">
            <CreateHabitCard />
          </div>

          {habits.filter(h => !h.isArchived).map((habit, i) => (
            <div 
              key={habit.id}
              className={cn(`animate-in will-change-transform fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-backwards`, {
                'delay-100': i === 0,
                'delay-150': i === 1,
                'delay-200': i === 2,
                'delay-250': i === 3,
                'delay-350': i === 4,
                'delay-450': i >= 5,
              })}
            >
              <ActiveHabitCard
                name={`${habit.emoji} ${habit.name}`}
                emoji={habit.emoji}
                habitName={habit.name}
                color={habit.color}
                goal={habit.goal}
                unit={habit.unit}
                onArchive={() => updateHabit(habit.id, { isArchived: true, archivedAt: dayjs().toString() })}
                onDelete={() => removeHabit(habit.id)}
                onEdit={(data) => updateHabit(habit.id, data)}
                onReset={() => resetHabitData(habit.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Archived Habits */}
      {habits.filter(h => h.isArchived).length > 0 && (
        <div className="space-y-root-lg">
          <h2 className="text-2xl font-bold flex items-center gap-root-sm text-muted-foreground">
            <Archive size={24} />
            <span className="uppercase">Archived Habits</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-root-md">
            {habits.filter(h => h.isArchived).map((habit, i) => (
              <div 
                key={habit.id}
                className={cn(`animate-in will-change-transform fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-backwards`, {
                  'delay-75': i === 0,
                  'delay-100': i === 1,
                  'delay-150': i === 2,
                  'delay-200': i === 3,
                  'delay-300': i === 4,
                  'delay-400': i >= 5,
                })}
              >
                <ArchivedHabitCard
                  name={`${habit.emoji} ${habit.name}`}
                  date={dayjs(habit.archivedAt).format('DD/mm/YYYY')}
                  onRestore={() => updateHabit(habit.id, { isArchived: false })}
                  onDelete={() => removeHabit(habit.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}