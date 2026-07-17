import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { Chip } from './Chip';
import { cn } from '../lib/utils';

export function StoreCard({ store, className }) {
  return (
    <Link to={`/customer/store/${store.id}`} className={cn('card p-4 hover:border-ink/40 transition-colors block', className)} data-testid={`store-card-${store.id}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center font-display text-lg font-bold shrink-0">
          {store.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold truncate">{store.name}</h4>
            <span className="chip chip-success shrink-0 !py-0.5 !px-1.5">
              <Star size={10} className="fill-current" /> {store.rating}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-sub">
            <span className="flex items-center gap-1"><MapPin size={11} />{store.neighborhood} · {store.distanceKm} km</span>
            <span className="flex items-center gap-1"><Clock size={11} />{store.etaMin} min</span>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {store.open ? <Chip tone="success">Open now</Chip> : <Chip tone="danger">Closed</Chip>}
            <Chip>{store.deliveryRadiusKm} km radius</Chip>
          </div>
        </div>
      </div>
    </Link>
  );
}
