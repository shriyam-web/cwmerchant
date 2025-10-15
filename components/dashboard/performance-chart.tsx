'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, IndianRupee, Calendar, BarChart3 } from 'lucide-react';

export function PerformanceChart() {
  const monthlyData = [
    { month: 'Jan', revenue: 180000, users: 850, change: '+12%' },
    { month: 'Feb', revenue: 195000, users: 920, change: '+8%' },
    { month: 'Mar', revenue: 210000, users: 1100, change: '+15%' },
    { month: 'Apr', revenue: 245680, users: 1234, change: '+17%' }
  ];

  const dailyData = [
    { day: 'Mon', revenue: 8200, change: '+5%' },
    { day: 'Tue', revenue: 9100, change: '+11%' },
    { day: 'Wed', revenue: 7800, change: '-14%' },
    { day: 'Thu', revenue: 8900, change: '+14%' },
    { day: 'Fri', revenue: 10200, change: '+15%' },
    { day: 'Sat', revenue: 12100, change: '+18%' },
    { day: 'Sun', revenue: 8450, change: '-30%' }
  ];

  const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);
  const totalUsers = monthlyData.reduce((sum, data) => sum + data.users, 0);
  const avgMonthlyRevenue = totalRevenue / monthlyData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue}</p>
                <p className="text-xs text-gray-500">( {(totalRevenue / 100000).toFixed(1)} L )</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Monthly</p>
                <p className="text-2xl font-bold text-gray-900">₹{(avgMonthlyRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Tabs */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Monthly View
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Daily View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {monthlyData.map((data, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-900">{data.month}</div>
                    <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${data.change.startsWith('+')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {data.change.startsWith('+') ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {data.change}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">₹{(data.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Revenue</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{data.users} users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {dailyData.map((data, index) => (
              <Card key={index} className={`bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group ${index === dailyData.length - 1 ? 'ring-2 ring-blue-200' : ''
                }`}>
                <CardContent className="p-5">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">{data.day}</div>
                    <div className="text-xl font-bold text-blue-600 mb-2">₹{(data.revenue / 1000).toFixed(1)}K</div>
                    <div className={`flex items-center justify-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mb-2 ${data.change.startsWith('+')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {data.change.startsWith('+') ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {data.change}
                    </div>
                    {index === dailyData.length - 1 && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs border-0">
                        Today
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
