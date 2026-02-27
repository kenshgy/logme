import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../client';
import { categories, logEntries, NewLogEntry } from '../schema';

export type EntryWithCategory = {
  entry: typeof logEntries.$inferSelect;
  category: typeof categories.$inferSelect;
};

export async function createEntry(data: Omit<NewLogEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  const result = await db.insert(logEntries).values(data).returning();
  return result[0];
}

export async function updateEntry(
  id: number,
  data: Partial<Omit<NewLogEntry, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const result = await db
    .update(logEntries)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(logEntries.id, id))
    .returning();
  return result[0];
}

export async function deleteEntry(id: number) {
  await db.delete(logEntries).where(eq(logEntries.id, id));
}

export function getEntriesByDateQuery(date: string) {
  return db
    .select()
    .from(logEntries)
    .innerJoin(categories, eq(logEntries.categoryId, categories.id))
    .where(eq(logEntries.date, date))
    .orderBy(logEntries.startedAt);
}

export function getEntriesInRangeQuery(startDate: string, endDate: string) {
  return db
    .select()
    .from(logEntries)
    .innerJoin(categories, eq(logEntries.categoryId, categories.id))
    .where(and(gte(logEntries.date, startDate), lte(logEntries.date, endDate)))
    .orderBy(logEntries.date, logEntries.startedAt);
}

export async function getEntryById(id: number) {
  const result = await db
    .select()
    .from(logEntries)
    .innerJoin(categories, eq(logEntries.categoryId, categories.id))
    .where(eq(logEntries.id, id));
  return result[0] ?? null;
}
