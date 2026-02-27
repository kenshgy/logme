import { asc, eq } from 'drizzle-orm';
import { db } from '../client';
import { categories, NewCategory } from '../schema';

export function getActiveCategoriesQuery() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder));
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function createCategory(data: Omit<NewCategory, 'id'>) {
  const result = await db.insert(categories).values(data).returning();
  return result[0];
}

export async function updateCategory(id: number, data: Partial<Omit<NewCategory, 'id'>>) {
  const result = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();
  return result[0];
}

export async function deleteOrDeactivateCategory(id: number) {
  // Check if any entries use this category
  const { logEntries } = await import('../schema');
  const { eq: eqFn, count } = await import('drizzle-orm');
  const entries = await db.select().from(logEntries).where(eqFn(logEntries.categoryId, id));
  if (entries.length > 0) {
    // Soft delete
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  } else {
    await db.delete(categories).where(eq(categories.id, id));
  }
}
