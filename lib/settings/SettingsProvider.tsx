import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { UserSettings } from '@/types/database';

export type Settings = Omit<UserSettings, 'user_id'>;
export type SettingsPatch = Partial<Settings>;

/** Mirrors the column defaults of public.user_settings. */
export const DEFAULT_SETTINGS: Settings = {
  notify_kickoff: true,
  notify_lineups: true,
  notify_goals: true,
  notify_full_time: true,
  notify_news: false,
  notify_tickets: true,
  notify_women: false,
  notify_academy: false,
  favourite_team_type: 'men',
  currency: 'GBP',
  autoplay_video: true,
  language: 'en',
  calendar_men: true,
  calendar_women: true,
  calendar_academy: false,
};

const GUEST_KEY = 'arsenal.guest-settings';

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  /** Where the settings live: the signed-in user's row, or this device for guests. */
  synced: boolean;
  update: (patch: SettingsPatch) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function pickSettings(row: Partial<UserSettings> | null | undefined): Settings {
  const merged = { ...DEFAULT_SETTINGS };
  if (!row) return merged;
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
    if (row[key] !== undefined && row[key] !== null) (merged as any)[key] = row[key];
  }
  return merged;
}

/**
 * Account settings. Signed-in users read and write public.user_settings;
 * guests keep the same shape in AsyncStorage so every toggle still works.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const userId = user?.id;

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        if (userId) {
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          if (error) throw error;
          if (!data) {
            // Accounts created before the signup trigger have no row yet.
            await supabase.from('user_settings').upsert({ user_id: userId });
          }
          if (!cancelled) setSettings(pickSettings(data));
        } else {
          const raw = await AsyncStorage.getItem(GUEST_KEY);
          if (!cancelled) setSettings(pickSettings(raw ? JSON.parse(raw) : null));
        }
      } catch (error) {
        console.warn('[Settings] load failed:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  // Latest settings for building the next value outside of a state updater.
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const update = useCallback(
    async (patch: SettingsPatch) => {
      const previous = settingsRef.current;
      const next = { ...previous, ...patch };
      settingsRef.current = next;
      setSettings(next);
      try {
        if (userId) {
          const { error } = await supabase
            .from('user_settings')
            .upsert({ user_id: userId, ...patch }, { onConflict: 'user_id' });
          if (error) throw error;
        } else {
          await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(next));
        }
      } catch (error) {
        settingsRef.current = previous;
        setSettings(previous);
        throw error;
      }
    },
    [userId]
  );

  const value = useMemo(
    () => ({ settings, loading, synced: Boolean(userId), update }),
    [settings, loading, userId, update]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
