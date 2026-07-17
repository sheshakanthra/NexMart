import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/States';
import { inr, fmtTime } from '../../lib/utils';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { state } = useApp();
  const order = state.orders.find(o => o.id === orderId);
  const nav = useNavigate();
  if (!order) return <EmptyState title="Order not found" action={<Link to="/customer" className="btn btn-primary">Home</Link>}/>;

  return (
    <div className="max-w-2xl mx-auto" data-testid="order-success-page">
      <div className="card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center"><CheckCircle2 size={26}/></div>
        <h1 className="font-display text-3xl font-bold mt-3">Order placed</h1>
        <p className="text-sub text-sm mt-1">Thank you — your neighborhood store is packing your items.</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="card p-3"><div className="label-mono">Order ID</div><div className="font-mono mt-1">{order.id}</div></div>
          <div className="card p-3"><div className="label-mono">Total</div><div className="font-mono mt-1">{inr(order.total)}</div></div>
          <div className="card p-3"><div className="label-mono">ETA</div><div className="font-mono mt-1">~30 min</div></div>
        </div>
        <ul className="mt-6 text-left text-sm space-y-2">
          {order.items.map(i => (
            <li key={i.productId} className="flex justify-between border-b divider pb-2">
              <span>{i.qty} × {i.name}</span><span className="font-mono text-sub">{inr(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-2 justify-center">
          <Link to="/customer" className="btn btn-ghost" data-testid="os-home">Back to home</Link>
          <button onClick={() => nav(`/customer/order/${order.id}`)} className="btn btn-primary" data-testid="os-track">Track order <ArrowUpRight size={14}/></button>
        </div>
      </div>
    </div>
  );
}
