import React, { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { revenueTrend, peakGrid, categoryPerf, demandForecast } from '../../data/mock';
import { inr, cn } from '../../lib/utils';

export default function VendorAnalytics() {
  const { state } = useApp();
  const storeId = state.session?.storeId || 's_0';
  const store = state.stores.find(s => s.id === storeId) || state.stores[0];
  const [range, setRange] = useState('7d');
  const days = range === 'today' ? 1 : range === '7d' ? 7 : 30;

  const rev = useMemo(() => revenueTrend(days, 5, 0.6), [days]);
  const cat = useMemo(() => categoryPerf(7), []);
  const grid = useMemo(() => peakGrid(store.id.charCodeAt(2)), [store.id]);
  const forecast = useMemo(() => demandForecast(store.products[0].name, 11), [store.products]);

  const maxHeat = Math.max(...grid.map(g => g.value));

  return (
    <div className="space-y-6" data-testid="vendor-analytics">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Analytics</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Store performance</h2>
        </div>
        <div className="card p-1 flex" data-testid="range-toggle">
          {['today','7d','30d'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={cn('px-3 py-1.5 rounded text-sm', range === r ? 'bg-muted' : 'text-sub')} data-testid={`range-${r}`}>{r === 'today' ? 'Today' : r === '7d' ? '7 days' : '30 days'}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="card p-4"><div className="label-mono">Total revenue</div><div className="font-mono text-3xl mt-1">{inr(rev.reduce((a, r) => a + r.revenue, 0))}</div></div>
        <div className="card p-4"><div className="label-mono">Total orders</div><div className="font-mono text-3xl mt-1">{rev.reduce((a, r) => a + r.orders, 0)}</div></div>
        <div className="card p-4"><div className="label-mono">Avg fulfillment</div><div className="font-mono text-3xl mt-1">28<span className="text-base text-sub">m</span></div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-5">
          <div className="label-mono">Revenue trend</div>
          <div className="font-display text-lg font-semibold">Last {days} days</div>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <AreaChart data={rev} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="day" stroke="rgb(var(--sub))" fontSize={10}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }} formatter={(v) => inr(v)}/>
                <Area dataKey="revenue" stroke="rgb(var(--brand))" fill="rgb(var(--brand) / 0.15)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="label-mono">Sales by category</div>
          <div className="font-display text-lg font-semibold">Distribution</div>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <BarChart data={cat} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="name" stroke="rgb(var(--sub))" fontSize={10}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }} formatter={(v) => inr(v)}/>
                <Bar dataKey="revenue" fill="rgb(var(--brand))" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak hours */}
      <div className="card p-5">
        <div className="label-mono">Peak shopping hours</div>
        <div className="font-display text-lg font-semibold">Day × Hour intensity</div>
        <div className="mt-4 overflow-x-auto">
          <div className="grid" style={{ gridTemplateColumns: 'auto repeat(24, minmax(14px, 1fr))', gap: 3 }}>
            <div/>
            {Array.from({ length: 24 }, (_, h) => <div key={h} className="text-[9px] text-sub font-mono text-center">{h}</div>)}
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, di) => (
              <React.Fragment key={day}>
                <div className="text-[10px] text-sub pr-1 font-mono">{day}</div>
                {Array.from({ length: 24 }, (_, h) => {
                  const cell = grid.find(g => g.dayIdx === di && g.hour === h);
                  const alpha = Math.min(0.95, (cell?.value || 0) / maxHeat);
                  return (
                    <div key={h} className="rounded-sm" style={{ height: 18, background: `rgba(234, 88, 12, ${alpha})` }} title={`${day} ${h}:00 · ${cell?.value || 0}`}/>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="card p-5">
        <div className="label-mono">Demand forecast</div>
        <div className="font-display text-lg font-semibold">{store.products[0].name} · next 7 days</div>
        <div className="h-56 mt-2">
          <ResponsiveContainer>
            <LineChart data={forecast} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="day" stroke="rgb(var(--sub))" fontSize={10}/>
              <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
              <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
              <Line dataKey="high" stroke="rgb(var(--sub))" strokeDasharray="4 4" name="High" dot={false}/>
              <Line dataKey="forecast" stroke="rgb(var(--brand))" strokeWidth={2} name="Forecast" dot={{ r: 3 }}/>
              <Line dataKey="low" stroke="rgb(var(--sub))" strokeDasharray="4 4" name="Low" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
