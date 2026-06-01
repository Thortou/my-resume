import { Card, Statistic } from 'antd';
import type { StatisticProps } from 'antd';
import { cn } from '@/lib/utils';

interface StatCardProps extends StatisticProps {
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  className?: string;
}

export function StatCard({
  icon,
  trend,
  trendValue,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <div className="flex items-start justify-between">
        <Statistic {...props} />
        {icon && (
          <div className="rounded-lg bg-primary-50 p-3 text-primary-500">
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className="mt-2">
          <span
            className={cn(
              'text-sm font-medium',
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="ml-2 text-sm text-gray-500">from last month</span>
        </div>
      )}
    </Card>
  );
}
