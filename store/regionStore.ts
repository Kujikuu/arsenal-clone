import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Delivery zones priced in store_shipping_rates. */
export const SHIPPING_ZONES = [
  { value: 'UK', label: 'United Kingdom', currency: 'GBP' },
  { value: 'EU', label: 'Europe', currency: 'GBP' },
  { value: 'US', label: 'United States', currency: 'USD' },
  { value: 'ROW', label: 'Rest of the world', currency: 'USD' },
] as const;
export type ShippingZone = (typeof SHIPPING_ZONES)[number]['value'];

interface RegionState {
  zone: ShippingZone;
  setZone: (zone: ShippingZone) => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      zone: 'UK',
      setZone: (zone) => set({ zone }),
    }),
    { name: 'arsenal.store-region', storage: createJSONStorage(() => AsyncStorage) }
  )
);

export const zoneLabel = (zone: ShippingZone) =>
  SHIPPING_ZONES.find((z) => z.value === zone)?.label ?? zone;
