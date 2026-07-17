import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { inr } from '../../lib/utils';

export default function Cart() {
  const { state, dispatch } = useApp();
  const nav = useNavigate();

  const grouped = useMemo(() => {
    const m = {};
    state.cart.forEach(i => {
      const store = state.stores.find(s => s.id === i.storeId);
      const key = i.storeId;
      if (!m[key]) m[key] = { store, items: [] };
      m[key].items.push(i);
    });
    return Object.values(m);
  }, [state.cart, state.stores]);

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = state.cart.length ? 25 : 0;
  const total = subtotal + deliveryFee;

  if (state.cart.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        body="Discover fresh stock from neighborhood stores near you."
        action={<Link to="/customer" className="btn btn-primary" data-testid="empty-browse">Start shopping</Link>}
      />
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-5" data-testid="cart-page">
      <div className="md:col-span-2 space-y-4">
        {grouped.map(g => (
          <div key={g.store?.id} className="card">
            <div className="px-5 py-3 border-b divider flex items-center justify-between">
              <div>
                <div className="label-mono">Store</div>
                <div className="font-medium">{g.store?.name}</div>
              </div>
              <span className="chip">ETA {g.store?.etaMin} min</span>
            </div>
            <ul>
              {g.items.map(i => (
                <li key={i.productId} className="px-5 py-4 flex items-center gap-4 border-b divider last:border-none" data-testid={`cart-item-${i.productId}`}>
                  <div className="w-14 h-14 bg-muted rounded overflow-hidden shrink-0"><img src={i.img} alt="" className="w-full h-full object-cover"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{i.name}</div>
                    <div className="text-xs text-sub">{i.unit} · {inr(i.price)}</div>
                  </div>
                  <div className="card flex items-center h-9">
                    <button onClick={() => dispatch({ type: 'CART_SET_QTY', payload: { productId: i.productId, qty: i.qty - 1 } })} className="w-8 h-9 flex items-center justify-center"><Minus size={12}/></button>
                    <div className="w-8 text-center font-mono text-sm">{i.qty}</div>
                    <button onClick={() => dispatch({ type: 'CART_SET_QTY', payload: { productId: i.productId, qty: i.qty + 1 } })} className="w-8 h-9 flex items-center justify-center"><Plus size={12}/></button>
                  </div>
                  <div className="w-20 text-right font-mono text-sm">{inr(i.price * i.qty)}</div>
                  <button onClick={() => dispatch({ type: 'CART_REMOVE', payload: i.productId })} className="p-2 text-sub hover:text-danger" data-testid={`cart-remove-${i.productId}`}><Trash2 size={14}/></button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="md:col-span-1">
        <div className="card p-5 md:sticky md:top-20" data-testid="bill-summary">
          <h3 className="font-display text-lg font-semibold">Bill summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-sub">Subtotal</dt><dd className="font-mono">{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-sub">Delivery fee</dt><dd className="font-mono">{inr(deliveryFee)}</dd></div>
            <div className="flex justify-between text-base pt-3 border-t divider"><dt className="font-medium">Total</dt><dd className="font-mono font-medium">{inr(total)}</dd></div>
          </dl>
          <button onClick={() => nav('/customer/checkout')} className="btn btn-primary w-full mt-4 justify-center !h-11" data-testid="proceed-checkout">Proceed to checkout</button>
          <Link to="/customer" className="btn btn-ghost w-full mt-2 justify-center">Continue shopping</Link>
          <p className="text-[11px] text-sub mt-3 font-mono">Your cart is saved locally.</p>
        </div>
      </div>
    </div>
  );
}
