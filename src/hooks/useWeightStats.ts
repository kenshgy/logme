import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq, gte, lte } from 'drizzle-orm';
import { subDays, format } from 'date-fns';
import { db } from '../db/client';
import { categories, logEntries } from '../db/schema';

export function useWeightStats(days: number = 30) {
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');

  const { data } = useLiveQuery(
    db
      .select()
      .from(logEntries)
      .innerJoin(categories, eq(logEntries.categoryId, categories.id))
      .where(
        and(
          eq(categories.inputType, 'weight'),
          gte(logEntries.date, startDate),
          lte(logEntries.date, endDate)
        )
      )
      .orderBy(logEntries.date)
  );

  const stats = (data ?? []).map((row) => ({
    date: row.log_entries.date,
    value: row.log_entries.numericValue ?? 0,
  }));

  return { stats, startDate, endDate };
}
