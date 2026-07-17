import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mock';
import { uid } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import * as productService from '../../services/productService';
import * as storageService from '../../services/storageService';

export default function AddProduct() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const storeId = state.session?.storeId || 's_0';
  const [form, setForm] = useState({ name: '', description: '', category: 'staples', price: '', unit: '1 kg', stock: '', threshold: '5', img: '' });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null); // holds the actual File object for upload

  const genAi = () => {
    if (!form.name) { toast({ title: 'Add a product name first', kind: 'error' }); return; }
    const desc = `Premium quality ${form.name.toLowerCase()} — sourced fresh, quality-tested, and packed with care. Ideal for daily use, this ${form.name.toLowerCase()} keeps your kitchen stocked with the essentials your family loves. Store in a cool, dry place.`;
    setForm(f => ({ ...f, description: desc }));
    toast({ title: 'Description generated', kind: 'success' });
  };

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    fileRef.current = f;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.price || +form.price <= 0) e.price = 'Enter a valid price';
    if (form.stock === '' || +form.stock < 0) e.stock = 'Enter stock qty';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      let productToAdd;

      if (supabase) {
        // Upload image if a file was selected
        let imgUrl = form.img;
        if (fileRef.current) {
          const uploadRes = await storageService.uploadProductImage(storeId, fileRef.current);
          if (uploadRes?.success) imgUrl = uploadRes.data;
        }

        const res = await productService.createProduct(storeId, {
          name:        form.name.trim(),
          category:    form.category,
          price:       +form.price,
          unit:        form.unit,
          stock:       +form.stock,
          threshold:   +form.threshold || 5,
          description: form.description || form.name.trim(),
          img:         imgUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
          trend:       [10,12,15,14,18,22,20],
          soldToday:   0,
          active:      true,
        });

        if (!res?.success) throw new Error(res?.error?.message || 'Failed to save product');
        productToAdd = res.data;
      } else {
        // Demo mode — local only
        productToAdd = {
          id:          uid('p'),
          storeId,
          name:        form.name.trim(),
          category:    form.category,
          price:       +form.price,
          unit:        form.unit,
          stock:       +form.stock,
          threshold:   +form.threshold || 5,
          description: form.description || form.name.trim(),
          img:         preview || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
          trend:       [10,12,15,14,18,22,20],
          soldToday:   0,
          active:      true,
        };
      }

      dispatch({ type: 'ADD_PRODUCT', payload: { storeId, product: productToAdd } });
      toast({ title: 'Product added', body: productToAdd.name, kind: 'success' });
      nav('/vendor/inventory');
    } catch (err) {
      toast({ title: 'Failed to save product', body: err.message, kind: 'error' });
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5" data-testid="add-product-page">
      <button onClick={() => nav(-1)} className="text-sm text-sub hover:text-ink inline-flex items-center gap-1"><ArrowLeft size={14}/>Back</button>
      <div>
        <div className="label-mono">Catalog</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Add new product</h2>
      </div>
      <form onSubmit={save} className="card p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="label-mono block mb-1">Product name</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" data-testid="ap-name"/>
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}</div>
          <div><label className="label-mono block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input" data-testid="ap-category">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label-mono">Description</label>
            <button type="button" onClick={genAi} className="chip chip-ai cursor-pointer" data-testid="ap-genai"><Sparkles size={12}/>Generate with AI</button>
          </div>
          <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input !h-28 pt-2" data-testid="ap-desc"/>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          <div><label className="label-mono block mb-1">Price ₹</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} className="input" data-testid="ap-price"/>
            {errors.price && <p className="text-danger text-xs mt-1">{errors.price}</p>}</div>
          <div><label className="label-mono block mb-1">Unit</label>
            <input value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))} className="input" data-testid="ap-unit"/></div>
          <div><label className="label-mono block mb-1">Initial stock</label>
            <input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} className="input" data-testid="ap-stock"/>
            {errors.stock && <p className="text-danger text-xs mt-1">{errors.stock}</p>}</div>
          <div><label className="label-mono block mb-1">Low-stock threshold</label>
            <input type="number" value={form.threshold} onChange={e => setForm(f => ({...f, threshold: e.target.value}))} className="input" data-testid="ap-threshold"/></div>
        </div>

        <div>
          <label className="label-mono block mb-1">Product image</label>
          <div className="flex items-start gap-3">
            <label className="btn btn-ghost cursor-pointer" data-testid="ap-upload"><Upload size={14}/>Upload<input type="file" accept="image/*" onChange={onFile} className="hidden"/></label>
            {preview && <div className="w-24 h-24 rounded bg-muted overflow-hidden"><img src={preview} className="w-full h-full object-cover" alt=""/></div>}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button type="button" onClick={() => nav(-1)} className="btn btn-ghost" disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" data-testid="ap-save" disabled={saving}>
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </div>
      </form>
    </div>
  );
}
