import { useState } from 'react';

// TODO Phase 2: Wire to productService.getProducts()
// data shape: Product[] — see src/data/mock.js buildStores() product entries
export function useProducts(params) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}

// TODO Phase 2: Wire to productService.getProductById()
export function useProduct(productId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}
