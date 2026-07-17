// TODO Phase 2: Implement with Supabase DB (table: orders, order_items)
// import { supabase } from '../lib/supabase';

export async function fetchOrders({ userId, storeId, status, page = 1, pageSize = 20 } = {}) {
  // TODO: supabase.from('orders').select('*, order_items(*)').eq('user_id', userId)
  throw new Error('Not implemented');
}

export async function fetchOrderById(orderId) {
  // TODO: supabase.from('orders').select('*, order_items(*)').eq('id', orderId).single()
  throw new Error('Not implemented');
}

export async function placeOrder(payload) {
  // payload: { storeId, items, address, payment, subtotal, deliveryFee, total }
  // TODO: supabase.from('orders').insert(payload).select().single()
  throw new Error('Not implemented');
}

export async function updateOrderStatus(orderId, status) {
  // TODO: supabase.from('orders').update({ status }).eq('id', orderId)
  throw new Error('Not implemented');
}

export async function cancelOrder(orderId, reason) {
  // TODO: updateOrderStatus(orderId, 'cancelled') + record reason
  throw new Error('Not implemented');
}

export async function fetchOrderTimeline(orderId) {
  // TODO: supabase.from('order_timeline').select('*').eq('order_id', orderId).order('created_at')
  throw new Error('Not implemented');
}
