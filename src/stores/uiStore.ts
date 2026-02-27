import { create } from 'zustand';
import { todayString } from '../utils/dateUtils';

interface UIState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeEntryId: number | null;
  setActiveEntryId: (id: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedDate: todayString(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  activeEntryId: null,
  setActiveEntryId: (id) => set({ activeEntryId: id }),
}));
