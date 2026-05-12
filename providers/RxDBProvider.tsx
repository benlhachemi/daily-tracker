'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getDatabase } from '@/db';
import { AppDatabase } from '@/db/types';

const RxDBContext = createContext<AppDatabase | null>(null);

export function RxDBProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AppDatabase | null>(null);

  useEffect(() => {
    getDatabase().then(setDb).catch(console.error);
  }, []);

  // Don't render children until DB is ready
  if (!db) return null; // or a loading spinner

  return (
    <RxDBContext.Provider value={db}>
      {children}
    </RxDBContext.Provider>
  );
}

export function useRxDB(): AppDatabase {
  const db = useContext(RxDBContext);
  if (!db) throw new Error('useRxDB must be used inside <RxDBProvider>');
  return db;
}