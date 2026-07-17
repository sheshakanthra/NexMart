import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusChip } from '../../components/Chip';
import { EmptyState } from '../../components/States';
import { Drawer } from '../../components/Modal';
import { Modal } from '../../components/Modal';
import { inr, elapsed, fmtTime } from '../../lib/utils';
import { ORDER_STAGES, ORDER_STAGE_LABELS } from '../../data/mock';

const STAGES = [
  { key: 'placed', label: 'New', next: 'accepted', cta: 'Accept' },
  { key: 'accepted', label: 'Accepted', next: 'packed', cta: 'Mark packed' },
  { key: 'packed', label: 'Packed', next: 'out_for_delivery', cta: 'Out for delivery' },
  { key: 'out_for_delivery', label: 'Out for Delivery', next: 'delivered', cta: 'Mark delivered' },
  { key: 'delivered', label: 'Completed', next: null, cta: null },
];

export default function VendorOrders() {
  const { state, dispatch, toast } = useApp();
  const storeId = state.session?.storeId || 's_0';
  const orders = useMemo(() => state.orders.filter(o => o.storeId === storeId), [state.orders, storeId]);
  const [detail, setDetail] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(null);

  const advance = (o, next) => {
    const idx = ORDER_STAGES.indexOf(o.status);
    const timeline = o.timeline.map((s, k) => k === idx + 1 ? { ...s, at: Date.now(), done: true, active: next !== 'delivered' } : k === idx ? { ...s, active: false } : s);
    dispatch({ type: 'UPDATE_ORDER', payload: { id: o.id, patch: { status: next, timeline } } });
    toast({ title: `Order ${o.id} → ${ORDER_STAGE_LABELS[next]}`, kind: 'success' });
  };

  const reject = () => {
    if (!rejectOpen) return;
    dispatch({ type: 'UPDATE_ORDER', payload: { id: rejectOpen.id, patch: { status: 'cancelled' } } });
    setRejectOpen(null);
    toast({ title: 'Order rejected', kind: 'info' });
  };

  return (
    <div className="space-y-5" data-testid="vendor-orders">
      <div>
        <div className="label-mono">Operations</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Order queue</h2>
        <p className="text-sub text-sm">Advance each order through its lifecycle. New orders arrive live.</p>
      </div>

      <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-3">
        {STAGES.map(stg => {
          const list = orders.filter(o => o.status === stg.key);
          return (
            <div key={stg.key} className="card min-h-[300px]" data-testid={`col-${stg.key}`}>
              <div className="px-4 py-3 border-b divider flex items-center justify-between">
                <div className="label-mono flex items-center gap-2">
                  {stg.key === 'placed' && <span className="pulse-dot inline-flex"><span/></span>}
                  {stg.label}
                </div>
                <span className="chip !py-0 !px-1.5 text-[10px]">{list.length}</span>
              </div>
              {list.length === 0 ? (
                <div className="p-4 text-xs text-sub text-center">No orders in this stage.</div>
              ) : (
                <ul className="p-2 space-y-2">
                  {list.slice(0, 20).map(o => (
                    <li key={o.id} className="card p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">{o.id}</span>
                        <span className="text-[10px] text-sub font-mono">{elapsed(o.placedAt)}</span>
                      </div>
                      <div className="text-sm font-medium mt-1 truncate">{o.customer}</div>
                      <div className="text-xs text-sub truncate">{o.items.length} items · {o.neighborhood}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-sm">{inr(o.total)}</span>
                        <button onClick={() => setDetail(o)} className="text-xs text-sub hover:text-ink underline underline-offset-2" data-testid={`view-${o.id}`}>View</button>
                      </div>
                      {stg.next && (
                        <div className="mt-2 flex gap-1">
                          <button onClick={() => advance(o, stg.next)} className="btn btn-primary !h-8 flex-1 justify-center text-xs" data-testid={`advance-${o.id}`}>{stg.cta}</button>
                          {stg.key === 'placed' && <button onClick={() => setRejectOpen(o)} className="btn btn-ghost !h-8 !text-danger text-xs" data-testid={`reject-${o.id}`}>Reject</button>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail ? `Order ${detail.id}` : 'Order'} width="max-w-lg">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusChip status={detail.status}/>
              <span className="text-xs text-sub font-mono">Placed {fmtTime(detail.placedAt)}</span>
            </div>
            <div>
              <div className="label-mono">Customer</div>
              <div className="text-sm mt-1">{detail.customer}</div>
              <div className="text-xs text-sub">{detail.customerAddress}</div>
            </div>
            <div>
              <div className="label-mono">Items</div>
              <ul className="mt-2 divide-y divider">
                {detail.items.map(i => (
                  <li key={i.productId} className="py-2 flex items-center justify-between">
                    <span>{i.qty} × {i.name}</span>
                    <span className="font-mono text-sub text-sm">{inr(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t divider text-sm flex justify-between font-medium">
                <span>Total ({detail.payment})</span><span className="font-mono">{inr(detail.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal open={!!rejectOpen} onClose={() => setRejectOpen(null)} title="Reject order?" size="sm"
        footer={<><button onClick={() => setRejectOpen(null)} className="btn btn-ghost">Keep</button><button onClick={reject} className="btn btn-primary !bg-danger" data-testid="confirm-reject">Reject</button></>}>
        <p className="text-sm text-sub">The customer will be notified and their payment refunded. This can’t be undone.</p>
      </Modal>
    </div>
  );
}
