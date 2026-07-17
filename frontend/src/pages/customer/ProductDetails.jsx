import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Heart, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { StockChip } from '../../components/Chip';
import { ProductCard } from '../../components/ProductCard';
import { inr, cn } from '../../lib/utils';

export default function ProductDetails() {
  const { productId } = useParams();
  const { state, dispatch, toast } = useApp();
  const [qty, setQty] = useState(1);
  const nav = useNavigate();

  const found = useMemo(() => {
    for (const s of state.stores) {
      const p = s.products.find(x => x.id === productId);
      if (p) return { product: p, store: s };
    }
    return null;
  }, [state.stores, productId]);

  if (!found) return <EmptyState title="Product not found" body="It may have been delisted." action={<Link to="/customer" className="btn btn-primary">Back home</Link>} />;

  const { product, store } = found;
  const outOfStock = product.stock <= 0;
  const wished = state.wishlist.includes(product.id);

  const stockPct = Math.min(100, Math.max(4, (product.stock / 50) * 100));

  const fbt = store.products.filter(p => p.id !== product.id).slice(0, 4);

  const addToCart = () => {
    if (outOfStock) return;
    dispatch({ type: 'CART_ADD', payload: {
      productId: product.id, storeId: store.id, name: product.name,
      price: product.price, unit: product.unit, img: product.img, qty,
    }});
    toast({ title: 'Added to cart', body: `${qty} × ${product.name}`, kind: 'success' });
  };

  return (
    <div className="space-y-6" data-testid={`product-page-${product.id}`}>
      <Link to={`/customer/store/${store.id}`} className="text-sm text-sub hover:text-ink inline-flex items-center gap-1"><ArrowLeft size={14}/>Back to {store.name}</Link>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="aspect-square bg-muted"><img src={product.img} alt={product.name} className="w-full h-full object-cover"/></div>
          <div className="p-3 grid grid-cols-4 gap-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="aspect-square bg-muted rounded overflow-hidden opacity-80"><img src={product.img} className="w-full h-full object-cover" alt=""/></div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="label-mono">{product.category}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-1">{product.name}</h1>
            <div className="mt-1 text-sub text-sm">{product.unit}</div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-medium">{inr(product.price)}</span>
            <span className="text-sub text-sm">/ {product.unit}</span>
          </div>

          {/* Stock meter */}
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <span className="label-mono">Live stock level</span>
              <StockChip qty={product.stock} />
            </div>
            <div className="mt-3 h-1.5 rounded bg-muted overflow-hidden">
              <div
                className={cn('h-full transition-all duration-500', outOfStock ? 'bg-danger' : product.stock <= 5 ? 'bg-warn' : 'bg-success')}
                style={{ width: `${outOfStock ? 100 : stockPct}%` }}
                data-testid="stock-meter"
              />
            </div>
            <div className="text-xs text-sub mt-2 font-mono">{outOfStock ? '0 available' : `${product.stock} available at ${store.name}`}</div>
          </div>

          <p className="text-sm text-sub leading-relaxed">{product.description}</p>

          {!outOfStock ? (
            <div className="flex items-center gap-3">
              <div className="card flex items-center h-11" data-testid="qty-stepper">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center"><Minus size={14}/></button>
                <div className="w-10 text-center font-mono">{qty}</div>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-11 flex items-center justify-center"><Plus size={14}/></button>
              </div>
              <button onClick={addToCart} className="btn btn-primary flex-1 justify-center !h-11" data-testid="add-to-cart-main">
                Add to cart — {inr(product.price * qty)}
              </button>
              <button onClick={() => dispatch({ type: 'WISHLIST_TOGGLE', payload: product.id })} className={cn('btn btn-ghost !w-11 !h-11 !p-0 justify-center', wished && '!text-danger')} data-testid="wishlist-toggle">
                <Heart size={16} className={wished ? 'fill-current' : ''}/>
              </button>
            </div>
          ) : (
            <button onClick={() => toast({ title: 'We’ll notify you', body: `When ${product.name} is back in stock.`, kind: 'info' })} className="btn btn-dark !h-11 justify-center" data-testid="notify-me">
              <Bell size={14}/> Notify me when back in stock
            </button>
          )}

          {/* Store */}
          <Link to={`/customer/store/${store.id}`} className="card p-4 flex items-center justify-between hover:border-ink/40" data-testid="from-store-link">
            <div>
              <div className="text-xs label-mono">Sold by</div>
              <div className="font-medium">{store.name}</div>
              <div className="text-xs text-sub mt-0.5">{store.neighborhood} · {store.distanceKm} km · ETA {store.etaMin}m</div>
            </div>
            <ArrowLeft size={14} className="rotate-180"/>
          </Link>
        </div>
      </div>

      <section>
        <h3 className="font-display text-xl font-semibold">Frequently bought together</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {fbt.map(p => <ProductCard key={p.id} product={p} storeName={store.name} showSpark={false} />)}
        </div>
      </section>
    </div>
  );
}
