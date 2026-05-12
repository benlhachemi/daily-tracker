import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { AppDatabase } from './types';
import { habitSchema } from './schemas/habit.schema';
import { habitLogSchema } from './schemas/habit-log.schema';

let dbInstance: AppDatabase | null = null;

export async function getDatabase(): Promise<AppDatabase> {
  if (typeof window === 'undefined') {
    throw new Error('RxDB can only be initialized on the client side');
  }

  if (dbInstance) return dbInstance;

  // Dev-mode plugin + AJV validator (only in development)
  if (process.env.NODE_ENV === 'development') {
    const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
    addRxPlugin(RxDBDevModePlugin);
  }

  // Wrap storage with AJV validator — required when dev-mode is active
  const storage =
    process.env.NODE_ENV === 'development'
      ? wrappedValidateAjvStorage({ storage: getRxStorageDexie() }) // 👈 wrapped
      : getRxStorageDexie();

  const db = await createRxDatabase<AppDatabase>({
    name: 'quotidient-db',
    storage,
    multiInstance: true,
    ignoreDuplicate: process.env.NODE_ENV === 'development',
  });

  await db.addCollections({
    habits: { schema: habitSchema },
    habitlogs: { schema: habitLogSchema }
  });

  dbInstance = db as AppDatabase;
  return dbInstance;
}