import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StockChip } from './Chip';
import { Sparkline } from './Sparkline';
import { inr, cn } from '../lib/utils';

export function ProductCard({ product, storeName, showSpark = true, className }) {
  const { dispatch, toast } = useApp();
  const outOfStock = product.stock <= 0;
  const addToCart = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (outOfStock) return;
    dispatch({ type: 'CART_ADD', payload: {
      productId: product.id, storeId: product.storeId, name: product.name,
      price: product.price, unit: product.unit, img: product.img, qty: 1,
    }});
    toast({ title: 'Added to cart', body: product.name, kind: 'success' });
  };
  return (
    <Link to={`/customer/product/${product.id}`} className={cn('card p-3 flex flex-col gap-2.5 hover:border-ink/40 transition-colors', className)} data-testid={`product-card-${product.id}`}>
      <div className="aspect-square bg-muted rounded overflow-hidden">
        <img src={product.img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{product.name}</div>
        <div className="text-xs text-sub mt-0.5 truncate">{storeName || product.unit}</div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="font-mono text-base font-medium leading-none">{inr(product.price)}</div>
          <div className="text-[10px] text-sub mt-1">{product.unit}</div>
        </div>
        {showSpark && product.trend && <Sparkline data={product.trend} width={54} height={20} color="rgb(var(--brand))" />}
      </div>
      <div className="flex items-center justify-between gap-2">
        <StockChip qty={product.stock} />
        <button
          onClick={addToCart}
          disabled={outOfStock}
          className={cn('btn h-8 !px-2.5 text-xs', outOfStock ? 'btn-ghost opacity-60 cursor-not-allowed' : 'btn-dark')}
          data-testid={`add-to-cart-${product.id}`}
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </Link>
  );
}
