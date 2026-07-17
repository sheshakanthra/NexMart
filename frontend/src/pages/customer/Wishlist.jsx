import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { StockChip } from '../../components/Chip';
import { inr } from '../../lib/utils';

export default function Wishlist() {
  const { state, dispatch, toast } = useApp();
  const items = useMemo(() => {
    const all = state.stores.flatMap(s => s.products.map(p => ({ ...p, storeName: s.name })));
    return all.filter(p => state.wishlist.includes(p.id));
  }, [state.stores, state.wishlist]);

  return (
    <div className="space-y-5" data-testid="wishlist-page">
      <div className="flex items-end justify-between">
        <div>
          <div className="label-mono">Saved for later</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Your wishlist</h2>
        </div>
        <span className="chip">Beta · coming soon</span>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Nothing saved yet" body="Tap the heart on any product to save it here."
          action={<Link to="/customer" className="btn btn-primary">Browse stores</Link>}/>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(p => (
            <div key={p.id} className="card p-3">
              <Link to={`/customer/product/${p.id}`} className="block">
                <div className="aspect-square bg-muted rounded overflow-hidden"><img src={p.img} className="w-full h-full object-cover" alt=""/></div>
                <div className="mt-2 text-sm font-medium truncate">{p.name}</div>
                <div className="text-[11px] text-sub truncate">{p.storeName}</div>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono">{inr(p.price)}</span>
                <StockChip qty={p.stock}/>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => {
                  dispatch({ type: 'CART_ADD', payload: { productId: p.id, storeId: p.storeId, name: p.name, price: p.price, unit: p.unit, img: p.img, qty: 1 } });
                  dispatch({ type: 'WISHLIST_TOGGLE', payload: p.id });
                  toast({ title: 'Moved to cart', body: p.name, kind: 'success' });
                }} className="btn btn-primary !h-8 flex-1 justify-center text-xs" data-testid={`wl-cart-${p.id}`}><ShoppingBag size={12}/>Move to cart</button>
                <button onClick={() => dispatch({ type: 'WISHLIST_TOGGLE', payload: p.id })} className="btn btn-ghost !h-8 !w-8 !p-0 justify-center" data-testid={`wl-del-${p.id}`}><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
