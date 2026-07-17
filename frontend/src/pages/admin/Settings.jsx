import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminSettings() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const [cfg, setCfg] = useState({ commissionPct: 8, deliveryFee: 25, autoApprove: false });
  const logout = () => { dispatch({ type: 'SET_SESSION', payload: null }); nav('/'); };

  return (
    <div className="max-w-3xl space-y-5" data-testid="admin-settings">
      <div>
        <div className="label-mono">Configuration</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Admin settings</h2>
      </div>

      <div className="card p-5">
        <div className="label-mono">Account</div>
        <div className="mt-2 grid md:grid-cols-2 gap-3">
          <div><label className="label-mono block mb-1">Name</label><input className="input" value={state.session?.name || ''} readOnly/></div>
          <div><label className="label-mono block mb-1">Email</label><input className="input" value={state.session?.email || ''} readOnly/></div>
        </div>
      </div>

      <div className="card p-5">
        <div className="label-mono">Platform</div>
        <div className="mt-2 grid md:grid-cols-2 gap-3">
          <div><label className="label-mono block mb-1">Commission %</label><input type="number" value={cfg.commissionPct} onChange={e => setCfg(c => ({...c, commissionPct: +e.target.value}))} className="input" data-testid="cfg-comm"/></div>
          <div><label className="label-mono block mb-1">Default delivery fee ₹</label><input type="number" value={cfg.deliveryFee} onChange={e => setCfg(c => ({...c, deliveryFee: +e.target.value}))} className="input" data-testid="cfg-fee"/></div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={cfg.autoApprove} onChange={e => setCfg(c => ({...c, autoApprove: e.target.checked}))} data-testid="cfg-auto"/>
          Auto-approve verified vendors
        </label>
      </div>

      <div className="card p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="label-mono">Appearance</div>
        <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })} className="btn btn-ghost" data-testid="a-theme">
          {state.theme === 'dark' ? <><Sun size={14}/>Light</> : <><Moon size={14}/>Dark</>}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => toast({ title: 'Settings saved', kind: 'success' })} className="btn btn-primary" data-testid="a-save-cfg">Save changes</button>
        <button onClick={logout} className="btn btn-ghost !text-danger" data-testid="a-logout"><LogOut size={14}/>Log out</button>
      </div>
    </div>
  );
}
