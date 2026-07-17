import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag, Store, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DEMO_USERS = {
  customer: { role: 'customer', name: 'Arjun R.', email: 'arjun@nexmart.demo' },
  vendor:   { role: 'vendor', name: 'Krishnan R.', email: 'krishnan@nexmart.demo', storeId: 's_0' },
  admin:    { role: 'admin', name: 'Priya Admin', email: 'priya@nexmart.admin' },
};

export default function Auth() {
  const [params] = useSearchParams();
  const initialRole = params.get('role') || 'customer';
  const initialTab = params.get('tab') === 'signup' ? 'signup' : 'login';
  const [tab, setTab] = useState(initialTab);
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { dispatch, toast } = useApp();
  const nav = useNavigate();

  const oneTap = (r) => {
    const u = DEMO_USERS[r];
    dispatch({ type: 'SET_SESSION', payload: u });
    toast({ title: `Signed in as ${r}`, kind: 'success' });
    nav(`/${r}`);
  };

  const validate = (mode) => {
    const e = {};
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if ((form.password || '').length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate(tab)) return;
    const u = DEMO_USERS[role];
    const merged = { ...u, name: tab === 'signup' ? form.name : u.name, email: form.email };
    dispatch({ type: 'SET_SESSION', payload: merged });
    toast({ title: tab === 'signup' ? 'Account created' : 'Welcome back', body: form.email, kind: 'success' });
    nav(`/${role}`);
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
            <button type="submit" className="btn btn-primary w-full justify-center h-11" data-testid="auth-submit">
              {tab === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={14}/>
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
              <button onClick={() => oneTap('vendor')} className="btn btn-ghost h-10 justify-center" data-testid="onetap-vendor"><Store size={14}/>Vendor</button>
              <button onClick={() => oneTap('admin')} className="btn btn-ghost h-10 justify-center" data-testid="onetap-admin"><Shield size={14}/>Admin</button>
            </div>
            <p className="text-[11px] text-sub mt-2 font-mono">No real authentication. Mock session persists locally.</p>
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
