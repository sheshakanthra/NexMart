import { useState } from 'react';

// TODO Phase 2: Wire to vendorService.getVendorDashboard()
// data shape: { todayOrders, todayRevenue, lowStockCount, pendingOrders }
export function useVendorDashboard(vendorId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

// TODO Phase 2: Wire to vendorService.getVendorOrders()
export function useVendorOrders(storeId, params) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

// TODO Phase 2: Wire to vendorService.getVendorInventory()
export function useVendorInventory(storeId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}
