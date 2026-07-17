import { useState } from 'react';

// TODO Phase 2: Wire to orderService.getOrders()
// data shape: Order[] — see src/data/mock.js buildOrders()
export function useOrders(params) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

// TODO Phase 2: Wire to orderService.getOrderById()
export function useOrder(orderId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}
