// Cart is currently managed client-side via localStorage in AppContext.
// TODO Phase 2: Add server-side cart sync for cross-device support
// import { supabase } from '../lib/supabase';

export async function fetchCart(userId) {
  // TODO: supabase.from('carts').select('*, cart_items(*)').eq('user_id', userId).single()
  throw new Error('Not implemented');
}

export async function syncCart(userId, cartItems) {
  // TODO: upsert cart_items for user — called after any cart mutation
  throw new Error('Not implemented');
}

export async function clearCart(userId) {
  // TODO: supabase.from('cart_items').delete().eq('user_id', userId)
  throw new Error('Not implemented');
}
