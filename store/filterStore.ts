import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TeamType } from '@/types/database';

export const CURRENT_SEASON = '2026/27';
export const ALL_COMPETITIONS = 'All Competitions';

export type TeamSelection = 'club' | 'all';

export interface FixtureFilter {
  teamSelection: TeamSelection;
  competition: string;
  season: string;
}

export const DEFAULT_FILTER: FixtureFilter = {
  teamSelection: 'club',
  competition: ALL_COMPETITIONS,
  season: CURRENT_SEASON,
};

interface FilterState {
  /** Each team (men / women / academy) keeps its own fixture filters. */
  filters: Record<TeamType, FixtureFilter>;
  setFilter: (team: TeamType, filter: FixtureFilter) => void;
  resetFilter: (team: TeamType) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      filters: { men: DEFAULT_FILTER, women: DEFAULT_FILTER, academy: DEFAULT_FILTER },
      setFilter: (team, filter) => set((s) => ({ filters: { ...s.filters, [team]: filter } })),
      resetFilter: (team) => set((s) => ({ filters: { ...s.filters, [team]: DEFAULT_FILTER } })),
    }),
    {
      name: 'arsenal.fixture-filters',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // v1 stored the team selection as the display labels 'Arsenal' / 'All'.
      migrate: (persisted, version) => {
        const state = persisted as Pick<FilterState, 'filters'>;
        if (version < 2 && state?.filters) {
          for (const team of Object.keys(state.filters) as TeamType[]) {
            const filter = state.filters[team];
            const legacy = (filter as { teamSelection: string }).teamSelection;
            filter.teamSelection = legacy === 'All' ? 'all' : 'club';
          }
        }
        return state as FilterState;
      },
    }
  )
);

export function isFiltered(filter: FixtureFilter): boolean {
  return (
    filter.teamSelection !== DEFAULT_FILTER.teamSelection ||
    filter.competition !== DEFAULT_FILTER.competition ||
    filter.season !== DEFAULT_FILTER.season
  );
}
