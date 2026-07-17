// TODO Phase 2: Implement with Supabase DB (table: stores)
// import { supabase } from '../lib/supabase';

export async function fetchStores({ neighborhood, status = 'active', page = 1, pageSize = 20 } = {}) {
  // TODO: supabase.from('stores').select('*').eq('status', status).range(...)
  throw new Error('Not implemented');
}

export async function fetchStoreById(storeId) {
  // TODO: supabase.from('stores').select('*, products(*)').eq('id', storeId).single()
  throw new Error('Not implemented');
}

export async function fetchStoresByVendor(vendorId) {
  // TODO: supabase.from('stores').select('*').eq('owner_id', vendorId)
  throw new Error('Not implemented');
}

export async function searchStores({ query, neighborhood } = {}) {
  // TODO: supabase.from('stores').select('*').ilike('name', `%${query}%`)
  throw new Error('Not implemented');
}

export async function updateStore(storeId, patch) {
  // TODO: supabase.from('stores').update(patch).eq('id', storeId).select().single()
  throw new Error('Not implemented');
}

export async function fetchNearbyStores({ neighborhood, radiusKm } = {}) {
  // TODO: PostGIS query or neighborhood filter
  throw new Error('Not implemented');
}
