import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq, gte, lte } from 'drizzle-orm';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { db } from '../db/client';
import { categories, logEntries } from '../db/schema';

export type DayActivity = {
  dots: Array<{ key: string; color: string }>;
};

export function useMonthActivity(yearMonth: string) {
  // yearMonth format: 'YYYY-MM'
  const startDate = `${yearMonth}-01`;
  const endDate = format(endOfMonth(new Date(startDate)), 'yyyy-MM-dd');

  const { data } = useLiveQuery(
    db
      .select()
      .from(logEntries)
      .innerJoin(categories, eq(logEntries.categoryId, categories.id))
      .where(and(gte(logEntries.date, startDate), lte(logEntries.date, endDate)))
      .orderBy(logEntries.date)
  );

  // Build a map: date -> unique category colors
  const activityMap: Record<string, DayActivity> = {};
  const seenColors: Record<string, Set<string>> = {};

  for (const row of data ?? []) {
    const date = row.log_entries.date;
    const color = row.categories.color;
    if (!activityMap[date]) {
      activityMap[date] = { dots: [] };
      seenColors[date] = new Set();
    }
    if (!seenColors[date].has(color) && activityMap[date].dots.length < 3) {
      seenColors[date].add(color);
      activityMap[date].dots.push({ key: color, color });
    }
  }

  return { activityMap };
}
