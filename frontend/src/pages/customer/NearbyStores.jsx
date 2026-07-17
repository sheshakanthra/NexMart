import React, { useMemo, useState } from 'react';
import { List, Map as MapIcon, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreCard } from '../../components/StoreCard';

export default function NearbyStores() {
  const { state } = useApp();
  const [view, setView] = useState('list');
  const [sort, setSort] = useState('distance');
  const [openOnly, setOpenOnly] = useState(false);

  const stores = useMemo(() => {
    let arr = state.stores.filter(s => s.status === 'active');
    if (openOnly) arr = arr.filter(s => s.open);
    if (sort === 'distance') arr.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [state.stores, sort, openOnly]);

  return (
    <div className="space-y-4" data-testid="nearby-page">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="label-mono">Discovery</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Stores near {state.neighborhood}</h2>
          <p className="text-sub text-sm mt-1">{stores.length} active stores in your area</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="card p-1 flex" data-testid="view-toggle">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded text-sm flex items-center gap-1.5 ${view === 'list' ? 'bg-muted' : ''}`} data-testid="view-list"><List size={14}/>List</button>
            <button onClick={() => setView('map')} className={`px-3 py-1.5 rounded text-sm flex items-center gap-1.5 ${view === 'map' ? 'bg-muted' : ''}`} data-testid="view-map"><MapIcon size={14}/>Map</button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="chip"><Filter size={12}/> Filters</span>
        <button onClick={() => setOpenOnly(v => !v)} className={`chip ${openOnly ? 'chip-success' : ''} cursor-pointer`} data-testid="filter-open">Open now</button>
        <select value={sort} onChange={e => setSort(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="filter-sort">
          <option value="distance">Sort: Distance</option>
          <option value="rating">Sort: Rating</option>
        </select>
      </div>

      {view === 'list' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stores.map(s => <StoreCard key={s.id} store={s} />)}
        </div>
      ) : (
        <div className="card overflow-hidden" data-testid="map-view">
          <div className="relative aspect-[16/9] bg-muted striped">
            <div className="absolute inset-0 grid-bg opacity-40"/>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sub text-sm">Interactive map placeholder — Chennai area</div>
            </div>
            {stores.slice(0, 10).map((s, i) => (
              <div key={s.id} className="absolute" style={{ left: `${10 + (i * 8) % 80}%`, top: `${15 + (i * 13) % 65}%` }}>
                <div className="relative group">
                  <span className="w-3 h-3 rounded-full bg-brand ring-4 ring-brand/30 block"/>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface border divider rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {s.name} · {s.distanceKm}km
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t divider grid md:grid-cols-2 gap-3">
            {stores.slice(0, 4).map(s => <StoreCard key={s.id} store={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}
