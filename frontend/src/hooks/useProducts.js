import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

// Returns products from AppContext state (nested inside stores).
// Reads from already-populated state.stores — no additional fetch needed.

export function useProducts({ storeId, category } = {}) {
  const { state } = useApp();

  const data = useMemo(() => {
    const stores = storeId
      ? state.stores.filter(s => s.id === storeId)
      : state.stores;

    let products = stores.flatMap(s => s.products.map(p => ({ ...p, storeId: s.id })));
    if (category) products = products.filter(p => p.category === category);
    return products;
  }, [state.stores, storeId, category]);

  return { loading: !state.authReady, error: null, data };
}

export function useProduct(productId) {
  const { state } = useApp();

  const data = useMemo(() => {
    for (const store of state.stores) {
      const p = store.products.find(p => p.id === productId);
      if (p) return p;
    }
    return null;
  }, [state.stores, productId]);

  return { loading: !state.authReady, error: null, data };
}
