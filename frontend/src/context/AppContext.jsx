import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { buildStores, buildOrders, ORDER_STAGES } from '../data/mock';
import { uid } from '../lib/utils';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

const initialStores = buildStores();
const initialOrders = buildOrders(initialStores);

const initialState = {
  // ── Auth ────────────────────────────────────────────────────────────────
  // session is always null on startup; restored by Supabase or localStorage
  // depending on whether Supabase is configured (see AppProvider below).
  session:   null,
  authReady: false, // true once auth state is known — guards RequireRole redirects

  // ── UI ──────────────────────────────────────────────────────────────────
  theme:        localStorage.getItem('nm_theme')        || 'dark',
  neighborhood: localStorage.getItem('nm_neighborhood') || 'T. Nagar',

  // ── Customer state ──────────────────────────────────────────────────────
  cart:      JSON.parse(localStorage.getItem('nm_cart')       || '[]'),
  wishlist:  JSON.parse(localStorage.getItem('nm_wishlist')   || '[]'),
  addresses: JSON.parse(localStorage.getItem('nm_addresses')  || 'null') || [
    { id: 'a1', label: 'Home', name: 'Arjun R.', phone: '+91 98400 12345', line1: '4B, Second Main Rd', line2: 'Kasturba Nagar', neighborhood: 'Adyar' },
  ],
  profile: JSON.parse(localStorage.getItem('nm_profile') || 'null') || { name: 'Arjun R.', email: 'arjun@nexmart.demo', phone: '+91 98400 12345' },

  // ── Mock data (replaced per-domain in future phases) ────────────────────
  stores:  initialStores,
  orders:  initialOrders,

  // ── Notifications ────────────────────────────────────────────────────────
  notifications: [],

  // ── Simulator ────────────────────────────────────────────────────────────
  simulator: { on: false, intensity: 'normal', generated: 0 },
};

function reducer(state, action) {
  switch (action.type) {
    // ── Auth ──────────────────────────────────────────────────────────────
    case 'SET_SESSION': return { ...state, session: action.payload };
    case 'AUTH_READY':  return { ...state, authReady: true };

    // ── UI ────────────────────────────────────────────────────────────────
    case 'SET_THEME':        return { ...state, theme: action.payload };
    case 'SET_NEIGHBORHOOD': return { ...state, neighborhood: action.payload };
    case 'SET_PROFILE':      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'SET_ADDRESSES':    return { ...state, addresses: action.payload };

    // ── Cart ──────────────────────────────────────────────────────────────
    case 'CART_ADD': {
      const { productId, storeId, name, price, unit, img, qty = 1 } = action.payload;
      const idx = state.cart.findIndex(i => i.productId === productId);
      const cart = idx >= 0
        ? state.cart.map((i, k) => k === idx ? { ...i, qty: i.qty + qty } : i)
        : [...state.cart, { productId, storeId, name, price, unit, img, qty }];
      return { ...state, cart };
    }
    case 'CART_SET_QTY': {
      const cart = state.cart
        .map(i => i.productId === action.payload.productId ? { ...i, qty: action.payload.qty } : i)
        .filter(i => i.qty > 0);
      return { ...state, cart };
    }
    case 'CART_REMOVE':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) };
    case 'CART_CLEAR':
      return { ...state, cart: [] };

    // ── Wishlist ──────────────────────────────────────────────────────────
    case 'WISHLIST_TOGGLE': {
      const has = state.wishlist.includes(action.payload);
      return { ...state, wishlist: has ? state.wishlist.filter(x => x !== action.payload) : [...state.wishlist, action.payload] };
    }

    // ── Products / Stock ──────────────────────────────────────────────────
    case 'UPDATE_STOCK': {
      const { storeId, productId, stock } = action.payload;
      return {
        ...state,
        stores: state.stores.map(s => s.id !== storeId ? s : {
          ...s,
          products: s.products.map(p => p.id !== productId ? p : { ...p, stock: Math.max(0, stock) }),
        }),
      };
    }
    case 'UPDATE_PRODUCT': {
      const { storeId, productId, patch } = action.payload;
      return {
        ...state,
        stores: state.stores.map(s => s.id !== storeId ? s : {
          ...s,
          products: s.products.map(p => p.id !== productId ? p : { ...p, ...patch }),
        }),
      };
    }
    case 'ADD_PRODUCT': {
      const { storeId, product } = action.payload;
      return {
        ...state,
        stores: state.stores.map(s => s.id !== storeId ? s : { ...s, products: [product, ...s.products] }),
      };
    }
    case 'DELETE_PRODUCT': {
      const { storeId, productId } = action.payload;
      return {
        ...state,
        stores: state.stores.map(s => s.id !== storeId ? s : { ...s, products: s.products.filter(p => p.id !== productId) }),
      };
    }

    // ── Orders ────────────────────────────────────────────────────────────
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER': {
      const { id, patch } = action.payload;
      return { ...state, orders: state.orders.map(o => o.id === id ? { ...o, ...patch } : o) };
    }

    // ── Stores ────────────────────────────────────────────────────────────
    case 'UPDATE_STORE': {
      const { storeId, patch } = action.payload;
      return { ...state, stores: state.stores.map(s => s.id === storeId ? { ...s, ...patch } : s) };
    }

    // ── Notifications ─────────────────────────────────────────────────────
    case 'NOTIFY': {
      const n = { id: uid('n'), createdAt: Date.now(), read: false, ...action.payload };
      return { ...state, notifications: [n, ...state.notifications].slice(0, 50) };
    }
    case 'NOTIF_READ_ALL':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'NOTIF_CLEAR':
      return { ...state, notifications: [] };

    // ── Simulator ─────────────────────────────────────────────────────────
    case 'SIM_SET':
      return { ...state, simulator: { ...state.simulator, ...action.payload } };

    default:
      return state;
  }
}

// ─── Module-level helper (not a hook) ────────────────────────────────────────
// Fetches the profile row from Supabase and shapes it into the session object
// the rest of the frontend expects: { id, role, name, email, phone, storeId }.
async function resolveProfileSession(supabaseSession) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email, phone, store_id')
      .eq('id', supabaseSession.user.id)
      .single();

    if (error) throw error;

    return {
      id:      supabaseSession.user.id,
      email:   profile.email      || supabaseSession.user.email,
      role:    profile.role       || 'customer',
      name:    profile.full_name  || supabaseSession.user.email?.split('@')[0] || 'User',
      phone:   profile.phone      || null,
      storeId: profile.store_id   || null,
    };
  } catch {
    // Profile row doesn't exist yet (trigger hasn't run) — fall back to auth metadata
    const meta = supabaseSession.user.user_metadata || {};
    return {
      id:      supabaseSession.user.id,
      email:   supabaseSession.user.email,
      role:    meta.role      || 'customer',
      name:    meta.full_name || supabaseSession.user.email?.split('@')[0] || 'User',
      phone:   null,
      storeId: null,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toasts, setToasts] = useState([]);

  // ── Track whether the active session came from Supabase (vs. one-tap demo) ─
  const isSupabaseSession = useRef(false);

  // ── Auth initialization ───────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) {
      // No Supabase configured — restore legacy mock session from localStorage
      const saved = JSON.parse(localStorage.getItem('nm_session') || 'null');
      if (saved) dispatch({ type: 'SET_SESSION', payload: saved });
      dispatch({ type: 'AUTH_READY' });
      return;
    }

    let mounted = true;

    // Restore an existing Supabase session (handles page refresh / returning user)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        const profile = await resolveProfileSession(session);
        if (!mounted) return;
        isSupabaseSession.current = true;
        dispatch({ type: 'SET_SESSION', payload: profile });
      }
      dispatch({ type: 'AUTH_READY' });
    });

    // Subscribe to future auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
        const profile = await resolveProfileSession(session);
        if (!mounted) return;
        isSupabaseSession.current = true;
        dispatch({ type: 'SET_SESSION', payload: profile });
        dispatch({ type: 'AUTH_READY' });
      } else if (event === 'SIGNED_OUT') {
        isSupabaseSession.current = false;
        dispatch({ type: 'SET_SESSION', payload: null });
      }
      // TOKEN_REFRESHED: Supabase handles transparently — no state change needed
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync logout: when session is cleared locally, sign out of Supabase ────
  // Pages dispatch SET_SESSION → null directly (Profile, VendorSettings, AdminSettings).
  // This effect detects that and mirrors it to Supabase.
  useEffect(() => {
    if (!state.authReady || !supabase) return;
    if (state.session === null && isSupabaseSession.current) {
      isSupabaseSession.current = false;
      supabase.auth.signOut().catch(console.error);
    }
  }, [state.session, state.authReady]);

  // ── Expose signOut as a first-class action (used by page logout buttons) ──
  const signOut = useCallback(async () => {
    if (supabase && isSupabaseSession.current) {
      isSupabaseSession.current = false;
      await supabase.auth.signOut().catch(console.error);
    }
    dispatch({ type: 'SET_SESSION', payload: null });
  }, []);

  // ── Persist select slices to localStorage ────────────────────────────────
  useEffect(() => { localStorage.setItem('nm_session',      JSON.stringify(state.session));   }, [state.session]);
  useEffect(() => { localStorage.setItem('nm_cart',         JSON.stringify(state.cart));       }, [state.cart]);
  useEffect(() => { localStorage.setItem('nm_wishlist',     JSON.stringify(state.wishlist));   }, [state.wishlist]);
  useEffect(() => { localStorage.setItem('nm_theme',        state.theme); document.documentElement.classList.toggle('dark', state.theme === 'dark'); }, [state.theme]);
  useEffect(() => { localStorage.setItem('nm_neighborhood', state.neighborhood);               }, [state.neighborhood]);
  useEffect(() => { localStorage.setItem('nm_addresses',    JSON.stringify(state.addresses));  }, [state.addresses]);
  useEffect(() => { localStorage.setItem('nm_profile',      JSON.stringify(state.profile));    }, [state.profile]);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const toast = (opts) => {
    const t = { id: uid('t'), ...opts };
    setToasts(prev => [...prev, t]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), opts.duration || 3200);
  };

  // ── Realtime simulation loop (stock ticks + order progression + notifications) ─
  const simRef = useRef({ tick: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      simRef.current.tick += 1;
      const intensity = state.simulator.on ? (state.simulator.intensity === 'flash' ? 3 : state.simulator.intensity === 'rush' ? 2 : 1.4) : 1;

      // Advance a small number of orders in flight
      const active = state.orders.filter(o => ORDER_STAGES.indexOf(o.status) < ORDER_STAGES.length - 1 && o.status !== 'cancelled');
      const advanceCount = Math.min(active.length, Math.random() < 0.6 * intensity ? 1 : 0);
      for (let i = 0; i < advanceCount; i++) {
        const target = active[Math.floor(Math.random() * active.length)];
        if (!target) continue;
        const idx = ORDER_STAGES.indexOf(target.status);
        if (idx >= ORDER_STAGES.length - 1) continue;
        const nextStage = ORDER_STAGES[idx + 1];
        const timeline = target.timeline.map((s, k) => k === idx + 1 ? { ...s, at: Date.now(), done: true, active: nextStage !== 'delivered' } : k === idx ? { ...s, active: false } : s);
        dispatch({ type: 'UPDATE_ORDER', payload: { id: target.id, patch: { status: nextStage, timeline } } });
      }

      // Occasionally simulate stock decrement
      if (Math.random() < 0.5 * intensity) {
        const s = state.stores[Math.floor(Math.random() * state.stores.length)];
        if (s && s.products.length) {
          const p = s.products[Math.floor(Math.random() * s.products.length)];
          if (p && p.stock > 0) {
            dispatch({ type: 'UPDATE_STOCK', payload: { storeId: s.id, productId: p.id, stock: p.stock - 1 } });
          }
        }
      }

      // Simulator generates new orders
      if (state.simulator.on && Math.random() < 0.6 * intensity) {
        const s = state.stores[Math.floor(Math.random() * Math.min(state.stores.length, 10))];
        if (s) {
          const p = s.products[Math.floor(Math.random() * s.products.length)];
          const qty = 1 + Math.floor(Math.random() * 3);
          const subtotal = p.price * qty;
          const newOrder = {
            id: `NM${Math.floor(90000 + Math.random() * 9000)}`,
            storeId: s.id,
            storeName: s.name,
            neighborhood: s.neighborhood,
            customer: ['Arjun R.','Divya S.','Karthik M.','Priya V.','Rahul K.'][Math.floor(Math.random() * 5)],
            customerAddress: `${Math.floor(Math.random()*80+10)}, ${s.neighborhood}, Chennai`,
            items: [{ productId: p.id, name: p.name, price: p.price, qty, unit: p.unit, img: p.img }],
            subtotal, deliveryFee: 25, total: subtotal + 25,
            status: 'placed',
            placedAt: Date.now(),
            timeline: [{ key:'placed', label:'Placed', at: Date.now(), done:true, active:true }, ...['accepted','packed','out_for_delivery','delivered'].map(k=>({ key:k, label: k, at:null, done:false, active:false }))],
            payment: Math.random() > 0.5 ? 'UPI' : 'COD',
          };
          dispatch({ type: 'ADD_ORDER', payload: newOrder });
          dispatch({ type: 'SIM_SET', payload: { generated: state.simulator.generated + 1 } });
          dispatch({ type: 'NOTIFY', payload: { title: 'New order', body: `${newOrder.id} · ${s.name} · ₹${subtotal + 25}`, kind: 'order' } });
        }
      }
    }, 3500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.simulator.on, state.simulator.intensity]);

  const value = useMemo(
    () => ({ state, dispatch, toast, toasts, signOut }),
    [state, toasts, signOut]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useSession() {
  const { state } = useApp();
  return state.session;
}
