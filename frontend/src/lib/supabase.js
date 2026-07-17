import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[NexMart] REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY not set — ' +
    'running in demo mode (one-tap sessions only).'
  );
}

export const supabaseConfig = {
  url:     SUPABASE_URL     ?? '',
  anonKey: SUPABASE_ANON_KEY ?? '',
};

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession:      true,
          storageKey:          'nm_sb_session', // distinct from legacy nm_session
          autoRefreshToken:    true,
          detectSessionInUrl:  true,
        },
      })
    : null;
