import { useState } from 'react';

// TODO Phase 3: Wire to analyticsService methods
// data shape mirrors chart data from src/data/mock.js chart generators

export function useHourlySales(storeId, date) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

export function useRevenueTrend(storeId, params) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

export function useNeighborhoodTrends() {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

export function useCategoryPerformance(storeId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}
