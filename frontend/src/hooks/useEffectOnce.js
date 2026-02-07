/**
 * useEffectOnce - runs an effect only once, even in React StrictMode
 */

import { useEffect, useRef } from 'react';

export function useEffectOnce(callback) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    callback();
  }, []);
}

/**
 * useAsyncEffectOnce - same as useEffectOnce but for async functions
 */
export function useAsyncEffectOnce(callback) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    callback();
  }, []);
}
