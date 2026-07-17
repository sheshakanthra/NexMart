import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { StockChip } from '../../components/Chip';
import { CATEGORIES } from '../../data/mock';
import { inr } from '../../lib/utils';

// Simple natural-language "AI" resolver over the catalog
function resolveNL(query, allProducts) {
  const q = query.toLowerCase();
  // Recipe-like queries
  const recipes = {
    biryani: ['basmati', 'garam', 'chicken', 'onion', 'tomato', 'ghee', 'chili'],
    breakfast: ['poha', 'milk', 'sugar', 'tea', 'bread', 'egg'],
    chai: ['tea', 'milk', 'sugar', 'ginger'],
    'dal chawal': ['toor', 'basmati', 'salt', 'turmeric'],
    dosa: ['besan', 'onion', 'chili'],
  };
  let terms = null;
  for (const key of Object.keys(recipes)) {
    if (q.includes(key)) { terms = recipes[key]; break; }
  }
  if (!terms) terms = q.split(/\s+/).filter(t => t.length > 2);
  const seen = new Set();
  const out = [];
  for (const t of terms) {
    for (const p of allProducts) {
      if (out.length >= 8) break;
      if (seen.has(p.id)) continue;
      if (p.name.toLowerCase().includes(t)) {
        seen.add(p.id); out.push(p);
      }
    }
  }
  return out;
}

export default function CustomerSearch() {
  const { state, dispatch, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [nl, setNl] = useState('');
  const [nlResults, setNlResults] = useState(null);
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(1000);

  const allProducts = useMemo(() => state.stores.flatMap(s => s.products.map(p => ({ ...p, storeName: s.name, distanceKm: s.distanceKm }))), [state.stores]);

  const results = useMemo(() => {
    let arr = allProducts;
    if (q) arr = arr.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    if (category !== 'all') arr = arr.filter(p => p.category === category);
    if (inStockOnly) arr = arr.filter(p => p.stock > 0);
    arr = arr.filter(p => p.price <= priceMax);
    return arr.slice(0, 60);
  }, [allProducts, q, category, inStockOnly, priceMax]);

  const runNL = () => {
    if (!nl.trim()) return;
    const suggestions = resolveNL(nl, allProducts);
    setNlResults(suggestions);
  };

  const addAll = () => {
    if (!nlResults) return;
    nlResults.forEach(p => {
      dispatch({ type: 'CART_ADD', payload: {
        productId: p.id, storeId: p.storeId, name: p.name, price: p.price, unit: p.unit, img: p.img, qty: 1,
      }});
    });
    toast({ title: `Added ${nlResults.length} items to cart`, body: `From your "${nl}" list`, kind: 'success' });
  };

  return (
    <div className="space-y-6" data-testid="search-page">
      {/* Search + NL */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="label-mono flex items-center gap-2"><SearchIcon size={12}/> Regular search</div>
          <div className="mt-2 relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sub"/>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search across all nearby stores…"
              className="input !pl-9 !h-11" data-testid="search-input" />
            {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-sub"><X size={14}/></button>}
          </div>
        </div>
        <div className="card p-4 sentinel-border">
          <div className="label-mono flex items-center gap-2"><Sparkles size={12}/> Natural language</div>
          <div className="mt-2 flex gap-2">
            <input value={nl} onChange={e => setNl(e.target.value)} placeholder='"ingredients for biryani for 6 people"'
              className="input !h-11 flex-1" data-testid="nl-input" />
            <button onClick={runNL} className="btn btn-dark !h-11" data-testid="nl-run">Ask AI</button>
          </div>
        </div>
      </div>

      {/* NL Suggestions */}
      {nlResults && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="label-mono">Suggested for you</div>
              <div className="font-display text-lg font-semibold">Cart-ready shopping list for "{nl}"</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setNlResults(null)} className="btn btn-ghost">Dismiss</button>
              <button onClick={addAll} className="btn btn-primary" data-testid="nl-add-all">Add all to cart</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {nlResults.map(p => (
              <Link to={`/customer/product/${p.id}`} key={p.id} className="card p-3">
                <div className="aspect-square bg-muted rounded overflow-hidden"><img src={p.img} className="w-full h-full object-cover" alt=""/></div>
                <div className="text-sm font-medium mt-2 truncate">{p.name}</div>
                <div className="flex items-center justify-between mt-1"><span className="font-mono text-sm">{inr(p.price)}</span><StockChip qty={p.stock}/></div>
              </Link>
            ))}
          </div>
          {nlResults.length === 0 && <div className="text-sm text-sub mt-3">No matches for that request. Try being more specific.</div>}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select value={category} onChange={e => setCategory(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="filter-category">
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => setInStockOnly(v => !v)} className={`chip cursor-pointer ${inStockOnly ? 'chip-success' : ''}`} data-testid="filter-instock">In stock only</button>
        <div className="chip !py-1 flex items-center gap-2">
          <span>Max ₹{priceMax}</span>
          <input type="range" min="20" max="1000" value={priceMax} onChange={e => setPriceMax(+e.target.value)} className="w-24" data-testid="filter-price"/>
        </div>
        <div className="ml-auto text-xs text-sub font-mono">{results.length} results</div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <EmptyState title="No results" body="Try adjusting your filters or search a different term." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map(p => (
            <Link to={`/customer/product/${p.id}`} key={p.id} className="card p-3">
              <div className="aspect-square bg-muted rounded overflow-hidden"><img src={p.img} className="w-full h-full object-cover" alt="" loading="lazy"/></div>
              <div className="text-sm font-medium mt-2 truncate">{p.name}</div>
              <div className="text-[11px] text-sub truncate">{p.storeName} · {p.distanceKm}km</div>
              <div className="flex items-center justify-between mt-1"><span className="font-mono">{inr(p.price)}</span><StockChip qty={p.stock}/></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
