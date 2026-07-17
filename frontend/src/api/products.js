// TODO Phase 2: Implement with Supabase DB (table: products)
// import { supabase } from '../lib/supabase';

export async function fetchProducts({ storeId, category, page = 1, pageSize = 20 } = {}) {
  // TODO: supabase.from('products').select('*').eq('store_id', storeId)
  throw new Error('Not implemented');
}

export async function fetchProductById(productId) {
  // TODO: supabase.from('products').select('*').eq('id', productId).single()
  throw new Error('Not implemented');
}

export async function searchProducts({ query, neighborhood, category } = {}) {
  // TODO: full-text search via supabase.rpc('search_products', { query, neighborhood, category })
  throw new Error('Not implemented');
}

export async function createProduct(storeId, product) {
  // TODO: supabase.from('products').insert({ store_id: storeId, ...product }).select().single()
  throw new Error('Not implemented');
}

export async function updateProduct(productId, patch) {
  // TODO: supabase.from('products').update(patch).eq('id', productId).select().single()
  throw new Error('Not implemented');
}

export async function deleteProduct(productId) {
  // TODO: supabase.from('products').delete().eq('id', productId)
  throw new Error('Not implemented');
}

export async function updateStock(productId, stock) {
  // TODO: supabase.from('products').update({ stock }).eq('id', productId)
  throw new Error('Not implemented');
}
