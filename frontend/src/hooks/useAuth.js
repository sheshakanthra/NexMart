import { useApp } from '../context/AppContext';

// Reads auth state from AppContext (managed by Supabase onAuthStateChange).
// data shape: { id, role, name, email, phone, storeId } | null
export function useAuth() {
  const { state, signOut } = useApp();

  return {
    loading:  !state.authReady,
    error:    null,
    data:     state.session,
    signOut,
    refetch:  () => {}, // session is managed by onAuthStateChange — no manual fetch needed
  };
}
