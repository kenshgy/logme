import { create } from 'zustand';
import { Category } from '../db/schema';

interface CategoriesState {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  getCategoryById: (id: number) => Category | undefined;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  setCategories: (cats) => set({ categories: cats }),
  getCategoryById: (id) => get().categories.find((c) => c.id === id),
}));
