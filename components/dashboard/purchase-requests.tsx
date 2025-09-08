'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, X, Clock, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function PurchaseRequests() {
  const [requests, setRequests] = useState([
    {
      id: '1',
      customerName: 'Rahul Sharma',
      amount: '₹1,250',
      product: 'iPhone Cable',
      submittedAt: '2025-01-15 14:30',
      status: 'pending',
      customerPhone: '+91 98765 43210',
      billImage: 'receipt-1.jpg'
    },
    {
      id: '2',
      customerName: 'Priya Singh', 
      amount: '₹850',
      product: 'Wireless Earphones',
      submittedAt: '2025-01-15 11:20',
      status: 'approved',
      customerPhone: '+91 87654 32109',
      billImage: 'receipt-2.jpg'
    },
    {
      id: '3',
      customerName: 'Amit Kumar',
      amount: '₹2,100',
      product: 'Power Bank',
      submittedAt: '2025-01-14 16:45',
      status: 'pending',
      customerPhone: '+91 76543 21098',
      billImage: 'receipt-3.jpg'
    },
    {
      id: '4',
      customerName: 'Sneha Patel',
      amount: '₹450',
      product: 'Phone Cover',
      submittedAt: '2025-01-14 09:15',
      status: 'rejected',
      customerPhone: '+91 65432 10987',
      billImage: 'receipt-4.jpg'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? {...req, status: 'approved'} : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? {...req, status: 'rejected'} : req
    ));
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Requests</h2>
          <p className="text-gray-600">Review and approve customer purchase requests</p>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          {pendingCount} Pending Approvals
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {request.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{request.customerName}</div>
                    <div className="text-sm text-gray-600">{request.customerPhone}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Submitted on {new Date(request.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 mb-1">{request.amount}</div>
                  <div className="text-sm text-gray-600 mb-2">{request.product}</div>
                  <Badge 
                    variant="secondary"
                    className={getStatusColor(request.status) + ' text-white capitalize'}
                  >
                    {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                    {request.status}
                  </Badge>
                </div>
              </div>
              
              {request.status === 'pending' && (
                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    View Receipt
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}