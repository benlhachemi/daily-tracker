import { RxDatabase, RxCollection, RxDocument } from 'rxdb';
import { type Habit } from './schemas/habit.schema';
import { type HabitLog } from './schemas/habit-log.schema';

export type HabitDocument = RxDocument<Habit>;
export type HabitCollection = RxCollection<Habit>;

export type HabitLogDocument = RxDocument<HabitLog>;
export type HabitLogCollection = RxCollection<HabitLog>;

export type AppCollections = {
  habits: HabitCollection;
  habitlogs: HabitLogCollection
};

export type AppDatabase = RxDatabase<AppCollections>;