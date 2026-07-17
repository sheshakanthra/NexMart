import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Radio, Map } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { StatusChip } from '../../components/Chip';
import { hourlySales, revenueTrend, categoryPerf, neighborhoodTrends } from '../../data/mock';
import { inr, relTime } from '../../lib/utils';

export default function Executive() {
  const { state } = useApp();
  const gmv = useMemo(() => state.orders.filter(o => o.status === 'delivered').reduce((a, o) => a + o.total, 0) + 940000, [state.orders]);
  const activeVendors = state.stores.filter(s => s.status === 'active').length;
  const aov = state.orders.length ? Math.round(state.orders.reduce((a, o) => a + o.total, 0) / state.orders.length) : 0;
  const fulfilRate = 95.8;
  const gmvTrend = useMemo(() => revenueTrend(14, 3, 8), []);
  const hourly = useMemo(() => hourlySales(2), []);
  const cats = useMemo(() => categoryPerf(9), []);
  const leaders = useMemo(() => [...state.stores].sort((a, b) => b.healthScore - a.healthScore).slice(0, 5), [state.stores]);
  const nbTrends = useMemo(() => neighborhoodTrends().slice(0, 5), []);
  const ticker = useMemo(() => state.orders.slice(0, 12), [state.orders]);

  return (
    <div className="space-y-6" data-testid="admin-executive">
      <div>
        <div className="label-mono">Marketplace overview</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Executive dashboard</h2>
        <p className="text-sub text-sm">City-altitude view of NexMart, Chennai.</p>
      </div>

      {/* KPI band */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="GMV today" value={gmv} prefix="₹" sub="▲ 14.2%" tone="up" realtime/>
        <StatCard label="Orders today" value={state.orders.length} sub="live feed" tone="up" realtime/>
        <StatCard label="Active vendors" value={activeVendors} sub={`of ${state.stores.length}`} tone="up"/>
        <StatCard label="Avg order value" value={aov} prefix="₹" sub="↑ 3.1%" tone="up"/>
        <StatCard label="Fulfillment rate" value={fulfilRate} suffix="%" sub="steady" tone="neutral"/>
      </div>

      {/* Live ticker */}
      <div className="card overflow-hidden" data-testid="exec-ticker">
        <div className="px-4 py-2 border-b divider flex items-center justify-between">
          <div className="label-mono flex items-center gap-2"><span className="pulse-dot inline-flex"><span/></span>Live order stream</div>
          <Link to="/admin/stream" className="text-xs text-sub hover:text-ink">Open full stream →</Link>
        </div>
        <Marquee speed={35} gradient={false} pauseOnHover>
          <div className="flex gap-8 py-2 text-xs font-mono text-sub">
            {ticker.map(o => (
              <span key={o.id} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"/>#{o.id} · {o.storeName} · {o.neighborhood} · {inr(o.total)} · {relTime(o.placedAt)}
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card p-5 md:col-span-2">
          <div className="label-mono">GMV trend</div>
          <div className="font-display text-lg font-semibold">Last 14 days</div>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <AreaChart data={gmvTrend} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="day" stroke="rgb(var(--sub))" fontSize={10}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }} formatter={v => inr(v)}/>
                <Area dataKey="revenue" stroke="rgb(var(--brand))" fill="rgb(var(--brand) / 0.15)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <div className="label-mono">Category share</div>
          <div className="font-display text-lg font-semibold">By revenue</div>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <BarChart data={cats} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="name" stroke="rgb(var(--sub))" fontSize={10}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }} formatter={v => inr(v)}/>
                <Bar dataKey="revenue" fill="rgb(var(--brand))" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Orders by hour + Leaderboard */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card p-5 md:col-span-2">
          <div className="label-mono">Orders per hour</div>
          <div className="font-display text-lg font-semibold">Today · platform-wide</div>
          <div className="h-52 mt-2">
            <ResponsiveContainer>
              <BarChart data={hourly.map(h => ({ ...h, orders: Math.round(h.today / 20) }))} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="hour" stroke="rgb(var(--sub))" fontSize={10} tickFormatter={h => `${h}h`}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }}/>
                <Bar dataKey="orders" fill="rgb(var(--brand))" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="px-5 py-3 border-b divider flex items-center justify-between">
            <div className="label-mono">Vendor leaderboard</div>
            <Link to="/admin/vendors" className="text-xs text-sub hover:text-ink">All →</Link>
          </div>
          <ul>
            {leaders.map((s, i) => (
              <li key={s.id} className="px-5 py-3 border-b divider last:border-none flex items-center gap-3">
                <span className="font-mono text-xs text-sub w-4">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{s.name}</div>
                  <div className="text-[11px] text-sub">{s.neighborhood} · ⚡ {s.healthScore}</div>
                </div>
                <StatusChip status={s.status}/>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Neighborhoods + Demand map cta */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card p-5 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="label-mono">Neighborhood trends</div>
              <div className="font-display text-lg font-semibold">Where the demand is</div>
            </div>
            <Link to="/admin/demand" className="text-xs text-sub hover:text-ink flex items-center gap-1">Open demand map<ArrowUpRight size={12}/></Link>
          </div>
          <ul className="mt-3">
            {nbTrends.map(n => (
              <li key={n.neighborhood} className="py-2 flex items-center gap-3 border-b divider last:border-none">
                <span className="w-4 h-4 rounded-full" style={{ background: `rgb(var(--brand) / ${Math.min(1, n.orders/700)})` }}/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{n.neighborhood}</div>
                  <div className="text-[11px] text-sub">{n.orders} orders · {n.topCategory}</div>
                </div>
                <span className={`chip !py-0.5 ${n.growth >= 0 ? 'chip-success' : 'chip-danger'}`}>{n.growth >= 0 ? '▲' : '▼'} {Math.abs(n.growth)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <div className="label-mono flex items-center gap-2"><Map size={12}/>Demand Map preview</div>
            <div className="font-display text-lg font-semibold mt-1">City heat</div>
          </div>
          <div className="mt-3 aspect-square bg-muted striped grid-bg rounded relative overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="absolute rounded-full" style={{
                width: 20 + (i * 5) % 25, height: 20 + (i * 5) % 25,
                left: `${8 + (i * 11) % 82}%`, top: `${10 + (i * 17) % 70}%`,
                background: `radial-gradient(closest-side, rgba(234, 88, 12, ${0.35 + (i%5)*0.1}), transparent 70%)`
              }}/>
            ))}
          </div>
          <Link to="/admin/demand" className="btn btn-dark mt-3 justify-center" data-testid="open-demand-map">Open Demand Map<ArrowUpRight size={14}/></Link>
        </div>
      </div>
    </div>
  );
}
