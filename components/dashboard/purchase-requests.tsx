'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, X, Clock, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMerchantAuth } from '@/lib/auth-context';

type PurchaseRequestStatus = 'approved' | 'rejected' | 'pending' | 'expired';

interface PurchaseRequest {
  id: string;
  customerName: string;
  amount: number;
  product: string;
  submittedAt: string;
  status: PurchaseRequestStatus;
  customerPhone: string;
}

const normalizeStatus = (value: string): PurchaseRequestStatus => {
  const status = value.toLowerCase();
  if (status === 'approved' || status === 'rejected' || status === 'expired') {
    return status;
  }
  return 'pending';
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export function PurchaseRequests() {
  const { merchant } = useMerchantAuth();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!merchant?.id) {
      return;
    }
    let cancelled = false;
    const fetchRequests = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('merchantToken') : null;
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`/api/merchant/dashboard?merchantId=${merchant.id}`, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch purchase requests');
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        const normalized = (data.requests || []).map((request: any): PurchaseRequest => {
          const rawAmount = request.amount ?? request.finalPrice ?? request.actualPrice ?? 0;
          const numericAmount = typeof rawAmount === 'number'
            ? rawAmount
            : Number(String(rawAmount).replace(/[^0-9.-]/g, '')) || 0;
          const timestamp = request.submittedAt || request.createdAt || request.date;
          return {
            id: request.id || request.offlinePurchaseId || String(request._id || ''),
            customerName: request.customerName || request.userName || 'Unknown',
            amount: numericAmount,
            product: request.product || request.productPurchased || 'N/A',
            submittedAt: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
            status: normalizeStatus(request.status || 'pending'),
            customerPhone: request.customerPhone || request.userMobileNo || 'N/A',
          };
        });
        setRequests(normalized);
      } catch (error) {
        console.error(error);
        setRequests([]);
      }
    };
    fetchRequests();
    return () => {
      cancelled = true;
    };
  }, [merchant?.id]);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: PurchaseRequestStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-orange-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div id="tour-requests-main" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Requests</h2>
          <p className="text-gray-600">Review and approve customer purchase requests</p>
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto bg-orange-100 text-orange-700">
          {pendingCount} Pending Approvals
        </Badge>
      </div>

      {/* Filters */}
      <div id="tour-requests-filters" className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
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
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full sm:w-auto items-start sm:items-center gap-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {request.customerName
                        ? request.customerName
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                        : 'NA'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{request.customerName}</div>
                    <div className="text-sm text-gray-600 break-words">{request.customerPhone}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Submitted on {new Date(request.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex w-full sm:w-auto flex-col gap-2 sm:items-end">
                  <div className="text-xl font-bold text-gray-900">{formatAmount(request.amount)}</div>
                  <div className="text-sm text-gray-600 sm:text-right">{request.product}</div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(request.status)} text-white capitalize self-start sm:self-auto`}
                  >
                    {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                    {request.status}
                  </Badge>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-4 border-t border-gray-200">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto">
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
