import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_RECENT = 12;

interface RecentState {
  ids: string[];
  view: (id: string) => void;
}

/** Products the fan opened most recently, newest first. */
export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      view: (id) =>
        set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, MAX_RECENT) })),
    }),
    { name: 'arsenal.store-recent', storage: createJSONStorage(() => AsyncStorage) }
  )
);
