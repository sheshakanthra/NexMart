import { supabase } from '../lib/supabase';
import { ApiError, handleApiError } from '../lib/apiError';

const BUCKET = 'product-images';

function require() {
  if (!supabase) throw new ApiError('Supabase not configured', 'NO_CLIENT', 503);
}

export async function uploadProductImage(storeId, file) {
  require();
  try {
    const ext  = file.name.split('.').pop() || 'jpg';
    const path = `${storeId}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) throw ApiError.fromSupabase(upErr);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) { handleApiError(err); }
}

export async function deleteProductImage(path) {
  require();
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw ApiError.fromSupabase(error);
  } catch (err) { handleApiError(err); }
}

export function getPublicUrl(path) {
  if (!supabase) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
