import React, { useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockChip } from '../../components/Chip';
import { CATEGORIES } from '../../data/mock';
import { cn } from '../../lib/utils';

export default function InventoryHealth() {
  const { state, toast } = useApp();
  const [cat, setCat] = useState('all');
  const [sev, setSev] = useState('all');
  const [storeF, setStoreF] = useState('all');

  const critical = useMemo(() => {
    const rows = [];
    state.stores.forEach(s => {
      s.products.forEach(p => {
        const velocity = 1 + (p.trend?.slice(-1)[0] || 10) / 5;
        const days = p.stock > 0 ? p.stock / velocity : 0;
        const severity = p.stock === 0 ? 'out' : p.stock <= p.threshold ? 'low' : null;
        if (severity) rows.push({ store: s, product: p, velocity: velocity.toFixed(1), days: days.toFixed(1), severity });
      });
    });
    return rows;
  }, [state.stores]);

  const filtered = critical.filter(r =>
    (cat === 'all' || r.product.category === cat) &&
    (sev === 'all' || r.severity === sev) &&
    (storeF === 'all' || r.store.id === storeF)
  );

  const totals = useMemo(() => ({
    out: critical.filter(r => r.severity === 'out').length,
    low: critical.filter(r => r.severity === 'low').length,
    healthy: state.stores.reduce((a, s) => a + s.products.filter(p => p.stock > p.threshold).length, 0),
  }), [critical, state.stores]);

  const catAvail = useMemo(() => {
    return CATEGORIES.map(c => {
      const all = state.stores.flatMap(s => s.products.filter(p => p.category === c.id));
      const inStock = all.filter(p => p.stock > 0).length;
      const pct = all.length ? Math.round((inStock / all.length) * 100) : 100;
      return { name: c.name, pct };
    });
  }, [state.stores]);

  return (
    <div className="space-y-5" data-testid="inv-health">
      <div>
        <div className="label-mono">Marketplace stock</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Inventory health</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><div className="label-mono">Out of stock</div><div className="font-mono text-3xl mt-1 text-danger">{totals.out}</div></div>
        <div className="card p-4"><div className="label-mono">Low stock</div><div className="font-mono text-3xl mt-1 text-warn">{totals.low}</div></div>
        <div className="card p-4"><div className="label-mono">Healthy</div><div className="font-mono text-3xl mt-1 text-success">{totals.healthy}</div></div>
        <div className="card p-4"><div className="label-mono">Stores affected</div><div className="font-mono text-3xl mt-1">{new Set(critical.map(r => r.store.id)).size}</div></div>
      </div>

      <div className="card p-5">
        <div className="label-mono">Category availability</div>
        <ul className="mt-3 space-y-2">
          {catAvail.map(c => (
            <li key={c.name} className="flex items-center gap-3">
              <span className="w-40 text-sm truncate">{c.name}</span>
              <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                <div className={cn('h-full', c.pct > 80 ? 'bg-success' : c.pct > 60 ? 'bg-warn' : 'bg-danger')} style={{ width: `${c.pct}%` }}/>
              </div>
              <span className="font-mono text-xs w-12 text-right">{c.pct}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select value={cat} onChange={e => setCat(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="ih-cat">
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={sev} onChange={e => setSev(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="ih-sev">
          <option value="all">All severity</option>
          <option value="low">Low</option>
          <option value="out">Out</option>
        </select>
        <select value={storeF} onChange={e => setStoreF(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="ih-store">
          <option value="all">All stores</option>
          {state.stores.slice(0, 12).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div className="ml-auto text-xs text-sub font-mono">{filtered.length} critical items</div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-surface2 text-left label-mono">
            <tr>
              <th className="px-4 py-2.5">Product</th>
              <th className="px-4 py-2.5">Store</th>
              <th className="px-4 py-2.5 text-right">Stock</th>
              <th className="px-4 py-2.5 text-right">Velocity/day</th>
              <th className="px-4 py-2.5 text-right">Days to out</th>
              <th className="px-4 py-2.5">Severity</th>
              <th className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 40).map((r, i) => (
              <tr key={i} className="border-t divider">
                <td className="px-4 py-3">{r.product.name}</td>
                <td className="px-4 py-3 text-sub">{r.store.name}</td>
                <td className="px-4 py-3 text-right font-mono">{r.product.stock}</td>
                <td className="px-4 py-3 text-right font-mono">{r.velocity}</td>
                <td className="px-4 py-3 text-right font-mono">{r.severity === 'out' ? '—' : r.days}</td>
                <td className="px-4 py-3"><StockChip qty={r.product.stock}/></td>
                <td className="px-4 py-3 text-right"><button onClick={() => toast({ title: 'Vendor notified', body: r.store.name, kind: 'success' })} className="btn btn-ghost !h-8 text-xs"><Bell size={12}/>Notify</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
