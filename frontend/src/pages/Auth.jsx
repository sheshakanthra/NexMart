import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag, Store, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as authService from '../services/authService';

const DEMO_USERS = {
  customer: { role: 'customer', name: 'Arjun R.',    email: 'arjun@nexmart.demo' },
  vendor:   { role: 'vendor',   name: 'Krishnan R.', email: 'krishnan@nexmart.demo', storeId: 's_0' },
  admin:    { role: 'admin',    name: 'Priya Admin',  email: 'priya@nexmart.admin' },
};

export default function Auth() {
  const [params] = useSearchParams();
  const initialRole = params.get('role') || 'customer';
  const initialTab  = params.get('tab') === 'signup' ? 'signup' : 'login';

  const [tab,        setTab]        = useState(initialTab);
  const [role,       setRole]       = useState(initialRole);
  const [form,       setForm]       = useState({ name: '', email: '', password: '' });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [authError,  setAuthError]  = useState(null);

  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();

  // Navigate automatically once auth is ready and session is established.
  // Handles both real Supabase sign-in (async onAuthStateChange) and one-tap demo.
  useEffect(() => {
    if (state.authReady && state.session) {
      nav(`/${state.session.role}`, { replace: true });
    }
  }, [state.session, state.authReady, nav]);

  // One-tap demo — sets a local mock session (no Supabase call)
  const oneTap = (r) => {
    const u = DEMO_USERS[r];
    dispatch({ type: 'SET_SESSION', payload: u });
    toast({ title: `Signed in as ${r}`, kind: 'success' });
  };

  const validate = (mode) => {
    const e = {};
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if ((form.password || '').length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate(tab)) return;

    setSubmitting(true);
    setAuthError(null);

    try {
      if (tab === 'login') {
        await authService.signIn({ email: form.email, password: form.password });
        // onAuthStateChange in AppContext dispatches SET_SESSION → useEffect above navigates
      } else {
        const result = await authService.signUp({
          email:    form.email,
          password: form.password,
          name:     form.name,
          role,
        });
        if (!result?.data?.session) {
          // Supabase email confirmation is enabled — user must verify before signing in
          toast({ title: 'Check your email', body: 'Verify your address to complete sign-up.', kind: 'info' });
          setSubmitting(false);
          return;
        }
        // Auto-confirmed: onAuthStateChange fires and navigates
      }
      toast({ title: tab === 'login' ? 'Welcome back' : 'Account created', body: form.email, kind: 'success' });
    } catch (err) {
      setAuthError(err?.message ?? 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex">
      {/* Left */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-sub hover:text-ink" data-testid="auth-back-home">
          <ArrowLeft size={14}/> Back home
        </Link>

        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-6 rounded bg-brand"/>
            <span className="font-display font-bold text-lg">NexMart</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            {tab === 'login' ? 'Sign in to your OS.' : 'Create your NexMart account.'}
          </h1>
          <p className="text-sub text-sm mt-2">
            {tab === 'login' ? 'Or jump into a role — no signup needed.' : 'Or one-tap explore any module below.'}
          </p>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-3 gap-2" data-testid="auth-role-tabs">
            {['customer','vendor','admin'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                data-testid={`auth-role-${r}`}
                className={`btn h-10 !px-2 justify-center capitalize ${role === r ? 'btn-dark' : 'btn-ghost'}`}
              >
                {r === 'customer' ? <ShoppingBag size={14}/> : r === 'vendor' ? <Store size={14}/> : <Shield size={14}/> }
                {r}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="mt-6 space-y-3">
            {tab === 'signup' && (
              <div>
                <label className="label-mono block mb-1">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="input" placeholder="Your name" data-testid="auth-name" />
                {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="label-mono block mb-1">Email</label>
              <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                className="input" placeholder="you@example.com" data-testid="auth-email" />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label-mono block mb-1">Password</label>
              <input value={form.password} type="password" onChange={e => setForm(f => ({...f, password: e.target.value}))}
                className="input" placeholder="••••••••" data-testid="auth-password" />
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
            </div>

            {authError && (
              <p className="text-danger text-sm py-2 px-3 rounded bg-danger/10 border border-danger/20">{authError}</p>
            )}

            <button type="submit" className="btn btn-primary w-full justify-center h-11" data-testid="auth-submit" disabled={submitting}>
              {submitting ? 'Please wait…' : (tab === 'login' ? 'Sign in' : 'Create account')}
              {!submitting && <ArrowRight size={14}/>}
            </button>
          </form>

          <div className="mt-4 text-sm text-sub">
            {tab === 'login' ? (
              <>New here?{' '}
                <button className="text-ink underline underline-offset-2" onClick={() => setTab('signup')} data-testid="auth-switch-signup">Create an account</button>
              </>
            ) : (
              <>Already have one?{' '}
                <button className="text-ink underline underline-offset-2" onClick={() => setTab('login')} data-testid="auth-switch-login">Sign in</button>
              </>
            )}
          </div>

          <div className="mt-8 border-t divider pt-6">
            <div className="label-mono mb-3 flex items-center gap-2"><Sparkles size={12}/> Explore as</div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => oneTap('customer')} className="btn btn-ghost h-10 justify-center" data-testid="onetap-customer"><ShoppingBag size={14}/>Customer</button>
              <button onClick={() => oneTap('vendor')}   className="btn btn-ghost h-10 justify-center" data-testid="onetap-vendor"><Store size={14}/>Vendor</button>
              <button onClick={() => oneTap('admin')}    className="btn btn-ghost h-10 justify-center" data-testid="onetap-admin"><Shield size={14}/>Admin</button>
            </div>
            <p className="text-[11px] text-sub mt-2 font-mono">Demo mode — mock session, no real account needed.</p>
          </div>
        </div>

        <div className="text-xs text-sub font-mono">© 2026 NexMart</div>
      </div>

      {/* Right pane */}
      <div className="hidden lg:flex flex-1 grid-bg border-l divider items-center justify-center p-10 relative overflow-hidden">
        <div className="max-w-md">
          <div className="chip chip-brand mb-4">The three-sided marketplace</div>
          <h2 className="font-display text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
            One tap in.<br/>
            Every dashboard, populated with realistic mock data.
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-sub">
            <li className="flex items-start gap-3"><ShoppingBag size={16} className="mt-0.5"/><span>Customer sees stores, live stock, and can complete a full order.</span></li>
            <li className="flex items-start gap-3"><Store size={16} className="mt-0.5"/><span>Vendor gets the full command center — orders, inventory, analytics, Sentinel.</span></li>
            <li className="flex items-start gap-3"><Shield size={16} className="mt-0.5"/><span>Admin sees platform GMV, demand map, live order stream, and a simulator.</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
