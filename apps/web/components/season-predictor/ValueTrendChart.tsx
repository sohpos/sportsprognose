'use client';

import { memo, useMemo } from 'react';

type ValuePoint = {
  date: string;
  value: number;
};

type ValueTrendChartProps = {
  data: ValuePoint[];
  showArea?: boolean;
  compact?: boolean;
};

export const ValueTrendChart = memo<ValueTrendChartProps>(({ 
  data, 
  showArea = true,
  compact = false 
}) => {
  const { minValue, maxValue, points } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minValue: 0, maxValue: 100, points: [] };
    }
    
    const values = data.map(d => d.value);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 100);
    const range = max - min || 1;
    
    // Generate SVG points
    const pts = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - ((d.value - min) / range) * 100,
      value: d.value,
      date: d.date,
    }));
    
    return { minValue: min, maxValue: max, points: pts };
  }, [data]);

  const areaPath = useMemo(() => {
    if (!showArea || points.length < 2) return '';
    
    let path = `M 0,100 L ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }
    path += ' L 100,100 Z';
    
    return path;
  }, [points, showArea]);

  const linePath = useMemo(() => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }
    
    return path;
  }, [points]);

  if (compact || points.length < 2) {
    return (
      <div className="text-sm text-neutral-400">
        Value: {data?.[data.length - 1]?.value.toFixed(1) || '0'}%
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-neutral-900/80 p-4 border border-neutral-800">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs uppercase tracking-wide text-neutral-500">Value Trend</h4>
        <span className="text-xs text-neutral-400">
          {minValue.toFixed(0)}% → {maxValue.toFixed(0)}%
        </span>
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
        {/* Grid lines */}
        {[25, 50, 75].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#374151" strokeWidth="0.5" strokeDasharray="1,1" />
        ))}
        
        {/* Area fill */}
        {showArea && areaPath && (
          <path d={areaPath} fill="url(#valueGradient)" opacity="0.3" />
        )}
        
        {/* Line */}
        <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2"
            fill={p.value >= 0 ? '#22c55e' : '#ef4444'}
            stroke="#111827"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Summary */}
      <div className="mt-2 pt-2 border-t border-neutral-800 flex justify-between text-xs">
        <span className="text-neutral-500">{data[0]?.date}</span>
        <span className={data[data.length - 1]?.value >= 0 ? 'text-green-400' : 'text-red-400'}>
          {data[data.length - 1]?.value >= 0 ? '+' : ''}{data[data.length - 1]?.value.toFixed(1)}%
        </span>
        <span className="text-neutral-500">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
});

ValueTrendChart.displayName = 'ValueTrendChart';