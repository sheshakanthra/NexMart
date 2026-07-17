import { supabase } from '../lib/supabase';
import { ApiError } from '../lib/apiError';

function require() {
  if (!supabase) throw new ApiError('Supabase not configured — set env vars', 'SUPABASE_NOT_CONFIGURED', 503);
}

export async function signIn({ email, password }) {
  require();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw ApiError.fromSupabase(error);
  return data;
}

export async function signUp({ email, password, name, role = 'customer' }) {
  require();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, role } },
  });
  if (error) throw ApiError.fromSupabase(error);
  return data;
}

export async function signOut() {
  require();
  const { error } = await supabase.auth.signOut();
  if (error) throw ApiError.fromSupabase(error);
}

export async function getSession() {
  require();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw ApiError.fromSupabase(error);
  return data.session;
}

export async function resetPassword(email) {
  require();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw ApiError.fromSupabase(error);
}

export async function updatePassword(newPassword) {
  require();
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw ApiError.fromSupabase(error);
  return data;
}

export async function fetchProfile(userId) {
  require();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, email, phone, store_id, created_at, updated_at')
    .eq('id', userId)
    .single();
  if (error) throw ApiError.fromSupabase(error);
  return data;
}

export async function updateProfile(userId, patch) {
  require();
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw ApiError.fromSupabase(error);
  return data;
}
