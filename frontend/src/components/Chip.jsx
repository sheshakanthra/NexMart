import React from 'react';
import { cn, stockStatus } from '../lib/utils';

export function Chip({ tone = 'default', className, children, ...rest }) {
  const cls = tone === 'success' ? 'chip-success' : tone === 'warn' ? 'chip-warn' : tone === 'danger' ? 'chip-danger' : tone === 'brand' ? 'chip-brand' : tone === 'ai' ? 'chip-ai' : '';
  return <span className={cn('chip', cls, className)} {...rest}>{children}</span>;
}

export function StockChip({ qty, threshold = 5, className }) {
  const s = stockStatus(qty, threshold);
  return <Chip tone={s.tone} className={className}>{s.label}</Chip>;
}

export function StatusChip({ status, className }) {
  const map = {
    placed: { tone: 'brand', label: 'Placed' },
    accepted: { tone: 'brand', label: 'Accepted' },
    packed: { tone: 'warn', label: 'Packed' },
    out_for_delivery: { tone: 'warn', label: 'Out for Delivery' },
    delivered: { tone: 'success', label: 'Delivered' },
    cancelled: { tone: 'danger', label: 'Cancelled' },
    active: { tone: 'success', label: 'Active' },
    pending: { tone: 'warn', label: 'Pending' },
    suspended: { tone: 'danger', label: 'Suspended' },
  };
  const m = map[status] || { tone: 'default', label: status };
  return <Chip tone={m.tone} className={className}>{m.label}</Chip>;
}
