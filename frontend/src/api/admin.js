// TODO Phase 3: Implement admin management endpoints
// Admin calls require service-role key — never expose in browser.
// These will be routed through a Supabase Edge Function or secure backend.
// import { supabase } from '../lib/supabase';

export async function fetchAdminDashboard() {
  // TODO: aggregate platform-wide metrics — active stores, orders today, revenue, pending vendors
  throw new Error('Not implemented');
}

export async function fetchAllVendors({ status, page = 1, pageSize = 20 } = {}) {
  // TODO: supabase.from('stores').select('*, profiles(*)').eq('status', status)
  throw new Error('Not implemented');
}

export async function approveVendor(vendorId) {
  // TODO: supabase.from('stores').update({ status: 'active' }).eq('owner_id', vendorId)
  throw new Error('Not implemented');
}

export async function suspendVendor(vendorId, reason) {
  // TODO: supabase.from('stores').update({ status: 'suspended', suspension_reason: reason })
  throw new Error('Not implemented');
}

export async function fetchPlatformAnalytics({ period = '30d' } = {}) {
  // TODO: supabase.rpc('platform_analytics', { period })
  throw new Error('Not implemented');
}

export async function fetchInventoryHealth() {
  // TODO: aggregate low-stock and out-of-stock counts across all stores
  throw new Error('Not implemented');
}

export async function fetchLiveOrderStream({ limit = 50 } = {}) {
  // TODO: supabase.from('orders').select('*').order('placed_at', { ascending: false }).limit(limit)
  throw new Error('Not implemented');
}
