import React, { useState } from 'react';
import { ChartTimeframe, Task } from '../types/task';

interface ProgressChartProps {
  tasks: Task[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ tasks }) => {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('week');

  // Generate realistic data points based on timeframe matching Behance chart
  const getDataPoints = () => {
    if (timeframe === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      // Sample trend mirroring Behance curve
      const values = [4, 7, 5, 8, 12, 9, 11];
      return { labels: days, values };
    } else if (timeframe === 'month') {
      const weeks = ['1 May', '5 May', '10 May', '15 May', '20 May', '25 May', '30 May'];
      const values = [6, 14, 11, 20, 18, 25, 22];
      return { labels: weeks, values };
    } else {
      const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
      const values = [45, 62, 58, 80, 75, 95];
      return { labels: months, values };
    }
  };

  const { labels, values } = getDataPoints();
  const maxVal = Math.max(...values, 10);
  const minVal = 0;

  // Compute SVG SVG coordinate paths
  const width = 500;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;

  const points = values.map((val, idx) => {
    const x = paddingX + (idx / (values.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
    return { x, y, val };
  });

  // Construct smooth bezier curve
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    pathD += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-[#181D2F] border border-[#2B324A] rounded-2xl p-5 shadow-card space-y-4">
      {/* Header with Title & Timeframe switcher matching Behance */}
      <div className="flex items-center justify-between">
        <h4 className="font-poppins font-semibold text-sm md:text-base text-white">
          Your progress
        </h4>

        <div className="inline-flex p-1 rounded-xl bg-[#141824] border border-white/5">
          {(['month', 'week', 'year'] as ChartTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-poppins font-medium capitalize transition-all ${
                timeframe === tf
                  ? 'bg-brand-500 text-white shadow-glow-sm'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart matching Behance line and gradient aesthetic */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#246BFD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#246BFD" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glowLine" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#246BFD" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, idx) => {
            const y = paddingY + pct * (height - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#2B324A"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          <path d={fillD} fill="url(#chartGradient)" />

          {/* Spline Curve Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#246BFD"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#glowLine)"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#181D2F"
                stroke="#246BFD"
                strokeWidth="2.5"
                className="transition-transform duration-200 group-hover:scale-150 cursor-pointer"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="2"
                fill="#FFFFFF"
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((pt, idx) => (
            <text
              key={`label-${idx}`}
              x={pt.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[10px] fill-dark-muted font-poppins"
            >
              {labels[idx]}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
