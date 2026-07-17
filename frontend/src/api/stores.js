import { supabase } from '../lib/supabase';
import { ApiError, handleApiError } from '../lib/apiError';
import { toStoreColumns } from '../lib/catalogMapper';

function require() {
  if (!supabase) throw new ApiError('Supabase not configured', 'NO_CLIENT', 503);
}

const STORE_WITH_PRODUCTS = '*, products(*, inventory(stock, threshold))';

export async function fetchStores({ neighborhood, status = 'active' } = {}) {
  require();
  try {
    let q = supabase
      .from('stores')
      .select(STORE_WITH_PRODUCTS)
      .eq('status', status)
      .is('deleted_at', null)
      .order('rating', { ascending: false });

    if (neighborhood) q = q.eq('neighborhood', neighborhood);

    const { data, error } = await q;
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function fetchStoreById(storeId) {
  require();
  try {
    const { data, error } = await supabase
      .from('stores')
      .select(STORE_WITH_PRODUCTS)
      .eq('id', storeId)
      .single();
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function fetchStoresByVendor(vendorId) {
  require();
  try {
    const { data, error } = await supabase
      .from('stores')
      .select(STORE_WITH_PRODUCTS)
      .eq('owner_id', vendorId)
      .is('deleted_at', null);
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function searchStores({ query, neighborhood } = {}) {
  require();
  try {
    let q = supabase
      .from('stores')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .ilike('name', `%${query}%`);

    if (neighborhood) q = q.eq('neighborhood', neighborhood);

    const { data, error } = await q;
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function updateStore(storeId, patch) {
  require();
  try {
    const cols = toStoreColumns(patch);
    const { data, error } = await supabase
      .from('stores')
      .update(cols)
      .eq('id', storeId)
      .select()
      .single();
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function fetchNearbyStores({ neighborhood } = {}) {
  return fetchStores({ neighborhood });
}
