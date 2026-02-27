import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useEffect } from 'react';
import { getActiveCategoriesQuery } from '../db/queries/categories';
import { useCategoriesStore } from '../stores/categoriesStore';

export function useCategories() {
  const { data } = useLiveQuery(getActiveCategoriesQuery());
  const setCategories = useCategoriesStore((s) => s.setCategories);

  useEffect(() => {
    if (data) setCategories(data);
  }, [data]);

  return { categories: data ?? [] };
}
