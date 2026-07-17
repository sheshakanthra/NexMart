import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Plus, Minus, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { StatusChip } from '../../components/Chip';
import { StockChip } from '../../components/Chip';
import { Sparkline } from '../../components/Sparkline';
import { hourlySales, revenueTrend, SENTINEL_BRIEF } from '../../data/mock';
import { inr, relTime } from '../../lib/utils';

export default function VendorDashboard() {
  const { state, dispatch } = useApp();
  const storeId = state.session?.storeId || 's_0';
  const store = state.stores.find(s => s.id === storeId) || state.stores[0];

  const storeOrders = useMemo(() => state.orders.filter(o => o.storeId === store.id), [state.orders, store.id]);
  const todayRevenue = useMemo(() => storeOrders.filter(o => o.status === 'delivered').reduce((a, o) => a + o.total, 0), [storeOrders]);
  const orderCount = storeOrders.length;
  const avgOrder = orderCount ? Math.round(todayRevenue / Math.max(1, orderCount)) : 0;
  const lowStock = store.products.filter(p => p.stock > 0 && p.stock <= p.threshold);

  const hourly = useMemo(() => hourlySales(store.id.charCodeAt(2)), [store.id]);
  const topProducts = useMemo(() => [...store.products].sort((a, b) => (b.soldToday || 0) - (a.soldToday || 0)).slice(0, 5), [store.products]);

  const incoming = storeOrders.filter(o => o.status === 'placed').slice(0, 5);

  const acceptOrder = (o) => {
    const timeline = o.timeline.map((s, k) => k === 1 ? { ...s, at: Date.now(), done: true, active: true } : k === 0 ? { ...s, active: false } : s);
    dispatch({ type: 'UPDATE_ORDER', payload: { id: o.id, patch: { status: 'accepted', timeline } } });
  };

  return (
    <div className="space-y-6" data-testid="vendor-dashboard">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Command Center</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{store.name}</h2>
          <p className="text-sub text-sm">{store.neighborhood} · {store.open ? 'Open' : 'Closed'} · {store.deliveryRadiusKm} km radius</p>
        </div>
        <div className="flex gap-2">
          <Link to="/vendor/orders" className="btn btn-ghost" data-testid="d-jump-orders">Orders queue<ArrowUpRight size={14}/></Link>
          <Link to="/vendor/sentinel" className="btn btn-dark" data-testid="d-jump-sentinel"><Sparkles size={14}/>Sentinel</Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Revenue today" value={todayRevenue} prefix="₹" sub="▲ 12.4% vs yesterday" tone="up" realtime
          spark={<Sparkline data={[8,12,10,16,22,19,25]} width={80} height={24} color="rgb(var(--brand))"/>}/>
        <StatCard label="Orders today" value={orderCount} sub="▲ 8 new since morning" tone="up" realtime/>
        <StatCard label="Avg order value" value={avgOrder} prefix="₹" sub="▬ steady" tone="neutral"/>
        <StatCard label="Low stock items" value={lowStock.length} sub={lowStock.length ? 'Action needed' : 'All healthy'} tone={lowStock.length ? 'down' : 'up'} realtime/>
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="label-mono">Hourly sales</div>
              <div className="font-display text-lg font-semibold">Today vs Yesterday</div>
            </div>
            <span className="chip">Realtime</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={hourly} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="hour" stroke="rgb(var(--sub))" fontSize={11} tickFormatter={h => `${h}h`}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={11}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', borderRadius: 6, fontSize: 12 }}/>
                <Legend iconType="plainline" wrapperStyle={{ fontSize: 11 }}/>
                <Line type="monotone" dataKey="yesterday" stroke="rgb(var(--sub))" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Yesterday"/>
                <Line type="monotone" dataKey="today" stroke="rgb(var(--brand))" strokeWidth={2} dot={false} name="Today"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="label-mono">Top products</div>
          <div className="font-display text-lg font-semibold">Today's leaders</div>
          <ul className="mt-3 space-y-2">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 py-1.5 border-b divider last:border-none">
                <span className="font-mono text-xs text-sub w-4">{i+1}</span>
                <div className="w-8 h-8 bg-muted rounded overflow-hidden"><img src={p.img} className="w-full h-full object-cover" alt=""/></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{p.name}</div>
                  <div className="text-[11px] text-sub">{p.soldToday || 0} sold · {inr(p.price)}</div>
                </div>
                <Sparkline data={p.trend} width={40} height={16} color="rgb(var(--brand))"/>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sentinel headline */}
      <div className="sentinel-border p-5" data-testid="sentinel-headline">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="label-mono text-ai flex items-center gap-1.5"><Sparkles size={12}/> Sentinel AI · daily brief</div>
            <div className="font-display text-xl font-semibold mt-1">{SENTINEL_BRIEF[0].title}</div>
            <p className="text-sm text-sub mt-1 max-w-2xl">{SENTINEL_BRIEF[0].body}</p>
          </div>
          <Link to="/vendor/sentinel" className="btn btn-ghost !h-9" data-testid="d-open-sentinel">Open Sentinel<ArrowUpRight size={14}/></Link>
        </div>
      </div>

      {/* Incoming + Low stock */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="card">
          <div className="px-5 py-3 border-b divider flex items-center justify-between">
            <div className="label-mono flex items-center gap-2"><span className="pulse-dot inline-flex items-center gap-1"><span/></span>Incoming orders</div>
            <Link to="/vendor/orders" className="text-xs text-sub hover:text-ink">Open queue →</Link>
          </div>
          {incoming.length === 0 ? (
            <div className="p-6 text-sm text-sub text-center">No new orders right now. You’re all caught up.</div>
          ) : (
            <ul>
              {incoming.map(o => (
                <li key={o.id} className="px-5 py-3 border-b divider last:border-none flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-mono text-xs">{o.id}</span><StatusChip status={o.status}/></div>
                    <div className="text-sm mt-0.5">{o.items.length} items · {o.customer}</div>
                    <div className="text-[11px] text-sub">{relTime(o.placedAt)}</div>
                  </div>
                  <div className="font-mono text-sm">{inr(o.total)}</div>
                  <button onClick={() => acceptOrder(o)} className="btn btn-primary !h-9" data-testid={`accept-${o.id}`}>Accept</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="px-5 py-3 border-b divider label-mono">Low stock alerts</div>
          {lowStock.length === 0 ? (
            <div className="p-6 text-sm text-sub text-center">All products healthy — no low-stock items.</div>
          ) : (
            <ul>
              {lowStock.slice(0, 6).map(p => (
                <li key={p.id} className="px-5 py-3 border-b divider last:border-none flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-muted overflow-hidden"><img src={p.img} className="w-full h-full object-cover" alt=""/></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{p.name}</div>
                    <StockChip qty={p.stock}/>
                  </div>
                  <div className="card flex items-center h-9">
                    <button onClick={() => dispatch({ type: 'UPDATE_STOCK', payload: { storeId: store.id, productId: p.id, stock: Math.max(0, p.stock - 1) } })} className="w-8 h-9 flex items-center justify-center"><Minus size={12}/></button>
                    <div className="w-8 text-center font-mono text-sm">{p.stock}</div>
                    <button onClick={() => dispatch({ type: 'UPDATE_STOCK', payload: { storeId: store.id, productId: p.id, stock: p.stock + 1 } })} className="w-8 h-9 flex items-center justify-center"><Plus size={12}/></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
