// TODO Phase 2: Implement vendor-specific Supabase queries
// import { supabase } from '../lib/supabase';

export async function fetchVendorDashboard(vendorId) {
  // TODO: aggregate stats — today's orders, revenue, low-stock count, pending actions
  throw new Error('Not implemented');
}

export async function fetchVendorOrders(storeId, { status, page = 1, pageSize = 20 } = {}) {
  // TODO: supabase.from('orders').select('*, order_items(*)').eq('store_id', storeId)
  throw new Error('Not implemented');
}

export async function acceptOrder(orderId) {
  // TODO: updateOrderStatus(orderId, 'accepted')
  throw new Error('Not implemented');
}

export async function fetchVendorInventory(storeId) {
  // TODO: supabase.from('products').select('*').eq('store_id', storeId)
  throw new Error('Not implemented');
}

export async function fetchVendorAnalytics(storeId, { period = '7d' } = {}) {
  // TODO: supabase.rpc('vendor_analytics', { store_id: storeId, period })
  throw new Error('Not implemented');
}

export async function updateVendorStore(storeId, patch) {
  // TODO: supabase.from('stores').update(patch).eq('id', storeId)
  throw new Error('Not implemented');
}
