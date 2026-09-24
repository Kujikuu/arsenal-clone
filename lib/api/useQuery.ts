import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Options<T> {
  /** Skip fetching until this is true (e.g. waiting on a route param or a session). */
  enabled?: boolean;
  initialData?: T;
}

export interface QueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  /** Local optimistic update; the next refetch replaces it. */
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

/** Throw Supabase errors so they reach the query's error state. */
export function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error)
    throw error instanceof Error ? error : new Error(String((error as any)?.message ?? error));
  return data as T;
}

/**
 * Minimal data-fetching hook. `key` identifies the request; whenever it changes
 * the fetcher runs again and responses from older keys are dropped.
 */
export function useQuery<T>(
  key: readonly unknown[],
  fetcher: () => Promise<T>,
  { enabled = true, initialData }: Options<T> = {}
): QueryResult<T> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const requestId = useRef(0);
  const fetcherRef = useRef(fetcher);
  // Always call the latest fetcher; runs before the fetch effect below.
  useLayoutEffect(() => {
    fetcherRef.current = fetcher;
  });
  const keyHash = JSON.stringify(key);

  const run = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    try {
      const result = await fetcherRef.current();
      if (id !== requestId.current) return;
      setData(result);
      setError(null);
    } catch (err) {
      if (id !== requestId.current) return;
      console.warn(`[useQuery] ${keyHash} failed:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [keyHash, enabled]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run, setData };
}
