import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/States';
import { inr, uid, cn } from '../../lib/utils';
import { ORDER_STAGES, ORDER_STAGE_LABELS } from '../../data/mock';

export default function Checkout() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const [addr, setAddr] = useState(state.addresses[0] || { name:'', phone:'', line1:'', line2:'', neighborhood: state.neighborhood });
  const [payment, setPayment] = useState('COD');
  const [errors, setErrors] = useState({});
  const [upiOpen, setUpiOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictItem, setConflictItem] = useState(null);
  const [placing, setPlacing] = useState(false);

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = state.cart.length ? 25 : 0;
  const total = subtotal + deliveryFee;

  if (state.cart.length === 0) {
    return <EmptyState title="Nothing to checkout" body="Add items to your cart first." action={<Link to="/customer" className="btn btn-primary">Browse stores</Link>} />;
  }

  const validate = () => {
    const e = {};
    if (!addr.name?.trim()) e.name = 'Required';
    if (!/^\+?\d[\d\s-]{7,}$/.test(addr.phone || '')) e.phone = 'Enter phone';
    if (!addr.line1?.trim()) e.line1 = 'Required';
    if (!addr.neighborhood) e.neighborhood = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const place = () => {
    if (!validate()) return;
    // 8% chance of a stock conflict simulation for demo
    if (Math.random() < 0.15) {
      setConflictItem(state.cart[Math.floor(Math.random() * state.cart.length)]);
      setConflictOpen(true);
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const storeId = state.cart[0].storeId;
      const store = state.stores.find(s => s.id === storeId);
      const items = state.cart.map(i => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty, unit: i.unit, img: i.img }));
      const orderId = 'NM' + (95000 + Math.floor(Math.random() * 5000));
      const now = Date.now();
      const order = {
        id: orderId,
        storeId, storeName: store?.name, neighborhood: store?.neighborhood,
        customer: state.profile?.name || 'You',
        customerAddress: `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.neighborhood}`,
        items, subtotal, deliveryFee, total,
        status: 'placed',
        placedAt: now,
        timeline: ORDER_STAGES.map((s, k) => ({ key: s, label: ORDER_STAGE_LABELS[s], at: k === 0 ? now : null, done: k === 0, active: k === 0 })),
        payment,
      };
      dispatch({ type: 'ADD_ORDER', payload: order });
      dispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'NOTIFY', payload: { title: 'Order placed', body: `${orderId} · ${inr(total)}`, kind: 'order' } });
      toast({ title: 'Order placed', body: orderId, kind: 'success' });
      setPlacing(false);
      nav(`/customer/order/success/${orderId}`);
    }, 700);
  };

  return (
    <div className="grid md:grid-cols-3 gap-5" data-testid="checkout-page">
      <div className="md:col-span-2 space-y-5">
        <Link to="/customer/cart" className="text-sm text-sub hover:text-ink inline-flex items-center gap-1"><ArrowLeft size={14}/>Back to cart</Link>

        {/* Address */}
        <div className="card p-5">
          <h3 className="font-display text-lg font-semibold">Delivery address</h3>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            <Field label="Full name" value={addr.name} onChange={v => setAddr(a => ({...a, name: v}))} error={errors.name} testId="addr-name"/>
            <Field label="Phone" value={addr.phone} onChange={v => setAddr(a => ({...a, phone: v}))} error={errors.phone} testId="addr-phone"/>
            <Field label="Address line 1" value={addr.line1} onChange={v => setAddr(a => ({...a, line1: v}))} error={errors.line1} className="md:col-span-2" testId="addr-line1"/>
            <Field label="Address line 2 (optional)" value={addr.line2 || ''} onChange={v => setAddr(a => ({...a, line2: v}))} className="md:col-span-2" testId="addr-line2"/>
            <div>
              <label className="label-mono block mb-1">Neighborhood</label>
              <input value={addr.neighborhood} onChange={e => setAddr(a => ({...a, neighborhood: e.target.value}))} className="input" data-testid="addr-neigh"/>
              {errors.neighborhood && <p className="text-danger text-xs mt-1">{errors.neighborhood}</p>}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="card p-5">
          <h3 className="font-display text-lg font-semibold">Payment method</h3>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            <button onClick={() => setPayment('COD')} className={cn('card p-4 text-left flex items-start gap-3 hover:border-ink/40', payment==='COD' && 'ring-1 ring-brand')}
              data-testid="pay-cod">
              <Wallet size={18}/>
              <div>
                <div className="font-medium">Cash on Delivery</div>
                <div className="text-xs text-sub mt-1">Pay in cash when your order arrives.</div>
              </div>
            </button>
            <button onClick={() => { setPayment('UPI'); setUpiOpen(true); }} className={cn('card p-4 text-left flex items-start gap-3 hover:border-ink/40', payment==='UPI' && 'ring-1 ring-brand')}
              data-testid="pay-upi">
              <CreditCard size={18}/>
              <div>
                <div className="font-medium">UPI (simulated)</div>
                <div className="text-xs text-sub mt-1">GPay, PhonePe, Paytm — all mocked.</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div>
        <div className="card p-5 md:sticky md:top-20">
          <h3 className="font-display text-lg font-semibold">Order summary</h3>
          <ul className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {state.cart.map(i => (
              <li key={i.productId} className="flex items-center justify-between text-sm">
                <span className="truncate mr-2">{i.qty} × {i.name}</span>
                <span className="font-mono text-sub">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 text-sm border-t divider pt-3">
            <div className="flex justify-between"><dt className="text-sub">Subtotal</dt><dd className="font-mono">{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-sub">Delivery</dt><dd className="font-mono">{inr(deliveryFee)}</dd></div>
            <div className="flex justify-between pt-2 border-t divider"><dt className="font-medium">Total</dt><dd className="font-mono font-medium">{inr(total)}</dd></div>
          </dl>
          <button disabled={placing} onClick={place} className="btn btn-primary w-full mt-4 justify-center !h-11" data-testid="place-order">
            {placing ? 'Placing…' : `Place order · ${inr(total)}`}
          </button>
        </div>
      </div>

      {/* UPI Modal */}
      <Modal open={upiOpen} onClose={() => setUpiOpen(false)} title="Simulated UPI payment" testId="upi-modal"
        footer={<><button onClick={() => setUpiOpen(false)} className="btn btn-ghost">Cancel</button><button onClick={() => { toast({ title: 'UPI confirmed', kind: 'success' }); setUpiOpen(false); }} className="btn btn-primary" data-testid="upi-confirm">Confirm ₹{total}</button></>}>
        <div className="grid grid-cols-3 gap-3">
          {['GPay','PhonePe','Paytm'].map(app => (
            <div key={app} className="card p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded bg-muted flex items-center justify-center font-display font-bold">{app[0]}</div>
              <div className="text-sm mt-2">{app}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-sub">Enter UPI PIN in your app to authorize.</div>
        <div className="mt-2 card p-3">
          <div className="text-xs label-mono">Paying to</div>
          <div className="font-mono text-sm mt-1">nexmart@upi</div>
        </div>
      </Modal>

      {/* Stock conflict */}
      <Modal open={conflictOpen} onClose={() => setConflictOpen(false)} title="Item just sold out" testId="conflict-modal"
        footer={<><button onClick={() => { setConflictOpen(false); nav('/customer/cart'); }} className="btn btn-primary" data-testid="conflict-cart">Update cart</button></>}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-warn/15 text-warn flex items-center justify-center shrink-0"><AlertTriangle size={16}/></div>
          <div>
            <p className="text-sm">While you were checking out, <b>{conflictItem?.name}</b> ran out of stock at the store. We've removed it from your cart. Please review and try again.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange, error, className, testId }) {
  return (
    <div className={className}>
      <label className="label-mono block mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="input" data-testid={testId}/>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
