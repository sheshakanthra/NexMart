import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/States';
import { CATEGORIES } from '../../data/mock';

export default function StoreDetails() {
  const { storeId } = useParams();
  const { state } = useApp();
  const [cat, setCat] = useState('all');
  const store = state.stores.find(s => s.id === storeId);

  const products = useMemo(() => {
    if (!store) return [];
    return cat === 'all' ? store.products : store.products.filter(p => p.category === cat);
  }, [store, cat]);

  if (!store) return <EmptyState title="Store not found" body="This store may have been suspended or removed." action={<Link to="/customer/nearby" className="btn btn-primary">Back to stores</Link>} />;

  return (
    <div className="space-y-5" data-testid={`store-page-${store.id}`}>
      <Link to="/customer/nearby" className="text-sm text-sub hover:text-ink inline-flex items-center gap-1"><ArrowLeft size={14}/>All stores</Link>

      <div className="card overflow-hidden">
        <div className="aspect-[3/1] bg-muted relative">
          <img src={store.cover} alt="" className="w-full h-full object-cover opacity-80"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
        </div>
        <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 relative">
          <div className="text-white md:text-inherit">
            <div className="w-14 h-14 rounded bg-surface border divider flex items-center justify-center font-display text-2xl font-bold">
              {store.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight mt-3 text-ink">{store.name}</h1>
            <div className="flex items-center gap-4 text-sm text-sub mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-success"><Star size={13} className="fill-current"/>{store.rating}</span>
              <span className="flex items-center gap-1"><MapPin size={13}/>{store.neighborhood} · {store.distanceKm} km</span>
              <span className="flex items-center gap-1"><Clock size={13}/>{store.hours}</span>
              <span className="chip">Delivery {store.deliveryRadiusKm} km</span>
              {store.open ? <span className="chip chip-success">Open now</span> : <span className="chip chip-danger">Closed</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 min-w-max" data-testid="store-category-tabs">
          <TabBtn active={cat === 'all'} onClick={() => setCat('all')}>All products</TabBtn>
          {CATEGORIES.map(c => (
            <TabBtn key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.name}</TabBtn>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products in this category" body="Try switching to a different category." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} storeName={store.name} showSpark={false} />)}
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, children, ...rest }) {
  return (
    <button {...rest} className={`px-3 py-1.5 rounded text-sm border ${active ? 'bg-ink text-bg border-ink' : 'border-transparent text-sub hover:text-ink hover:bg-muted'}`}>
      {children}
    </button>
  );
}
