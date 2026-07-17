import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function VendorSettings() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const [prefs, setPrefs] = useState({ orderAlerts: true, lowStockAlerts: true, weeklyBrief: true, defaultThreshold: 5 });

  const logout = () => { dispatch({ type: 'SET_SESSION', payload: null }); nav('/'); };

  return (
    <div className="max-w-3xl space-y-5" data-testid="vendor-settings">
      <div>
        <div className="label-mono">Preferences</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Vendor settings</h2>
      </div>

      <div className="card p-5">
        <div className="label-mono">Account</div>
        <div className="mt-2 grid md:grid-cols-2 gap-3">
          <div><label className="label-mono block mb-1">Name</label><input className="input" value={state.session?.name || ''} readOnly/></div>
          <div><label className="label-mono block mb-1">Email</label><input className="input" value={state.session?.email || ''} readOnly/></div>
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <div className="label-mono">Notifications</div>
        <Toggle label="New order alerts" v={prefs.orderAlerts} onChange={v => setPrefs(p => ({...p, orderAlerts: v}))} testId="tg-order"/>
        <Toggle label="Low-stock alerts" v={prefs.lowStockAlerts} onChange={v => setPrefs(p => ({...p, lowStockAlerts: v}))} testId="tg-lowstock"/>
        <Toggle label="Weekly Sentinel brief" v={prefs.weeklyBrief} onChange={v => setPrefs(p => ({...p, weeklyBrief: v}))} testId="tg-brief"/>
      </div>

      <div className="card p-5">
        <div className="label-mono">Inventory defaults</div>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm">Default low-stock threshold</span>
          <input type="number" value={prefs.defaultThreshold} onChange={e => setPrefs(p => ({...p, defaultThreshold: +e.target.value}))} className="input !w-24" data-testid="v-thres"/>
        </div>
      </div>

      <div className="card p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="label-mono">Appearance</div>
        <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })} className="btn btn-ghost" data-testid="v-theme">
          {state.theme === 'dark' ? <><Sun size={14}/>Light</> : <><Moon size={14}/>Dark</>}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => toast({ title: 'Preferences saved', kind: 'success' })} className="btn btn-primary" data-testid="v-save-prefs">Save preferences</button>
        <button onClick={logout} className="btn btn-ghost !text-danger" data-testid="v-logout"><LogOut size={14}/>Log out</button>
      </div>
    </div>
  );
}

function Toggle({ label, v, onChange, testId }) {
  return (
    <label className="flex items-center justify-between text-sm py-1" data-testid={testId}>
      <span>{label}</span>
      <button onClick={() => onChange(!v)} className={`w-10 h-5 rounded-full transition-colors relative ${v ? 'bg-brand' : 'bg-line'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${v ? 'left-5' : 'left-0.5'}`}/>
      </button>
    </label>
  );
}
