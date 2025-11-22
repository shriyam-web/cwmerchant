'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function PerformanceChart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-gradient-to-br from-gray-100 dark:from-gray-900/40 to-gray-100 dark:to-gray-900/40 rounded-full mb-4">
        <BarChart3 className="h-8 w-8 text-gray-600 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Revenue Analytics</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
        Revenue analytics will be available once you have recorded transactions. Start by listing products and processing orders to see your performance data.
      </p>
    </div>
  );
}
