'use client'

import { AnalyticsChart } from "@/components/analytics-chart";
import { CurrentStreak } from "@/components/current-streak";
import { PreviousStreaks } from "@/components/previous-streaks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHabits } from "@/hooks/use-habits";
import { useAllHabitLogs } from "@/hooks/use-habit-logs";
import { HabitLog } from "@/db/schemas/habit-log.schema";
import { Habit } from "@/db/schemas/habit.schema";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

// ─── streak helpers ──────────────────────────────────────────────────────────

type StreakEntry = { startDate: string; endDate: string; duration: number };

/**
 * Given logs + habits for a selection, compute:
 * - currentStreak: consecutive completed days ending today
 * - previousStreaks: all past completed streaks (excluding current)
 * - completedDays: days where every habit hit its goal
 * - failedDays: days with at least one log but not all goals met
 */
function computeStreaks(logs: HabitLog[], habits: Habit[]) {
  if (habits.length === 0 || logs.length === 0) {
    return { currentStreak: 0, previousStreaks: [], completedDays: 0, failedDays: 0 };
  }

  // Build a set of all dates that have any log
  const allDates = [...new Set(logs.map(l => l.date))].sort();

  // For each date: was every habit completed?
  function isDayComplete(date: string): boolean {
    return habits.every(habit => {
      const log = logs.find(l => l.habitId === habit.id && l.date === date);
      return log ? log.value >= habit.goal : false;
    });
  }

  function isDayAttempted(date: string): boolean {
    return logs.some(l => l.date === date);
  }

  let completedDays = 0;
  let failedDays = 0;

  for (const date of allDates) {
    if (isDayComplete(date)) completedDays++;
    else if (isDayAttempted(date)) failedDays++;
  }

  // Walk backwards from today to find current streak
  let currentStreak = 0;
  let cursor = dayjs();
  while (true) {
    const dateStr = cursor.format('YYYY-MM-DD');
    if (!isDayComplete(dateStr)) break;
    currentStreak++;
    cursor = cursor.subtract(1, 'day');
  }

  // Find all streaks (contiguous completed days)
  const streakList: StreakEntry[] = [];
  let streakStart: string | null = null;
  let streakLen = 0;
  const today = dayjs().format('YYYY-MM-DD');

  for (let i = 0; i < allDates.length; i++) {
    const date = allDates[i];
    const complete = isDayComplete(date);

    if (complete) {
      if (!streakStart) streakStart = date;
      streakLen++;
    } else {
      if (streakStart && streakLen > 0) {
        // Only record as "previous" if it ended before today
        const endDate = allDates[i - 1];
        if (endDate !== today) {
          streakList.push({
            startDate: dayjs(streakStart).format('DD MMM').toUpperCase(),
            endDate: dayjs(endDate).format('DD MMM').toUpperCase(),
            duration: streakLen,
          });
        }
      }
      streakStart = null;
      streakLen = 0;
    }
  }

  // Close any open streak at the end
  if (streakStart && streakLen > 0) {
    const endDate = allDates[allDates.length - 1];
    if (endDate !== today) {
      streakList.push({
        startDate: dayjs(streakStart).format('DD MMM').toUpperCase(),
        endDate: dayjs(endDate).format('DD MMM').toUpperCase(),
        duration: streakLen,
      });
    }
  }

  return {
    currentStreak,
    previousStreaks: streakList.reverse(), // most recent first
    completedDays,
    failedDays,
  };
}

// ─── page ────────────────────────────────────────────────────────────────────

const ALL = '__all__';

export default function AnalyticsPage() {
  const { habits } = useHabits();
  const activeHabits = habits.filter(h => !h.isArchived);

  const [selectedHabitId, setSelectedHabitId] = useState<string>(ALL);

  // Fetch logs — undefined = all habits
  const filterHabitId = selectedHabitId === ALL ? undefined : selectedHabitId;
  const { logs, loading } = useAllHabitLogs(filterHabitId);

  // Habits in scope for analytics
  const scopedHabits = useMemo(
    () => selectedHabitId === ALL ? activeHabits : activeHabits.filter(h => h.id === selectedHabitId),
    [activeHabits, selectedHabitId]
  );

  const { currentStreak, previousStreaks, completedDays, failedDays } = useMemo(
    () => computeStreaks(logs, scopedHabits),
    [logs, scopedHabits]
  );

  return (
    <div className="space-y-root-lg">
      {/* Habit selector */}
      <Select value={selectedHabitId} onValueChange={setSelectedHabitId as any}>
        <SelectTrigger className='w-52'>
          <SelectValue>
            {selectedHabitId === ALL
              ? 'All Habits'
              : (() => {
                const h = activeHabits.find(h => h.id === selectedHabitId);
                return h ? `${h.emoji} ${h.name}` : 'All Habits';
              })()
            }
          </SelectValue>
        </SelectTrigger>

        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectItem value={ALL}>All Habits</SelectItem>
            {activeHabits.map(habit => (
              <SelectItem key={habit.id} value={habit.id}>
                {habit.emoji} {habit.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-root-md w-full">
        {/* LEFT — streaks */}
        <div className="col-span-1 w-full space-y-root-md animate-in fade-in-50 blur-in-xs slide-in-from-bottom-3 duration-default ease-default fill-mode-forwards will-change-transform">
          <CurrentStreak streak={currentStreak} />
          <PreviousStreaks streaks={previousStreaks} />
        </div>

        {/* RIGHT — stats + chart */}
        <div className="col-span-2 w-full space-y-root-md h-full animate-in fade-in blur-in-xs slide-in-from-bottom-3 duration-default ease-default fill-mode-backwards will-change-transform delay-150">
          <div className="grid grid-cols-2 gap-root-md h-fit w-full">
            <Card>
              <CardHeader>
                <CardTitle>✅ Completed</CardTitle>
              </CardHeader>
              <CardContent className="text-sm font-medium text-muted-foreground">
                <span className="text-3xl font-semibold text-foreground">{completedDays}</span>{' '}
                {completedDays === 1 ? 'Day' : 'Days'}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>❌ Failed</CardTitle>
              </CardHeader>
              <CardContent className="text-sm font-medium text-muted-foreground">
                <span className="text-3xl font-semibold text-foreground">{failedDays}</span>{' '}
                {failedDays === 1 ? 'Day' : 'Days'}
              </CardContent>
            </Card>
          </div>

          <AnalyticsChart logs={logs} habits={scopedHabits} />
        </div>
      </div>
    </div>
  );
}