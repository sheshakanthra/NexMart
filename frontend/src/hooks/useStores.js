import { useState } from 'react';

// TODO Phase 2: Wire to storeService.getStores()
// data shape: Store[] — see src/data/mock.js buildStores()
export function useStores(params) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

// TODO Phase 2: Wire to storeService.getStoreById()
export function useStore(storeId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}
