'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { incrementVisitAction } from '@/actions';

interface VisitorCounterProps {
  initialCount: number;
  page?: string;
}

export function VisitorCounter({
  initialCount,
  page = '/',
}: VisitorCounterProps) {
  const [count, setCount] = useState(initialCount);
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    // Only increment once per session
    const sessionKey = `visited_${page}`;
    const hasVisited = sessionStorage.getItem(sessionKey);

    if (!hasVisited && !hasIncremented) {
      setHasIncremented(true);
      sessionStorage.setItem(sessionKey, 'true');

      incrementVisitAction(page).then((result) => {
        if (result.success && result.data) {
          setCount(result.data.count);
        }
      });
    }
  }, [page, hasIncremented]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
      <Eye className="h-4 w-4" />
      <span className="font-medium">{count.toLocaleString()}</span>
      <span>100000visits</span>
    </div>
  );
}
