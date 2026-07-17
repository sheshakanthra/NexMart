// TODO Phase 4: Implement with Supabase Realtime channels
// import { supabase } from '../lib/supabase';

export async function fetchNotifications(userId, { unreadOnly = false, limit = 50 } = {}) {
  // TODO: supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit)
  throw new Error('Not implemented');
}

export async function markAllRead(userId) {
  // TODO: supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
  throw new Error('Not implemented');
}

export async function clearNotifications(userId) {
  // TODO: supabase.from('notifications').delete().eq('user_id', userId)
  throw new Error('Not implemented');
}

export function subscribeToNotifications(userId, onNotification) {
  // TODO Phase 4:
  // const channel = supabase
  //   .channel(`notifications:${userId}`)
  //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, onNotification)
  //   .subscribe();
  // return () => supabase.removeChannel(channel);
  return () => {}; // unsubscribe noop until Phase 4
}
