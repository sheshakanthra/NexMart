import { supabase } from '../lib/supabase';
import { ApiError, handleApiError } from '../lib/apiError';
import { toProductColumns } from '../lib/catalogMapper';

function require() {
  if (!supabase) throw new ApiError('Supabase not configured', 'NO_CLIENT', 503);
}

const PRODUCT_WITH_INVENTORY = '*, inventory(stock, threshold)';

export async function fetchProducts({ storeId, category } = {}) {
  require();
  try {
    let q = supabase
      .from('products')
      .select(PRODUCT_WITH_INVENTORY)
      .eq('active', true)
      .is('deleted_at', null);

    if (storeId)  q = q.eq('store_id', storeId);
    if (category) q = q.eq('category_id', category);

    const { data, error } = await q;
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function fetchProductById(productId) {
  require();
  try {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_WITH_INVENTORY)
      .eq('id', productId)
      .single();
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function searchProducts({ query, category } = {}) {
  require();
  try {
    let q = supabase
      .from('products')
      .select(PRODUCT_WITH_INVENTORY)
      .eq('active', true)
      .is('deleted_at', null)
      .ilike('name', `%${query}%`);

    if (category) q = q.eq('category_id', category);

    const { data, error } = await q;
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function createProduct(storeId, product) {
  require();
  try {
    const { data: prod, error: prodErr } = await supabase
      .from('products')
      .insert({
        store_id:    storeId,
        category_id: product.category,
        name:        product.name,
        price:       product.price,
        unit:        product.unit,
        image_url:   product.img,
        description: product.description,
        active:      product.active ?? true,
        trend:       product.trend  || [10,12,14,13,15,18,20],
        sold_today:  product.soldToday || 0,
      })
      .select()
      .single();

    if (prodErr) throw ApiError.fromSupabase(prodErr);

    const { error: invErr } = await supabase
      .from('inventory')
      .insert({
        product_id: prod.id,
        stock:      product.stock     ?? 0,
        threshold:  product.threshold ?? 5,
      });

    if (invErr) throw ApiError.fromSupabase(invErr);

    // Return with inventory merged so mapper can use it immediately
    return {
      ...prod,
      inventory: { stock: product.stock ?? 0, threshold: product.threshold ?? 5 },
    };
  } catch (err) { handleApiError(err); }
}

export async function updateProduct(productId, patch) {
  require();
  try {
    const cols = toProductColumns(patch);
    const { data, error } = await supabase
      .from('products')
      .update(cols)
      .eq('id', productId)
      .select(PRODUCT_WITH_INVENTORY)
      .single();
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}

export async function deleteProduct(productId) {
  require();
  try {
    // Soft delete — keeps data for analytics
    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString(), active: false })
      .eq('id', productId);
    if (error) throw ApiError.fromSupabase(error);
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
