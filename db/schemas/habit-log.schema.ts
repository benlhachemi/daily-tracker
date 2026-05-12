import { RxJsonSchema } from 'rxdb';

export interface HabitLog {
  id: string;          // uuid
  habitId: string;
  date: string;        // ISO date string — date only, e.g. "2025-05-01"
  value: number;       // progress value recorded for that day
  timestamp: string;   // full ISO datetime of last update
}

export const habitLogSchema: RxJsonSchema<HabitLog> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id:        { type: 'string', maxLength: 100 },
    habitId:   { type: 'string', maxLength: 100 },
    date:      { type: 'string', maxLength: 10 },   // "YYYY-MM-DD"
    value:     { type: 'number' },
    timestamp: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'habitId', 'date', 'value', 'timestamp'],
  indexes: ['habitId', 'date'],
};