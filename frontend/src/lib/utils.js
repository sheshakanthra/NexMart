import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...args) {
  return twMerge(clsx(args));
}

export function inr(n) {
  const num = Math.round(Number(n) || 0);
  return '₹' + num.toLocaleString('en-IN');
}

export function relTime(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function elapsed(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs}s`;
}

export function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function clamp(n, mn, mx) { return Math.max(mn, Math.min(mx, n)); }

export function stockStatus(qty, threshold = 5) {
  if (qty <= 0) return { key: 'out', label: 'Out of stock', tone: 'danger' };
  if (qty <= threshold) return { key: 'low', label: `Only ${qty} left`, tone: 'warn' };
  return { key: 'in', label: 'In stock', tone: 'success' };
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
