import { supabase } from '../lib/supabase';
import { ApiError, handleApiError } from '../lib/apiError';

function require() {
  if (!supabase) throw new ApiError('Supabase not configured', 'NO_CLIENT', 503);
}

export async function fetchCategories() {
  require();
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (error) throw ApiError.fromSupabase(error);
    return data;
  } catch (err) { handleApiError(err); }
}
