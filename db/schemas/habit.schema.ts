import { RxJsonSchema } from 'rxdb';

export enum HabitColor {
  red = 'red',
  amber = 'amber',
  emerald = 'emerald',
  blue = 'blue',
  indigo = 'indigo',
  violet = 'violet',
  pink = 'pink',
  mauve = 'mauve',
  mist = 'mist',
  olive = 'olive',
}

export const HABIT_COLOR_CLASSES: Record<HabitColor, string> = {
  [HabitColor.red]:     'bg-red-400 outline-red-400',
  [HabitColor.amber]:   'bg-amber-500 outline-amber-500',
  [HabitColor.emerald]: 'bg-emerald-600 outline-emerald-600',
  [HabitColor.blue]:    'bg-blue-400 outline-blue-400',
  [HabitColor.indigo]:  'bg-indigo-400 outline-indigo-400',
  [HabitColor.violet]:  'bg-violet-400 outline-violet-400',
  [HabitColor.pink]:    'bg-pink-400 outline-pink-400',
  [HabitColor.mauve]:   'bg-mauve-500 outline-mauve-500',
  [HabitColor.mist]:    'bg-mist-500 outline-mist-500',
  [HabitColor.olive]:   'bg-olive-500 outline-olive-500',
};

export const HABIT_COLOR_BACKGROUNDS: Record<HabitColor, string> = {
  [HabitColor.red]:     'bg-red-200 dark:bg-red-500 fill-red-200 dark:fill-red-500 data-icon:bg-red-300 data-icon:dark:bg-red-400',
  [HabitColor.amber]:   'bg-amber-200 dark:bg-amber-500 fill-amber-200 dark:fill-amber-500 data-icon:bg-amber-300 data-icon:dark:bg-amber-400',
  [HabitColor.emerald]: 'bg-emerald-200 dark:bg-emerald-500 fill-emerald-200 dark:fill-emerald-500 data-icon:bg-emerald-300 data-icon:dark:bg-emerald-400',
  [HabitColor.blue]:    'bg-blue-200 dark:bg-blue-500 fill-blue-200 dark:fill-blue-500 data-icon:bg-blue-300 data-icon:dark:bg-blue-400',
  [HabitColor.indigo]:  'bg-indigo-200 dark:bg-indigo-500 fill-indigo-200 dark:fill-indigo-500 data-icon:bg-indigo-300 data-icon:dark:bg-indigo-400',
  [HabitColor.violet]:  'bg-violet-200 dark:bg-violet-500 fill-violet-200 dark:fill-violet-500 data-icon:bg-violet-300 data-icon:dark:bg-violet-400',
  [HabitColor.pink]:    'bg-pink-200 dark:bg-pink-500 fill-pink-200 dark:fill-pink-500 data-icon:bg-pink-300 data-icon:dark:bg-pink-400',
  [HabitColor.mauve]:   'bg-fuchsia-200 dark:bg-fuchsia-500 fill-fuchsia-200 dark:fill-fuchsia-500 data-icon:bg-fuchsia-300 data-icon:dark:bg-fuchsia-400',
  [HabitColor.mist]:    'bg-slate-200 dark:bg-slate-500 fill-slate-200 dark:fill-slate-500 data-icon:bg-slate-300 data-icon:dark:bg-slate-400',
  [HabitColor.olive]:   'bg-olive-200 dark:bg-olive-500 fill-olive-200 dark:fill-olive-500 data-icon:bg-olive-300 data-icon:dark:bg-olive-400',
};

export interface Habit {
  id: string;
  name: string;
  color: HabitColor;
  emoji: string;
  goal: number;
  unit: string;
  timestamp: string;
  isArchived: boolean;
  archivedAt: string;
}

export const habitSchema: RxJsonSchema<Habit> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    color: { type: 'string' },
    emoji: { type: 'string' },
    goal: { type: 'number' },
    unit: { type: 'string' },
    isArchived: { type: 'boolean' },
    timestamp: { type: 'string', format: 'date-time' },
    archivedAt: { type: 'string' },
  },
  required: ['id', 'name', 'color', 'emoji', 'goal', 'unit'],
};