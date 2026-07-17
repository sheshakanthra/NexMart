import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusChip } from '../../components/Chip';
import { Drawer, Modal } from '../../components/Modal';
import { inr } from '../../lib/utils';

const COLS = [
  { key: 'name', label: 'Store' },
  { key: 'neighborhood', label: 'Neighborhood' },
  { key: 'healthScore', label: 'Health' },
  { key: 'gmv', label: 'GMV', numeric: true },
  { key: 'orders', label: 'Orders', numeric: true },
  { key: 'fulfillment', label: 'Fulfill%', numeric: true },
  { key: 'availability', label: 'Stock%', numeric: true },
  { key: 'status', label: 'Status' },
];

export default function VendorManagement() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState({ key: 'healthScore', dir: 'desc' });
  const [detail, setDetail] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const rows = useMemo(() => {
    const enriched = state.stores.map(s => {
      const so = state.orders.filter(o => o.storeId === s.id);
      const gmv = so.reduce((a, o) => a + o.total, 0) + 25000;
      const inStockPct = Math.round((s.products.filter(p => p.stock > 0).length / s.products.length) * 100);
      return { ...s, gmv, orders: so.length + 24, fulfillment: 92 + (s.healthScore % 8), availability: inStockPct };
    });
    let arr = enriched;
    if (q) arr = arr.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.neighborhood.toLowerCase().includes(q.toLowerCase()));
    arr = [...arr].sort((a, b) => {
      const av = a[sort.key]; const bv = b[sort.key];
      if (typeof av === 'string') return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sort.dir === 'asc' ? av - bv : bv - av;
    });
    return arr;
  }, [state.stores, state.orders, q, sort]);

  const toggleSort = (k) => setSort(s => s.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'desc' });

  const toggleSuspend = (s) => {
    const next = s.status === 'active' ? 'suspended' : 'active';
    dispatch({ type: 'UPDATE_STORE', payload: { storeId: s.id, patch: { status: next } } });
    toast({ title: next === 'active' ? 'Vendor reactivated' : 'Vendor suspended', kind: 'success' });
    setConfirm(null);
    setDetail(null);
  };

  return (
    <div className="space-y-5" data-testid="vendor-management">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Merchants</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Vendor management</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sub"/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search vendors…" className="input !pl-9 !w-64" data-testid="vm-search"/>
          </div>
          <button onClick={() => nav('/admin/approvals')} className="btn btn-primary" data-testid="vm-approvals">Approvals ({state.stores.filter(s => s.status === 'pending').length})</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-surface2">
            <tr className="text-left label-mono">
              {COLS.map(c => (
                <th key={c.key} className={c.numeric ? 'text-right px-4 py-2.5' : 'px-4 py-2.5'}>
                  <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-ink">
                    {c.label}<ArrowUpDown size={10}/>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(s => (
              <tr key={s.id} className="border-t divider hover:bg-muted/50 cursor-pointer" onClick={() => setDetail(s)} data-testid={`vm-row-${s.id}`}>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sub">{s.neighborhood}</td>
                <td className="px-4 py-3"><span className="chip">{s.healthScore}</span></td>
                <td className="px-4 py-3 text-right font-mono">{inr(s.gmv)}</td>
                <td className="px-4 py-3 text-right font-mono">{s.orders}</td>
                <td className="px-4 py-3 text-right font-mono">{s.fulfillment}%</td>
                <td className="px-4 py-3 text-right font-mono">{s.availability}%</td>
                <td className="px-4 py-3"><StatusChip status={s.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.name || 'Vendor'} width="max-w-lg">
        {detail && (
          <div className="space-y-4">
            <div><StatusChip status={detail.status}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3"><div className="label-mono">GMV</div><div className="font-mono text-xl mt-1">{inr(detail.gmv)}</div></div>
              <div className="card p-3"><div className="label-mono">Orders</div><div className="font-mono text-xl mt-1">{detail.orders}</div></div>
              <div className="card p-3"><div className="label-mono">Fulfill%</div><div className="font-mono text-xl mt-1">{detail.fulfillment}%</div></div>
              <div className="card p-3"><div className="label-mono">Stock%</div><div className="font-mono text-xl mt-1">{detail.availability}%</div></div>
            </div>
            <div>
              <div className="label-mono">Products (first 5)</div>
              <ul className="mt-2 space-y-1 text-sm">
                {detail.products.slice(0, 5).map(p => <li key={p.id} className="flex justify-between border-b divider py-1"><span>{p.name}</span><span className="font-mono text-sub">{inr(p.price)}</span></li>)}
              </ul>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setConfirm(detail)} className={`btn ${detail.status === 'active' ? '!bg-danger !text-white' : 'btn-primary'}`} data-testid="vm-suspend">
                {detail.status === 'active' ? 'Suspend' : 'Reactivate'}
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Confirm action" size="sm"
        footer={<><button onClick={() => setConfirm(null)} className="btn btn-ghost">Cancel</button><button onClick={() => toggleSuspend(confirm)} className="btn btn-primary" data-testid="vm-confirm">Confirm</button></>}>
        <p className="text-sm text-sub">Change {confirm?.name} status?</p>
      </Modal>
    </div>
  );
}
