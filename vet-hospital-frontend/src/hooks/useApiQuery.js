import { useEffect, useState } from 'react';

/**
 * Generic hook to fetch data from an async function.
 *
 * @template T
 * @param {() => Promise<T>} queryFn - Function that resolves the requested data.
 * @param {Array<unknown>} deps - Dependency list; refetch occurs when any value changes.
 * @param {T} [initialData=null] - Optional initial value to use before the first fetch.
 * @returns {{ data: T, loading: boolean, error: Error | null, refetch: () => Promise<void> }}
 */
export function useApiQuery(queryFn, deps = [], initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await queryFn();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}
