import React from 'react';
import { cn } from '../lib/utils';

export function Sparkline({ data, width = 84, height = 26, color = 'currentColor', className }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * (height - 2) - 1}`).join(' ');
  const areaPts = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} className={cn('inline-block', className)} viewBox={`0 0 ${width} ${height}`}>
      <polygon points={areaPts} fill={color} opacity="0.12" />
      <polyline fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}
