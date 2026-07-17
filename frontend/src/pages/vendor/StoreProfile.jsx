import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusChip } from '../../components/Chip';
import { NEIGHBORHOODS } from '../../data/mock';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function StoreProfile() {
  const { state, dispatch, toast } = useApp();
  const storeId = state.session?.storeId || 's_0';
  const store = state.stores.find(s => s.id === storeId) || state.stores[0];
  const [form, setForm] = useState({
    name: store.name, description: store.description || `${store.name} — trusted neighborhood provisions.`,
    neighborhood: store.neighborhood, deliveryRadiusKm: store.deliveryRadiusKm, open: store.open,
    hours: store.hours,
  });

  const save = () => {
    dispatch({ type: 'UPDATE_STORE', payload: { storeId, patch: form } });
    toast({ title: 'Store profile updated', kind: 'success' });
  };

  return (
    <div className="max-w-4xl space-y-5" data-testid="store-profile-page">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Public identity</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">{store.name}</h2>
          <div className="mt-1"><StatusChip status={store.status}/></div>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer" data-testid="store-open-toggle">
          <input type="checkbox" checked={form.open} onChange={e => setForm(f => ({...f, open: e.target.checked}))} />
          <span>{form.open ? 'Open for orders' : 'Closed'}</span>
        </label>
      </div>

      <div className="card p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="label-mono block mb-1">Store name</label><input className="input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} data-testid="sp-name"/></div>
          <div><label className="label-mono block mb-1">Neighborhood</label>
            <select className="input" value={form.neighborhood} onChange={e => setForm(f => ({...f, neighborhood: e.target.value}))} data-testid="sp-neigh">
              {NEIGHBORHOODS.map(n => <option key={n}>{n}</option>)}
            </select></div>
        </div>
        <div><label className="label-mono block mb-1">Description</label><textarea className="input !h-24 pt-2" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} data-testid="sp-desc"/></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="label-mono block mb-1">Delivery radius (km)</label><input type="number" className="input" value={form.deliveryRadiusKm} onChange={e => setForm(f => ({...f, deliveryRadiusKm: +e.target.value}))} data-testid="sp-radius"/></div>
          <div><label className="label-mono block mb-1">Hours</label><input className="input" value={form.hours} onChange={e => setForm(f => ({...f, hours: e.target.value}))} data-testid="sp-hours"/></div>
        </div>
      </div>

      <div className="card p-5">
        <div className="label-mono">Location</div>
        <div className="mt-2 aspect-[3/1] rounded overflow-hidden bg-muted striped grid-bg relative">
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapPin size={26} className="text-brand"/>
            <div className="mt-1 text-sm text-sub">Pin: {form.neighborhood} · Chennai</div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="label-mono">Weekly hours</div>
        <div className="grid md:grid-cols-7 gap-2 mt-3">
          {DAYS.map(d => (
            <div key={d} className="card p-3">
              <div className="label-mono">{d}</div>
              <div className="text-sm mt-1 font-mono">7:00 – 22:00</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button onClick={() => setForm({ name: store.name, description: store.description || '', neighborhood: store.neighborhood, deliveryRadiusKm: store.deliveryRadiusKm, open: store.open, hours: store.hours })} className="btn btn-ghost">Reset</button>
        <button onClick={save} className="btn btn-primary" data-testid="sp-save">Save changes</button>
      </div>
    </div>
  );
}
