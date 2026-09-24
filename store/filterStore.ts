import { create } from 'zustand';

export interface FilterState {
  teamSelection: 'Arsenal' | 'All';
  selectedComp: string;
  selectedSeason: string;
  setTeamSelection: (team: 'Arsenal' | 'All') => void;
  setSelectedComp: (comp: string) => void;
  setSelectedSeason: (season: string) => void;
  resetFilters: () => void;
  isFiltered: () => boolean;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  teamSelection: 'Arsenal',
  selectedComp: 'All Competitions',
  selectedSeason: '2026/27',
  setTeamSelection: (team) => set({ teamSelection: team }),
  setSelectedComp: (comp) => set({ selectedComp: comp }),
  setSelectedSeason: (season) => set({ selectedSeason: season }),
  resetFilters: () =>
    set({
      teamSelection: 'Arsenal',
      selectedComp: 'All Competitions',
      selectedSeason: '2026/27',
    }),
  isFiltered: () => {
    const { teamSelection, selectedComp } = get();
    return teamSelection !== 'Arsenal' || selectedComp !== 'All Competitions';
  },
}));
