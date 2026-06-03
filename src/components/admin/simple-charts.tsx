'use client';

import { Card, Empty } from 'antd';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title: string;
  height?: number;
  suffix?: string;
}

export function SimpleBarChart({
  data,
  title,
  height = 200,
  suffix = '',
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <Empty description="ບໍ່ມີຂໍ້ມູນ" />
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card title={title}>
      <div style={{ height }} className="flex items-end gap-2">
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-orange-500',
          ];
          const colorClass = item.color || colors[index % colors.length];

          return (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs font-medium text-gray-700">
                {item.value.toLocaleString()}
                {suffix}
              </span>
              <div
                className={`w-full rounded-t-md ${colorClass} transition-all duration-500`}
                style={{
                  height: `${barHeight}%`,
                  minHeight: barHeight > 0 ? '4px' : '0',
                }}
              />
              <span className="w-full truncate text-center text-xs text-gray-500">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  title: string;
  height?: number;
  suffix?: string;
  color?: string;
}

export function SimpleLineChart({
  data,
  title,
  height = 200,
  suffix = '',
  color = 'stroke-blue-500',
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <Empty description="ບໍ່ມີຂໍ້ມູນ" />
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 80 - 10;
    return { x, y, value: item.value, label: item.label };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <Card title={title}>
      <div style={{ height }} className="relative">
        {/* Y-axis labels */}
        <div className="absolute bottom-6 left-0 top-0 flex flex-col justify-between pr-2 text-xs text-gray-500">
          <span>
            {maxValue.toLocaleString()}
            {suffix}
          </span>
          <span>
            {Math.round((maxValue + minValue) / 2).toLocaleString()}
            {suffix}
          </span>
          <span>
            {minValue.toLocaleString()}
            {suffix}
          </span>
        </div>

        {/* Chart area */}
        <div className="ml-16 h-full">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-[calc(100%-24px)] w-full"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            ))}

            {/* Area fill */}
            <path
              d={`${pathD} L 100 100 L 0 100 Z`}
              fill="url(#gradient)"
              opacity="0.3"
            />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              className={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="1.5"
                className={`fill-white ${color}`}
                strokeWidth="1"
              />
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* X-axis labels */}
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            {data.map((item, i) => (
              <span
                key={i}
                className={
                  data.length > 7 && i % 2 !== 0 ? 'hidden sm:inline' : ''
                }
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
  centerLabel?: string;
  centerValue?: string | number;
}

export function SimpleDonutChart({
  data,
  title,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <Empty description="ບໍ່ມີຂໍ້ມູນ" />
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  return (
    <Card title={title}>
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -currentAngle;
              currentAngle += percentage;

              return (
                <circle
                  key={index}
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="3"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Center text */}
          {(centerLabel || centerValue) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {centerValue && (
                <span className="text-xl font-bold text-gray-900">
                  {typeof centerValue === 'number'
                    ? centerValue.toLocaleString()
                    : centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-xs text-gray-500">{centerLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="ml-auto text-sm font-medium text-gray-900">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface StatsCardWithChartProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: number;
  data?: number[];
  color?: string;
}

export function StatsCardWithChart({
  title,
  value,
  suffix = '',
  trend,
  data = [],
  color = '#3b82f6',
}: StatsCardWithChartProps) {
  const maxValue = Math.max(...data, 1);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
            {suffix}
          </p>
          {trend !== undefined && (
            <p
              className={`mt-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% ຈາກເດືອນກ່ອນ
            </p>
          )}
        </div>
        {data.length > 0 && (
          <div className="flex h-12 items-end gap-0.5">
            {data.map((d, i) => (
              <div
                key={i}
                className="w-1.5 rounded-t transition-all duration-300"
                style={{
                  height: `${(d / maxValue) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.3 + (i / data.length) * 0.7,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
