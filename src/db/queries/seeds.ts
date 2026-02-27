import { db } from '../client';
import { categories } from '../schema';

const DEFAULT_CATEGORIES = [
  { name: 'Sleep', icon: 'sleep', color: '#6C63FF', inputType: 'sleep' as const, unit: undefined, sortOrder: 0, isSystem: true },
  { name: 'Wake Up', icon: 'weather-sunny', color: '#FFB347', inputType: 'check' as const, unit: undefined, sortOrder: 1, isSystem: true },
  { name: 'Meal', icon: 'silverware-fork-knife', color: '#FF6B6B', inputType: 'meal' as const, unit: undefined, sortOrder: 2, isSystem: true },
  { name: 'Water', icon: 'water', color: '#4ECDC4', inputType: 'numeric' as const, unit: 'ml', sortOrder: 3, isSystem: true },
  { name: 'Weight', icon: 'scale-bathroom', color: '#45B7D1', inputType: 'weight' as const, unit: 'kg', sortOrder: 4, isSystem: true },
  { name: 'Exercise', icon: 'run', color: '#96CEB4', inputType: 'duration' as const, unit: undefined, sortOrder: 5, isSystem: true },
  { name: 'Walk', icon: 'walk', color: '#88D8B0', inputType: 'numeric' as const, unit: 'km', sortOrder: 6, isSystem: true },
  { name: 'Work', icon: 'briefcase', color: '#5B7FA6', inputType: 'duration' as const, unit: undefined, sortOrder: 7, isSystem: true },
  { name: 'Cleaning', icon: 'broom', color: '#F7DC6F', inputType: 'check' as const, unit: undefined, sortOrder: 8, isSystem: true },
  { name: 'Shopping', icon: 'cart', color: '#E8A0BF', inputType: 'check' as const, unit: undefined, sortOrder: 9, isSystem: true },
  { name: 'Bath/Shower', icon: 'shower', color: '#A29BFE', inputType: 'check' as const, unit: undefined, sortOrder: 10, isSystem: true },
  { name: 'Medication', icon: 'pill', color: '#FD79A8', inputType: 'check' as const, unit: undefined, sortOrder: 11, isSystem: true },
  { name: 'Mood', icon: 'emoticon-happy', color: '#FFEAA7', inputType: 'numeric' as const, unit: undefined, sortOrder: 12, isSystem: true },
  { name: 'Note', icon: 'note-text', color: '#B2BABB', inputType: 'text' as const, unit: undefined, sortOrder: 13, isSystem: true },
];

export async function seedDefaultCategories() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) return;

  await db.insert(categories).values(
    DEFAULT_CATEGORIES.map((c) => ({
      name: c.name,
      icon: c.icon,
      color: c.color,
      inputType: c.inputType,
      unit: c.unit ?? null,
      sortOrder: c.sortOrder,
      isSystem: c.isSystem,
      isActive: true,
    }))
  );
}
