import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { StatusChip } from '../../components/Chip';
import { inr, fmtDate } from '../../lib/utils';

export default function Orders() {
  const { state, dispatch, toast } = useApp();
  const active = useMemo(() => state.orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').slice(0, 20), [state.orders]);
  const past   = useMemo(() => state.orders.filter(o => o.status === 'delivered' || o.status === 'cancelled').slice(0, 30), [state.orders]);

  const reorder = (o) => {
    o.items.forEach(i => dispatch({ type: 'CART_ADD', payload: {
      productId: i.productId, storeId: o.storeId, name: i.name, price: i.price, unit: i.unit, img: i.img, qty: i.qty
    }}));
    toast({ title: 'Items added to cart', body: `From ${o.storeName}`, kind: 'success' });
  };

  return (
    <div className="space-y-6" data-testid="orders-history">
      <div>
        <div className="label-mono">My orders</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Active & past orders</h2>
      </div>

      <section>
        <h3 className="font-display text-lg font-semibold mb-2">Active</h3>
        {active.length === 0 ? (
          <EmptyState title="No active orders" body="Place your first order from a store near you." action={<Link to="/customer" className="btn btn-primary">Browse stores</Link>}/>
        ) : (
          <div className="grid gap-3">
            {active.map(o => <OrderRow key={o.id} order={o} onReorder={() => reorder(o)}/>)}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display text-lg font-semibold mb-2">Completed</h3>
        {past.length === 0 ? (
          <EmptyState title="No past orders yet" body="Once you complete an order it'll show up here."/>
        ) : (
          <div className="grid gap-3">
            {past.map(o => <OrderRow key={o.id} order={o} onReorder={() => reorder(o)}/>)}
          </div>
        )}
      </section>
    </div>
  );
}

function OrderRow({ order, onReorder }) {
  return (
    <div className="card p-4 flex items-center gap-4 flex-wrap md:flex-nowrap" data-testid={`order-row-${order.id}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-sub">#{order.id}</span>
          <StatusChip status={order.status}/>
          <span className="text-xs text-sub">{fmtDate(order.placedAt)}</span>
        </div>
        <div className="mt-1 font-medium">{order.storeName}</div>
        <div className="text-xs text-sub">{order.items.length} items · {order.neighborhood}</div>
      </div>
      <div className="font-mono text-sm">{inr(order.total)}</div>
      <div className="flex items-center gap-2">
        <button onClick={onReorder} className="btn btn-ghost !h-9" data-testid={`reorder-${order.id}`}><RefreshCw size={14}/>Reorder</button>
        <Link to={`/customer/order/${order.id}`} className="btn btn-dark !h-9" data-testid={`track-${order.id}`}>Track</Link>
      </div>
    </div>
  );
}
