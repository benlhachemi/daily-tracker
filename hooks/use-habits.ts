'use client';

import { useEffect, useState } from 'react';
import { useRxDB } from '@/providers/RxDBProvider';
import { Habit } from '@/db/schemas/habit.schema';
import { toast } from 'sonner';

export function useHabits() {
  const db = useRxDB();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = db.habits
      .find({ sort: [{ timestamp: 'desc' }] })
      .$.subscribe((docs) => {
        setHabits(docs.map((d) => d.toJSON()));
        setLoading(false);
      });

    return () => sub.unsubscribe();
  }, [db]);

  async function addHabit(data: Omit<Habit, 'id' | 'timestamp'>) {
    await db.habits.insert({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  async function updateHabit(id: string, data: Partial<Omit<Habit, 'id'>>) {
    const doc = await db.habits.findOne(id).exec();
    if (doc) await doc.patch(data);
  }

  async function removeHabit(id: string) {
    const doc = await db.habits.findOne(id).exec();
    if (doc) {
      await doc.remove();
      toast.success('Habit deleted successfully');
    }
  }

  async function resetHabitData(habitId: string) {
    // Find all habit logs for this habit and delete them
    const logs = await db.habitlogs.find({ selector: { habitId } }).exec();
    await Promise.all(logs.map(log => log.remove()));
    toast.success('Habit data reset successfully');
  }

  return { habits, loading, addHabit, updateHabit, removeHabit, resetHabitData };
}