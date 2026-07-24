import { useState, useCallback } from 'react';

/**
 * Manages async operation state: loading, error, and data.
 * Simplifies API calls in components and avoids boilerplate.
 *
 * @example
 * const { loading, error, execute } = useAsync(async () => {
 *   const res = await fetch('/api/jobs');
 *   return res.json();
 * });
 */
export function useAsync<T>(
  asyncFn: (...args: any[]) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        setData(result);
        return result;
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  return { loading, error, data, execute };
}
