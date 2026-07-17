import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreCard } from '../../components/StoreCard';
import { ProductCard } from '../../components/ProductCard';
import { Sparkline } from '../../components/Sparkline';
import { NEIGHBORHOODS, CATEGORIES } from '../../data/mock';
import { inr } from '../../lib/utils';

export default function Home() {
  const { state, dispatch } = useApp();
  const [nbOpen, setNbOpen] = useState(false);

  const nearbyStores = useMemo(() => {
    return [...state.stores]
      .filter(s => s.status === 'active')
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 6);
  }, [state.stores]);

  const trending = useMemo(() => {
    const all = state.stores.flatMap(s => s.products.map(p => ({ ...p, storeName: s.name, neighborhood: s.neighborhood })));
    return all.sort((a, b) => (b.soldToday || 0) - (a.soldToday || 0)).slice(0, 8);
  }, [state.stores]);

  const featured = useMemo(() => {
    const all = state.stores.flatMap(s => s.products.map(p => ({ ...p, storeName: s.name })));
    return all.slice(0, 12);
  }, [state.stores]);

  return (
    <div className="space-y-8" data-testid="customer-home">
      {/* Neighborhood + hero */}
      <div className="card p-5 md:p-6 grid md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-8">
          <span className="label-mono">Delivering to</span>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <button onClick={() => setNbOpen(v => !v)} className="btn btn-ghost !h-9" data-testid="neighborhood-picker">
              <MapPin size={14}/> {state.neighborhood}
              <ChevronRight size={14} className={nbOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
            </button>
            <span className="text-sm text-sub">— fresh stock from stores within 3 km</span>
          </div>
          {nbOpen && (
            <div className="mt-3 flex flex-wrap gap-1.5" data-testid="neighborhood-list">
              {NEIGHBORHOODS.map(n => (
                <button key={n}
                  onClick={() => { dispatch({ type: 'SET_NEIGHBORHOOD', payload: n }); setNbOpen(false); }}
                  className={`chip cursor-pointer ${n === state.neighborhood ? 'chip-brand' : ''}`}
                  data-testid={`nb-${n.replace(/\W+/g,'-').toLowerCase()}`}
                >{n}</button>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-4">
          <Link to="/customer/search" className="btn btn-dark w-full justify-between !h-11" data-testid="home-search-cta">
            <span className="text-sm">Search across all nearby stores…</span>
            <span className="chip chip-ai !py-0.5"><Sparkles size={10}/> NL</span>
          </Link>
        </div>
      </div>

      {/* Category grid */}
      <section>
        <SectionHeader title="Browse categories" subtitle="Every essential, closer than you think." />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-3">
          {CATEGORIES.map(c => (
            <Link to={`/customer/search?category=${c.id}`} key={c.id}
              className="card p-3 hover:border-ink/40 text-center" data-testid={`cat-${c.id}`}>
              <div className="w-10 h-10 mx-auto rounded bg-muted flex items-center justify-center font-display font-bold text-brand">
                {c.name[0]}
              </div>
              <div className="text-xs mt-2 font-medium truncate">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stores near you */}
      <section>
        <SectionHeader title="Stores near you" subtitle="Sorted by distance, live open status." action={<Link to="/customer/nearby" className="text-sm text-brand hover:underline" data-testid="see-all-stores">See all →</Link>} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {nearbyStores.map(s => <StoreCard key={s.id} store={s} />)}
        </div>
      </section>

      {/* Trending in neighborhood */}
      <section>
        <SectionHeader title={`Trending in ${state.neighborhood}`} subtitle="Live 7-day sales sparklines." icon={TrendingUp} />
        <div className="mt-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 min-w-max pb-1">
            {trending.map(p => (
              <Link to={`/customer/product/${p.id}`} key={p.id} className="card p-3 w-56 shrink-0 hover:border-ink/40" data-testid={`trend-${p.id}`}>
                <div className="aspect-square rounded overflow-hidden bg-muted">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover"/>
                </div>
                <div className="mt-2 text-sm font-medium truncate">{p.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-sm">{inr(p.price)}</span>
                  <Sparkline data={p.trend} width={56} height={20} color="rgb(var(--brand))" />
                </div>
                <div className="text-[11px] text-sub mt-1 truncate">{p.storeName}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section>
        <SectionHeader title="Featured for you" subtitle="Fresh picks with live stock." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {featured.map(p => <ProductCard key={p.id} product={p} storeName={p.storeName} />)}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle, action, icon: Icon }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          {Icon && <Icon size={18} className="text-brand"/>}{title}
        </h3>
        {subtitle && <p className="text-sm text-sub mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
