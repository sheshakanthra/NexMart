import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modal';
import { NEIGHBORHOODS } from '../../data/mock';
import { uid } from '../../lib/utils';

export default function Profile() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const [profile, setProfile] = useState(state.profile);
  const [addrOpen, setAddrOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const save = () => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
    toast({ title: 'Profile updated', kind: 'success' });
  };

  const logout = () => {
    dispatch({ type: 'SET_SESSION', payload: null });
    nav('/');
  };

  const saveAddress = (a) => {
    const exists = state.addresses.some(x => x.id === a.id);
    const newList = exists ? state.addresses.map(x => x.id === a.id ? a : x) : [...state.addresses, a];
    dispatch({ type: 'SET_ADDRESSES', payload: newList });
    setAddrOpen(false);
    toast({ title: exists ? 'Address updated' : 'Address added', kind: 'success' });
  };

  const removeAddress = (id) => {
    dispatch({ type: 'SET_ADDRESSES', payload: state.addresses.filter(x => x.id !== id) });
    toast({ title: 'Address removed', kind: 'success' });
  };

  return (
    <div className="space-y-6 max-w-3xl" data-testid="profile-page">
      <div>
        <div className="label-mono">Account</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Your profile</h2>
      </div>

      <div className="card p-5">
        <h3 className="font-display text-lg font-semibold">Profile info</h3>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div><label className="label-mono block mb-1">Name</label>
            <input className="input" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} data-testid="pf-name"/></div>
          <div><label className="label-mono block mb-1">Phone</label>
            <input className="input" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} data-testid="pf-phone"/></div>
          <div className="md:col-span-2"><label className="label-mono block mb-1">Email</label>
            <input className="input" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} data-testid="pf-email"/></div>
        </div>
        <button onClick={save} className="btn btn-primary mt-4" data-testid="pf-save">Save changes</button>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Saved addresses</h3>
          <button onClick={() => { setEditing({ id: uid('a'), label: 'Home', name: profile.name, phone: profile.phone, line1: '', line2: '', neighborhood: state.neighborhood }); setAddrOpen(true); }} className="btn btn-ghost" data-testid="addr-add"><Plus size={14}/>Add</button>
        </div>
        <ul className="mt-3 divide-y divider">
          {state.addresses.map(a => (
            <li key={a.id} className="py-3 flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{a.label} · {a.name}</div>
                <div className="text-sm text-sub">{a.line1}{a.line2 ? ', ' + a.line2 : ''}, {a.neighborhood}</div>
                <div className="text-xs text-sub font-mono">{a.phone}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(a); setAddrOpen(true); }} className="btn btn-ghost !h-8" data-testid={`addr-edit-${a.id}`}><Pencil size={12}/></button>
                <button onClick={() => removeAddress(a.id)} className="btn btn-ghost !h-8 !text-danger" data-testid={`addr-del-${a.id}`}><Trash2 size={12}/></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Preferences</div>
          <div className="font-medium mt-1">Neighborhood: <select value={state.neighborhood} onChange={e => dispatch({ type: 'SET_NEIGHBORHOOD', payload: e.target.value })} className="input !inline-block !w-auto !h-8 ml-2" data-testid="pf-nb"> {NEIGHBORHOODS.map(n => <option key={n}>{n}</option>)}</select></div>
        </div>
        <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })} className="btn btn-ghost" data-testid="pf-theme">
          {state.theme === 'dark' ? <><Sun size={14}/>Light theme</> : <><Moon size={14}/>Dark theme</>}
        </button>
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div><div className="label-mono">Session</div><div className="text-sm text-sub mt-1">You’re signed in as {state.session?.name}</div></div>
        <button onClick={logout} className="btn btn-ghost !text-danger" data-testid="pf-logout"><LogOut size={14}/>Log out</button>
      </div>

      <Modal open={addrOpen} onClose={() => setAddrOpen(false)} title={editing?.id?.startsWith('a_') ? 'Edit address' : 'Add address'}
        footer={<><button onClick={() => setAddrOpen(false)} className="btn btn-ghost">Cancel</button><button onClick={() => saveAddress(editing)} className="btn btn-primary" data-testid="addr-save">Save</button></>}>
        {editing && (
          <div className="grid md:grid-cols-2 gap-3">
            <div><label className="label-mono block mb-1">Label</label><input className="input" value={editing.label} onChange={e => setEditing(a => ({...a, label: e.target.value}))}/></div>
            <div><label className="label-mono block mb-1">Name</label><input className="input" value={editing.name} onChange={e => setEditing(a => ({...a, name: e.target.value}))}/></div>
            <div><label className="label-mono block mb-1">Phone</label><input className="input" value={editing.phone} onChange={e => setEditing(a => ({...a, phone: e.target.value}))}/></div>
            <div><label className="label-mono block mb-1">Neighborhood</label>
              <select className="input" value={editing.neighborhood} onChange={e => setEditing(a => ({...a, neighborhood: e.target.value}))}>{NEIGHBORHOODS.map(n => <option key={n}>{n}</option>)}</select></div>
            <div className="md:col-span-2"><label className="label-mono block mb-1">Line 1</label><input className="input" value={editing.line1} onChange={e => setEditing(a => ({...a, line1: e.target.value}))}/></div>
            <div className="md:col-span-2"><label className="label-mono block mb-1">Line 2</label><input className="input" value={editing.line2 || ''} onChange={e => setEditing(a => ({...a, line2: e.target.value}))}/></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
