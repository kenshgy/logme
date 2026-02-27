import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { categories, logEntries } from '../db/schema';

export function useEntriesByDate(date: string) {
  const { data, error } = useLiveQuery(
    db
      .select()
      .from(logEntries)
      .innerJoin(categories, eq(logEntries.categoryId, categories.id))
      .where(eq(logEntries.date, date))
      .orderBy(logEntries.startedAt)
  );

  return { entries: data ?? [], error };
}
