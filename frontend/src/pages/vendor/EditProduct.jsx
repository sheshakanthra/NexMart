import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, PowerOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { Modal } from '../../components/Modal';
import { CATEGORIES } from '../../data/mock';

export default function EditProduct() {
  const { productId } = useParams();
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const storeId = state.session?.storeId || 's_0';
  const store = state.stores.find(s => s.id === storeId);
  const product = store?.products.find(p => p.id === productId);
  const [form, setForm] = useState(product ? { ...product } : null);
  const [confirmDel, setConfirmDel] = useState(false);

  if (!product || !form) return <EmptyState title="Product not found" action={<button onClick={() => nav('/vendor/inventory')} className="btn btn-primary">Back to inventory</button>}/>;

  const save = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_PRODUCT', payload: { storeId, productId, patch: form } });
    toast({ title: 'Product updated', kind: 'success' });
    nav('/vendor/inventory');
  };

  return (
    <div className="max-w-3xl space-y-5" data-testid="edit-product-page">
      <button onClick={() => nav(-1)} className="text-sm text-sub hover:text-ink inline-flex items-center gap-1"><ArrowLeft size={14}/>Back</button>
      <div>
        <div className="label-mono">Editing</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">{product.name}</h2>
      </div>

      <form onSubmit={save} className="card p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="label-mono block mb-1">Name</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" data-testid="ep-name"/></div>
          <div><label className="label-mono block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input" data-testid="ep-cat">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
        </div>
        <div><label className="label-mono block mb-1">Description</label>
          <textarea value={form.description || ''} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input !h-28 pt-2" data-testid="ep-desc"/></div>
        <div className="grid md:grid-cols-4 gap-3">
          <div><label className="label-mono block mb-1">Price ₹</label><input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: +e.target.value}))} className="input" data-testid="ep-price"/></div>
          <div><label className="label-mono block mb-1">Unit</label><input value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))} className="input" data-testid="ep-unit"/></div>
          <div><label className="label-mono block mb-1">Stock</label><input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: +e.target.value}))} className="input" data-testid="ep-stock"/></div>
          <div><label className="label-mono block mb-1">Threshold</label><input type="number" value={form.threshold} onChange={e => setForm(f => ({...f, threshold: +e.target.value}))} className="input" data-testid="ep-threshold"/></div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button type="button" onClick={() => nav(-1)} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary" data-testid="ep-save">Save changes</button>
        </div>
      </form>

      <div className="card p-5 border !border-danger/30 !bg-danger/5">
        <div className="label-mono !text-danger">Danger zone</div>
        <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm">Deactivate this product to hide it from customers, or delete it permanently.</div>
          <div className="flex gap-2">
            <button onClick={() => { dispatch({ type: 'UPDATE_PRODUCT', payload: { storeId, productId, patch: { active: !product.active } } }); toast({ title: product.active ? 'Deactivated' : 'Activated', kind: 'success' }); }} className="btn btn-ghost" data-testid="ep-toggle"><PowerOff size={14}/>{product.active ? 'Deactivate' : 'Activate'}</button>
            <button onClick={() => setConfirmDel(true)} className="btn btn-ghost !text-danger" data-testid="ep-delete"><Trash2 size={14}/>Delete</button>
          </div>
        </div>
      </div>

      <Modal open={confirmDel} onClose={() => setConfirmDel(false)} title="Delete product?" size="sm"
        footer={<><button onClick={() => setConfirmDel(false)} className="btn btn-ghost">Cancel</button><button onClick={() => { dispatch({ type: 'DELETE_PRODUCT', payload: { storeId, productId } }); toast({ title: 'Product deleted', kind: 'success' }); nav('/vendor/inventory'); }} className="btn btn-primary !bg-danger" data-testid="ep-confirm-del">Delete permanently</button></>}>
        <p className="text-sm text-sub">This permanently removes <b>{product.name}</b> from your inventory.</p>
      </Modal>
    </div>
  );
}
