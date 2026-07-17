import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, ArrowLeft, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { StatusChip } from '../../components/Chip';
import { Modal } from '../../components/Modal';
import { inr, fmtTime, cn } from '../../lib/utils';

export default function OrderTracking() {
  const { orderId } = useParams();
  const { state, dispatch, toast } = useApp();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return <EmptyState title="Order not found" action={<Link to="/customer/orders" className="btn btn-primary">All orders</Link>}/>;

  const cancel = () => {
    dispatch({ type: 'UPDATE_ORDER', payload: { id: order.id, patch: { status: 'cancelled' } } });
    toast({ title: 'Order cancelled', kind: 'success' });
    setCancelOpen(false);
  };

  return (
    <div className="space-y-5" data-testid={`track-${order.id}`}>
      <Link to="/customer/orders" className="text-sm text-sub hover:text-ink inline-flex items-center gap-1"><ArrowLeft size={14}/>All orders</Link>

      <div className="card p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="label-mono">Order</div>
          <div className="font-mono text-lg">{order.id}</div>
          <div className="mt-1 text-sm text-sub">{order.storeName} · {order.neighborhood}</div>
        </div>
        <StatusChip status={order.status}/>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Timeline */}
        <div className="md:col-span-2 card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Delivery timeline</h3>
            <span className="pulse-dot inline-flex items-center gap-2 text-[10px] label-mono"><span/>&nbsp;Realtime</span>
          </div>
          <ol className="mt-4 relative">
            {order.timeline.map((s, i) => (
              <li key={s.key} className="grid grid-cols-[auto_1fr] gap-4 py-3">
                <div className="flex flex-col items-center">
                  <div className={cn('w-3 h-3 rounded-full', s.done ? 'bg-success' : 'bg-line', s.active && 'animate-pulseDot')}/>
                  {i < order.timeline.length - 1 && <div className={cn('flex-1 w-px my-1', s.done ? 'bg-success' : 'bg-line')}/>}
                </div>
                <div>
                  <div className={cn('text-sm font-medium', !s.done && 'text-sub')}>{s.label}</div>
                  <div className="text-xs text-sub font-mono mt-0.5">{s.at ? fmtTime(s.at) : '—'}</div>
                </div>
              </li>
            ))}
          </ol>
          {order.status === 'placed' && (
            <button onClick={() => setCancelOpen(true)} className="btn btn-ghost mt-2" data-testid="cancel-order">Cancel order</button>
          )}
          {order.status === 'delivered' && (
            <button onClick={() => setRateOpen(true)} className="btn btn-primary mt-2" data-testid="rate-order">Rate this order</button>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="label-mono">Contact store</div>
            <div className="mt-2 font-medium">{order.storeName}</div>
            <div className="text-xs text-sub">{order.neighborhood}</div>
            <button onClick={() => toast({ title: 'Calling store…', body: 'Placeholder', kind: 'info'})} className="btn btn-ghost mt-3 w-full justify-center" data-testid="call-store">
              <Phone size={14}/> Call store
            </button>
          </div>

          <div className="card p-5">
            <div className="label-mono">Items</div>
            <ul className="mt-2 space-y-2 text-sm">
              {order.items.map(i => (
                <li key={i.productId} className="flex justify-between">
                  <span className="truncate mr-2">{i.qty} × {i.name}</span>
                  <span className="font-mono text-sub">{inr(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t divider pt-3 text-sm flex justify-between font-medium">
              <span>Total</span><span className="font-mono">{inr(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel order?" size="sm"
        footer={<><button onClick={() => setCancelOpen(false)} className="btn btn-ghost">Keep order</button><button onClick={cancel} className="btn btn-primary" data-testid="cancel-confirm">Confirm cancel</button></>}>
        <p className="text-sm text-sub">This will stop the store from packing your items. This action can’t be undone.</p>
      </Modal>

      <Modal open={rateOpen} onClose={() => setRateOpen(false)} title="Rate your order" size="sm"
        footer={<button onClick={() => { toast({ title: 'Thanks for rating!', kind: 'success' }); setRateOpen(false); }} className="btn btn-primary" data-testid="rate-submit">Submit</button>}>
        <div className="flex justify-center gap-2 py-4">
          {[1,2,3,4,5].map(i => <Star key={i} size={28} className="text-warn fill-current cursor-pointer"/>)}
        </div>
        <textarea className="input !h-24" placeholder="Leave a note (optional)"/>
      </Modal>
    </div>
  );
}
