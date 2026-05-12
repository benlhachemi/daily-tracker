'use client';

import { useEffect, useState } from 'react';
import { useRxDB } from '@/providers/RxDBProvider';
import { HabitLog } from '@/db/schemas/habit-log.schema';
import dayjs from 'dayjs';

/** Returns all logs for a given date (YYYY-MM-DD) */
export function useHabitLogsByDate(date: Date) {
  const db = useRxDB();
  const dateStr = dayjs(date).format('YYYY-MM-DD');
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    const sub = db.habitlogs
      .find({ selector: { date: { $eq: dateStr } } })
      .$.subscribe((docs) => {
        setLogs(docs.map((d) => d.toJSON()));
      });

    return () => sub.unsubscribe();
  }, [db, dateStr]);

  function getValueForHabit(habitId: string): number {
    return logs.find((l) => l.habitId === habitId)?.value ?? 0;
  }

  async function setValueForHabit(habitId: string, value: number) {
    const existing = await db.habitlogs
      .findOne({ selector: { habitId: { $eq: habitId }, date: { $eq: dateStr } } })
      .exec();

    if (existing) {
      await existing.patch({ value, timestamp: new Date().toISOString() });
    } else {
      await db.habitlogs.insert({
        id: crypto.randomUUID(),
        habitId,
        date: dateStr,
        value,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return { logs, getValueForHabit, setValueForHabit };
}

/** Returns all logs for one or all habits — used for analytics */
export function useAllHabitLogs(habitId?: string) {
  const db = useRxDB();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selector = habitId ? { habitId: { $eq: habitId } } : {};
    const sub = db.habitlogs
      .find({ selector, sort: [{ date: 'asc' }] })
      .$.subscribe((docs) => {
        setLogs(docs.map((d) => d.toJSON()));
        setLoading(false);
      });

    return () => sub.unsubscribe();
  }, [db, habitId]);

  return { logs, loading };
}