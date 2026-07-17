import { supabase } from '../lib/supabase';
import { ApiError, handleApiError } from '../lib/apiError';

function require() {
  if (!supabase) throw new ApiError('Supabase not configured', 'NO_CLIENT', 503);
}

export async function fetchInventoryByProduct(productId) {
  require();
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .single();
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function upsertInventory(productId, { stock, threshold }) {
  require();
  try {
    const { data, error } = await supabase
      .from('inventory')
      .upsert({ product_id: productId, stock, threshold }, { onConflict: 'product_id' })
      .select()
      .single();
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function updateStock(productId, stock) {
  require();
  try {
    const { data, error } = await supabase
      .from('inventory')
      .update({ stock: Math.max(0, stock) })
      .eq('product_id', productId)
      .select()
      .single();
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}
