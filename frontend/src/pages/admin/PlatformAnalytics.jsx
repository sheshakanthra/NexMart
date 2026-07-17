import React, { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { customerGrowth, funnelData, revenueTrend, hourlySales, neighborhoodTrends, categoryPerf } from '../../data/mock';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const COLORS = ['rgb(234,88,12)', 'rgb(99,102,241)', 'rgb(22,163,74)', 'rgb(217,119,6)', 'rgb(220,38,38)', 'rgb(129,140,248)', 'rgb(59,130,246)', 'rgb(190,142,60)'];

export default function PlatformAnalytics() {
  const { toast } = useApp();
  const [range, setRange] = useState('30d');

  const growth = useMemo(() => customerGrowth(15), []);
  const funnel = useMemo(() => funnelData(), []);
  const gmv = useMemo(() => revenueTrend(range === '7d' ? 7 : range === '14d' ? 14 : 30, 3, 8), [range]);
  const hourly = useMemo(() => hourlySales(2), []);
  const nb = useMemo(() => neighborhoodTrends().slice(0, 8), []);
  const cats = useMemo(() => categoryPerf(11), []);
  const totalFunnel = funnel[0].value;

  const fulfilTime = [
    { bin: '<15m', v: 240 }, { bin: '15-30m', v: 620 }, { bin: '30-45m', v: 410 }, { bin: '45-60m', v: 180 }, { bin: '>60m', v: 68 },
  ];

  return (
    <div className="space-y-5" data-testid="platform-analytics">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Business intelligence</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Platform analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="card p-1 flex">
            {['7d','14d','30d'].map(r => <button key={r} onClick={() => setRange(r)} className={cn('px-3 py-1.5 rounded text-sm', range === r ? 'bg-muted' : 'text-sub')} data-testid={`pa-range-${r}`}>{r}</button>)}
          </div>
          <button onClick={() => toast({ title: 'Export queued (mock)', kind: 'info' })} className="btn btn-ghost" data-testid="pa-export"><Download size={14}/>Export</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-5">
          <div className="label-mono">Customer growth</div>
          <div className="font-display text-lg font-semibold">Cumulative signups</div>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="day" stroke="rgb(var(--sub))" fontSize={10}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }}/>
                <Area dataKey="signups" stroke="rgb(var(--ai))" fill="rgb(var(--ai) / 0.15)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="label-mono">Order funnel</div>
          <div className="font-display text-lg font-semibold">Placed → Delivered</div>
          <ul className="mt-4 space-y-2">
            {funnel.map(f => {
              const pct = Math.round((f.value / totalFunnel) * 100);
              return (
                <li key={f.stage}>
                  <div className="flex justify-between text-sm mb-1"><span>{f.stage}</span><span className="font-mono">{f.value.toLocaleString()} · {pct}%</span></div>
                  <div className="h-3 rounded bg-muted overflow-hidden"><div className="h-full bg-brand" style={{ width: `${pct}%` }}/></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-5">
          <div className="label-mono">Fulfillment time distribution</div>
          <div className="font-display text-lg font-semibold">Placed to delivered</div>
          <div className="h-52 mt-2">
            <ResponsiveContainer>
              <BarChart data={fulfilTime} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="bin" stroke="rgb(var(--sub))" fontSize={10}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }}/>
                <Bar dataKey="v" fill="rgb(var(--brand))" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="label-mono">Neighborhoods leading growth</div>
          <div className="font-display text-lg font-semibold">Top 8 by orders</div>
          <div className="h-52 mt-2">
            <ResponsiveContainer>
              <BarChart data={nb} layout="vertical" margin={{ left: 10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" horizontal={false}/>
                <XAxis type="number" stroke="rgb(var(--sub))" fontSize={10}/>
                <YAxis type="category" dataKey="neighborhood" stroke="rgb(var(--sub))" fontSize={10} width={90}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }}/>
                <Bar dataKey="orders" fill="rgb(var(--brand))" radius={[0,3,3,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-5">
          <div className="label-mono">Category revenue share</div>
          <div className="font-display text-lg font-semibold">All categories</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={cats} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={40}>
                  {cats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="label-mono">Peak platform hours</div>
          <div className="font-display text-lg font-semibold">Today's activity</div>
          <div className="h-52 mt-2">
            <ResponsiveContainer>
              <LineChart data={hourly} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="hour" stroke="rgb(var(--sub))" fontSize={10} tickFormatter={h => `${h}h`}/>
                <YAxis stroke="rgb(var(--sub))" fontSize={10}/>
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', fontSize: 12 }}/>
                <Line dataKey="today" stroke="rgb(var(--brand))" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
