import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  inputType: text('input_type', {
    enum: ['check', 'duration', 'numeric', 'text', 'sleep', 'meal', 'weight'],
  }).notNull(),
  unit: text('unit'),
  sortOrder: int('sort_order').notNull().default(0),
  isSystem: int('is_system', { mode: 'boolean' }).notNull().default(false),
  isActive: int('is_active', { mode: 'boolean' }).notNull().default(true),
});

export const logEntries = sqliteTable('log_entries', {
  id: int('id').primaryKey({ autoIncrement: true }),
  categoryId: int('category_id')
    .notNull()
    .references(() => categories.id),
  date: text('date').notNull(), // YYYY-MM-DD
  startedAt: text('started_at'), // ISO datetime
  endedAt: text('ended_at'), // ISO datetime
  durationMin: int('duration_min'),
  numericValue: real('numeric_value'),
  textValue: text('text_value'),
  rating: int('rating'), // 1-5
  note: text('note'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const dailyNotes = sqliteTable('daily_notes', {
  date: text('date').primaryKey(), // YYYY-MM-DD
  note: text('note'),
  mood: int('mood'), // 1-5
});

export const appSettings = sqliteTable('app_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type LogEntry = typeof logEntries.$inferSelect;
export type NewLogEntry = typeof logEntries.$inferInsert;
export type DailyNote = typeof dailyNotes.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;

export type InputType = 'check' | 'duration' | 'numeric' | 'text' | 'sleep' | 'meal' | 'weight';
