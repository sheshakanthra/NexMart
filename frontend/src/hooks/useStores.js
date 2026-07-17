import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

// Returns stores from AppContext state (populated from Supabase or mock data).
// Components should read from state.stores via these hooks rather than directly.

export function useStores({ neighborhood, status } = {}) {
  const { state } = useApp();

  const data = useMemo(() => {
    let arr = state.stores;
    if (status)       arr = arr.filter(s => s.status === status);
    if (neighborhood) arr = arr.filter(s => s.neighborhood === neighborhood);
    return arr;
  }, [state.stores, neighborhood, status]);

  return { loading: !state.authReady, error: null, data };
}

export function useStore(storeId) {
  const { state } = useApp();
  const data = useMemo(
    () => state.stores.find(s => s.id === storeId) || null,
    [state.stores, storeId]
  );
  return { loading: !state.authReady, error: null, data };
}
