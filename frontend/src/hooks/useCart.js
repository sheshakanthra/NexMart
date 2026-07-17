import { useState } from 'react';

// TODO Phase 2: Wire to cartService for server-side sync
// Client-side cart is already managed in AppContext via localStorage.
// This hook will add cross-device sync on top without replacing AppContext.
export function useCartSync(userId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}
