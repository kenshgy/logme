import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq, gte, lte } from 'drizzle-orm';
import { subDays, format } from 'date-fns';
import { db } from '../db/client';
import { categories, logEntries } from '../db/schema';

export function useSleepStats(days: number = 7) {
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');

  const { data } = useLiveQuery(
    db
      .select()
      .from(logEntries)
      .innerJoin(categories, eq(logEntries.categoryId, categories.id))
      .where(
        and(
          eq(categories.inputType, 'sleep'),
          gte(logEntries.date, startDate),
          lte(logEntries.date, endDate)
        )
      )
      .orderBy(logEntries.date)
  );

  const stats = (data ?? []).map((row) => ({
    date: row.log_entries.date,
    durationMin: row.log_entries.durationMin ?? 0,
    rating: row.log_entries.rating,
  }));

  return { stats, startDate, endDate };
}
