'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function PerformanceChart() {
  const monthlyData = [
    { month: 'Jan', revenue: 180000, users: 850 },
    { month: 'Feb', revenue: 195000, users: 920 },
    { month: 'Mar', revenue: 210000, users: 1100 },
    { month: 'Apr', revenue: 245680, users: 1234 }
  ];

  const dailyData = [
    { day: 'Mon', revenue: 8200 },
    { day: 'Tue', revenue: 9100 },
    { day: 'Wed', revenue: 7800 },
    { day: 'Thu', revenue: 8900 },
    { day: 'Fri', revenue: 10200 },
    { day: 'Sat', revenue: 12100 },
    { day: 'Sun', revenue: 8450 }
  ];

  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="monthly">Monthly View</TabsTrigger>
        <TabsTrigger value="daily">Daily View</TabsTrigger>
      </TabsList>
      
      <TabsContent value="monthly" className="mt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthlyData.map((data, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-lg font-bold text-gray-900">{data.month}</div>
                  <div className="text-2xl font-bold text-blue-600 mt-2">₹{(data.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-600 mt-1">{data.users} users</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="daily" className="mt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {dailyData.map((data, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-gray-600 mb-2">{data.day}</div>
                  <div className="text-lg font-bold text-blue-600">₹{data.revenue.toLocaleString()}</div>
                  {index === dailyData.length - 1 && (
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700 text-xs">
                      Today
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}