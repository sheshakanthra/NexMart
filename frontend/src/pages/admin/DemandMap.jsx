import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { neighborhoodTrends, NEIGHBORHOODS } from '../../data/mock';
import { inr } from '../../lib/utils';

export default function DemandMap() {
  const [metric, setMetric] = useState('orders');
  const [selected, setSelected] = useState(null);
  const zones = useMemo(() => neighborhoodTrends(), []);
  const max = Math.max(...zones.map(z => metric === 'orders' ? z.orders : z.revenue));

  const zoneCoords = zones.map((z, i) => ({
    ...z,
    x: 10 + (i * 13) % 78,
    y: 12 + (i * 21) % 72,
    size: 40 + ((metric === 'orders' ? z.orders : z.revenue) / max) * 90,
  }));

  const active = selected ? zones.find(z => z.neighborhood === selected) : null;

  return (
    <div className="space-y-5" data-testid="demand-map-page">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Hyperlocal</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Demand map · Chennai</h2>
          <p className="text-sub text-sm">Zones sized by 24-hour {metric}. Click a zone to drill in.</p>
        </div>
        <div className="card p-1 flex">
          <button onClick={() => setMetric('orders')} className={`px-3 py-1.5 rounded text-sm ${metric==='orders' ? 'bg-muted' : 'text-sub'}`} data-testid="metric-orders">Orders</button>
          <button onClick={() => setMetric('revenue')} className={`px-3 py-1.5 rounded text-sm ${metric==='revenue' ? 'bg-muted' : 'text-sub'}`} data-testid="metric-revenue">Revenue</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card overflow-hidden">
          <div className="aspect-[4/3] bg-muted striped grid-bg relative">
            {zoneCoords.map((z) => (
              <button key={z.neighborhood} onClick={() => setSelected(z.neighborhood)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${z.x}%`, top: `${z.y}%` }}
                data-testid={`zone-${z.neighborhood.replace(/\W+/g,'-').toLowerCase()}`}>
                <span className="block rounded-full"
                  style={{
                    width: z.size, height: z.size,
                    background: `radial-gradient(closest-side, rgba(234,88,12,${0.55}), rgba(234,88,12,${0.05}) 70%, transparent 80%)`,
                    boxShadow: selected === z.neighborhood ? '0 0 0 2px rgb(var(--brand))' : 'none',
                  }}/>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 text-[10px] font-mono whitespace-nowrap bg-surface border divider px-1.5 py-0.5 rounded opacity-90">
                  {z.neighborhood}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          {active ? (
            <div className="space-y-3">
              <div>
                <div className="label-mono">Zone detail</div>
                <div className="font-display text-2xl font-bold mt-1">{active.neighborhood}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="card p-3"><div className="label-mono">Orders</div><div className="font-mono text-xl mt-1">{active.orders}</div></div>
                <div className="card p-3"><div className="label-mono">Revenue</div><div className="font-mono text-xl mt-1">{inr(active.revenue)}</div></div>
              </div>
              <div className="card p-3">
                <div className="label-mono">Top category</div>
                <div className="text-sm mt-1">{active.topCategory}</div>
              </div>
              <div>
                <div className="label-mono mb-2">Top items</div>
                <ul className="text-sm space-y-1">
                  <li>Aashirvaad Atta · 46 sold</li>
                  <li>Amul Paneer · 28 sold</li>
                  <li>Basmati Rice · 22 sold</li>
                </ul>
              </div>
              <button onClick={() => setSelected(null)} className="btn btn-ghost w-full justify-center">Close</button>
            </div>
          ) : (
            <div className="text-sub text-sm">
              <div className="label-mono">Zone detail</div>
              <p className="mt-2">Click a zone on the map to see its order count, revenue, and top items.</p>
              <div className="mt-4">
                <div className="label-mono mb-2">Top 5 zones</div>
                <ul className="space-y-2">
                  {zones.slice(0, 5).map(z => (
                    <li key={z.neighborhood} className="flex items-center justify-between">
                      <button onClick={() => setSelected(z.neighborhood)} className="text-sm text-ink hover:underline">{z.neighborhood}</button>
                      <span className="font-mono text-xs text-sub">{z.orders}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
