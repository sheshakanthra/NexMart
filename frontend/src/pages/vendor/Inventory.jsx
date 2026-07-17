import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Search as SearchIcon, Pencil, Trash2, PowerOff, Power } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockChip } from '../../components/Chip';
import { Sparkline } from '../../components/Sparkline';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/States';
import { CATEGORIES } from '../../data/mock';
import { inr, cn } from '../../lib/utils';

export default function Inventory() {
  const { state, dispatch, toast } = useApp();
  const storeId = state.session?.storeId || 's_0';
  const store = state.stores.find(s => s.id === storeId) || state.stores[0];
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [status, setStatus] = useState('all');
  const [delTarget, setDelTarget] = useState(null);

  const products = useMemo(() => {
    let arr = store.products;
    if (q) arr = arr.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat !== 'all') arr = arr.filter(p => p.category === cat);
    if (status !== 'all') arr = arr.filter(p => (status === 'in' ? p.stock > p.threshold : status === 'low' ? p.stock > 0 && p.stock <= p.threshold : p.stock === 0));
    return arr;
  }, [store, q, cat, status]);

  const counts = useMemo(() => ({
    total: store.products.length,
    inStock: store.products.filter(p => p.stock > p.threshold).length,
    low: store.products.filter(p => p.stock > 0 && p.stock <= p.threshold).length,
    out: store.products.filter(p => p.stock === 0).length,
  }), [store]);

  const setStock = (p, s) => dispatch({ type: 'UPDATE_STOCK', payload: { storeId: store.id, productId: p.id, stock: Math.max(0, s) }});
  const toggle = (p) => { dispatch({ type: 'UPDATE_PRODUCT', payload: { storeId: store.id, productId: p.id, patch: { active: !p.active } } }); toast({ title: p.active ? 'Product deactivated' : 'Product activated', kind: 'success' }); };
  const del = () => { if (!delTarget) return; dispatch({ type: 'DELETE_PRODUCT', payload: { storeId: store.id, productId: delTarget.id } }); toast({ title: 'Product deleted', kind: 'success' }); setDelTarget(null); };

  return (
    <div className="space-y-5" data-testid="inventory-page">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="label-mono">Catalog</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Inventory</h2>
          <p className="text-sub text-sm">Adjust stock in real time. Add new products or edit existing ones.</p>
        </div>
        <Link to="/vendor/inventory/add" className="btn btn-primary" data-testid="inv-add"><Plus size={14}/>Add product</Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><div className="label-mono">Total SKUs</div><div className="font-mono text-2xl mt-1">{counts.total}</div></div>
        <div className="card p-4"><div className="label-mono">In stock</div><div className="font-mono text-2xl mt-1 text-success">{counts.inStock}</div></div>
        <div className="card p-4"><div className="label-mono">Low stock</div><div className="font-mono text-2xl mt-1 text-warn">{counts.low}</div></div>
        <div className="card p-4"><div className="label-mono">Out of stock</div><div className="font-mono text-2xl mt-1 text-danger">{counts.out}</div></div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sub"/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…" className="input !pl-9" data-testid="inv-search"/>
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="inv-cat">
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="inv-status">
          <option value="all">All status</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <EmptyState title="No products match" body="Try clearing filters or add a new product."/>
      ) : (
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-surface2">
            <tr className="text-left label-mono">
              <th className="px-4 py-2.5">Product</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5 text-right">Price</th>
              <th className="px-4 py-2.5">Stock</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Trend</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className={cn('border-t divider', !p.active && 'opacity-60')} data-testid={`inv-row-${p.id}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-muted overflow-hidden shrink-0"><img src={p.img} alt="" className="w-full h-full object-cover"/></div>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[11px] text-sub">{p.unit}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sub text-xs uppercase">{p.category}</td>
                <td className="px-4 py-3 text-right font-mono">{inr(p.price)}</td>
                <td className="px-4 py-3">
                  <div className="card flex items-center h-8 w-max">
                    <button onClick={() => setStock(p, p.stock - 1)} className="w-7 h-8 flex items-center justify-center" data-testid={`stock-dec-${p.id}`}><Minus size={12}/></button>
                    <div className="w-10 text-center font-mono">{p.stock}</div>
                    <button onClick={() => setStock(p, p.stock + 1)} className="w-7 h-8 flex items-center justify-center" data-testid={`stock-inc-${p.id}`}><Plus size={12}/></button>
                  </div>
                </td>
                <td className="px-4 py-3"><StockChip qty={p.stock}/></td>
                <td className="px-4 py-3"><Sparkline data={p.trend} width={70} height={22} color="rgb(var(--brand))"/></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/vendor/inventory/edit/${p.id}`} className="btn btn-ghost !h-8" data-testid={`edit-${p.id}`}><Pencil size={12}/></Link>
                    <button onClick={() => toggle(p)} className="btn btn-ghost !h-8" data-testid={`toggle-${p.id}`}>{p.active ? <PowerOff size={12}/> : <Power size={12}/>}</button>
                    <button onClick={() => setDelTarget(p)} className="btn btn-ghost !h-8 !text-danger" data-testid={`del-${p.id}`}><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}

      <Modal open={!!delTarget} onClose={() => setDelTarget(null)} title="Delete product?" size="sm"
        footer={<><button onClick={() => setDelTarget(null)} className="btn btn-ghost">Cancel</button><button onClick={del} className="btn btn-primary !bg-danger" data-testid="confirm-delete">Delete</button></>}>
        <p className="text-sm text-sub">This permanently removes <b>{delTarget?.name}</b> from your inventory.</p>
      </Modal>
    </div>
  );
}
